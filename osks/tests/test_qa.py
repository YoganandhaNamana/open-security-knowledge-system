"""
Tests for engines/qa.py
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent / "engines"))
from qa import QAEngine

VALID_FRONTMATTER = """---
id: "NET-101"
title: "TCP/IP Protocol Mechanics"
volume: "vol_01_foundations"
chapter: "ch_networking"
version: "1.0.0"
stability: "static"
status: "Research"
taxonomy:
  domain: "defensive_security"
  discipline: "network_security"
  technology: "tcp_ip"
  skill_level: "intermediate"
learning_outcomes:
  - "Deconstruct the 3-way handshake."
evidence:
  sources:
    - id: "RFC-793"
      type: "RFC"
      authority: "Primary"
knowledge_graph:
  prerequisites: []
  next_topics: []
  lab_references: []
  glossary_terms: []
  mitre_attack: []
---

# Chapter body content
"""

REQUIRED_FILES = [
    "README.md", "chapter.md", "research.md", "commands.md",
    "labs.md", "quiz.md", "interview.md", "references.md",
    "diagrams.md", "cheatsheet.md", "revision.md"
]


def _make_complete_bundle(tmp_path: Path) -> Path:
    module_dir = tmp_path / "NET-101"
    module_dir.mkdir()
    for fname in REQUIRED_FILES:
        if fname == "chapter.md":
            (module_dir / fname).write_text(VALID_FRONTMATTER, encoding="utf-8")
        else:
            (module_dir / fname).write_text(f"# {fname}\nReal content here.\n", encoding="utf-8")
    return module_dir


def test_qa_passes_on_complete_valid_bundle(tmp_path):
    module_dir = _make_complete_bundle(tmp_path)
    qa = QAEngine(root_dir=str(tmp_path))
    passed, errors = qa.audit_module_bundle(module_dir)
    assert passed is True
    assert errors == []


def test_qa_detects_missing_files(tmp_path):
    module_dir = _make_complete_bundle(tmp_path)
    (module_dir / "quiz.md").unlink()
    qa = QAEngine(root_dir=str(tmp_path))
    passed, errors = qa.audit_module_bundle(module_dir)
    assert passed is False
    assert any("quiz.md" in e for e in errors)


def test_qa_rejects_placeholder_research_text(tmp_path):
    module_dir = _make_complete_bundle(tmp_path)
    (module_dir / "research.md").write_text(
        "# Research Dossier: NET-101\n\n*Awaiting response from compiled prompt*\n",
        encoding="utf-8"
    )
    qa = QAEngine(root_dir=str(tmp_path))
    passed, errors = qa.audit_module_bundle(module_dir)
    assert passed is False
    assert any("placeholder" in e.lower() for e in errors)


def test_qa_rejects_unauthored_chapter_deep_dive(tmp_path):
    module_dir = _make_complete_bundle(tmp_path)
    (module_dir / "chapter.md").write_text(
        VALID_FRONTMATTER + "\n*(Populated from verified research dossier)*\n",
        encoding="utf-8"
    )
    qa = QAEngine(root_dir=str(tmp_path))
    passed, errors = qa.audit_module_bundle(module_dir)
    assert passed is False
    assert any("not yet authored" in e for e in errors)


def test_qa_detects_missing_primary_evidence_source(tmp_path):
    module_dir = _make_complete_bundle(tmp_path)
    bad_frontmatter = VALID_FRONTMATTER.replace('authority: "Primary"', 'authority: "Secondary"')
    (module_dir / "chapter.md").write_text(bad_frontmatter, encoding="utf-8")
    qa = QAEngine(root_dir=str(tmp_path))
    passed, errors = qa.audit_module_bundle(module_dir)
    assert passed is False
    assert any("Primary Authority" in e for e in errors)
