"""
OSKS AI Engine: Technical Writer Agent (Dual-Engine Mode)
File: engines/writer_agent.py
"""

import os
from pathlib import Path

try:
    import anthropic
    HAS_ANTHROPIC_SDK = True
except ImportError:
    HAS_ANTHROPIC_SDK = False

from logging_config import get_logger

MODEL_STRING = os.getenv("OSKS_LLM_MODEL", "claude-sonnet-5")


class WriterAgent:
    def __init__(self, root_dir: str = "."):
        self.root = Path(root_dir)
        self.prompts_dir = self.root / "prompts" / "compiled"
        self.prompts_dir.mkdir(parents=True, exist_ok=True)
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        self.logger = get_logger("osks.writer_agent", root_dir)

    def write_chapter(self, module_id: str, volume: str, chapter: str) -> Path:
        module_path = self.root / "modules" / volume / chapter / module_id
        research_path = module_path / "research.md"
        chapter_path = module_path / "chapter.md"

        if not research_path.exists():
            raise FileNotFoundError(
                f"research.md not found — run '--stage research' for {module_id} first"
            )

        if not chapter_path.exists():
            raise FileNotFoundError(
                f"chapter.md not found — run '--stage scaffold' for {module_id} first"
            )

        research_text = research_path.read_text(encoding="utf-8")

        system_instruction = f"""# OSKS TECHNICAL WRITER DIRECTIVE
Target Module: {module_id}
Task: Write Section 3 (Technical Deep-Dive) for chapter.md based ONLY on the Research Dossier below.

## RESEARCH DOSSIER
{research_text}

## REQUIREMENTS
1. Output ONLY the technical deep-dive markdown section.
2. Include an ASCII state machine or flow diagram.
3. Detail protocol/system mechanics at a low level.
"""

        if self.api_key and HAS_ANTHROPIC_SDK:
            self.logger.info(f"Calling Anthropic API ({MODEL_STRING}) for {module_id} chapter...")
            client = anthropic.Anthropic(api_key=self.api_key)
            response = client.messages.create(
                model=MODEL_STRING,
                max_tokens=3500,
                messages=[{"role": "user", "content": system_instruction}]
            )
            deep_dive_content = response.content[0].text

            existing = chapter_path.read_text(encoding="utf-8")
            if "## 🧠 3. Technical Deep-Dive & Architecture" in existing:
                parts = existing.split("## 🧠 3. Technical Deep-Dive & Architecture")
                updated = parts[0] + "## 🧠 3. Technical Deep-Dive & Architecture\n" + deep_dive_content
            else:
                updated = existing + "\n" + deep_dive_content

            chapter_path.write_text(updated, encoding="utf-8")
            self.logger.info(f"API chapter written: {chapter_path.relative_to(self.root)}")
        else:
            compiled_prompt_file = self.prompts_dir / f"writer_prompt_{module_id}.md"
            compiled_prompt_file.write_text(system_instruction, encoding="utf-8")

            self.logger.warning(
                f"Free-tier mode active. Open {compiled_prompt_file.relative_to(self.root)}, "
                f"paste into Claude.ai/ChatGPT, append response to {chapter_path.relative_to(self.root)}."
            )

        return chapter_path


if __name__ == "__main__":
    get_logger("osks.writer_agent").info("Writer Agent initialized.")
