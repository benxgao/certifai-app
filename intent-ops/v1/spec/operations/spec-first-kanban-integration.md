# Spec-First Kanban Integration Protocol

> **Source of truth**: this protocol + `v1/flow/README.md` lane transition criteria
> **Last reviewed**: 2026-08-27
> **Owner**: package maintainer

## Purpose

This is the enforceable contract that wires the **spec-first docs system** (`v1/spec/`) to the **AI-oriented kanban** (`v1/flow/`). It makes planning and execution explicitly docs-led and auditable: assistants and reviewers can see which docs were required, whether docs were sufficient for each major decision, when fallback code scanning was necessary, and exactly how doc gaps were remediated in the same rollout.

## Non-Negotiable Workflow Contract

- **No implementation starts until `Docs Needed` is declared and approved** in the rollout plan (`v1/flow/templates/rollout-plan-template.md`).
- **No major decision is valid without a decision-evidence record** in the plan's `Planning Decision Evidence Log`.
- **Any fallback code scan requires a same-rollout doc reconciliation action** (or an explicit owner + due date block).
- **Rollout closure requires at least one docs-only simulation run with evidence** (see `v1/spec/ai/project-simulation-readiness.md`).

## Spec Format Contract

Every rollout plan must contain these sections in order (from `v1/flow/templates/rollout-plan-template.md`):

1. `## Summary` — problem, intent, why this rollout exists.
2. `## Docs Impact` — completed at planning time, before code:
   - `### Docs checked during planning`
   - `### Docs-First Retrieval Checklist`
   - `### Docs Needed` (mandatory gate — populated before implementation)
   - `### Planning Decision Evidence Log` (mandatory gate)
   - `### ADR Conflict Check` (mandatory gate)
   - `### Docs to create / update / delete`
3. Phases with **verification gates** (machine-verifiable: tests, grep, tsc).
4. Mandatory closing phases in order:
   - Phase N — User-journey sync
   - Phase N+1 — Docs Sync
   - Phase N+2 — AI-ready docs reflection and next-plan handoff
   - Phase N+3 — Docs-only Simulation Drill
   - Phase N+4 — Rollout Eval & Health Score

## Decision Evidence Schema (5 Columns)

Every major decision row in the `Planning Decision Evidence Log` must include:

| Column                     | Requirement                                                      |
| -------------------------- | ---------------------------------------------------------------- |
| `Decision`                 | The decision statement — one row per major decision              |
| `Docs cited`               | Canonical doc path(s) that support the decision                  |
| `Sufficiency verdict`      | `Sufficient` or `Insufficient` (explicit, no blank)              |
| `Fallback code scan used?` | `Yes` (with reason) or `No`                                      |
| `Doc update action`        | Exact doc path + section to update, or `blocked with owner+date` |

## Fallback Code Scan Rules

- Code scanning is a **bounded fallback**, only when docs are missing, ambiguous, contradictory, or known outdated for the specific decision.
- Every fallback must be recorded: which docs were insufficient, why a scan was necessary, and the remediation action.
- Remediation happens in the **same rollout** (Docs Sync phase) or is explicitly blocked with an owner and due date.
- A rollout that uses fallback scans without remediation does not pass the Review lane gate.

## Reviewer Gates

Before a lane transition, the reviewer (human or AI) must confirm:

### Planned → Active

- [ ] `Docs Needed` is declared and approved (specs identified before code).
- [ ] `## Docs Impact` section is complete: docs checked, docs to create/update/delete identified.
- [ ] `Planning Decision Evidence Log` has one row per major decision.
- [ ] `ADR Conflict Check` populated; no unresolved ADR-conflict open question.

### Active → Review

- [ ] Every major architectural or convention decision has a Decision Evidence Log row with all 5 columns.
- [ ] Relevant spec docs were loaded before code was read or written (docs-search evidence).
- [ ] Any doc found insufficient during execution was updated in the same rollout, or a follow-up item exists with owner + due date (graph-link reconciliation).
- [ ] Every new or modified doc has a valid `## Related Docs` section with working relative links.
- [ ] New or renamed docs are registered in `v1/spec/ai/assistant-context-index.md`.

### Review → Archive

- [ ] All review comments resolved or explicitly deferred with a tracked follow-up.
- [ ] **Docs-only Simulation Drill** passed: evidence shows the task is reproducible from docs alone.
- [ ] Final docs state verified: no stale `Last reviewed` dates, no broken links.
- [ ] Executive closeout or final summary artifact complete.
- [ ] Rollout Eval & Health Score `>= 85/120` (or documented deviation).

## Simulation Drill

- Executed in the `Docs-only Simulation Drill` closing phase.
- Rubric and run-log format: `v1/spec/ai/project-simulation-readiness.md`.
- Pass target: score `>= 80`, fallback ratio `<= 0.20`, all fallback actions remediated.

## Checklist (Quick Reference)

- [ ] `Docs Needed` declared before implementation.
- [ ] Decision evidence log complete for all major decisions.
- [ ] Fallback scans justified + remediated in the same rollout.
- [ ] Simulation drill evidence recorded.
- [ ] Context index + related docs links updated.

## Dangerous Areas / Anti-patterns

- Starting implementation before `Docs Needed` is declared — the most common contract violation.
- Reviewing from memory instead of the decision-evidence log.
- Using fallback code scan without recording the insufficient docs or the remediation.
- Marking `Sufficiency verdict` as `Sufficient` when the cited docs are actually placeholders or outdated.

## Related Docs

- [v1/flow README (lane transition criteria)](../../flow/README.md)
- [Rollout Plan Template](../../flow/templates/rollout-plan-template.md)
- [Docs Maintenance Protocol](./docs-maintenance.md)
- [AI Assistant Guide](../ai/guide.md)
- [Project Simulation Readiness](../ai/project-simulation-readiness.md)
- [AI Retrieval Smoke Tests](./ai-retrieval-smoke-tests.md)
