Plan: 001-frontend-backend-integration
=====================================

Purpose
-------
This plan translates `spec.md` into actionable, non-destructive steps to prepare the repository for a safe frontend import using static JSON exports.

Phases
------
1. Sandbox frontend inspection (read-only)
   - Action: Place the Gemini frontend archive into a sandbox folder outside of `osks/` (e.g., `_incoming_gemini_frontend/`).
   - Outcome: File inventory and conflict map.

2. Define export schema (v1)
   - Action: Draft precise JSON schemas for `curriculum-index.v1.json`, `module-<ID>.v1.json`, `labs.v1.json`, and `manifest.json`.
   - Outcome: JSON schema files under `specs/001-frontend-backend-integration/schemas/` (not yet implemented).

3. Implement exporter (spec only)
   - Action: Write tasks to implement `osks/engines/exporter.py` that reads `ModuleMetadata` instances and writes versioned JSON to `osks/exported/v1/`.
   - Outcome: Exporter tasks documented in `tasks.md`.

4. Frontend placement (spec only)
   - Action: Import frontend into `frontend/` after pass-fail review and mapping of assets.
   - Outcome: `frontend/` contains SPA, `frontend/public/api/` read-only snapshots from `osks/exported/v1/`.

5. CI integration (active)
   - Action: Run backend verification, export generation, traceability validation, and the static export bridge before the frontend build; deploy only after all required gates pass.
   - Outcome: `osks/exported/v1/` artifacts are copied into `frontend/public/api/v1/` for GitHub Pages consumption.

Milestones
----------
- M1: File inventory and conflict report produced (sandbox).
- M2: JSON export schema approved.
- M3: Exporter implementation tasks defined and reviewed.
- M4: Frontend import mapping approved.

Constraints
-----------
- No changes to `osks/` until exporter implementation is approved.
- No installation of Node or Python dependencies during spec phase.

Risks and Mitigations (brief)
-----------------------------
- Risk: Hidden naming collisions — Mitigation: sandbox analysis before import.
- Risk: Frontend expects API — Mitigation: exporter produce full static snapshot first.
