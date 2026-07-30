"""
OSKS AI Engine: Research Agent (Dual-Engine Mode)
File: engines/research_agent.py
"""

import os
from pathlib import Path
from typing import Dict, Any

try:
    import anthropic
    HAS_ANTHROPIC_SDK = True
except ImportError:
    HAS_ANTHROPIC_SDK = False

from logging_config import get_logger

MODEL_STRING = os.getenv("OSKS_LLM_MODEL", "claude-sonnet-5")


class ResearchAgent:
    def __init__(self, root_dir: str = "."):
        self.root = Path(root_dir)
        self.references_dir = self.root / "references"
        self.prompts_dir = self.root / "prompts" / "compiled"
        self.prompts_dir.mkdir(parents=True, exist_ok=True)
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        self.logger = get_logger("osks.research_agent", root_dir)

    def _write_text_file(self, path: Path, content: str) -> None:
        try:
            path.write_text(content, encoding="utf-8")
        except OSError:
            self.logger.exception("Failed to write file: %s", path.relative_to(self.root))
            raise

    def _extract_response_text(self, response: Any, module_id: str) -> str:
        try:
            return response.content[0].text
        except (AttributeError, IndexError, TypeError) as exc:
            self.logger.exception("Unexpected Anthropic response structure for %s", module_id)
            raise ValueError(f"Anthropic returned an unexpected response for {module_id}") from exc

    def construct_extraction_context(self, module_metadata: Dict[str, Any]) -> str:
        primary_sources = module_metadata.get("evidence", {}).get("sources", [])
        context_blocks = []

        for src in primary_sources:
            src_id = src.get("id", "").lower().replace("-", "")
            ref_path = self.references_dir / src.get("type", "").lower() / f"{src_id}.txt"
            if ref_path.exists():
                context_blocks.append(
                    f"--- BEGIN SOURCE: {src['id']} ---\n" + ref_path.read_text(encoding="utf-8") + "\n--- END SOURCE ---"
                )

        raw_context = "\n\n".join(context_blocks) if context_blocks else "No local raw reference files found. Use authoritative standards (RFCs/NIST)."

        module_id = module_metadata.get("id", "UNKNOWN-000")
        title = module_metadata.get("title", "Untitled Module")
        taxonomy = module_metadata.get("taxonomy", {})
        domain = taxonomy.get("domain", "general_security")
        discipline = taxonomy.get("discipline", "general")

        system_instruction = f"""# OSKS RESEARCH AGENT DIRECTIVE
Target Module: {module_id} - {title}
Domain: {domain} | Discipline: {discipline}

## CONTEXT & SOURCES
{raw_context}

## TASK
Generate a structured, technical Research Dossier for {module_id}.
Do NOT write introductory prose, conversational filler, or narrative chapter text.

Strictly format output as markdown with these sections:
## 1. Verified Primary Source Facts
## 2. Low-Level Protocol / System Mechanics
## 3. Threat Vector & Misuse Cases
## 4. Citation Mappings
"""
        return system_instruction

    def generate_research_dossier(self, module_metadata: Dict[str, Any]) -> Path:
        module_id = module_metadata.get("id", "UNKNOWN-000")
        volume = module_metadata.get("volume", "vol_01_foundations")
        chapter = module_metadata.get("chapter", "ch_networking")

        target_dir = self.root / "modules" / volume / chapter / module_id
        target_dir.mkdir(parents=True, exist_ok=True)
        research_file = target_dir / "research.md"

        prompt_text = self.construct_extraction_context(module_metadata)

        if self.api_key and HAS_ANTHROPIC_SDK:
            self.logger.info(f"Calling Anthropic API ({MODEL_STRING}) for {module_id}...")
            client = anthropic.Anthropic(api_key=self.api_key)
            response = client.messages.create(
                model=MODEL_STRING,
                max_tokens=2500,
                messages=[{"role": "user", "content": prompt_text}]
            )
            dossier_content = self._extract_response_text(response, module_id)
            self._write_text_file(research_file, dossier_content)
            self.logger.info(f"API research dossier written: {research_file.relative_to(self.root)}")
        else:
            compiled_prompt_file = self.prompts_dir / f"research_prompt_{module_id}.md"
            self._write_text_file(compiled_prompt_file, prompt_text)

            self.logger.warning(
                f"Free-tier mode active (no ANTHROPIC_API_KEY). "
                f"Open {compiled_prompt_file.relative_to(self.root)}, paste into Claude.ai/ChatGPT, "
                f"save output into {research_file.relative_to(self.root)}."
            )

            if not research_file.exists():
                self._write_text_file(
                    research_file,
                    f"# Research Dossier: {module_id}\n\n*Awaiting response from compiled prompt: {compiled_prompt_file.name}*\n"
                )

        return research_file


if __name__ == "__main__":
    get_logger("osks.research_agent").info("Research Agent initialized.")
