import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))
from main import OSKSOrchestrator


def test_get_module_metadata_uses_module_specific_curriculum_values():
    orchestrator = OSKSOrchestrator(root_dir=str(Path(__file__).parent.parent))

    net101 = orchestrator._get_module_metadata("NET-101")
    net102 = orchestrator._get_module_metadata("NET-102")
    lin102 = orchestrator._get_module_metadata("LIN-102")

    assert net101["taxonomy"]["technology"] == "tcp_ip"
    assert net101["learning_outcomes"][0] == "Understand the TCP/IP layered model and handshake mechanics."
    assert net101["evidence"]["sources"][0]["id"] == "RFC-793"

    assert net102["taxonomy"]["technology"] == "tcp_ip"
    assert net102["learning_outcomes"][0] == "Analyze IPv4 addressing, subnetting, and packet structure."
    assert net102["knowledge_graph"]["glossary_terms"] == ["ip", "subnetting", "packet"]

    assert lin102["taxonomy"]["discipline"] == "linux_security"
    assert lin102["taxonomy"]["technology"] == "linux"
    assert lin102["learning_outcomes"][0] == "Understand Linux permission models and capability inheritance."
    assert lin102["certifications"] == ["RHCSA", "OSCP"]
