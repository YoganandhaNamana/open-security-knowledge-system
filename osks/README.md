# OSKS — Open Security Knowledge System

A structured, AI-assisted cybersecurity knowledge base built section-by-section
(Volume → Module → Chapter → Section → Topic), not generated in bulk. Every module
goes through Research → Verification → Authoring → QA before it's committed.

## Pilot Module: NET-101

`modules/vol_01_foundations/ch_networking/NET-101/` contains a complete, QA-passing
example module — TCP/IP Protocol Mechanics & Session Handshakes — demonstrating the
full 11-file bundle (chapter, research dossier, lab, quiz, interview Q&A, cheatsheet,
references, etc.).

## Structure
```
osks/
├── manifest.yaml              # Project + governance config
├── curriculum/
│   └── master_curriculum.yaml # Volume/Chapter/Module definitions
├── engines/                   # schema, metadata, generator, agents, QA
├── templates/                 # Jinja2 chapter template
├── modules/                   # Generated content, organized by volume/chapter
├── labs/                      # Standalone lab definitions
├── glossary/                  # Shared glossary entries
├── prompts/compiled/          # Free-tier prompt files (gitignored)
└── main.py                    # CLI orchestrator
```

## Quick Start

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full stepwise workflow. Short version:

```bash
pip install -r requirements.txt
python main.py --module NET-101 --stage scaffold
python main.py --module NET-101 --stage research   # paste into Claude.ai, save to research.md
python main.py --module NET-101 --stage write       # paste into Claude.ai, save to chapter.md
python main.py --module NET-101 --qa-only
```

## Roadmap

Planned first five pilot modules: Networking (TCP/IP), Linux, Web Security, Active
Directory, Cloud Security — each fully authored before expanding further.
