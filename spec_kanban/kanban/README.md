# AI-Oriented Kanban: A Reusable Delivery Method for Any AI-Assisted Software Project

AI-assisted delivery breaks down when context is scattered across chat history, half-updated tickets, and undocumented decisions. This methodology turns Kanban into a **context system**, not just a task board.

It is designed to work across different tools, stacks, and team sizes, and is based on practical execution patterns from real delivery cycles: phased rollout planning, evidence-based completion, executive closeout summaries, and explicit rollback posture.

---

## Why this methodology exists

Traditional Kanban answers:

- What is in progress?
- What is blocked?
- What is done?

AI-oriented Kanban must additionally answer:

- What is the canonical context for the current phase?
- Which decisions are final vs still open?
- What evidence proves this work is complete?
- How can a different person (or agent) resume the work in minutes?

The objective is simple: **reduce context loss, improve delivery speed, and make project memory durable**.

---

## Core principles

### 1) Split initiatives into micro-phases

Treat every initiative as a sequence of short, independently verifiable phases. Each phase should include:

- goal,
- in-scope / out-of-scope,
- risks,
- acceptance checks,
- rollback note.

This makes work reliable for AI execution and quick for human review.

### 2) Separate strategy from execution

Do not mix “why” and “how” in one long file. Keep distinct artifacts:

- initiative brief (intent and outcomes),
- phase plan (execution scope),
- progress tracker (current state),
- decision log (resolved tradeoffs),
- lessons learned (reusable guidance).

### 3) Define done as evidence

“Done” means:

- implementation completed,
- checks passed,
- status updated,
- decisions documented,
- rollback posture stated.

If evidence is missing, the item is still in progress.

### 4) Archive for retrieval

Archives are operational assets. A future contributor should quickly answer:

- What changed?
- Why did we choose this approach?
- What should not be reverted accidentally?

### 5) Keep methodology tool-agnostic

The process should survive model and platform changes. Treat AI assistants as interchangeable executors over a stable workflow contract.

---

## Recommended Kanban structure

```text
kanban/
  00-intake/
    ideas/
    triage-log.md

  10-planned/
    <initiative-id>-<initiative-slug>/
      initiative-brief.md
      scope-map.md
      risk-register.md
      decision-log.md
      phase-index.md

  20-active/
    <initiative-id>-<initiative-slug>/
      progress-tracker.md
      handoff.md
      phases/
        phase-01.md
        phase-02.md
      evidence/
        validations.md
        release-notes-draft.md

  30-review/
    <initiative-id>-<initiative-slug>/
      qa-summary.md
      architecture-signoff.md
      unresolved-items.md

  40-archive/
    <initiative-id>-<initiative-slug>/
      final-summary.md
      lessons-learned.md
      migration-guide.md
      timeline.md

  50-report/
    <year>/
      <month>/
        <initiative-slug>-executive-report.md
```

---

## Operating workflow (repeatable loop)

### Step 1: Intake and triage

- Capture initiative intent and constraints.
- Assign risk level and expected blast radius.
- Define phase boundaries before implementation.

### Step 2: Plan with explicit phase contracts

For each phase, document:

- objective,
- **Docs Needed list** (canonical docs to consult before implementation),
- files/systems expected to change,
- verification method (including docs-only simulation readiness),
- rollback method,
- open questions requiring decisions.

### Step 3: Execute in short cycles

- Make small, testable changes.
- Update tracker and handoff at each meaningful checkpoint.
- **Record Decision Evidence Log**: document every major decision with `Docs cited`, `Sufficiency verdict`, and `Fallback scan used`.
- Update docs immediately if they are found insufficient or outdated.

### Step 4: Validate and review

- Run acceptance checks for the phase.
- Separate “implemented” from “accepted.”
- **Docs-only Simulation Drill**: prove the task can be completed using docs alone.
- Carry unresolved items forward explicitly.

### Step 5: Archive with executive closeout

Finalize a concise summary including:

- executive summary,
- business outcome,
- what changed,
- current status,
- key risks and mitigations,
- decision points,
- rollback posture.

### Step 6: Publish report and extract insights

- Extract the `final-summary.md` and `lessons-learned.md` into a formal executive report.
- Store the report in the `50-report` lane for long-term stakeholder visibility and project cross-referencing.
- Update global lessons-learned index if applicable.

---

## Lane Transition Criteria

Lane moves must satisfy objective checks. When a lane item depends on docs-first execution, the following gates apply before each transition.

### Intake → Planned

- [ ] Initiative brief includes at least one rollout phase with an explicit verification gate.
- [ ] Risk level is assigned.
- [ ] No phase is planned that mixes multiple dependency layers without an explicit exception note.

### Planned → Active

- [ ] Phase 1 (or minimum viable hotfix path) is scoped with verification gate language.
- [ ] **Docs Needed list** is declared and approved (specs identified before code).
- [ ] `## Docs Impact` section is complete: docs checked, docs to create/update/delete identified.
- [ ] Docs-first retrieval checklist is present in the rollout plan (see template).

### Active → Review

Before moving an item from **20-active** to **30-review**, confirm all four gates:

**Decision evidence log**

- [ ] Every major architectural or convention decision has a `Decision Evidence Log` row.
- [ ] Log includes: `Docs cited`, `Sufficiency verdict`, and whether a `Fallback code scan` was used.

**Docs search evidence**

- [ ] Relevant spec docs were loaded before any code was read or written.
- [ ] Record confirms that implementation matches the documented source of truth.

**Docs update evidence**

- [ ] Any doc found insufficient, missing, or outdated during execution was updated in the same PR, or a follow-up kanban item was created and linked (Graph-Link reconciliation).

**Docs link integrity**

- [ ] Each new or modified doc has a valid `## Related Docs` section with working relative links.
- [ ] New or renamed docs are registered in `docs/ai/assistant-context-index.md`.

If any gate cannot be confirmed, the item stays in **20-active** until the gap is resolved or explicitly deferred with a tracked follow-up item.

### Review → Archive

Before moving an item from **30-review** to **40-archive**, confirm:

- [ ] All review comments are resolved or explicitly deferred with a tracked follow-up item.
- [ ] **Docs-only Simulation Drill** passed: evidence shows the task is reproducible from docs alone.
- [ ] Final docs state is verified: no stale `Last reviewed` dates and no broken links in touched docs.
- [ ] Executive closeout or final summary artifact is complete.
- [ ] Rollout eval gate passed: Phase N+2 (Eval & Health Score) is marked `[x]` with score `>= 70`.

### Archive → Report

Before moving/replicating key artifacts from **40-archive** to **50-report**, confirm:

- [ ] Executive summary is polished for non-technical leadership review.
- [ ] Financial or business impact metrics are verified.
- [ ] The report is correctly filed in the year/month schema.

---

## What this looked like in recent delivery work

Recent completed initiatives followed repeatable patterns:

- **Spec-First Integration (certifai-app)** introduced hard-gated decision evidence logs and docs-only simulation drills to unify app-level exploration.
- **AI-Ready Docs MVP (certifai-api)** created the canonical assistant context index and repository map used for all subsequent tasks.
- **Status semantics rollout** used phased delivery, explicit risks, and decision points before broad release.
- **Security hardening** emphasized environment-driven policy, observability, staged rollout, and rollback readiness.
- **Type-enforcement closeout** emphasized completion evidence, phase traceability, and clean executive reporting.

Across all these, the strongest common trait was: **documentation stayed aligned with implementation state**.

---

## What to do better next time

### 1) Add structured metadata to all phase files

Include frontmatter fields such as:

- `owner`
- `status`
- `updated_at`
- `depends_on`
- `risk_level`

This enables automated dashboards and clearer ownership.

### 2) Automate Graph-Link Validation

Build tools or scripts that automatically check if every new doc added to a rollout is registered in `docs/ai/assistant-context-index.md` and has the required `Source of truth` headers.

### 3) decision-log-linting

Run periodic audits to detect decision logs that use "fallback code scan" without a corresponding doc-update action.

### 4) Cross-Repo Context Sync

Improve how `certifai-api` and `certifai-app` share common architectural decisions to prevent diverging patterns in the service layer.

### 5) Define explicit exit criteria for "Ready for Simulation"

Standardize what it means for a set of docs to be "ready" for an assistant to execute without any code-reading fallback.

### 6) Standardize on the Rollout Plan Template

Ensure every initiative, no matter how small, starts with the `rollout-plan-template.md` to guarantee the decision evidence log is present from day zero.

---

## Quick-start checklist for new projects

1. Create the Kanban folder structure.
2. Start one initiative brief with phase index.
3. Define phase acceptance and rollback criteria before coding.
4. Keep one active handoff document updated daily.
5. Require evidence before marking done.
6. Archive with executive summary and lessons learned.

If followed consistently, this methodology converts AI-assisted execution from ad hoc chat history into a reliable, auditable delivery system.


## Mobile workflow quickstart

(Draft) update relevant instructions for AI assistants to ensure the kanban workflow be like this: When prompts like `generate a plan for xxx`, it would create a plan file in `10-plan` based on the rollout plan template, meanwhile remove the proposaled file from `00-intake`; when prompts like `start the planned task xxx` it would start to implement the first 2 phases of the planned task; when prompts like `complete the task xxx` it would mark the task as done and archive the relevant documents and generate an executive report.
