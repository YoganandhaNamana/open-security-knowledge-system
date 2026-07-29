"""
Tests for engines/schema.py
"""
import sys
from pathlib import Path

import pytest
from pydantic import ValidationError

sys.path.append(str(Path(__file__).parent.parent / "engines"))
from schema import ModuleMetadata


def _base_metadata(**overrides):
    data = {
        "id": "NET-101",
        "title": "TCP/IP Protocol Mechanics & Session Handshakes",
        "volume": "vol_01_foundations",
        "chapter": "ch_networking",
        "stability": "static",
        "status": "Research",
        "taxonomy": {
            "domain": "defensive_security",
            "discipline": "network_security",
            "technology": "tcp_ip",
            "skill_level": "intermediate"
        },
        "learning_outcomes": ["Deconstruct the 3-way handshake."],
        "evidence": {
            "sources": [
                {"id": "RFC-793", "type": "RFC", "authority": "Primary"}
            ]
        },
        "knowledge_graph": {}
    }
    data.update(overrides)
    return data


def test_valid_metadata_passes():
    meta = ModuleMetadata(**_base_metadata())
    assert meta.id == "NET-101"
    assert meta.evidence.sources[0].authority == "Primary"


def test_module_id_pattern_rejects_lowercase():
    with pytest.raises(ValidationError):
        ModuleMetadata(**_base_metadata(id="net-101"))


def test_module_id_pattern_rejects_missing_dash():
    with pytest.raises(ValidationError):
        ModuleMetadata(**_base_metadata(id="NET101"))


def test_module_id_pattern_accepts_four_letter_prefix():
    meta = ModuleMetadata(**_base_metadata(id="WEBX-201"))
    assert meta.id == "WEBX-201"


def test_evidence_requires_at_least_one_source():
    bad = _base_metadata()
    bad["evidence"] = {"sources": []}
    with pytest.raises(ValidationError):
        ModuleMetadata(**bad)


def test_learning_outcomes_requires_at_least_one():
    bad = _base_metadata()
    bad["learning_outcomes"] = []
    with pytest.raises(ValidationError):
        ModuleMetadata(**bad)


def test_invalid_stability_enum_rejected():
    bad = _base_metadata(stability="sometimes")
    with pytest.raises(ValidationError):
        ModuleMetadata(**bad)


def test_invalid_authority_tier_rejected():
    bad = _base_metadata()
    bad["evidence"]["sources"][0]["authority"] = "Unofficial"
    with pytest.raises(ValidationError):
        ModuleMetadata(**bad)
