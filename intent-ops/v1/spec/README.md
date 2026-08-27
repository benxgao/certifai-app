# Spec-First Docs System

> **Source of truth**: this `v1/spec/` tree — the canonical-docs layer of the `intent-ops` package
> **Last reviewed**: 2026-08-27
> **Owner**: package maintainer

## Purpose

This folder is the entrypoint for the spec-first documentation system. Use it to:

1. Quickly find the right domain file for your task.
2. Understand the separation between canonical docs and workflow docs.
3. Understand how `v1/spec/` (specs) and `v1/flow/` (kanban) work together during planning and delivery.

For detailed retrieval routing, use [`ai/guide.md`](./ai/guide.md). For the full index, use [`ai/assistant-context-index.md`](./ai/assistant-context-index.md).

---

## Docs Domain Map (Spec-First)

Start with the domain that matches the decision you need to make.

| Domain                  | What it defines                                                      | Start here                                                                           |
| ----------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `v1/spec/ai/`           | Assistant routing, repo map, simulation-readiness standards          | [`v1/spec/ai/guide.md`](./ai/guide.md)                                               |
| `v1/spec/architecture/` | Framework/routing conventions, component placement, error boundaries | [`architecture/_template.md`](./architecture/_template.md)                           |
| `v1/spec/api/`          | API envelope contract, client fetch boundary, data-fetching patterns | [`api/_template.md`](./api/_template.md)                                             |
| `v1/spec/state/`        | Client state responsibilities and provider boundaries                | [`state/_template.md`](./state/_template.md)                                         |
| `v1/spec/data/`         | Data model and typing conventions                                    | [`data/_template.md`](./data/_template.md)                                           |
| `v1/spec/style/`        | UI conventions and styling rules                                     | [`style/_template.md`](./style/_template.md)                                         |
| `v1/spec/security/`     | Auth/JWT/middleware invariants and server-only boundaries            | [`security/_template.md`](./security/_template.md)                                   |
| `v1/spec/performance/`  | Optimization hooks and performance patterns                          | [`performance/_template.md`](./performance/_template.md)                             |
| `v1/spec/testing/`      | Unit/E2E strategy, fixtures, and test responsibilities               | [`testing/_template.md`](./testing/_template.md)                                     |
| `v1/spec/product/`      | Product glossary and user-domain language                            | [`product/_template.md`](./product/_template.md)                                     |
| `v1/spec/workflow/`     | Step-by-step operational flows that reference canonical docs         | [`workflow/README.md`](./workflow/README.md)                                         |
| `v1/spec/adr/`          | Architectural decisions and rationale history                        | [`adr/README.md`](./adr/README.md)                                                   |
| `v1/spec/operations/`   | Operational review protocols (retrieval smoke tests, governance)     | [`operations/ai-retrieval-smoke-tests.md`](./operations/ai-retrieval-smoke-tests.md) |

---

## Layering Rule: Canonical vs Workflow

- Canonical domain docs (`architecture`, `api`, `security`, etc.) define reusable rules and invariants.
- Workflow docs under `workflow/` define process steps and handoffs.
- Workflow docs must reference canonical rules instead of redefining them.

When similar content appears in both places, keep normative rule text in the canonical domain doc and link from the workflow doc.

---

## How `v1/spec/` and `v1/flow/` Work Together

The package uses a docs-first loop for planning and implementation.

1. **Route the task** with [`ai/guide.md`](./ai/guide.md).
2. **Load canonical docs** from the relevant domain(s) before code scanning.
3. **Plan rollout artifacts** in `v1/flow/` using:
   - [`v1/flow/templates/rollout-plan-template.md`](../flow/templates/rollout-plan-template.md)
   - required `Docs Needed` and decision evidence sections.
4. **Implement changes**.
5. **Sync docs in the same rollout/PR** when findings expose missing or outdated documentation.
6. **Validate retrieval quality** with [`operations/ai-retrieval-smoke-tests.md`](./operations/ai-retrieval-smoke-tests.md) when routing/index or major docs topology changes.

This creates a traceable chain:

`canonical docs` → `kanban planning evidence` → `implementation` → `docs reconciliation`.

---

## Quick Start for Contributors and Assistants

1. Read [`ai/assistant-context-index.md`](./ai/assistant-context-index.md).
2. Pick the domain from the table above.
3. Read only the docs needed for your task.
4. If docs are insufficient, do a bounded fallback code scan and capture what needs doc updates.
5. Update docs and kanban evidence before closing the work item.

---

## Related Docs

- [`ai/guide.md`](./ai/guide.md)
- [`ai/assistant-context-index.md`](./ai/assistant-context-index.md)
- [`ai/repo-map.md`](./ai/repo-map.md)
- [`workflow/README.md`](./workflow/README.md)
- [`operations/ai-retrieval-smoke-tests.md`](./operations/ai-retrieval-smoke-tests.md)
- [`v1/flow/templates/rollout-plan-template.md`](../flow/templates/rollout-plan-template.md)
