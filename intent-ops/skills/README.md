# Skills — Community AI-Coding Instructions

> **Source of truth**: this `skills/` folder
> **Last reviewed**: 2026-08-27
> **Owner**: package maintainer

## What This Is

`intent-ops/skills/` stores a collection of **skills** — packaged instructions that tell an AI coding copilot how to perform a specific task (e.g. "run the E2E suite", "review a rollout plan", "migrate the database schema"). Skills are usually downloaded from the community (or written locally), dropped into this folder, and then **linked, navigated, and integrated** with the `intent-ops` workflow:

- **Linked** — the package entry points point here: the navigator ([`../instructions.md`](../instructions.md)), the package README ([`../README.md`](../README.md)), and the genesis plan ([`../v1/cli/init.md`](../v1/cli/init.md)).
- **Navigated** — this file is the registry/index for every installed skill; copilots discover skills here, and the assistant context index ([`../v1/spec/ai/assistant-context-index.md`](../v1/spec/ai/assistant-context-index.md)) routes docs-first retrieval to this folder.
- **Integrated on init** — executing [`../v1/cli/init.md`](../v1/cli/init.md) as a rollout plan includes a **Skills integration** phase that refreshes this registry, re-registers every skill for retrieval, and validates links.

## Skill Format

Each skill is one entry in this folder:

```text
skills/
├── README.md            ← this registry / index
└── <skill-name>/
    ├── SKILL.md         ← the instruction (canonical file for the skill)
    └── ...              ← optional assets (scripts, examples) referenced by SKILL.md
```

- A skill may be a single `<skill-name>.md` file if it needs no assets.
- `SKILL.md` must carry `Source of truth`, `Last reviewed`, `Owner` metadata and a `## Related Docs` section — the same convention as [`../v1/spec/ai/_template.md`](../v1/spec/ai/_template.md).

## Adding a Skill (Register It Here)

1. Copy the skill into `skills/<skill-name>/` (or `skills/<skill-name>.md`).
2. Add a row to the **Skill Index** below.
3. Register the folder in [`../v1/spec/ai/assistant-context-index.md`](../v1/spec/ai/assistant-context-index.md) (`Adding New Documentation`) so copilots find it docs-first.
4. If the skill corresponds to a user prompt intent, add a row to the Prompt Triggers table in [`../instructions.md`](../instructions.md).
5. Run the copy-readiness scans in [`../instructions.md`](../instructions.md) (link / version-scope / content) — skills must not introduce origin-project business terms.

## Skill Index

| Skill                      | What it does                    | Prompt trigger              | Status   |
| -------------------------- | ------------------------------- | --------------------------- | -------- |
| `[project: fill in]`       | `[project: fill in]`            | `[project: fill in]`        | Installed |

## Integration with the Workflow

- **Docs-first rule still applies**: a skill is an instruction aid, not a license to skip the `Docs Needed` declaration and the decision-evidence log required by [`../v1/flow/templates/rollout-plan-template.md`](../v1/flow/templates/rollout-plan-template.md).
- **Skills vs flow**: a skill may be invoked from a rollout plan phase, or triggered by a prompt intent from the navigator; the kanban lanes in `v1/flow/` remain the delivery context around it.
- **Versioning**: `skills/` is package-root user content (like `README.md` / `instructions.md`), **not** versioned under `v1/`. It is copied with the package folder; the v1 → v2 migration is unaffected because `skills/` is not part of `v1/`.

## Related Docs

- [`../instructions.md`](../instructions.md) — navigator (entry routing, prompt triggers, validation scans)
- [`../v1/cli/init.md`](../v1/cli/init.md) — genesis plan (its Skills-integration phase registers this folder on init)
- [`../v1/spec/ai/assistant-context-index.md`](../v1/spec/ai/assistant-context-index.md) — retrieval index
- [`../v1/spec/ai/_template.md`](../v1/spec/ai/_template.md) — metadata / doc-template convention
- [`../v1/flow/templates/rollout-plan-template.md`](../v1/flow/templates/rollout-plan-template.md) — rollout-plan structure skills must not bypass
