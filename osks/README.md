# OSKS — Open Security Knowledge System

OSKS is a structured, AI-assisted cybersecurity knowledge system designed for guided curriculum generation, module authoring, and documentation publishing. Each module follows a transparent workflow of research, verification, authoring, and QA before it is considered ready.

## Project Description

The project provides a lightweight but extensible framework for building curated cybersecurity learning modules. It combines a Python-based CLI, curriculum definitions, generation engines, and an MkDocs portal so content can be created and published in a repeatable way.

## Features

- Structured curriculum scaffolding for volume, chapter, and module bundles
- Research, authoring, and QA stages for each module
- CLI orchestration for scaffold, research, write, and QA workflows
- MkDocs-based documentation publishing for modules, labs, and references
- Pilot modules that demonstrate the full content bundle workflow

## Architecture

The repository is organized around a compact workflow:

```text
osks/
├── manifest.yaml
├── curriculum/
├── engines/
├── templates/
├── modules/
├── labs/
├── glossary/
├── prompts/compiled/
└── main.py
```

## Installation

```bash
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
.venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
```

## Usage

```bash
python main.py --module NET-101 --stage scaffold
python main.py --module NET-101 --stage research
python main.py --module NET-101 --stage write
python main.py --module NET-101 --qa-only
```

## Screenshots Placeholder

Public screenshots and a polished demo preview will be added before the first major release milestone.

## Roadmap

Planned first five pilot modules: Networking (TCP/IP), Linux, Web Security, Active Directory, and Cloud Security.

## License

This project is licensed under the MIT License. See the repository-level [LICENSE](../LICENSE) for details.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](../CONTRIBUTING.md) for the workflow and contribution expectations.
