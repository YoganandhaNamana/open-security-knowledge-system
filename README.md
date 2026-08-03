# OSKS — Open Security Knowledge System

OSKS is an open, structured knowledge system for cybersecurity education and curriculum generation. It combines a documented module workflow, a CLI-driven content generator, and an MkDocs-based portal for publishing learning content.

## Features

- Structured curriculum scaffolding for volume, chapter, and module bundles
- Research, writing, and QA stages for each module
- CLI orchestrator for scaffolding, research, writing, and QA
- MkDocs documentation portal for publishing modules and labs
- Test coverage for curriculum, generator, CLI, QA, and schema behavior

## Architecture

The repository is organized around a small Python-based workflow:

- [osks/curriculum](osks/curriculum) contains the curriculum definition
- [osks/engines](osks/engines) contains the generator, QA, research, and writer components
- [osks/modules](osks/modules) stores generated content bundles
- [osks/templates](osks/templates) contains the chapter rendering template
- [osks/main.py](osks/main.py) provides the CLI entry point

## Installation

```bash
cd osks
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

Screenshots and a polished public demo preview will be added before the first major release milestone.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the near-term public release milestones.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and contribution expectations.
