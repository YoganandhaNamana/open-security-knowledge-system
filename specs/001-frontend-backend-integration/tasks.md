Tasks: 001-frontend-backend-integration
=====================================

Preconditions (do not perform yet)
- Ensure the Gemini frontend archive is available in a sandbox folder for inspection.

Task list (small, verifiable tasks)
----------------------------------
1. Inventory frontend archive (read-only)
   - Output: `specs/001-frontend-backend-integration/frontend-inventory.txt` listing files and sizes.
   - Verification: File exists and contains top-level `package.json` and `src/` entries.

2. Produce conflict map
   - Output: `specs/001-frontend-backend-integration/conflicts.txt` listing files that overlap with the canonical repo (e.g., `osks/`, `templates/`, `site/`).
   - Verification: File exists and shows zero `osks/` overwrites planned.

3. Draft JSON schemas
   - Output: `specs/001-frontend-backend-integration/schemas/curriculum-index.v1.schema.json` and `module.v1.schema.json`.
   - Verification: Schemas declare required fields (id, title, volume, chapter, learning_outcomes, evidence.sources).

4. Define exporter interface (spec-only)
   - Output: `specs/001-frontend-backend-integration/exporter-interface.md` describing `export()` function signature and output location `osks/exported/v1/`.
   - Verification: File exists and does not implement code.

5. Acceptance smoke test (spec-only)
   - Output: `specs/001-frontend-backend-integration/acceptance.md` describing manual steps: run pipeline, produce `osks/exported/v1/`, open `frontend/` against exported files.
   - Verification: Document describes steps but does not run them.

6. Review & sign-off
   - Output: `specs/001-frontend-backend-integration/review.md` with stakeholder checklist.

Notes
- These tasks are intentionally non-destructive and create spec artifacts only. No source code changes in `osks/` or `frontend/` are to be made during this phase.
