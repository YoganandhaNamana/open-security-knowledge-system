import json
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

import pytest
import yaml

from engines.exporter import Exporter


ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent
SCHEMA_ROOT = REPO_ROOT / "specs" / "001-frontend-backend-integration" / "schemas"


def _write_curriculum_fixture(tmp_path: Path) -> None:
    """Materialize the canonical curriculum into an isolated test root."""
    curriculum_src = ROOT / "curriculum" / "master_curriculum.yaml"
    (tmp_path / "curriculum").mkdir(parents=True, exist_ok=True)
    (tmp_path / "curriculum" / "master_curriculum.yaml").write_text(
        curriculum_src.read_text(encoding="utf-8"),
        encoding="utf-8",
    )


def _source_module_ids(curriculum: dict) -> set[str]:
    ids = set()
    for vol in curriculum.get("volumes", []):
        for ch in vol.get("chapters", []):
            for mod in ch.get("modules", []):
                mod_id = mod.get("id")
                if mod_id:
                    ids.add(str(mod_id))
    return ids


def _exported_module_ids(export_dir: Path) -> set[str]:
    ids = set()
    for path in sorted(export_dir.glob("module-*.v1.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        mod_id = payload.get("id")
        if mod_id is None:
            raise AssertionError(f"Exported module file missing 'id': {path}")
        ids.add(str(mod_id))
    return ids


def validate_export_traceability(
    content_root: Path,
    schema_root: Path,
    export_dir: Path | None = None,
) -> None:
    curriculum_path = content_root / "curriculum" / "master_curriculum.yaml"
    if not curriculum_path.exists():
        raise AssertionError(f"Curriculum source missing: {curriculum_path}")

    curriculum = yaml.safe_load(curriculum_path.read_text(encoding="utf-8"))
    if not isinstance(curriculum, dict):
        raise AssertionError(f"Curriculum root is not a mapping: {curriculum_path}")

    expected_ids = _source_module_ids(curriculum)
    export_root = export_dir or content_root / "exported" / "v1"
    if not export_root.exists():
        raise AssertionError(f"Export directory missing: {export_root}")

    actual_ids = _exported_module_ids(export_root)
    expected_count = len(expected_ids)
    actual_count = len(actual_ids)

    if expected_count != actual_count:
        raise AssertionError(
            f"Source/export module count mismatch: expected {expected_count}, got {actual_count}. "
            f"expected={sorted(expected_ids)} actual={sorted(actual_ids)}"
        )

    missing = sorted(expected_ids - actual_ids)
    unexpected = sorted(actual_ids - expected_ids)
    if missing or unexpected:
        raise AssertionError(
            f"Source/export module ID mismatch: missing={missing} unexpected={unexpected}"
        )

    idx_path = export_root / "curriculum-index.v1.json"
    if not idx_path.exists():
        raise AssertionError(f"Missing curriculum index export: {idx_path}")

    idx_schema = schema_root / "curriculum-index.v1.json"
    idx_data = json.loads(idx_path.read_text(encoding="utf-8"))
    idx_schema_data = json.loads(idx_schema.read_text(encoding="utf-8"))
    import jsonschema
    jsonschema.validate(instance=idx_data, schema=idx_schema_data)

    module_schema = schema_root / "module.v1.json"
    module_schema_data = json.loads(module_schema.read_text(encoding="utf-8"))
    for module_path in sorted(export_root.glob("module-*.v1.json")):
        module_data = json.loads(module_path.read_text(encoding="utf-8"))
        jsonschema.validate(instance=module_data, schema=module_schema_data)


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
    schema_idx = SCHEMA_ROOT / "curriculum-index.v1.json"
    idx_data = json.loads(idx_path.read_text(encoding="utf-8"))
    schema_idx_data = json.loads(schema_idx.read_text(encoding="utf-8"))

    # Release gate: require jsonschema validator to be present and used.
    import jsonschema

    jsonschema.validate(instance=idx_data, schema=schema_idx_data)

    # Validate every module export, not just a representative sample.
    for jf in exp.export_base.glob("module-*.v1.json"):
        module_data = json.loads(jf.read_text(encoding="utf-8"))
        schema_mod = SCHEMA_ROOT / "module.v1.json"
        schema_mod_data = json.loads(schema_mod.read_text(encoding="utf-8"))
        jsonschema.validate(instance=module_data, schema=schema_mod_data)


def test_export_traceability_clean_path(tmp_path):
    _write_curriculum_fixture(tmp_path)
    exp = Exporter(str(tmp_path))
    exp.export_all()
    validate_export_traceability(tmp_path, SCHEMA_ROOT)


def test_export_traceability_failure_on_drift(tmp_path):
    _write_curriculum_fixture(tmp_path)
    exp = Exporter(str(tmp_path))
    exp.export_all()

    export_root = tmp_path / "exported" / "v1"
    remaining = sorted(export_root.glob("module-*.v1.json"))
    if remaining:
        remaining[-1].unlink()

    with pytest.raises(AssertionError, match="mismatch|missing|unexpected|count"):
        validate_export_traceability(tmp_path, SCHEMA_ROOT)
