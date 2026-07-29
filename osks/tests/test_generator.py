"""
Tests for engines/generator.py
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent / "engines"))
from generator import DocumentationGenerator

SAMPLE_METADATA = {
    "id": "NET-999",
    "title": "Test Module For Scaffolding",
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
    "learning_outcomes": ["Understand test scaffolding."],
    "evidence": {
        "sources": [
            {"id": "RFC-793", "type": "RFC", "authority": "Primary"}
        ]
    },
    "knowledge_graph": {}
}

REQUIRED_FILES = [
    "README.md", "chapter.md", "research.md", "commands.md",
    "labs.md", "quiz.md", "interview.md", "references.md",
    "diagrams.md", "cheatsheet.md", "revision.md"
]


def _setup_project(tmp_path: Path) -> Path:
    """Copies the real templates directory into a temp project root."""
    real_templates = Path(__file__).parent.parent / "templates"
    project_templates = tmp_path / "templates"
    project_templates.mkdir(parents=True)
    for f in real_templates.iterdir():
        (project_templates / f.name).write_text(f.read_text(encoding="utf-8"), encoding="utf-8")
    return tmp_path


def test_scaffold_creates_all_required_files(tmp_path):
    project_root = _setup_project(tmp_path)
    generator = DocumentationGenerator(root_dir=str(project_root))
    topic_dir = generator.scaffold_topic_bundle(SAMPLE_METADATA)

    for fname in REQUIRED_FILES:
        assert (topic_dir / fname).exists(), f"Missing expected file: {fname}"


def test_scaffold_chapter_contains_frontmatter_id(tmp_path):
    project_root = _setup_project(tmp_path)
    generator = DocumentationGenerator(root_dir=str(project_root))
    topic_dir = generator.scaffold_topic_bundle(SAMPLE_METADATA)

    chapter_text = (topic_dir / "chapter.md").read_text(encoding="utf-8")
    assert 'id: "NET-999"' in chapter_text
    assert "## 🧠 3. Technical Deep-Dive & Architecture" in chapter_text


def test_scaffold_does_not_overwrite_existing_chapter(tmp_path):
    project_root = _setup_project(tmp_path)
    generator = DocumentationGenerator(root_dir=str(project_root))
    topic_dir = generator.scaffold_topic_bundle(SAMPLE_METADATA)

    chapter_path = topic_dir / "chapter.md"
    chapter_path.write_text("CUSTOM AUTHORED CONTENT", encoding="utf-8")

    # Re-running scaffold should not clobber already-authored content
    generator.scaffold_topic_bundle(SAMPLE_METADATA)
    assert chapter_path.read_text(encoding="utf-8") == "CUSTOM AUTHORED CONTENT"
