Specification 001: Frontend ↔ Backend Integration
===============================================

Goal
----
Define a safe, non-destructive integration approach that allows the Gemini-generated React/Vite frontend to consume curriculum data produced by the canonical OSKS Python engine without replacing or modifying authoritative backend artifacts.

Scope
-----
- Read-only inspection and specification only. No code changes to `osks/`.
- Initial integration approach: static JSON export from Python engine consumed by SPA.
- Future API boundary described but not implemented.

Current system architecture
---------------------------
- **Authoritative Backend (Python)**: `osks/` — contains the orchestrator (`osks/main.py`), generation engines (`osks/engines/`), curriculum (`osks/curriculum/master_curriculum.yaml`), templates, modules, QA, and tests. This is the single source of truth for content, metadata schema, and content generation.
- **Frontend (Gemini / React/Vite)**: external project (not yet merged). Intended to become `frontend/` in the canonical repo; provides interactive presentation and client-side UX.
- **Build/CI**: Python-centered `.github/workflows/ci.yml` runs backend verification and the static export bridge before building the frontend bundle. The exported JSON snapshots are copied into `frontend/public/api/v1/` as part of the CI pipeline.

Authoritative source boundaries
------------------------------
- `osks/curriculum/master_curriculum.yaml`: authoritative curriculum definitions and module identifiers.
- `osks/engines/schema.py` and `osks/engines/metadata.py`: authoritative schema validation logic for module front-matter.
- `osks/modules/` and `osks/templates/`: canonical generated outputs and templates.
- All other frontend assets (React code, Vite config, CSS, images) are non-authoritative and belong under `frontend/` once imported.

Frontend responsibilities
------------------------
- Consume exported, versioned, static JSON artifacts describing: curriculum index, module metadata, rendered module content (HTML or structured Markdown), lab metadata, and search index.
- Provide interactive UI: navigation, search, module rendering, lab links, glossary, and references.
- Render client-side routing and UI state; offline-capable caching of exported JSON is acceptable.

Backend responsibilities
-----------------------
- Continue to author and validate curriculum in `master_curriculum.yaml`.
- Continue to run generation pipeline (scaffold, research, writer, QA) to produce canonical artifacts.
- Provide a non-destructive exporter from the existing pipeline that emits versioned JSON files (see Curriculum export below). The exporter is implemented in `osks/engines/exporter.py` and is in active use for the static export bridge workflow.

Curriculum data flow (spec)
---------------------------
1. Author edits `osks/curriculum/master_curriculum.yaml` and module source files under `osks/modules/` via the established pipeline.
2. The canonical pipeline generates module artifacts (Markdown, chapter.md, research.md, etc.).
3. A designated exporter reads canonical artifacts and `ModuleMetadata` schema objects and emits a stable, versioned JSON bundle under `osks/exported/` or `frontend/public/api/` (for consumption by SPA). The export format must be versioned (e.g., `v1`) and include a manifest with timestamp and `generator_version`.
4. The SPA in `frontend/` consumes these JSON files at build-time or runtime (prefer build-time for initial integration), without requiring a live backend API.

master_curriculum.yaml as source of truth
----------------------------------------
- All module identifiers, titles, taxonomies, links (labs, glossary) originate in `master_curriculum.yaml`. The exporter must derive the curriculum index from this file and include referential integrity checks.

Python → exported structured data → frontend architecture
--------------------------------------------------------
- Export artifact types (initial set):
  - `curriculum-index.v1.json` — volumes, chapters, module ids, titles, prerequisites
  - `module-<ID>.v1.json` — module metadata (per `ModuleMetadata`), plus rendered HTML fragment and raw markdown
  - `labs.v1.json` — lab metadata and references
  - `search-index.v1.json` — pre-built search index (optional; can reuse MkDocs search artifacts)
  - `manifest.json` — export metadata (timestamp, version, generator hash)
- Files are written to `osks/exported/v1/` and copied to `frontend/public/api/v1/` by the CI/static-export bridge before the frontend build runs.

Static JSON export as preferred initial method
----------------------------------------------
- Rationale: Minimal risk, no runtime API changes, easy rollback, straightforward to teach-to-contributors.
- Trade-offs: Data is snapshot-based; near-real-time updates require re-export and re-deploy of frontend assets or build-time fetches.

Future API boundary (for later work)
-----------------------------------
- Define a minimal REST surface that mirrors exported artifacts: `/api/v1/curriculum`, `/api/v1/module/<id>`, `/api/v1/labs`, `/api/v1/search`.
- Keep API optional; SPA must work with exported artifacts first.

SSRF and external-request boundary considerations
------------------------------------------------
- The exporter and existing research agents must validate and sanitize all external URLs and evidence URIs included in exported JSON.
- Any future API endpoints must enforce outbound request policies and safeguard against SSRF by whitelisting allowed domains and using timeouts and retries.

File ownership rules
--------------------
- `osks/` (and its subfolders) — owned by backend team; only backend maintainers may modify.
- `frontend/` — owned by frontend UX team once created; import into `frontend/` must not modify `osks/`.
- Exported artifacts directory `osks/exported/` — generated by backend exporter; can be read by frontend. Commits that add exported snapshots must be clearly labeled as CI artifacts and include manifest.

Conflict prevention rules
-------------------------
- Never copy or replace `osks/` from frontend sources.
- All frontend code must be placed under `frontend/` root; do not create top-level files that shadow existing repo-level files without review.
- Naming collisions: if the frontend archive contains an `osks/`, rename to `frontend/osks_gemini_origin/` for analysis only; never commit this into canonical repo.

Testing and acceptance criteria
------------------------------
- Unit tests: existing `pytest` suite must pass without changes.
- Exporter acceptance tests: `curriculum-index.v1.json` includes the canonical module set from `master_curriculum.yaml`, and the export traceability gate validates module count and IDs before frontend build/deploy.

Decision #6: v1.2 release scope
-------------------------------
- The foundation/integration release scope for OSKS v1.2 is intentionally limited to the canonical modules `NET-101`, `NET-102`, and `LIN-102` and is not claimed as a complete curriculum.
- This scope is tracked as the current foundation/integration delivery target; the exported frontend bundle reflects exactly those canonical IDs and no fabricated placeholders.
- The exporter implementation and export bridge were introduced during the integration phase and are now active as part of the build pipeline; this is not treated as an always-correct historical artifact claim.
- Manual acceptance: SPA in `frontend/` can read `osks/exported/v1/curriculum-index.v1.json` and render module list.

Rollback strategy
-----------------
- Because initial integration uses generated JSON, rollback is a simple reversion of frontend commits or removal of copied exported snapshots.
- No changes to `osks/` are made, so backend rollback is not required for initial phase.

Open issues
-----------
- Exact export schema needs definition in `plan.md` and `tasks.md`.
- CI process for copying `osks/exported/` into `frontend/public/api/` must be designed later.
