"""
Tests for engines/metadata.py
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent / "engines"))
from metadata import MetadataEngine

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


def test_parse_frontmatter_splits_yaml_and_body(tmp_path):
    f = tmp_path / "chapter.md"
    f.write_text(VALID_FRONTMATTER, encoding="utf-8")

    engine = MetadataEngine()
    data, body = engine.parse_markdown_frontmatter(f)

    assert data["id"] == "NET-101"
    assert "Chapter body content" in body


def test_validate_module_file_passes_on_valid_frontmatter(tmp_path):
    f = tmp_path / "chapter.md"
    f.write_text(VALID_FRONTMATTER, encoding="utf-8")

    engine = MetadataEngine()
    is_valid, meta, errors = engine.validate_module_file(f)

    assert is_valid is True
    assert meta.id == "NET-101"
    assert errors == []


def test_validate_module_file_fails_on_missing_frontmatter(tmp_path):
    f = tmp_path / "chapter.md"
    f.write_text("# No frontmatter here\nJust body text.\n", encoding="utf-8")

    engine = MetadataEngine()
    is_valid, meta, errors = engine.validate_module_file(f)

    assert is_valid is False
    assert meta is None
    assert len(errors) == 1


def test_validate_module_file_fails_on_bad_id_pattern(tmp_path):
    bad_frontmatter = VALID_FRONTMATTER.replace('id: "NET-101"', 'id: "net101"', 1)
    f = tmp_path / "chapter.md"
    f.write_text(bad_frontmatter, encoding="utf-8")

    engine = MetadataEngine()
    is_valid, meta, errors = engine.validate_module_file(f)

    assert is_valid is False
    assert any("Validation Error" in e for e in errors)


def test_parse_frontmatter_raises_on_missing_file(tmp_path):
    missing = tmp_path / "does_not_exist.md"
    engine = MetadataEngine()
    try:
        engine.parse_markdown_frontmatter(missing)
        assert False, "Expected FileNotFoundError"
    except FileNotFoundError:
        pass
