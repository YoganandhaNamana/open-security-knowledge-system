Frontend Inventory
==================

Location (sandbox)
------------------
`_incoming_gemini_frontend/` — read-only sandbox extracted for SDD audit.

Complete structure (top-level)
- .env.example — environment hints for GEMINI_API_KEY, APP_URL
- .gitignore
- assets/ — static images and media
- index.html — SPA HTML entry
- metadata.json — app metadata (mentions server-side Gemini capability)
- package.json — npm scripts and dependencies (do not modify)
- README.md — run/deploy instructions for AI Studio
- src/ — React + TypeScript source
  - main.tsx — React entry (mounts `App`)
  - App.tsx — top-level app wiring and state
  - index.css — global styles (Tailwind)
  - types.ts — TypeScript types for UI models
  - data/osksData.ts — large hardcoded dataset (modules, labs, CVEs, KBs)
  - components/* — UI components (Dashboard, LiveLabTerminal, ThreatIntel, KnowledgeBase, etc.)
- tsconfig.json
- vite.config.ts — Vite + Tailwind plugin configuration

Component responsibilities
- `App.tsx` — global client state, top-level navigation and composition of components.
- `components/Dashboard.tsx` — overview / summary widgets and module cards.
- `components/ModulesView.tsx` — module listing and selection UI.
- `components/LearningJourney.tsx` — stage-based lesson renderer and stage navigation.
- `components/LiveLabTerminal.tsx` — simulated terminal sandbox UI and flag verification (client-only simulation).
- `components/TerminalAssistant.tsx` — CLI-style assistant for curriculum navigation.
- `components/KnowledgeBase.tsx` — article reader and KB listing (uses static `KNOWLEDGE_ARTICLES`).
- `components/ThreatIntel.tsx` — displays `LIVE_CVES` and MITRE techniques (static data).
- `components/QuickSearchModal.tsx` — client-side quick search against local datasets.

Dependencies (from `package.json`) — runtime (non-exhaustive)
- `react`, `react-dom`, `vite`, `@vitejs/plugin-react`
- `tailwindcss`, `@tailwindcss/vite` (styling)
- `@google/genai` (Gemini client; implies server-side AI usage intended)
- `express`, `dotenv` (server/injection hints are present but no server code included)
- `lucide-react`, `motion` for UI icons and animation

Data sources (current state)
- `src/data/osksData.ts`: single-source of truth for the SPA — contains:
  - `INITIAL_USER_STATS` (fake user profile)
  - `SECURITY_MODULES` (array of module objects with ids like `mod-recon`, `mod-webapp`)
  - `INTERACTIVE_LABS` (labs with `flag` strings and `targetIp` values)
  - `LIVE_CVES`, `MITRE_TECHNIQUES`, `KNOWLEDGE_ARTICLES`
- No runtime network fetches; SPA is offline-first using local imports.

Components safe to preserve unchanged (on move to `frontend/`)
- All presentational UI components in `src/components/*` (visuals, layout, behaviors) — keep as-is subject to data adapter changes.
- Styling and Vite/Tailwind config (can be reused under `frontend/`).

Components requiring adaptation
- `src/data/osksData.ts` — must be replaced with a data adapter that consumes exported canonical JSON (see `data-contract.md`).
- `LiveLabTerminal` and other lab components — data (flags, IPs) must be sanitized and mapped to canonical lab metadata or sandbox-only placeholders.
- Type definitions (`types.ts`) likely require alignment with canonical `ModuleMetadata` fields; mapping layer required.
- Any use of `@google/genai` and secrets (GEMINI_API_KEY) must be controlled and moved behind approved server-side integration in a future phase.

Notes
- The frontend is currently a complete SPA with rich UI and a simulated learning environment powered by static datasets. Integration should preserve UI components while replacing hardcoded data with canonical exported JSON and a clean adapter layer.
