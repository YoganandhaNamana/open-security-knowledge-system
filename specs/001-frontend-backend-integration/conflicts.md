Conflicts & Compatibility Map
=============================

Overview
--------
This file enumerates file-level, semantic, dependency and security conflicts discovered during the sandbox inventory of `_incoming_gemini_frontend/` against the canonical `osks/` project.

File-level conflicts (potential if merged naively)
- `index.html`, `README.md`, `package.json` (frontend root) — would create new top-level files; safe only if placed under `frontend/`.
- `vite.config.ts`, `tsconfig.json`, `src/` — must live under `frontend/`; do not copy into repository root or into `osks/`.
- Any `osks/` folder originating in frontend (none present) must never overwrite `OSKS-2026/osks/`.

Semantic / data conflicts
- Module identifiers:
  - Frontend uses IDs like `mod-recon`, `mod-webapp`, `mod-malware`.
  - Canonical uses `NET-101`, `NET-102`, `LIN-102`, etc. Canonical IDs are authoritative; mapping required.
- Module content shape:
  - Frontend `SecurityModule` has UI fields (icon, progressPercent, xpReward, status enums) that are derived/UI-only.
  - Canonical `ModuleMetadata` is authoritative for curriculum fields: taxonomy, evidence, learning_outcomes, knowledge_graph.
- Curriculum source: `osks/curriculum/master_curriculum.yaml` must remain source of truth; frontend data must be derived via export rather than replacing YAML.

Dependency conflicts
- Dual-tooling: repository will host Python (pip) and Node (npm) tooling; keep them isolated:
  - Place `package.json` and Node tooling inside `frontend/` to avoid confusion with repo Python env.
- `@google/genai` present in frontend deps indicates usage of Gemini client — do not include API keys in repo; any server-side integration must be planned and secured.

Security concerns
- `.env.example` suggests `GEMINI_API_KEY` — secrets must not be committed; ensure CI and deployment use secure secrets store.
- Hardcoded flags and target IPs in labs (`INTERACTIVE_LABS.flag`, `targetIp`) may leak sensitive or realistic host data — sanitize before committing.
- Simulated terminal responses include command hints and outputs; ensure no accidental execution of harmful commands or real endpoints.

Hardcoded / fake data requiring replacement
- `src/data/osksData.ts` contains full sandbox data that must be replaced by an adapter consuming exported canonical artifacts.
- `flag` strings (e.g., `OSKS{nmap_stealth_syn_scan_complete_2026}`) must not be shipped in canonical datasets without review.
- `targetIp` values (10.10.14.88, 192.168.1.105) are private/internal addresses and must be sanitized or clearly marked as sandbox-only.

Files that must never overwrite canonical OSKS
- Any file or directory under `osks/` in the sandbox (if present) — canonical `OSKS-2026/osks/` is authoritative.
- `osks/curriculum/master_curriculum.yaml` — never overwrite.
- `osks/engines/*` — never overwrite without explicit approval.

Recommendations to avoid conflicts
---------------------------------
1. Import the frontend under `frontend/` only after mapping and approval.
2. Replace `src/data/osksData.ts` with a lightweight adapter `src/adapters/osksAdapter.ts` that reads exported JSON snapshots from `osks/exported/v1/` (or `frontend/public/api/v1/`).
3. Sanitize all lab artifacts and remove secrets prior to any commit.
4. Keep `_incoming_gemini_frontend/` as sandbox until final sign-off, then delete it before merge.
