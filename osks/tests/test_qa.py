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
            chapter_text = VALID_FRONTMATTER + "\n" + "\n".join([
                "## 📌 1. Module Overview & Domain Mechanics",
                "This section provides a substantive overview of the topic.",
                "## 🎯 2. Prerequisites & Target Learning Outcomes",
                "The reader should understand the core mechanism before proceeding.",
                "## 🧠 3. Technical Deep-Dive & Architecture",
                "Detailed technical analysis and state transitions are documented here.",
                "## ⚡ 4. Operational Commands & Tooling",
                "Commands and defensive tooling are described in this section.",
                "## 🧪 5. Hands-on Lab Mapping",
                "A lab exercise is attached to reinforce the topic.",
                "## 🛡️ 6. Enterprise Defense & Hardening",
                "Defensive mitigations and operational guidance are provided.",
                "## 📚 7. Reference & Citation Matrix",
                "References are listed to support the technical guidance.",
            ]) + "\n"
            (module_dir / fname).write_text(chapter_text, encoding="utf-8")
        elif fname == "research.md":
            (module_dir / fname).write_text(
                "# Research Dossier: NET-101\n\n"
                "## Verified Primary Source Facts\n"
                "This dossier contains substantive research findings and evidence.\n"
                "The module relies on authoritative references and field observations.\n"
                "The summary highlights key protocol behavior and attack surface analysis.\n\n"
                "## Low-Level Protocol / System Mechanics\n"
                "This section covers the technical mechanics in sufficient detail.\n"
                "It explains handshake state transitions, packet structure, and defensive implications.\n"
                "It also outlines the relationship between protocol behavior and potential misuse.\n",
                encoding="utf-8"
            )
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


def test_qa_detects_empty_research_and_short_chapter(tmp_path):
    module_dir = _make_complete_bundle(tmp_path)
    (module_dir / "research.md").write_text("", encoding="utf-8")
    (module_dir / "chapter.md").write_text(
        VALID_FRONTMATTER + "\n## 📌 1. Module Overview & Domain Mechanics\nShort body.\n",
        encoding="utf-8"
    )
    qa = QAEngine(root_dir=str(tmp_path))
    passed, errors = qa.audit_module_bundle(module_dir)
    assert passed is False
    assert any("research.md is empty" in e for e in errors)
    assert any("chapter.md contains insufficient body content" in e for e in errors)
