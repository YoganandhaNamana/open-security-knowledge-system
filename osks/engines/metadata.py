"""
OSKS Core Engine: Metadata Parser & Validator
File: engines/metadata.py
"""

import sys
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
import yaml
from pydantic import ValidationError

sys.path.append(str(Path(__file__).parent))
from schema import ModuleMetadata


class MetadataEngine:
    def __init__(self):
        pass

    @staticmethod
    def parse_markdown_frontmatter(file_path: Path) -> Tuple[Dict[str, Any], str]:
        """Extracts YAML front-matter dictionary and remaining body content."""
        if not file_path.exists():
            raise FileNotFoundError(f"Module file not found: {file_path}")

        raw_content = file_path.read_text(encoding="utf-8")

        if not raw_content.startswith("---"):
            raise ValueError(f"Missing YAML front-matter header in {file_path}")

        parts = raw_content.split("---", 2)
        if len(parts) < 3:
            raise ValueError(f"Malformed front-matter in {file_path}")

        frontmatter_yaml = parts[1]
        body_content = parts[2]

        parsed_data = yaml.safe_load(frontmatter_yaml)
        return parsed_data, body_content

    def validate_module_file(self, file_path: Path) -> Tuple[bool, Optional[ModuleMetadata], List[str]]:
        """
        Validates a module's front-matter against the ModuleMetadata schema.
        Returns: (is_valid, validated_metadata_object, list_of_errors)
        """
        errors = []
        try:
            data, _ = self.parse_markdown_frontmatter(file_path)
            metadata = ModuleMetadata(**data)
            return True, metadata, []
        except ValidationError as e:
            for err in e.errors():
                loc = " -> ".join([str(x) for x in err["loc"]])
                errors.append(f"Validation Error [{loc}]: {err['msg']}")
            return False, None, errors
        except Exception as ex:
            errors.append(f"Parsing Exception: {str(ex)}")
            return False, None, errors


if __name__ == "__main__":
    engine = MetadataEngine()
    print("[*] Metadata Engine Initialized.")
