# Workflow Docs — Location and Naming Convention

> **Source of truth**: `v1/spec/operations/docs-maintenance.md` (Layering Contract section)
> **Last reviewed**: 2026-08-27
> **Owner**: package maintainer

## Purpose

Define where business-process and operational-sequence documentation lives, and how new workflow docs are named and structured.

---

## What Goes Here

A **workflow doc** belongs under `v1/spec/workflow/` when it describes:

- Step-by-step execution procedures a developer or operator follows to perform a task.
- Handoffs between systems or teams (for example: signup → verification → downstream pipeline).
- Operational sequences with decision branches (for example: retry logic, rollback steps).

It does **not** belong here if it defines reusable rules, invariants, or type contracts — those belong in the relevant canonical parent doc (`v1/spec/architecture/`, `v1/spec/security/`, `v1/spec/api/`, etc.).

---

## Naming Convention

All workflow docs must use the `*-workflow.md` suffix pattern:

```
v1/spec/workflow/<domain>-<action>-workflow.md
```

Examples (`[project: fill in]` — replace with your project's flows):

| Use case | File name |
| --- | --- |
| `[project: fill in — e.g., user signup and verification flow]` | `<domain>-signup-verification-workflow.md` |
| `[project: fill in — e.g., submission and scoring flow]` | `<domain>-submission-workflow.md` |
| `[project: fill in — e.g., issuance process]` | `<domain>-issuance-workflow.md` |
| `[project: fill in — e.g., third-party pipeline]` | `<domain>-subscription-workflow.md` |

---

## When to Create a New Workflow Doc

Create a new file in `v1/spec/workflow/` when:

1. A business process spans more than one system or team.
2. The operational sequence is too detailed to live inline in a canonical parent doc.
3. The process has distinct states, decision branches, or handoffs that benefit from a step-by-step layout.

---

## Required Metadata

Every workflow doc must include these fields in the header block:

```markdown
> **Source of truth**: <canonical parent doc it references, or system source>
> **Last reviewed**: YYYY-MM-DD
> **Owner**: <team or named owner>
```

---

## Linking Rules

- The canonical parent doc **should link** to the workflow doc from its `## Related Docs` section.
- Workflow docs **must not restate** invariants or rules already defined in the canonical parent doc. Reference them by link instead.
- Register every new workflow doc in [`v1/spec/ai/assistant-context-index.md`](../ai/assistant-context-index.md).

---

## Placement Rule

All business workflow docs must live in `v1/spec/workflow/` using the `*-workflow.md` naming convention. No exceptions.

---

## Related Docs

- [Docs Maintenance Protocol](../operations/docs-maintenance.md)
- [AI Assistant Context Index](../ai/assistant-context-index.md)
- [Layering Contract](../operations/docs-maintenance.md#layering-contract-canonical-vs-workflow)
