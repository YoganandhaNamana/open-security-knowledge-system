"""
Tests for curriculum parsing (main.py OSKSOrchestrator._get_module_metadata)
"""
import sys
from pathlib import Path

import pytest

sys.path.append(str(Path(__file__).parent.parent))
from main import OSKSOrchestrator

SAMPLE_CURRICULUM = """
curriculum_version: "1.0.0"
volumes:
  - id: "vol_01_foundations"
    title: "Volume 01: Test"
    chapters:
      - id: "ch_networking"
        title: "Networking"
        modules:
          - id: "NET-101"
            title: "TCP/IP Protocol Mechanics"
            stability: "static"
            prerequisites: []
            next_topics: ["NET-102"]
            mitre_mapping: ["T1046"]
"""


def _setup_project(tmp_path: Path) -> Path:
    (tmp_path / "curriculum").mkdir()
    (tmp_path / "curriculum" / "master_curriculum.yaml").write_text(SAMPLE_CURRICULUM, encoding="utf-8")
    (tmp_path / "templates").mkdir()
    (tmp_path / "templates" / "chapter.j2").write_text("---\nid: {{ metadata.id }}\n---\nbody", encoding="utf-8")
    return tmp_path


def test_get_module_metadata_finds_existing_module(tmp_path):
    project_root = _setup_project(tmp_path)
    orchestrator = OSKSOrchestrator(root_dir=str(project_root))

    meta = orchestrator._get_module_metadata("NET-101")

    assert meta["id"] == "NET-101"
    assert meta["volume"] == "vol_01_foundations"
    assert meta["chapter"] == "ch_networking"
    assert meta["knowledge_graph"]["next_topics"] == ["NET-102"]
    assert meta["knowledge_graph"]["mitre_attack"] == ["T1046"]


def test_get_module_metadata_exits_on_unknown_module(tmp_path):
    project_root = _setup_project(tmp_path)
    orchestrator = OSKSOrchestrator(root_dir=str(project_root))

    with pytest.raises(SystemExit):
        orchestrator._get_module_metadata("DOES-NOT-EXIST")


def test_get_module_metadata_exits_on_missing_curriculum_file(tmp_path):
    (tmp_path / "templates").mkdir()
    (tmp_path / "templates" / "chapter.j2").write_text("---\nid: {{ metadata.id }}\n---\nbody", encoding="utf-8")
    orchestrator = OSKSOrchestrator(root_dir=str(tmp_path))

    with pytest.raises(SystemExit):
        orchestrator._get_module_metadata("NET-101")
