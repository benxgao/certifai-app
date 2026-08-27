# Docs Maintenance Protocol

> **Source of truth**: `v1/spec/` governance conventions
> **Last reviewed**: 2026-08-27
> **Owner**: package maintainer

## Purpose

Define how docs under `v1/spec/` are owned, kept fresh, and registered so the docs graph stays reliable for assistants and contributors.

## Key Concepts

- **Canonical docs**: reusable rules and invariants (`architecture/`, `api/`, `security/`, etc.).
- **Workflow docs**: step-by-step process and handoff documents (`workflow/*-workflow.md`) that reference canonical rules instead of redefining them.
- **Graph-link registration**: every doc must be reachable through the assistant index and linked from the nearest related doc.

## Ownership and Freshness SLA

- Every doc carries a metadata block:
  ```markdown
  > **Source of truth**: <real source path or system>
  > **Last reviewed**: YYYY-MM-DD
  > **Owner**: <team or named owner>
  ```
- `Last reviewed` must be updated whenever the doc's content changes.
- If a doc has no owner, assign one before editing; unowned docs are stale by default.
- Review cadence: `[project: fill in — e.g., quarterly review of all canonical docs]`.

## Update Trigger Table

Update the relevant docs when the following change:

| Change | Docs to update |
| --- | --- |
| New file, renamed API, changed invariant | The affected canonical doc(s) + `v1/spec/ai/assistant-context-index.md` |
| New workflow or handoff sequence | New `v1/spec/workflow/*-workflow.md` + index registration + related canonical doc link |
| New governance protocol or reviewer gate | `v1/spec/operations/` doc + index registration + rollout template references |
| New architectural decision | `v1/spec/adr/YYYY-MM.md` entry + index |
| Routing or index topology change | `v1/spec/ai/guide.md` + `v1/spec/ai/assistant-context-index.md`; run retrieval smoke tests |

## New-Doc Registration Checklist

For every new doc under `v1/spec/`:

- [ ] Copied from the domain `_template.md` (metadata + standard headings).
- [ ] `Source of truth`, `Last reviewed`, `Owner` filled.
- [ ] Registered in `v1/spec/ai/assistant-context-index.md` (Quick Reference row).
- [ ] Linked from the nearest related doc's `## Related Docs` section.
- [ ] Referenced from `v1/spec/ai/guide.md` task-type index when it affects retrieval routing.

## Graph-Link Rules

- Every doc must have a `## Related Docs` section with working relative links.
- Workflow docs must link to canonical parents and must not restate invariants.
- Renames/deletes: update all inbound links and the index in the same change; `grep` for the old filename to confirm no dangling links remain.

## Layering Contract: Canonical vs Workflow

- Canonical domain docs define rules. Workflow docs define process.
- When similar content appears in both, keep the normative text in the canonical doc and link from the workflow doc.
- No exceptions.

## Checklist

- [ ] New docs registered in the index.
- [ ] `Last reviewed` dates current for all touched docs.
- [ ] No `TODO`/`FIXME`/`TBD` placeholders left in non-template docs.
- [ ] `grep` confirms no dangling links after any rename/delete.

## Dangerous Areas / Anti-patterns

- Updating doc content without updating `Last reviewed` — the freshness SLA is broken.
- Registering a doc in the index but never linking it from any related doc (orphan node).
- Restating canonical invariants inside workflow docs (drift risk).

## Related Docs

- [AI Assistant Guide](../ai/guide.md)
- [AI Assistant Context Index](../ai/assistant-context-index.md)
- [Spec-First Kanban Integration Protocol](./spec-first-kanban-integration.md)
- [AI Retrieval Smoke Tests](./ai-retrieval-smoke-tests.md)
- [Workflow Docs Convention](../workflow/README.md)
