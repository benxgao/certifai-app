# Intent Operations — AI Copilot Navigator

> **Source of truth**: this package (`intent-ops/`) — navigates, does not restate
> **Last reviewed**: 2026-08-27
> **Owner**: package maintainer

## What This Is

`intent-ops` is a self-contained, copy-ready package that turns any AI-assisted software project into a **spec-first, intent-driven delivery system**. It merges two proven concepts:

- **Spec system** (`v1/spec/`) — a canonical, retrievable docs structure: domain docs, AI routing guide, decision history (ADR), governance protocols. Code is written from specs first; code scanning is a bounded, recorded fallback.
- **Kanban flow** (`v1/flow/`) — an AI-oriented kanban that treats tickets as a **context system**: lane-based delivery (`00-intake` → `10-plan` → `20-active` → `30-review` → `40-archive` → `50-report`) with evidence-based completion and executive closeout.

The two are wired together: rollout plans (`v1/flow/templates/rollout-plan-template.md`) require a `Docs Needed` declaration and a per-decision evidence log before any implementation, and every rollout closes with docs sync, a docs-only simulation drill, and a health score.

The whole folder can be copied into any project and take effect immediately. See [First Copy](#first-copy-checklist) below.

## Package Layout

```text
intent-ops/
├── instructions.md              ← this navigator (you are here)
├── README.md                    ← package definition, layout, version model
├── skills/
│   └── README.md                ← skills registry (community AI-coding instructions)
├── v1/
│   ├── README.md                ← version manifest + v1 → v2 migration checklist
│   ├── cli/
│   │   └── init.md              ← GENESIS ROLLOUT PLAN: execute it to generate v1/spec/
│   ├── flow/                    ← AI-oriented kanban (methodology + lanes + templates)
│   │   ├── README.md
│   │   ├── 00-intake/ 10-plan/ 20-active/ 30-review/ 40-archive/ 50-report/
│   │   └── templates/
│   │       ├── rollout-plan-template.md
│   │       └── excutive-report-template.md
│   └── spec/                    ← spec-first docs system (mirrors a project docs/ structure)
│       ├── README.md
│       ├── ai/ operations/ adr/ workflow/
│       └── architecture/ api/ state/ data/ style/ security/ performance/ testing/ product/
```

## Entry Routing

| When you need to...                                                          | Go to                                                                                      |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Understand the delivery methodology (principles, lane gates, operating loop) | [`v1/flow/README.md`](v1/flow/README.md)                                                   |
| Write a rollout plan / phased plan / migration plan                          | [`v1/flow/templates/rollout-plan-template.md`](v1/flow/templates/rollout-plan-template.md) |
| Find or add canonical docs, decide what to read for a task                   | [`v1/spec/README.md`](v1/spec/README.md) → [`v1/spec/ai/guide.md`](v1/spec/ai/guide.md)    |
| Initialize a new repo's spec scaffold                                        | [`v1/cli/init.md`](v1/cli/init.md) — execute it as a rollout plan                          |
| Browse or register community AI-coding skills                                | [`skills/README.md`](skills/README.md) — registry + integration steps                     |
| Understand versions and how to upgrade to v2                                 | [`v1/README.md`](v1/README.md)                                                             |

## Prompt Triggers

The workflow is intent-driven. These trigger phrases map to deterministic behaviors:

| User prompt intent         | Behavior                                                                                                                                                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "generate a plan for X"    | Create a rollout plan file in `v1/flow/10-plan/` from [`rollout-plan-template.md`](v1/flow/templates/rollout-plan-template.md) (with `Docs Needed`, decision evidence, verification gates). Remove the intake item from `v1/flow/00-intake/`. |
| "start the planned task X" | Begin implementing the first 2 phases of the planned task, following the plan's verification gates. Update the plan's progress dashboard and session notes.                                                                                   |
| "complete the task X"      | Mark the task done (all gates pass), archive the relevant documents to `v1/flow/40-archive/`, and generate an executive report into `v1/flow/50-report/` from [`excutive-report-template.md`](v1/flow/templates/excutive-report-template.md). |

For every prompt, the docs-first rule applies first: route via [`v1/spec/ai/guide.md`](v1/spec/ai/guide.md), declare `Docs Needed` before implementation, and record a `Decision Evidence Log` row for every major decision.

## First Copy Checklist

1. Copy the `intent-ops/` folder into your project root.
2. Decide where canonical docs live: keep `intent-ops/v1/spec/` as-is, or promote it to `<project>/docs/` (all internal links are relative and survive the rename — see [`v1/README.md`](v1/README.md)).
3. Execute [`v1/cli/init.md`](v1/cli/init.md) **as a rollout plan** — it generates all folders and files inside `v1/spec/` for your repo (this is the genesis/recursive self-generation step); its Skills-integration phase also links and registers the `skills/` folder.
4. Drop community AI-coding skills into `skills/`; register each in [`skills/README.md`](skills/README.md) (Skill Index).
5. Populate the domain scaffolds in `v1/spec/` (`architecture/`, `api/`, `state/`, `data/`, `style/`, `security/`, `performance/`, `testing/`, `product/`) with `[project: fill in]` placeholders replaced by your project's actual content.
6. Register every new doc in [`v1/spec/ai/assistant-context-index.md`](v1/spec/ai/assistant-context-index.md).
7. Validate copy-readiness with the scans below.

## Copy-Readiness Validation (Maintenance Gate)

Run these after every package edit. The package is copy-ready only when all pass.

```bash
# 1. Link integrity: every markdown link resolves to an existing file
#    (extract the targets of all markdown link syntax, then check each path exists)
grep -rnE "\]\(([^)]+)\)" intent-ops/ | grep -v "http" > /tmp/links.txt

# 2. Version scope: no internal reference escapes the package
#    (skills/ is a documented package-root external — the registry the init plan links to;
#     the v1 → v2 migration is unaffected because skills/ is not versioned under v1/)
grep -rn "\.\./\.\./\.\./" intent-ops/v1/ | grep -v "skills"   # must return nothing
grep -rn "docs/" intent-ops/v1/flow/ | grep -v "v1/spec" | grep -v "\.\./spec"   # audit remaining docs/ mentions

# 3. No business content (terms from the origin project must be absent;
#    word boundaries avoid matching inside ordinary words like "example";
#    bracket trick keeps the command from matching its own literal text;
#    the archived transfer plan at v1/flow/10-plan/ is a historical record and is excluded)
grep -riE "cert[i]fai|fireb[a]se|str[i]pe|\be[x]am\b|mailer[l]ite" \
  intent-ops/ --exclude="v1/flow/10-plan/*"   # must return nothing
```

| Gate               | Pass criterion                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Link scan          | every relative link target exists                                                                                                     |
| Version-scope scan | no `v1/`-rooted document references anything outside `intent-ops/` (only documented externals: extraction sources, promotion note, package-root `skills/` registry) |
| Content scan       | zero matches for origin-project business terms                                                                                        |
| Simulated copy     | `cp -r intent-ops /tmp/intent-ops-copy-test` passes the same three scans                                                              |
| Genesis dry-run    | executing `v1/cli/init.md` against a scratch repo regenerates the `v1/spec/` scaffold, which passes the same scans                    |

## Maintenance Notes

- **One-way extraction**: improvements are authored here in `intent-ops`; backporting to the source folders (`ai_oriented_kanban/`, `docs/`) is a deliberate, manual act.
- **Versioning**: `v1/` is the current version. `v2/` is created by copying all files under `v1/` to `v2/` and applying changes — see [`v1/README.md`](v1/README.md) for the migration checklist.
- **Business-free rule**: never commit content that names a specific product, provider, or architecture of an origin project; use `[project: fill in]` placeholders instead.
- **Skills**: community AI-coding skills live in `skills/` (see [`skills/README.md`](skills/README.md)); they are package-root user content, not versioned under `v1/`, and are linked/registered by the init plan.

## Related Docs

- [`README.md`](README.md) — package definition and version model
- [`v1/README.md`](v1/README.md) — version manifest and migration checklist
- [`v1/flow/README.md`](v1/flow/README.md) — the AI-oriented kanban methodology
- [`v1/spec/README.md`](v1/spec/README.md) — the spec-first docs system
- [`v1/cli/init.md`](v1/cli/init.md) — the genesis rollout plan
- [`skills/README.md`](skills/README.md) — skills registry
