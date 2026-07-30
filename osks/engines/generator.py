"""
OSKS Core Engine: Documentation Bundle Generator
File: engines/generator.py
"""

import sys
from pathlib import Path
from jinja2 import Environment, FileSystemLoader

sys.path.append(str(Path(__file__).parent))
from schema import ModuleMetadata
from logging_config import get_logger


class DocumentationGenerator:
    BUNDLE_FILES = [
        "README.md",
        "research.md",
        "commands.md",
        "labs.md",
        "quiz.md",
        "interview.md",
        "references.md",
        "diagrams.md",
        "cheatsheet.md",
        "revision.md"
    ]

    def __init__(self, root_dir: str = "."):
        self.root = Path(root_dir)
        self.template_dir = self.root / "templates"
        self.output_base = self.root / "modules"
        self.logger = get_logger("osks.generator", root_dir)

        self.env = Environment(
            loader=FileSystemLoader(str(self.template_dir)),
            trim_blocks=True,
            lstrip_blocks=True
        )

    def _write_file_if_missing(self, path: Path, content: str) -> None:
        if path.exists():
            return
        try:
            path.write_text(content, encoding="utf-8")
        except OSError:
            raise

    def scaffold_topic_bundle(self, metadata_dict: dict) -> Path:
        """Generates the full topic folder structure for a given module."""
        metadata = ModuleMetadata(**metadata_dict)

        topic_dir = self.output_base / metadata.volume / metadata.chapter / metadata.id
        topic_dir.mkdir(parents=True, exist_ok=True)

        template = self.env.get_template("chapter.j2")
        rendered_chapter = template.render(metadata=metadata.model_dump(mode="json"))

        chapter_path = topic_dir / "chapter.md"
        if not chapter_path.exists():
            self._write_file_if_missing(chapter_path, rendered_chapter)

        for bfile in self.BUNDLE_FILES:
            file_path = topic_dir / bfile
            self._write_file_if_missing(
                file_path,
                f"# {metadata.id} - {bfile.split('.')[0].capitalize()}\n"
            )

        self.logger.info(f"Successfully scaffolded bundle: {topic_dir.relative_to(self.root)}")
        return topic_dir


if __name__ == "__main__":
    get_logger("osks.generator").info("Documentation Generator initialized.")
