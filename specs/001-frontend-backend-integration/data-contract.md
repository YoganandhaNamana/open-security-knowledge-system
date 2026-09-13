Data Contract (Exported JSON) — v1
================================

Purpose
-------
Define a stable, versioned JSON contract that the canonical OSKS Python engine will emit and the React frontend adapter will consume. This contract is intentionally conservative: it mirrors canonical schema fields required by the frontend and leaves advanced backend-only fields optional.

Top-level document structure
---------------------------
All export bundles are stored under `osks/exported/v1/`.

Example bundle layout
```
osks/exported/v1/
  manifest.json
  curriculum-index.v1.json
  modules/
    module-NET-101.v1.json
    module-LIN-102.v1.json
  labs.v1.json
  cves.v1.json
```

Manifest (`manifest.json`)
- `schemaVersion` (string): e.g., `osks-export/v1`
- `generatorVersion` (string): generator code version
- `timestamp` (ISO8601)
- `sourceCommit` (optional): VCS commit hash
- `notes` (optional)

Curriculum index (`curriculum-index.v1.json`) — example shape
{
  "schemaVersion": "osks-export/v1",
  "volumes": [
    {
      "id": "vol_01_foundations",
      "title": "Volume 01: Computer Science & Enterprise Infrastructure",
      "chapters": [
        {
          "id": "ch_networking",
          "title": "Networking Principles & Protocol Mechanics",
          "modules": [
            {"id": "NET-101", "title": "TCP/IP Protocol Mechanics & Session Handshakes"},
            {"id": "NET-102", "title": "IP Addressing, Subnetting, and Packet Analysis"}
          ]
        }
      ]
    }
  ]
}

Module artifact (`module-<ID>.v1.json`) — minimal required fields
{
  "schemaVersion": "osks-export/v1",
  "id": "NET-101",
  "title": "TCP/IP Protocol Mechanics & Session Handshakes",
  "volume": "vol_01_foundations",
  "chapter": "ch_networking",
  "version": "1.0.0",
  "stability": "static",
  "status": "Research",
  "taxonomy": {"domain":"defensive_security","discipline":"network_security","technology":"tcp_ip","skill_level":"intermediate"},
  "learning_outcomes": ["..."],
  "evidence": {"sources": [{"id":"RFC-793","type":"RFC","authority":"Primary","uri":null}]},
  "knowledge_graph": {"prerequisites": [], "next_topics": [], "lab_references": ["LAB-001"], "glossary_terms": []},
  "rendered_html": "<article>...</article>",        // OPTIONAL: rendered HTML for fast display
  "raw_markdown": "---frontmatter---\n...",      // OPTIONAL
  "provenance": null
}

Labs (`labs.v1.json`)
- Contains lab metadata only: id, title, description, difficulty, canonical lab identifier (e.g., `LAB-001`), and an unambiguous reference to any external sandbox resource (URI) if provisioned later.
- DO NOT include hardcoded flags or live IP addresses in exported canonical lab metadata. `flag` and `targetIp` MUST be excluded or marked as `sandbox_only: true`.

CVE / Threat (`cves.v1.json`)
- Contains curated CVE summaries, must include `cveId`, `title`, `severity`, `cvssScore`, `summary`, `publishedDate`.
- External feeds are out of scope; exports should contain vetted, static entries or be empty.

Validation rules
- All exported JSON files MUST contain `schemaVersion` at the root.
- Module `id` MUST match entries in `master_curriculum.yaml` exactly.
- `evidence.sources` MUST be an array with at least one entry; `authority` value must be one of `Primary`, `Secondary`, `Supporting`.
- Files should be UTF-8 encoded and validated against a JSON schema (to be authored under `specs/.../schemas/`) prior to shipping to `frontend/`.

Backward compatibility strategy
- `schemaVersion` uses semantic major versioning. `v1` → `v2` breaks only when necessary; frontend adapter must ignore unknown fields to permit forward-compatible additions.
- Maintain a migration document in `specs/` for each schema change.

Notes
- Exported artifacts are snapshots. For near-real-time data, re-export and redeploy frontend or add future API layer.
