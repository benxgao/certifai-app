# Workflow Docs — Location and Naming Convention

> **Source of truth**: `docs/operations/docs-maintenance.md` (Layering Contract section)
> **Last reviewed**: 2026-05-26
> **Owner**: Engineering team

## Purpose

Define where business-process and operational-sequence documentation lives, and how new workflow docs are named and structured.

---

## What Goes Here

A **workflow doc** belongs under `docs/workflow/` when it describes:

- Step-by-step execution procedures a developer or operator follows to perform a task.
- Handoffs between systems or teams (for example: signup → verification → marketing pipeline).
- Operational sequences with decision branches (for example: retry logic, rollback steps).

It does **not** belong here if it defines reusable rules, invariants, or type contracts — those belong in the relevant canonical parent doc (`docs/architecture/`, `docs/security/`, `docs/api/`, etc.).

---

## Naming Convention

All workflow docs must use the `*-workflow.md` suffix pattern:

```
docs/workflow/<domain>-<action>-workflow.md
```

Examples:

| Use case | File name |
| --- | --- |
| User signup and verification flow | `signup-verification-workflow.md` |
| Exam submission and scoring flow | `exam-submission-workflow.md` |
| Certificate issuance process | `cert-issuance-workflow.md` |
| Marketing subscription pipeline | `marketing-subscription-workflow.md` |

---

## When to Create a New Workflow Doc

Create a new file in `docs/workflow/` when:

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
- Register every new workflow doc in [`docs/ai/assistant-context-index.md`](../ai/assistant-context-index.md).

---

## Compatibility with Existing Workflow Docs

Some workflow docs were written before this convention existed and may live in domain folders (for example, `docs/security/signin-workflow.md`). Those docs are valid and do not need to move unless a major revision is planned. New workflow docs should use `docs/workflow/` from this point forward.

---

## Related Docs

- [Docs Maintenance Protocol](../operations/docs-maintenance.md)
- [AI Assistant Context Index](../ai/assistant-context-index.md)
- [Layering Contract](../operations/docs-maintenance.md#layering-contract-canonical-vs-workflow)
