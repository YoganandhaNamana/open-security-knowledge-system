# Contributing to OSKS

OSKS uses a **Dual-Engine Architecture** supporting both automated API workflows and
free-tier, prompt-assisted development. Most contributors will use the free-tier path
below unless they have an `ANTHROPIC_API_KEY` configured.

## Free-Tier / Manual-Paste Workflow

Run each stage explicitly — do **not** run bare `python main.py`, since its default
`--stage all` will skip the manual paste step entirely and just leave placeholder text
in place (which fails QA on purpose).

### 1. Scaffold the Module Bundle
```bash
python main.py --module NET-101 --stage scaffold
```
This creates the module tree (`modules/.../NET-101/`) with all 11 bundle files and a
hydrated `chapter.md` (front-matter + section headers from `chapter.j2`).

### 2. Generate Technical Research
```bash
python main.py --module NET-101 --stage research
```
This writes `prompts/compiled/research_prompt_NET-101.md`. Open it, paste the whole
thing into Claude.ai (or ChatGPT), and save the reply into
`modules/.../NET-101/research.md`, replacing the placeholder text.

### 3. Generate the Technical Chapter Content
```bash
python main.py --module NET-101 --stage write
```
This writes `prompts/compiled/writer_prompt_NET-101.md`. Paste it into your LLM chat,
then replace the `## 🧠 3. Technical Deep-Dive & Architecture` placeholder in
`chapter.md` with the response.

### 4. Run the QA Gate
```bash
python main.py --module NET-101 --qa-only
```
QA checks: all 11 bundle files present, valid front-matter, at least one Primary
evidence source, and no leftover placeholder text in `research.md` or `chapter.md`.
Fix any reported errors and re-run until it passes.

## API Mode (Reference Implementation)

If `ANTHROPIC_API_KEY` is set (and the `anthropic` package is installed), the same
commands call the API directly instead of compiling a prompt file. Override the model
with `OSKS_LLM_MODEL` if needed — check `docs.claude.com` for the current model string,
since Anthropic retires older models on a rolling basis.

## Adding a New Module

1. Add an entry under the relevant volume/chapter in `curriculum/master_curriculum.yaml`.
2. Run the four stages above for the new module ID.
3. Commit the completed, QA-passing bundle.
