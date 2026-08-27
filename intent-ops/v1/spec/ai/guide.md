# AI Assistant Guide

> **Source of truth**: `v1/spec/` directory structure — this file navigates, not restates
> **Last reviewed**: 2026-08-27
> **Owner**: package maintainer

## Purpose

This guide tells AI assistants _how_ to use the `v1/spec/` knowledge base when working on a task. Instead of searching the codebase blind, load the relevant docs first — they describe invariants, dangerous areas, and conventions that are not obvious from code alone.

Do not load all docs. Load only what the current task requires. Use the task-type index below to pick the right docs.

---

## How to Use This Guide

1. Identify your task type from the index below.
2. Load the listed **primary docs** before reading or writing any code.
3. Check the **invariants** — these are hard constraints; violating them causes bugs or security issues.
4. Check the **anti-patterns** — these are common mistakes to avoid.
5. After implementation, confirm the **docs that need updating** as listed per task type.

Start with [`v1/spec/ai/repo-map.md`](repo-map.md) if you are unfamiliar with the codebase or working on something that crosses multiple domains.

### Docs-First Retrieval Decision Flow

Follow this ordered decision path on every task before touching code:

1. **Identify** the task type in the [Task-Type Index](#task-type-index) below.
2. **Load** all listed primary docs for that task type.
3. **Assess sufficiency** — can the loaded docs answer the implementation decision fully?
   - **Yes → proceed** using docs as the primary context. Do not open source files unless the task explicitly requires reading implementation.
   - **No → fallback**: scan the codebase only when docs are **insufficient** because they are missing, ambiguous, contradictory, or known to be outdated for this specific decision.
4. **Record the gap**: if a code scan was needed, note which docs were insufficient and add them to the post-task update list.

This flow is docs-first by default. Codebase scanning is a fallback, not a starting point.

### Post-Task Docs-Update Trigger

After implementation, if code findings revealed that any spec doc was missing, incorrect, or incomplete:

1. Update the relevant doc before closing the task.
2. If the finding is structural (new file, renamed API, changed invariant), also update the applicable entry in [`v1/spec/ai/assistant-context-index.md`](assistant-context-index.md).
3. Record what changed in the PR or rollout note so the update is traceable.

Skipping this step leaves the next assistant with the same insufficient docs context that required the fallback.

### Retrieval QA Requirement (When to Run Smoke Tests)

Run the manual retrieval protocol in [`v1/spec/operations/ai-retrieval-smoke-tests.md`](../operations/ai-retrieval-smoke-tests.md) when:

1. You create, rename, or remove docs under `v1/spec/`.
2. You modify task routing guidance in this file.
3. You add governance/workflow docs that assistants should discover during first-pass retrieval.

Record pass/fail results in the PR or rollout note, and fix routing/index docs before merge if any prompt fails.

---

## Task-Type Index

> The entries below are **scaffolds**. Replace each `[project: fill in]` placeholder with your project's actual task types, primary docs, invariants, and anti-patterns. Keep the structure; the rules in [How to Use This Guide](#how-to-use-this-guide) are normative.

### 1. [project: fill in — e.g., Adding or Modifying a Page or Route]

**Primary docs to load**:

1. [`v1/spec/architecture/_template.md`](../architecture/_template.md) — routing rules, layout hierarchy, page/component split patterns
2. [`v1/spec/ai/repo-map.md`](repo-map.md) — confirm whether the route is public or protected

**Invariants**:

- [project: fill in — e.g., every protected route lives under a single guarded prefix]

**Anti-patterns**:

- [project: fill in — e.g., calling API endpoints directly from a page component]

**Docs to update after implementation**: `[project: fill in — e.g., v1/spec/architecture/...]`.

---

### 2. [project: fill in — e.g., Adding or Modifying a Data-Fetching Hook]

**Primary docs to load**:

1. [`v1/spec/api/_template.md`](../api/_template.md) — response envelope shape, fetch config, error handling
2. [`v1/spec/data/_template.md`](../data/_template.md) — type conventions

**Invariants**:

- [project: fill in]

**Anti-patterns**:

- [project: fill in]

**Docs to update after implementation**: `[project: fill in]`.

---

### 3. [project: fill in — e.g., Changing Auth Flow, JWT Handling, or Middleware]

**Primary docs to load**:

1. [`v1/spec/security/_template.md`](../security/_template.md) — auth state machine, cookie lifecycle, server-only boundaries
2. [`v1/spec/state/_template.md`](../state/_template.md) — context provider responsibilities

**Invariants**:

- [project: fill in]

**Anti-patterns**:

- [project: fill in]

**Docs to update after implementation**: `[project: fill in]`.

---

### 4. Writing or Updating a Rollout Plan from docs/specs First

**Primary docs to load**:

1. [`v1/spec/ai/assistant-context-index.md`](assistant-context-index.md) — confirm which docs exist before listing docs to create/update
2. [`v1/spec/operations/docs-maintenance.md`](../operations/docs-maintenance.md) — update trigger table to identify which docs are affected
3. Template: [`v1/flow/templates/rollout-plan-template.md`](../../flow/templates/rollout-plan-template.md) — includes the spec-first governance contract (Docs Needed gate, 5-column decision evidence schema, reviewer gates)

**Invariants**:

- Every rollout plan must include a `## Docs Impact` section listing docs checked, docs to create/update/delete.
- Every rollout plan must declare `Docs Needed` before implementation planning starts.
- Every rollout plan must include a `Planning Decision Evidence Log` for major decisions (`Decision`, `Docs cited`, `Sufficiency verdict`, `Fallback code scan used?`, `Doc update action`).
- Rollout planning must start from canonical docs/specs only; code scanning is a bounded fallback that must be recorded and remediated.
- Every rollout plan must include mandatory closing phases in order: Docs Sync, AI-ready docs reflection and next-plan handoff, Docs-only Simulation Drill, and Rollout Eval & Health Score.
- Check `v1/spec/ai/assistant-context-index.md` before listing a doc as "to create" — it may already exist.

**Anti-patterns**:

- Omitting the docs-sync phase because the plan "doesn't touch docs" — every code change has potential doc impact.
- Duplicating documentation content across multiple docs instead of linking.
- Using fallback code scan without recording which docs were insufficient and what docs were updated.

---

### 5. Running Docs-Only Simulation Readiness

**Primary docs to load**:

1. [`v1/spec/ai/project-simulation-readiness.md`](project-simulation-readiness.md) — rubric, scoring, and run-log format
2. [`v1/flow/templates/rollout-plan-template.md`](../../flow/templates/rollout-plan-template.md) — policy and evidence requirements (Docs Needed, decision evidence schema)
3. [`v1/spec/operations/ai-retrieval-smoke-tests.md`](../operations/ai-retrieval-smoke-tests.md) — simulation-related prompts and pass criteria

**Invariants**:

- Simulation output must include `Docs Needed` and a complete decision-evidence table.
- Fallback code scans are allowed only when justified and must trigger same-rollout docs remediation.
- A simulation run is not passable if major decisions cannot be traced to cited docs.

**Anti-patterns**:

- Running simulation as a narrative note without measurable score/verdict.
- Treating ambiguous docs as acceptable without creating update actions.

**Docs to update after implementation**: `v1/spec/ai/project-simulation-readiness.md`; `v1/spec/operations/ai-retrieval-smoke-tests.md` when prompt quality or criteria change.

---

### 6. Cross-Domain or Unknown Task

If your task does not fit a single category above, load in this order:

1. [`v1/spec/ai/repo-map.md`](repo-map.md) — establish system boundary and identify which domains are involved
2. [`v1/spec/ai/assistant-context-index.md`](assistant-context-index.md) — navigate to domain-specific docs
3. Load each relevant domain doc before writing code

---

## Quick Danger Check

Before writing any code, confirm none of these apply (customize for your project):

| Risk                                                                       | Check                                                           |
| -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [project: fill in — e.g., importing a server-only module in a client file] | [project: fill in — where the server-only boundary is enforced] |
| [project: fill in]                                                         | [project: fill in]                                              |
| [project: fill in]                                                         | [project: fill in]                                              |

---

## Related Docs

- [`v1/spec/ai/repo-map.md`](repo-map.md)
- [`v1/spec/ai/assistant-context-index.md`](assistant-context-index.md)
- [`v1/spec/operations/docs-maintenance.md`](../operations/docs-maintenance.md)
- [Rollout Plan Template — Spec-First Contract Gates](../../flow/templates/rollout-plan-template.md)
- [`v1/spec/ai/project-simulation-readiness.md`](project-simulation-readiness.md)
