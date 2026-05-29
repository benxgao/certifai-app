# Project Simulation Readiness

> **Source of truth**: rollout evidence artifacts and docs-only simulation runs for `certifai-app`
> **Last reviewed**: 2026-05-29
> **Owner**: Engineering team

## Purpose

Provide a measurable rubric to determine whether a comparable project task can be executed from docs/specs first, with minimal and justified fallback code scanning.

## Readiness Definition

A project area is simulation-ready when an assistant can complete a comparable planning task using canonical docs/specs, produce a valid `Docs Needed` list and Decision Evidence Log, and pass reviewer gates without ad-hoc code discovery.

## Scoring Rubric

| Dimension | Max Points | Scoring guidance |
| --- | --- | --- |
| Docs-needed quality | 25 | Required docs listed with clear decision rationale |
| Decision traceability | 35 | Major decisions cite docs + sufficiency + fallback status + remediation action |
| Fallback discipline | 20 | Fallback scans are justified and bounded; remediation captured |
| Graph-link discoverability | 20 | Responses use docs reachable via guide + assistant index + related docs |
| **Total** | **100** | Pass threshold: $\ge 80$ |

## Fallback Ratio Rule

For simulation runs, target fallback ratio is:

$$
\text{fallback ratio} = \frac{\text{major decisions that required fallback code scan}}{\text{total major decisions}}
$$

Pass target: fallback ratio $\le 0.20$.

If fallback ratio exceeds $0.20$, run is `Needs Improvement` unless every fallback includes a same-rollout doc remediation action.

## Run Log Template

Use this for each simulation drill run.

| Date | Scenario | Docs Needed complete? | Decision Evidence complete? | Fallback ratio | Score | Verdict | Follow-up actions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD | <scenario summary> | Yes/No | Yes/No | <0.00-1.00> | <0-100> | Pass / Needs Improvement / Fail | <doc updates or owner+due date> |

## Decision Evidence Requirement

A simulation run is incomplete unless every major decision includes:

- `Decision`
- `Docs cited`
- `Sufficiency verdict`
- `Fallback code scan used?`
- `Doc update action`

## Verdict Rules

- **Pass**: score $\ge 80$, fallback ratio $\le 0.20$, and all fallback actions remediated.
- **Needs Improvement**: score $60$–$79$ or fallback ratio above target with partial remediation.
- **Fail**: score $< 60$ or missing required evidence sections.

## Related Docs

- [AI Assistant Guide](./guide.md)
- [Assistant Context Index](./assistant-context-index.md)
- [Spec-First Kanban Integration Protocol](../operations/spec-first-kanban-integration.md)
- [AI Retrieval Smoke Tests](../operations/ai-retrieval-smoke-tests.md)
