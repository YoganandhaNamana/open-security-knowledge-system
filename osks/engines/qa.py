"""
OSKS Core Engine: Quality Assurance & Audit Engine
File: engines/qa.py
"""

import sys
from pathlib import Path
from typing import List, Tuple

sys.path.append(str(Path(__file__).parent))
from metadata import MetadataEngine
from logging_config import get_logger


class QAEngine:
    def __init__(self, root_dir: str = "."):
        self.root = Path(root_dir)
        self.metadata_engine = MetadataEngine()
        self.logger = get_logger("osks.qa", root_dir)

    def audit_module_bundle(self, module_dir: Path) -> Tuple[bool, List[str]]:
        self.logger.info(f"Auditing module bundle: {module_dir}")
        errors = []

        required_files = [
            "README.md", "chapter.md", "research.md", "commands.md",
            "labs.md", "quiz.md", "interview.md", "references.md",
            "diagrams.md", "cheatsheet.md", "revision.md"
        ]
        for rfile in required_files:
            file_path = module_dir / rfile
            if not file_path.exists():
                errors.append(f"[Missing File] Required bundle artifact missing: {rfile}")

        chapter_file = module_dir / "chapter.md"
        if chapter_file.exists():
            is_valid, meta, meta_errors = self.metadata_engine.validate_module_file(chapter_file)
            if not is_valid:
                errors.extend([f"[Metadata Error] {e}" for e in meta_errors])
            else:
                sources = meta.evidence.sources
                primary_count = sum(1 for s in sources if s.authority == "Primary")
                if primary_count < 1:
                    errors.append("[Evidence Error] Less than 1 Primary Authority source defined.")

        research_file = module_dir / "research.md"
        if research_file.exists():
            try:
                content = research_file.read_text(encoding="utf-8")
            except OSError as exc:
                errors.append(f"[Read Error] Unable to read research.md: {exc}")
            else:
                if "Awaiting response" in content:
                    errors.append("[Content Error] research.md still contains placeholder text.")

        if chapter_file.exists():
            try:
                content = chapter_file.read_text(encoding="utf-8")
            except OSError as exc:
                errors.append(f"[Read Error] Unable to read chapter.md: {exc}")
            else:
                if "*(Populated from verified research dossier)*" in content:
                    errors.append("[Content Error] chapter.md Technical Deep-Dive section not yet authored.")

        is_passed = len(errors) == 0
        if is_passed:
            self.logger.info(f"QA passed for {module_dir.name}")
        else:
            for err in errors:
                self.logger.error(err)
        return is_passed, errors


if __name__ == "__main__":
    qa = QAEngine()
    get_logger("osks.qa").info("QA Engine initialized.")
