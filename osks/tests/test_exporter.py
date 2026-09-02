import json
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

import pytest

from engines.exporter import Exporter


ROOT = Path(__file__).resolve().parents[1]


def test_export_all_creates_files(tmp_path):
    exp = Exporter(str(ROOT))
    files = exp.export_all()
    assert files, "No files were generated"

    # Check that curriculum index and manifest exist
    idx = exp.export_base / "curriculum-index.v1.json"
    manifest = exp.export_base / "manifest.json"
    assert idx.exists()
    assert manifest.exists()


def test_preserves_canonical_ids():
    exp = Exporter(str(ROOT))
    curriculum = exp.load_curriculum()
    # Perform export to ensure files created
    exp.export_all()

    for vol in curriculum.get("volumes", []):
        for ch in vol.get("chapters", []):
            for mod in ch.get("modules", []):
                mid = mod.get("id")
                # Only canonical IDs are expected
                if not exp._module_id_is_canonical(mid):
                    continue
                modfile = exp.export_base / f"module-{mid}.v1.json"
                assert modfile.exists(), f"Expected export for {mid} missing"


def test_no_sensitive_fields_in_exports():
    exp = Exporter(str(ROOT))
    exp.export_all()

    forbidden = ["flag", "targetIp", "GEMINI_API_KEY", "gemini_key"]
    for jf in exp.export_base.glob("module-*.v1.json"):
        text = jf.read_text(encoding="utf-8")
        for fk in forbidden:
            assert fk not in text, f"Forbidden key {fk} present in {jf}"


def test_schema_validation_minimal():
    exp = Exporter(str(ROOT))
    files = exp.export_all()

    idx_path = exp.export_base / "curriculum-index.v1.json"
    schema_idx = Path("specs/001-frontend-backend-integration/schemas/curriculum-index.v1.json")
    idx_data = json.loads(idx_path.read_text(encoding="utf-8"))
    schema_idx_data = json.loads(schema_idx.read_text(encoding="utf-8"))

    # Release gate: require jsonschema validator to be present and used.
    import jsonschema

    jsonschema.validate(instance=idx_data, schema=schema_idx_data)

    # Validate one module as representative
    for jf in exp.export_base.glob("module-*.v1.json"):
        module_data = json.loads(jf.read_text(encoding="utf-8"))
        schema_mod = Path("specs/001-frontend-backend-integration/schemas/module.v1.json")
        schema_mod_data = json.loads(schema_mod.read_text(encoding="utf-8"))
        jsonschema.validate(instance=module_data, schema=schema_mod_data)
        break
