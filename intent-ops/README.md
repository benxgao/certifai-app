# Intent Operations Flow

## Overview

`intent-ops` is a self-contained, copy-ready package that gives any AI-assisted software project a **spec-first, intent-driven delivery workflow**. It unifies two proven systems:

- **`v1/flow/`** — the AI-oriented kanban: an intent-driven delivery method (lane-based: intake → plan → active → review → archive → report) with evidence-based completion.
- **`v1/spec/`** — the spec-first docs system: a canonical, retrievable documentation structure (AI routing, governance protocols, ADR decision history, per-domain scaffolds).
- **`v1/cli/init.md`** — the genesis rollout plan: executed as a rollout plan to generate all folders and files inside `v1/spec/` (recursive self-generation).
- **`instructions.md`** — the navigator: entry routing, prompt triggers, first-copy checklist, and copy-readiness validation gates for AI coding copilots.

The whole folder can be copied into any project and benefit immediately.

## Package Layout

```text
intent-ops/
├── instructions.md              ← navigator for AI copilots (start here)
├── README.md                    ← this file
├── v1/
│   ├── README.md                ← version manifest + v1 → v2 migration checklist
│   ├── cli/init.md              ← genesis rollout plan (generates v1/spec/)
│   ├── flow/                    ← AI-oriented kanban (methodology, lanes, templates)
│   └── spec/                    ← spec-first docs system (mirrors a project docs/ structure)
```

## Version Model

- `v1/` is the complete current version of the package.
- The next version (`v2/`) is created by copying all files under `v1/` to `v2/` and applying changes — no cross-version references, so migration stays a plain file copy.
- See [`v1/README.md`](v1/README.md) for the migration checklist.

## How to Use

1. **Start** with [`instructions.md`](instructions.md) — it routes copilots into `v1/flow/` (delivery), `v1/spec/` (docs), and `v1/cli/` (initialization).
2. **Initialize a new project**: copy the folder, then execute [`v1/cli/init.md`](v1/cli/init.md) as a rollout plan to generate the `v1/spec/` scaffold.
3. **Deliver**: route prompts through the prompt triggers in `instructions.md`; plans live in `v1/flow/10-plan/`, evidence in `v1/flow/20-active/`, archives in `v1/flow/40-archive/`, reports in `v1/flow/50-report/`.

## Copy & Promotion

- Copy the `intent-ops/` folder into your project root. All internal references are relative and resolve inside the package.
- Canonical docs may stay at `intent-ops/v1/spec/` **or** be promoted to `<project>/docs/` (rename the folder; the structure survives unchanged). Document the choice in `v1/spec/adr/`.
- Validate every copy with the scan gates in [`instructions.md`](instructions.md) (link / version-scope / content / simulated-copy / genesis dry-run).

## Provenance

The methodology and doc structure were extracted and generalized from the AI-oriented kanban methodology and a spec-first docs system; business-specific content is intentionally excluded. Improvements should be authored here in `intent-ops` and backported to source folders deliberately.

## Related Docs

- [`instructions.md`](instructions.md) — navigator
- [`v1/README.md`](v1/README.md) — version manifest + migration checklist
- [`v1/flow/README.md`](v1/flow/README.md) — methodology
- [`v1/spec/README.md`](v1/spec/README.md) — spec-first docs system
