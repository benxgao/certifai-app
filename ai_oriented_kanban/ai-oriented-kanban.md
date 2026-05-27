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
- files/systems expected to change,
- verification method,
- rollback method,
- open questions requiring decisions.

### Step 3: Execute in short cycles

- Make small, testable changes.
- Update tracker and handoff at each meaningful checkpoint.
- Record key decision rationale while it is fresh.

### Step 4: Validate and review

- Run acceptance checks for the phase.
- Separate “implemented” from “accepted.”
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

---

## Lane Transition Criteria

Lane moves must satisfy objective checks. When a lane item depends on docs-first execution, the following gates apply before each transition.

### Intake → Planned

- [ ] Initiative brief includes at least one rollout phase with an explicit verification gate.
- [ ] Risk level is assigned.
- [ ] No phase is planned that mixes multiple dependency layers without an explicit exception note.

### Planned → Active

- [ ] Phase 1 (or minimum viable hotfix path) is scoped with verification gate language.
- [ ] `## Docs Impact` section is complete: docs checked, docs to create/update/delete identified.
- [ ] Docs-first retrieval checklist is present in the rollout plan (see template).

### Active → Review

Before moving an item from **20-active** to **30-review**, confirm all three gates:

**Docs search evidence**

- [ ] Relevant spec docs were loaded before any code was read or written.
- [ ] Record which docs were checked and what each confirmed (or left insufficient).

**Docs update evidence**

- [ ] Any doc found insufficient, missing, or outdated during execution was updated in the same PR, or a follow-up kanban item was created and linked.

**Docs link integrity**

- [ ] Each new or modified doc has a valid `## Related Docs` section with working relative links.
- [ ] New or renamed docs are registered in `docs/ai/assistant-context-index.md`.

If any gate cannot be confirmed, the item stays in **20-active** until the gap is resolved or explicitly deferred with a tracked follow-up item.

### Review → Archive

Before moving an item from **30-review** to **40-archive**, confirm:

- [ ] All review comments are resolved or explicitly deferred with a tracked follow-up item.
- [ ] Final docs state is verified: no stale `Last reviewed` dates and no broken links in touched docs.
- [ ] Executive closeout or final summary artifact is complete.

---

## Artifact templates (minimum useful set)

### `phase-XX.md`

- Goal (one sentence)
- Scope and non-scope
- Dependencies
- Risks
- Step checklist
- Acceptance checklist
- Rollback note
- Notes for next phase

### `handoff.md`

- Current state (max 5 bullets)
- Open decisions
- Immediate next step
- Do-not-change notes
- Evidence links

### `final-summary.md`

- Executive summary
- Business impact
- Delivery status
- Key risks/mitigations
- Remaining work (if any)
- Approval and release posture

---

## What this looked like in recent delivery work

Recent completed initiatives followed repeatable patterns:

- **Status semantics rollout** used phased delivery, explicit risks, and decision points before broad release.
- **Security hardening** emphasized environment-driven policy, observability, staged rollout, and rollback readiness.
- **Type-enforcement closeout** emphasized completion evidence, phase traceability, and clean executive reporting.

Across all three, the strongest common trait was: **documentation stayed aligned with implementation state**.

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

### 2) Formalize evidence links per phase

Require each phase to link explicit artifacts (tests, logs, screenshots, validation notes) instead of generic “verified” statements.

### 3) Standardize decision logging

Use a lightweight decision template (`decision`, `alternatives`, `rationale`, `revisit-condition`) to reduce rediscovery work.

### 4) Add context linting

Run periodic audits to detect:

- stale handoff notes,
- orphaned phase files,
- unresolved items with no owner,
- archived docs that no longer match current behavior.

### 5) Define entry/exit criteria for each Kanban lane

Prevent ambiguous movement by requiring objective checks before transition from planning → active → review → archive. See **Lane Transition Criteria** above for the concrete docs search/update/link gate requirements.

### 6) Separate “implemented” from “released” in trackers

Many teams close work too early. Track both states explicitly to avoid false completion.

### 7) Build a reusable closeout standard

Use one consistent executive-report format across all completed initiatives so stakeholders can compare outcomes quickly.

---

## Quick-start checklist for new projects

1. Create the Kanban folder structure.
2. Start one initiative brief with phase index.
3. Define phase acceptance and rollback criteria before coding.
4. Keep one active handoff document updated daily.
5. Require evidence before marking done.
6. Archive with executive summary and lessons learned.

If followed consistently, this methodology converts AI-assisted execution from ad hoc chat history into a reliable, auditable delivery system.
