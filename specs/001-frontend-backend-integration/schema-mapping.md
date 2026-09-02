Schema Mapping: Python → Exported JSON → Frontend Types
=========================================================

Purpose
-------
Explicit field-level mapping between the canonical Python `ModuleMetadata` (see `osks/engines/schema.py`), the exported JSON contract (`module-<ID>.v1.json`), and the frontend TypeScript types (`src/types.ts`). Do not invent fields; unsupported fields are marked.

Legend
- `PY` = Python Pydantic `ModuleMetadata` fields
- `JSON` = exported module JSON field
- `TS` = frontend TypeScript field (approximate)

Top-level
- PY: `id: str`
  - JSON: `id` — must match exactly
  - TS: `SecurityModule.id` (string)

- PY: `title: str`
  - JSON: `title`
  - TS: `SecurityModule.title`

- PY: `volume: str`, `chapter: str`
  - JSON: `volume`, `chapter`
  - TS: frontend may use `module.volume` and `module.chapter` (UI-only fields) — add to `SecurityModule` via adapter.

- PY: `version: str`
  - JSON: `version`
  - TS: optional `SecurityModule.version`

- PY: `stability: StabilityClass` (enum: `static` | `time_sensitive`)
  - JSON: `stability` (string)
  - TS: optional `SecurityModule.stability` (string)

- PY: `status: LifecycleStatus` (enum)
  - JSON: `status` (string)
  - TS: `SecurityModule.status` (frontend uses `COMPLETED|IN_PROGRESS|LOCKED` — map canonical statuses to UI statuses in adapter)

Taxonomy
- PY: `taxonomy` {domain, discipline, technology, skill_level}
  - JSON: `taxonomy` object unchanged
  - TS: map to `SecurityModule` fields or attach as `module.taxonomy` for advanced filtering

Learning outcomes
- PY: `learning_outcomes: List[str]`
  - JSON: `learning_outcomes` array
  - TS: `SecurityModule.longDescription` or `stageData.introduction.learningObjectives` via adapter

Evidence
- PY: `evidence: EvidenceModel` where `sources: List[EvidenceSource]`
  - JSON: `evidence.sources` array of `{id, type, authority, uri?, control?}`
  - TS: frontend may render `evidence` for a references panel; map `authority` enum strings literally
  - Validation: exported array must be present and non-empty (at least 1 Primary recommended)

Knowledge graph
- PY: `knowledge_graph` {prerequisites, next_topics, lab_references, glossary_terms, mitre_attack}
  - JSON: same shape
  - TS: `SecurityModule.prerequisites`, `SecurityModule.mitreMapping` — adapter flattens names where needed

Rendered content / Stage data
- PY: No single `stageData` object exists in schema. The generator creates templated chapter content.
  - JSON: provide either `rendered_html` and/or `raw_markdown` in the module export.
  - TS: `ModuleStageData` (rich structured data used by UI) — adapter choices:
    - Option A (preferred): Export structured `stageData` from backend (if generator can produce structured stage sections) mapped to `ModuleStageData` directly.
    - Option B (fallback): Export `rendered_html` and let frontend parse/render; UI-specific types like `ModuleStageData` are then derived client-side.

Provenance & changelog
- PY: `provenance` and `changelog` exist
  - JSON: include `provenance` as optional object; include `changelog` as optional array
  - TS: Mark `provenance` and `changelog` as unsupported for initial integration (UI can ignore or display minimal info)

Labs mapping
- PY: labs are referenced in `knowledge_graph.lab_references` and existing files under `osks/labs/`.
  - JSON: `labs.v1.json` contains lab metadata: `{id, title, description, difficulty, canonical_lab_id}`
  - TS: `InteractiveLab` (frontend) contains UI-only fields like `initialTerminalLogs`, `flag` — these MUST be marked `sandbox_only` and excluded from canonical export. Adapter maps canonical lab metadata to UI model; UI-only simulation fields live in `frontend/` only.

CVE / Threat mapping
- PY: no canonical CVE model in `schema.py` — export is optional
  - JSON: `cves.v1.json` with curated fields (`cveId`, `title`, `severity`, `cvssScore`, `summary`, `publishedDate`)
  - TS: `CVEItem` maps directly; frontend may add UI-only fields (e.g., `isNew`) locally

Unsupported / UI-only fields (explicit)
- `SecurityModule.progressPercent`, `xpReward`, `status` variants: UI-only, derived from user state — not present in canonical `ModuleMetadata`.
- `InteractiveLab.flag`, `initialTerminalLogs`, `targetIp` — sandbox-only; must not be included in canonical exports.
- `UserStats` (frontend profile) — UI-only, not exported from canonical curriculum engine.

Validation & adapter rules
- The frontend adapter MUST:
  - Validate `module.id` against `curriculum-index.v1.json`.
  - Ignore unknown fields in JSON to allow forward-compatible backend additions.
  - Map canonical lifecycle/status values to UI status enumerations.
  - Reject any exported lab objects containing `flag` or `targetIp` unless explicitly marked `sandbox_only: true`.

Versioning
- The adapter looks for `schemaVersion` in every exported artifact. If `schemaVersion` mismatch occurs, adapter must fail-fast and request migration.
