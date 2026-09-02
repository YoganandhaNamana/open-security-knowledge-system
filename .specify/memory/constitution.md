OSKS Product Constitution (SDD memory)
=====================================

Context
-------
This document captures the governing product constitution for the Open Security Knowledge System (OSKS) as used by the Spec-Driven Development (SDD) process.

Authoritative facts
-------------------
- The canonical Python engine lives in `osks/` and is authoritative for curriculum generation, validation, and QA.
- The curriculum source of truth is `osks/curriculum/master_curriculum.yaml` and must not be modified by integration work unless explicitly migrated under approved change control.
- The repository uses a file-based pipeline driven by the `OSKSOrchestrator` in `osks/main.py` and engine modules in `osks/engines/`.
- The project CI installs Python dependencies from `requirements.txt`, runs `pytest`, performs a QA check, and builds MkDocs (see `.github/workflows/ci.yml`).

Governance rules (re-stated for SDD)
-----------------------------------
- `osks/` is AUTHORITATIVE: do not move, rename, overwrite, or replace its contents without explicit project sign-off.
- No runtime API or dependency changes will be implemented as part of the initial frontend integration: initial integration uses exported artifacts only.
- All integration work must be performed in a sandbox/staging area and tracked under `specs/` before any code changes are proposed.

Memory purpose
--------------
This file is the canonical memory entry for the OSKS constitution during SDD: store decisions, constraints, and linkage pointers used by specs in `specs/`.
