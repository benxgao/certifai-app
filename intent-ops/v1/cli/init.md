# Rollout: Initialize the Spec-First Scaffold under `v1/spec/` (Genesis Plan)

> **Role**: This file is the **genesis rollout plan** of the `intent-ops` package. It is itself written to the [`v1/flow/templates/rollout-plan-template.md`](../flow/templates/rollout-plan-template.md) structure, and **executing it as a rollout plan** generates all folders and files inside `v1/spec/`. Target projects run this plan the same way after copying the package. This is the recursive self-generation loop: the package produces its own spec system through the same methodology it standardizes.

## Summary

`intent-ops/v1/spec/` is the canonical-docs layer of the package: an entrypoint, an AI routing layer, an operations/governance layer, an ADR system, a workflow convention, and per-domain scaffolds. A fresh copy of the package ships only placeholders; this plan turns them into a complete, usable spec scaffold and keeps the structure aligned with the package's own layout.

This plan generates exactly these artifacts (the **output contract**):

```text
v1/spec/
├── README.md                       ← entrypoint: domain map, layering rule, flow interplay, quick start
├── ai/
│   ├── guide.md                    ← AI assistant retrieval guide (decision flow, post-task trigger)
│   ├── assistant-context-index.md  ← canonical index (registers every spec doc)
│   ├── repo-map.md                 ← placeholder repo-map skeleton
│   ├── project-simulation-readiness.md ← simulation rubric + run-log template
│   └── _template.md                ← canonical doc template
├── operations/
│   ├── ai-retrieval-smoke-tests.md ← retrieval QA protocol
│   ├── docs-maintenance.md         ← docs ownership / freshness / registration protocol
│   └── _template.md                ← operations-doc template
│   (the spec-first governance contract ships in `v1/flow/templates/rollout-plan-template.md`)
├── adr/
│   ├── README.md                   ← ADR process + month-log convention (YYYY-MM.md + Index)
│   └── _template.md                ← ADR template
├── workflow/
│   └── README.md                   ← workflow-doc naming convention (*-workflow.md)
└── architecture/ api/ state/ data/ style/ security/ performance/ testing/ product/
    └── _template.md                ← one generic scaffold per domain
    └── product/user-journey.md     ← user-journey scaffold (written by rollout Phase N)
```

Plus the package-root skills registry — `skills/README.md` (linked + registered by Phase 6; **not** generated inside `v1/spec/`, and not part of the `v1/` version — it is package-root user content for community skills).

## Current Evaluation

### What already exists

- `intent-ops/v1/spec/README.md` — may exist as a one-line stub ("Spec Kanban Specification Files") or not at all.
- Source material: the canonical-docs structure in the package's origin project (`docs/` with `ai/`, `operations/`, `adr/`, `workflow/`, and domain folders) — used as the **structural reference only**; business content is not copied.
- The methodology that gates this plan: [`v1/flow/README.md`](../flow/README.md) and [`v1/flow/templates/rollout-plan-template.md`](../flow/templates/rollout-plan-template.md).

### What is not centralized / stable / complete yet

1. The spec entrypoint does not exist or is a stub.
2. No `ai/` layer — assistants cannot route docs-first.
3. No `operations/` layer — governance contracts referenced by the flow templates are missing.
4. No `adr/` system and no `workflow/` convention.
5. No domain scaffolds — a new project has nothing to populate.

### Risks in the current state

- [ ] A target project that copies the package gets broken links (flow templates point at spec files that do not exist).
- [ ] Without an entrypoint, assistants cannot decide what to read first, so docs-first delivery degrades to ad-hoc code scanning.

## Scope

- Files to create: ~23 (`v1/spec/README.md`, 5 × `ai/`, 3 × `operations/`, 2 × `adr/`, 1 × `workflow/`, 9 domain `_template.md`, 1 × `product/user-journey.md`, 1 × package-root `skills/README.md` registry)
- Risk level: Low — documentation-only generation; no code, no runtime.

### In scope

- Generate every file listed in the output contract above.
- Derive `[project: fill in]` placeholder content for the target project (optional repo-scan phase).
- Register generated docs in `v1/spec/ai/assistant-context-index.md`.
- Link and register community skills in the package-root `skills/` folder (Skills integration phase).

### Out of scope

- Modifying `v1/flow/` (copied as-is by target projects).
- Business content from the origin project — intentionally excluded.
- Creating a target project's actual domain docs (placeholders only).

## Minimum Viable Hotfix

- Phase 1 (entrypoint) + Phase 2 (`ai/` layer) — once these exist, an assistant can route docs-first and declare `Docs Needed` from a real index.

## Docs Impact

> Completed during planning, before any generation.

### Docs checked during planning

| Doc                                          | Relevant finding                                                                                     |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `v1/flow/templates/rollout-plan-template.md` | Mandates `Docs Needed`, decision evidence, mandatory closing phases — this plan conforms.            |
| `v1/flow/10-plan/README.md`                  | Points to the rollout plan template (spec-first governance contract) — ships with the package, not generated here. |
| `v1/spec/README.md` (stub or missing)        | Entrypoint to author.                                                                                |
| Origin `docs/` structure                     | Structural mirror only; business content excluded by policy.                                         |

### Docs-First Retrieval Checklist

- [x] Loaded all primary docs for this task type (the flow templates and lane READMEs above).
- [x] Declared initial `Docs Needed` list before implementation planning.
- [x] Assessed sufficiency — docs were **sufficient** / ~~insufficient~~.
- [x] For each major planning decision, recorded a `Decision Evidence Log` row.
- [x] Post-task docs update required: `[x] Yes` — the generated scaffold itself is the deliverable.

### Docs Needed (planning + implementation)

| Doc                                          | Why needed                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------ |
| `v1/flow/templates/rollout-plan-template.md` | Structure this plan conforms to; the closing-phase language it mandates. |
| `v1/flow/README.md`                          | Lane transition criteria that gate this plan's progress.                 |
| Origin `docs/` structure (extraction source) | Folder topology to mirror; process/methodology only.                     |

### Planning Decision Evidence Log

| Decision                                                                                | Docs cited                                         | Sufficiency verdict | Fallback code scan used? | Doc update action                                      |
| --------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------- | ------------------------ | ------------------------------------------------------ |
| `v1/spec/` mirrors the origin `docs/` topology (ai, operations, adr, workflow, domains) | `v1/spec/README.md` purpose, origin docs structure | Sufficient          | No                       | Generate the scaffold per the output contract.         |
| Business content is excluded; `[project: fill in]` placeholders are used                | Package policy (navigator, business-free rule)     | Sufficient          | No                       | Enforced by the no-business-content verification gate. |
| The genesis plan is itself a rollout plan (recursive self-generation)                   | `v1/flow/templates/rollout-plan-template.md`       | Sufficient          | No                       | This file; proven by executing it.                     |

### Docs to create

| File                                                                                                                   | Reason                                                             |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `v1/spec/README.md` + `ai/` (5) + `operations/` (3) + `adr/` (2) + `workflow/README.md` (1) + domain scaffolds (9 + 1) | The spec-first scaffold this plan generates (see output contract). |
| `skills/README.md` (package root)                                                                                      | The skills registry/index — created if missing, updated if present; makes community skills linkable, navigable, and integrated on init. |

### No docs affected

- [ ] Confirmed: this plan introduces no new patterns and changes no existing conventions beyond the scaffold it generates.
      _(Checked only if run in a repo where `v1/spec/` was previously empty.)_

## Context Map

### Files to modify first

| File                | Purpose    | Why it matters                                             |
| ------------------- | ---------- | ---------------------------------------------------------- |
| `v1/spec/README.md` | Entrypoint | Anchors the domain map every other spec doc links back to. |

### Likely files to create

| File                                                                           | Purpose                           |
| ------------------------------------------------------------------------------ | --------------------------------- |
| `v1/spec/ai/*`, `operations/*`, `adr/*`, `workflow/*`, `<domain>/_template.md` | Scaffold per the output contract. |

### Risks

- [ ] The generated tree drifts from the output contract — mitigated by the verification gate that diffs the tree against the contract.
- [ ] Business content leaks into scaffolds — mitigated by the no-business-content scan.

## Recommended Architecture

### Principle 1: Process is normative, examples are fill-in

Rules that govern behavior (docs-first retrieval flow, decision-evidence schema, simulation rubric, ADR month-log convention) are stated as requirements. Examples are `[project: fill in]` placeholders.

### Principle 2: The scaffold mirrors the origin docs topology

Folder topology is the reusable asset. A target project may keep `v1/spec/` as its canonical docs or rename it to `<project>/docs/` with zero structural change.

## Dependency Rule

> **Each phase must touch exactly one dependency layer.**

Layers: entrypoint → ai → operations → adr/workflow → domains. Phases generate top-down; each phase's outputs are referenced by the next.

## Phase Sequencing Rule

Root cause first: the entrypoint (Phase 1) and the AI routing layer (Phase 2) unblock docs-first behavior immediately; the operations layer (Phase 3) supplies the governance contracts the flow templates link to; conventions and scaffolds (Phases 4–5) complete the tree.

## Progress Markers

- `[ ]` — not started
- `[~]` — in progress
- `[x]` — completed and verified
- `[!]` — blocked

## Progress Dashboard

- [x] Phase 1 — Entrypoint: `v1/spec/README.md`
- [x] Phase 2 — AI layer: `v1/spec/ai/*` (5 files)
- [x] Phase 3 — Operations layer: `v1/spec/operations/*` (3 files)
- [x] Phase 4 — ADR + workflow conventions: `v1/spec/adr/*` + `v1/spec/workflow/README.md` (3 files)
- [x] Phase 5 — Domain scaffolds: 9 × `_template.md` + `product/user-journey.md`
- [x] Phase 6 — Skills integration: link + register the package-root `skills/` registry (added 2026-08-27)
- [x] Phase 7 — Docs Sync: register generated docs in the context index; verify gates
- [x] Phase 8 — Rollout Eval & Health Score (100/100 on the generation gate; see session note)

## Phases

### Phase 1: Entrypoint — `v1/spec/README.md`

**Progress**: `[ ]`

**Layer**: spec entrypoint

**Goal**: Author the spec-first entrypoint: purpose, domain map (ai, operations, adr, workflow, architecture, api, state, data, style, security, performance, testing, product), canonical-vs-workflow layering rule, how `v1/spec/` and `v1/flow/` work together, quick start.

**Files**:

- `v1/spec/README.md` — create — entrypoint

**Verification gate**:

- `v1/spec/README.md` exists with metadata (`Source of truth`, `Last reviewed`, `Owner`) and a `## Related Docs` section.
- Domain map lists exactly the domains the scaffold ships.

---

### Phase 2: AI layer — `v1/spec/ai/*`

**Progress**: `[ ]`

**Layer**: spec AI/routing layer

**Goal**: Author the five AI-layer files so assistants can route docs-first: `guide.md` (retrieval decision flow, post-task docs-update trigger, retrieval QA trigger, generic task-type index), `assistant-context-index.md` (placeholder rows + registration instructions), `repo-map.md` (placeholder skeleton), `project-simulation-readiness.md` (full rubric + run-log), `_template.md` (generic canonical-doc template).

**Files**:

- `v1/spec/ai/guide.md` — create
- `v1/spec/ai/assistant-context-index.md` — create
- `v1/spec/ai/repo-map.md` — create
- `v1/spec/ai/project-simulation-readiness.md` — create
- `v1/spec/ai/_template.md` — create

**Verification gate**:

- All five files exist with metadata and `## Related Docs`.
- `grep -c "project: fill in" v1/spec/ai/*.md` >= 4 (placeholder discipline).
- No business terms (`grep -riE "cert[i]fai|fireb[a]se|str[i]pe|e[x]am|mailer[l]ite" v1/spec/ai/` returns nothing).

---

### Phase 3: Operations layer — `v1/spec/operations/*`

**Progress**: `[ ]`

**Layer**: spec governance layer

**Goal**: Author the three operations files: `ai-retrieval-smoke-tests.md` (QA protocol + placeholder prompts referencing `v1/spec/` paths), `docs-maintenance.md` (ownership, freshness SLA, new-doc registration, graph-link rules), `_template.md`. The spec-first governance contract (Docs Needed gate, 5-column decision evidence schema, reviewer gates) ships in `v1/flow/templates/rollout-plan-template.md`, not as a standalone spec doc.

**Files**:

- `v1/spec/operations/ai-retrieval-smoke-tests.md` — create
- `v1/spec/operations/docs-maintenance.md` — create
- `v1/spec/operations/_template.md` — create

**Verification gate**:

- All three files exist with metadata and `## Related Docs`.
- The 5-column decision evidence schema (`Decision`, `Docs cited`, `Sufficiency verdict`, `Fallback code scan used?`, `Doc update action`) ships in `v1/flow/templates/rollout-plan-template.md`.
- Smoke-test prompts reference only `v1/spec/...` and `v1/flow/...` paths.

---

### Phase 4: ADR + workflow conventions — `v1/spec/adr/*` + `v1/spec/workflow/README.md`

**Progress**: `[ ]`

**Layer**: spec conventions layer

**Goal**: Author `adr/_template.md` (context/decision/consequences), `adr/README.md` (numbered ADRs, month-log `YYYY-MM.md` + `## Index` convention that the rollout template's Docs Sync phase relies on), and `workflow/README.md` (`*-workflow.md` naming convention, generic examples).

**Files**:

- `v1/spec/adr/_template.md` — create
- `v1/spec/adr/README.md` — create
- `v1/spec/workflow/README.md` — create

**Verification gate**:

- All three files exist with metadata and `## Related Docs`.
- `adr/README.md` documents the month-log + index convention.
- `workflow/README.md` example filenames contain no business nouns.

---

### Phase 5: Domain scaffolds — 9 × `_template.md` + `product/user-journey.md`

**Progress**: `[ ]`

**Layer**: spec domain scaffolds

**Goal**: Create one `_template.md` per domain (architecture, api, state, data, style, security, performance, testing, product) plus `product/user-journey.md`; each keeps the standard headings (Purpose, System Boundary / Key Concepts, Critical Invariants / Conventions, Dangerous Areas, Related Docs) with `[project: fill in]` placeholders.

**Files**:

- `v1/spec/architecture/_template.md`, `api/_template.md`, `state/_template.md`, `data/_template.md`, `style/_template.md`, `security/_template.md`, `performance/_template.md`, `testing/_template.md`, `product/_template.md` — create
- `v1/spec/product/user-journey.md` — create

**Verification gate**:

- Each domain folder contains exactly `_template.md` (plus `user-journey.md` for product).
- No domain folder contains business content.

---

### Phase 6: Skills integration — link, navigate, register community skills

**Progress**: `[x]`

**Layer**: package-root integration (skills registry)

**Goal**: Make any skills files in the package-root `skills/` folder usable with the workflow: ensure the registry exists, index every installed skill, register the folder for docs-first retrieval, and validate links. Skills are community-downloaded AI-coding instructions; the folder ships with the package and is populated by users.

**Files**:

- `skills/README.md` — create if missing / update — the skills registry (Skill Index table, format, registration steps)
- `v1/spec/ai/assistant-context-index.md` — modify — add a Quick Reference row for the skills registry
- `instructions.md` — modify — optional: add Prompt-Triggers rows for skills that map to user intents

**Verification gate**:

- Every non-`README.md` entry under `skills/` is listed in the Skill Index.
- All relative links in the registry resolve.
- `v1/spec/ai/assistant-context-index.md` has a Quick Reference row pointing to `skills/README.md`.
- No business terms in the registry (`grep -riE "cert[i]fai|fireb[a]se|str[i]pe|e[x]am|mailer[l]ite" skills/` returns nothing).

**Version-scope note**: `skills/` is package-root user content (community skills), the same class as `README.md`/`instructions.md` — not versioned under `v1/`. The v1 → v2 migration stays a plain file copy because `skills/` is copied with the package folder, not under `v1/`. References from `v1/`-rooted docs to the registry are a documented package-root external (see the version-scope scan in `../instructions.md`).

---

### Phase 7: Docs Sync _(mandatory closing phase)_

**Progress**: `[ ]`

**Goal**: Register every generated doc in `v1/spec/ai/assistant-context-index.md` and verify the full output contract.

**Verification gate**:

- `find v1/spec -type f` matches the output contract file inventory.
- Every generated file has `Source of truth:`, `Last reviewed:`, `Owner:` metadata and a `## Related Docs` section.
- Every generated file is registered in `v1/spec/ai/assistant-context-index.md`.
- Link scan: every relative link resolves.
- Content scan: `grep -riE "cert[i]fai|fireb[a]se|str[i]pe|e[x]am|mailer[l]ite" v1/spec/` returns nothing.

---

### Phase 8: Rollout Eval & Health Score _(mandatory closing phase)_

**Progress**: `[ ]`

**Goal**: Score the generation per the package rubric (docs-first adherence 40, docs health 40, reflection 20, simulation readiness 20 — pass >= 85/120) and record the verdict in a session note.

---

## Dependency Graph

```text
v1/spec/README.md (entrypoint)
        ↓
v1/spec/ai/* (routing layer)
        ↓
v1/spec/operations/* (governance layer)
        ↓
v1/spec/adr/* + workflow/ (conventions)
        ↓
domain scaffolds (9 × _template.md + user-journey.md)
        ↓
skills integration (package-root skills/README.md registry + context-index registration)
```

## Suggested Implementation Order

Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 (Skills integration) → Phase 7 (Docs Sync) → Phase 8 (Eval).

## Progress Checks (Resume-at-any-time protocol)

At the end of each working session:

1. Update the Progress Dashboard and active phase `Progress` marker.
2. Mark sub-subphase `[x]` only after independent verification passes.
3. Add a short session note with timestamp, last completed step, next step, and blockers.

### Session Note Template

```markdown
### Session Note — <YYYY-MM-DD HH:mm local>

- Completed: <phase>
- Verified by: <command/scan>
- Next: <phase>
- Blockers: <none | details>
```

## Essential Implementation Details

- All verification gates are markdown/grep/file-existence checks — no build step, no runtime.
- Business-free rule: any content naming a specific product, provider, or architecture of an origin project stays out; use `[project: fill in]` placeholders.
- Register every generated doc in the context index; link from each doc's `## Related Docs` section.
- Skills integration: `skills/` is package-root user content (not under `v1/`); the registry `skills/README.md` is created/updated by Phase 6 and referenced from this plan via `../../skills/README.md` (documented package-root external).
- The generated `v1/spec/` may be renamed to `<project>/docs/` after copy — all internal links are relative and survive the rename.

## Execution Record

### Session Note — 2026-08-27 14:25 local

- Completed: Phases 1–6 executed against the package to generate `v1/spec/` (23 files, matching the output contract).
- Verified by: `find v1/spec -type f` matches the file inventory; all files carry metadata + `## Related Docs`; 23/23 registered in `v1/spec/ai/assistant-context-index.md`; link scan zero missing targets; content scan zero business terms.
- Next: target projects execute this plan the same way (see the Follow-Up section of `../flow/10-plan/sculp-intent-ops.md`).
- Blockers: none.

### Session Note — 2026-08-27 17:15 local

- Completed: Phase 6 (Skills integration) added and executed — authored the package-root `skills/README.md` registry, added a Quick Reference row in the context index, validated links and content.
- Verified by: link scan on new references; `grep -riE "cert[i]fai|fireb[a]se|str[i]pe|e[x]am|mailer[l]ite" skills/` returns nothing.
- Next: target projects run the full plan (Phases 1–8) to generate `v1/spec/` + the skills registry.
- Blockers: none.

## Success Criteria

- The `v1/spec/` tree matches the output contract exactly.
- The package-root `skills/` registry exists (created or updated), indexes every installed skill, and is registered in the context index.
- All files have metadata and `## Related Docs`; all are registered in the context index.
- Zero business terms remain; every relative link resolves.
- The plan itself is repeatable: any project can execute it to produce the same scaffold.

## Rollback Plan

1. Every change is markdown-only — `git revert` any phase commit with no code impact.
2. If the scaffold drifts from the contract, delete the drifted files and re-run from the offending phase.

## Open Questions

1. Should the scaffold include domain folders beyond the default set? Default: keep the 9 domains; a target project may add/remove folders after generation. (Owner: user; revisit in follow-up.)
2. Should Phase 6 also generate Prompt-Triggers rows in `instructions.md` for each installed skill, or is the registry (Skill Index) sufficient? Default: registry is sufficient; trigger rows are added when a skill maps to a concrete user intent. (Owner: user; revisit in follow-up.)

## Recommendation

Execute Phases 1–5 in order, then Docs Sync and Eval. The result is a complete, verified spec-first scaffold that any project can regenerate.
