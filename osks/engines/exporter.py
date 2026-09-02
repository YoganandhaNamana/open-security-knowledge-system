"""
OSKS Exporter
Produces versioned JSON exports for frontend consumption.
This is a spec-driven, read-only exporter that emits snapshots under `osks/exported/v1/`.
"""

from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

import yaml

from engines.schema import ModuleMetadata
from engines.generator import DocumentationGenerator


SCHEMA_VERSION = "osks-export/v1"


class Exporter:
    def __init__(self, root_dir: str = "."):
        self.root = Path(root_dir)
        self.curriculum_file = self.root / "curriculum" / "master_curriculum.yaml"
        self.export_base = self.root / "exported" / "v1"
        self.export_base.mkdir(parents=True, exist_ok=True)
        self.generator = DocumentationGenerator(root_dir)

    def load_curriculum(self) -> Dict[str, Any]:
        if not self.curriculum_file.exists():
            raise FileNotFoundError(f"Curriculum file missing: {self.curriculum_file}")
        with open(self.curriculum_file, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)

    def _module_id_is_canonical(self, module_id: str) -> bool:
        # Canonical IDs follow pattern like NET-101, LIN-102 etc.
        return re.match(r"^[A-Z]{2,4}-\d{3}$", module_id) is not None

    def build_curriculum_index(self, curriculum: Dict[str, Any]) -> Dict[str, Any]:
        index = {"schemaVersion": SCHEMA_VERSION, "volumes": []}
        for vol in curriculum.get("volumes", []):
            v = {"id": vol.get("id"), "title": vol.get("title"), "chapters": []}
            for ch in vol.get("chapters", []):
                c = {"id": ch.get("id"), "title": ch.get("title"), "modules": []}
                for mod in ch.get("modules", []):
                    c["modules"].append({"id": mod.get("id"), "title": mod.get("title")})
                v["chapters"].append(c)
            index["volumes"].append(v)
        return index

    def _normalize_module_dict(self, mod: Dict[str, Any], vol_id: str, ch_id: str) -> Dict[str, Any]:
        # Create a ModuleMetadata-compatible dict using canonical defaults where needed
        m = {
            "id": mod.get("id"),
            "title": mod.get("title"),
            "volume": vol_id,
            "chapter": ch_id,
            "version": mod.get("version", "1.0.0"),
            "stability": mod.get("stability", "static"),
            "status": mod.get("status", "Research"),
            "taxonomy": mod.get("taxonomy", {}),
            "learning_outcomes": mod.get("learning_outcomes") or mod.get("learning_outcomes", []),
            "evidence": mod.get("evidence", {"sources": mod.get("evidence", {}).get("sources", [])}),
            "knowledge_graph": mod.get("knowledge_graph", {}),
        }
        return m

    def build_module_export(self, metadata_dict: Dict[str, Any]) -> Dict[str, Any]:
        # Validate via Pydantic model to ensure canonical rules
        metadata = ModuleMetadata(**metadata_dict)

        # Render chapter HTML where possible (optional)
        try:
            rendered = self.generator._render_chapter_content(metadata)
        except Exception:
            rendered = None

        export = {
            "schemaVersion": SCHEMA_VERSION,
            "id": metadata.id,
            "title": metadata.title,
            "volume": metadata.volume,
            "chapter": metadata.chapter,
            "version": metadata.version,
            "stability": metadata.stability.value if hasattr(metadata.stability, "value") else str(metadata.stability),
            "status": metadata.status.value if hasattr(metadata.status, "value") else str(metadata.status),
            "taxonomy": metadata.taxonomy.model_dump() if hasattr(metadata, "taxonomy") else metadata_dict.get("taxonomy", {}),
            "target_environment": metadata.target_environment.model_dump() if getattr(metadata, "target_environment", None) else None,
            "learning_outcomes": metadata.learning_outcomes,
            "evidence": {"sources": [s.model_dump() for s in metadata.evidence.sources]},
            "knowledge_graph": metadata.knowledge_graph.model_dump() if getattr(metadata, "knowledge_graph", None) else metadata_dict.get("knowledge_graph", {}),
            "rendered_html": rendered,
            "raw_markdown": None,
            "provenance": metadata.provenance.model_dump() if getattr(metadata, "provenance", None) else None,
            "changelog": [c.model_dump() for c in metadata.changelog] if getattr(metadata, "changelog", None) else [],
        }

        # Remove None values for cleanliness
        export = {k: v for k, v in export.items() if v is not None}
        return export

    def _write_json(self, path: Path, obj: Any) -> None:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(obj, f, indent=2, ensure_ascii=False)

    def validate_against_schema(self, data: Dict[str, Any], schema_path: Path) -> bool:
        # Strict validation: require `jsonschema` to be installed in the environment.
        try:
            import jsonschema
        except Exception as e:
            raise ImportError("jsonschema is required for strict schema validation") from e

        with open(schema_path, "r", encoding="utf-8") as s:
            schema = json.load(s)
        jsonschema.validate(instance=data, schema=schema)
        return True

    def export_all(self) -> List[Path]:
        curriculum = self.load_curriculum()
        index = self.build_curriculum_index(curriculum)

        # Write curriculum index
        idx_path = self.export_base / "curriculum-index.v1.json"
        self._write_json(idx_path, index)

        generated_files = [idx_path]

        # Iterate modules and write module files
        for vol in curriculum.get("volumes", []):
            for ch in vol.get("chapters", []):
                for mod in ch.get("modules", []):
                    mid = mod.get("id")
                    if not self._module_id_is_canonical(mid):
                        # Skip non-canonical IDs (frontend-only) — do not export
                        continue
                    norm = self._normalize_module_dict(mod, vol.get("id"), ch.get("id"))
                    module_export = self.build_module_export(norm)

                    # Security rule: ensure no forbidden fields
                    forbidden_keys = ["flag", "targetIp", "GEMINI_API_KEY", "gemini_key"]
                    for fk in forbidden_keys:
                        if fk in json.dumps(module_export):
                            raise RuntimeError(f"Forbidden sensitive field found in export: {fk}")

                    out_path = self.export_base / f"module-{mid}.v1.json"
                    self._write_json(out_path, module_export)
                    generated_files.append(out_path)

        # Manifest
        manifest = {
            "schemaVersion": SCHEMA_VERSION,
            "generatorVersion": self._read_manifest_version(),
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
        manifest_path = self.export_base / "manifest.json"
        self._write_json(manifest_path, manifest)
        generated_files.append(manifest_path)

        return generated_files

    def _read_manifest_version(self) -> str:
        manifest_file = self.root / "manifest.yaml"
        if manifest_file.exists():
            try:
                with open(manifest_file, "r", encoding="utf-8") as f:
                    data = yaml.safe_load(f)
                return data.get("project", {}).get("version", "unknown")
            except Exception:
                return "unknown"
        return "unknown"


if __name__ == "__main__":
    e = Exporter(".")
    files = e.export_all()
    print(f"Exported {len(files)} files to {e.export_base}")
