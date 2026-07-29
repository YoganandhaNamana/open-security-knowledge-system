"""
OSKS Main Build Orchestrator
File: main.py
"""

import argparse
import sys
from pathlib import Path
import yaml

sys.path.append(str(Path(__file__).parent / "engines"))

from generator import DocumentationGenerator
from research_agent import ResearchAgent
from writer_agent import WriterAgent
from qa import QAEngine
from logging_config import get_logger


class OSKSOrchestrator:
    def __init__(self, root_dir: str = "."):
        self.root = Path(root_dir)
        self.curriculum_file = self.root / "curriculum" / "master_curriculum.yaml"
        self.generator = DocumentationGenerator(root_dir)
        self.research_agent = ResearchAgent(root_dir)
        self.writer_agent = WriterAgent(root_dir)
        self.qa_engine = QAEngine(root_dir)
        self.logger = get_logger("osks.orchestrator", root_dir)

    def _get_module_metadata(self, module_id: str) -> dict:
        if not self.curriculum_file.exists():
            self.logger.error(f"Curriculum file not found at {self.curriculum_file}")
            sys.exit(1)

        with open(self.curriculum_file, "r", encoding="utf-8") as f:
            curriculum = yaml.safe_load(f)

        for vol in curriculum.get("volumes", []):
            for ch in vol.get("chapters", []):
                for mod in ch.get("modules", []):
                    if mod["id"] == module_id:
                        return {
                            "id": mod["id"],
                            "title": mod["title"],
                            "volume": vol["id"],
                            "chapter": ch["id"],
                            "stability": mod.get("stability", "static"),
                            "status": "Research",
                            "taxonomy": {
                                "domain": "defensive_security",
                                "discipline": "network_security",
                                "technology": "tcp_ip",
                                "skill_level": "intermediate"
                            },
                            "learning_outcomes": [
                                "Deconstruct protocol mechanisms at the bit/packet level.",
                                "Analyze threat vectors and configure defensive controls."
                            ],
                            "evidence": {
                                "sources": [
                                    {"id": "RFC-793", "type": "RFC", "authority": "Primary"}
                                ]
                            },
                            "knowledge_graph": {
                                "prerequisites": mod.get("prerequisites", []),
                                "next_topics": mod.get("next_topics", []),
                                "lab_references": ["LAB-001"],
                                "glossary_terms": ["tcp", "three_way_handshake"],
                                "mitre_attack": mod.get("mitre_mapping", [])
                            }
                        }

        self.logger.error(f"Module '{module_id}' not found in curriculum.")
        sys.exit(1)

    def run_scaffold(self, module_id: str) -> Path:
        self.logger.info(f"[Scaffold] Building bundle tree for {module_id}...")
        meta = self._get_module_metadata(module_id)
        return self.generator.scaffold_topic_bundle(meta)

    def run_research(self, module_id: str):
        self.logger.info(f"[Research] Running Stage 1 Research Agent for {module_id}...")
        meta = self._get_module_metadata(module_id)
        self.research_agent.generate_research_dossier(meta)

    def run_writer(self, module_id: str):
        self.logger.info(f"[Writer] Running Stage 3 Technical Writer Agent for {module_id}...")
        meta = self._get_module_metadata(module_id)
        self.writer_agent.write_chapter(module_id, meta["volume"], meta["chapter"])

    def run_qa(self, module_id: str) -> bool:
        self.logger.info(f"[QA] Validating module bundle for {module_id}...")
        meta = self._get_module_metadata(module_id)
        module_dir = self.root / "modules" / meta["volume"] / meta["chapter"] / module_id

        if not module_dir.exists():
            self.logger.error(f"Module directory does not exist: {module_dir}")
            return False

        passed, errors = self.qa_engine.audit_module_bundle(module_dir)

        if passed:
            self.logger.info(f"QA PASSED: Module '{module_id}' meets all build gates!")
        else:
            self.logger.error(f"QA FAILURES ({len(errors)}) for '{module_id}'")
        return passed

    def run_full_pipeline(self, module_id: str):
        self.logger.info(f"EXECUTING FULL PIPELINE: {module_id}")
        self.run_scaffold(module_id)
        self.run_research(module_id)
        self.run_writer(module_id)
        self.run_qa(module_id)


def main():
    parser = argparse.ArgumentParser(
        description="Open Security Knowledge System (OSKS) - Orchestrator CLI"
    )
    parser.add_argument("--module", "-m", type=str, default="NET-101", help="Target Module ID")
    parser.add_argument(
        "--stage", "-s", type=str,
        choices=["scaffold", "research", "write", "all"],
        default="all",
        help="Pipeline stage to execute"
    )
    parser.add_argument("--qa-only", action="store_true", help="Run QA audit only")

    args = parser.parse_args()
    orchestrator = OSKSOrchestrator()

    if args.qa_only:
        passed = orchestrator.run_qa(args.module)
        sys.exit(0 if passed else 1)
    elif args.stage == "scaffold":
        orchestrator.run_scaffold(args.module)
    elif args.stage == "research":
        orchestrator.run_research(args.module)
    elif args.stage == "write":
        orchestrator.run_writer(args.module)
    else:
        orchestrator.run_full_pipeline(args.module)


if __name__ == "__main__":
    main()
