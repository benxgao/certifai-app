# Spec-First Kanban Integration Protocol

> **Source of truth**: `ai_oriented_kanban/templates/rollout-plan-template.md`, `.github/copilot-instructions.md`, `.github/pull_request_template.md`
> **Last reviewed**: 2026-05-29
> **Owner**: Engineering team

## Purpose

Define the enforceable contract for docs-first rollout planning so assistants and reviewers can trace each major decision to canonical docs/specs, remediate insufficiencies in the same rollout, and progressively reduce fallback code scans.

## Policy Contract

For any rollout/spec/governance initiative:

1. **Docs-first start is mandatory**: assistants must search canonical docs before code.
2. **`Docs Needed` declaration is mandatory**: implementation planning cannot begin without explicit required docs and reasons.
3. **Decision evidence is mandatory**: each major decision must cite docs and sufficiency status.
4. **Fallback scan is controlled**: code scanning is allowed only when docs are missing, ambiguous, contradictory, or outdated for the specific decision.
5. **Same-rollout remediation is mandatory**: fallback usage requires doc updates in the same rollout/PR, or explicit owner + due date block.
6. **Simulation readiness is mandatory for closure**: at least one docs-only simulation run must exist before rollout final evaluation.

## Spec Format Contract (Mandatory)

Every rollout/spec/governance artifact must define:

- **Scope**: what is in/out for this phase.
- **Assumptions**: environmental or dependency assumptions that must hold.
- **Constraints**: boundaries that cannot be violated.
- **Risks**: key risks and mitigation ownership.
- **Acceptance criteria**: objective pass conditions for the phase.
- **Evidence artifacts**: completed `Docs Needed` and `Decision Evidence Log` sections.

## Required Evidence Schema

### 1) Docs Needed table

| Doc | Why needed |
| --- | --- |
| `docs/<section>/<file>.md` | Decision dependency or policy contract this doc provides |

### 2) Decision Evidence Log

| Decision | Docs cited | Sufficiency verdict | Fallback code scan used? | Doc update action |
| --- | --- | --- | --- | --- |
| <major decision> | <doc paths> | <Sufficient/Insufficient> | <Yes/No> | <doc updated, or blocked owner+date> |

## Acceptance Schema (Phase Gate)

The phase is accepted only when all required artifacts below are present and complete:

| Artifact | Required fields |
| --- | --- |
| Spec contract | Scope, Assumptions, Constraints, Risks, Acceptance criteria |
| Docs Needed | Doc path, why needed |
| Decision Evidence Log | Decision, docs cited, sufficiency verdict, fallback usage, doc update action |
| Reviewer gate outcome | Explicit pass/fail with reasons for any failure |

## Reviewer Gate (Pass/Fail)

A rollout/PR **passes** only if all applicable items are true:

- `Docs Needed` exists and is complete before implementation starts.
- Every major decision has a completed Decision Evidence row.
- Any `Insufficient` verdict has explicit fallback justification.
- Any fallback scan has same-rollout doc update action or owner+due-date block.
- Graph-link discoverability remains intact (`guide.md`, `assistant-context-index.md`, and related docs references where applicable).

A rollout/PR **fails** if any applicable item above is missing.

## Minimal Example

### Docs Needed

| Doc | Why needed |
| --- | --- |
| `docs/ai/guide.md` | Route task type and docs-first flow |
| `docs/operations/docs-maintenance.md` | Verify docs registration and graph-link gate |

### Decision Evidence Log

| Decision | Docs cited | Sufficiency verdict | Fallback code scan used? | Doc update action |
| --- | --- | --- | --- | --- |
| Require `Docs Needed` in rollout template | `docs/ai/guide.md`, `ai_oriented_kanban/templates/rollout-plan-template.md` | Sufficient | No | Update template section text |
| Add graph-link review checklist to docs policy | `docs/operations/docs-maintenance.md`, `docs/ai/assistant-context-index.md` | Insufficient | Yes | Update `docs-maintenance.md` reviewer gate text |

## Related Docs

- [AI Assistant Guide](../ai/guide.md)
- [Assistant Context Index](../ai/assistant-context-index.md)
- [AI Retrieval Smoke Tests](./ai-retrieval-smoke-tests.md)
- [Docs Maintenance Protocol](./docs-maintenance.md)
- [Rollout Plan Template](../../ai_oriented_kanban/templates/rollout-plan-template.md)
