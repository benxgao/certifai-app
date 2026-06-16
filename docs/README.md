# Spec-First Docs System

## Purpose

This file is the entrypoint for the spec-first documentation system.

Use it to:

1. Quickly find the right `docs/` domain file for your task.
2. Understand the separation between canonical docs and workflow docs.
3. Understand how `docs/` and `ai_oriented_kanban/` work together during planning and delivery.

For detailed retrieval routing, use [`docs/ai/guide.md`](./ai/guide.md). For the full index, use [`docs/ai/assistant-context-index.md`](./ai/assistant-context-index.md).

---

## Docs Domain Map (Spec-First)

Start with the domain that matches the decision you need to make.

| Domain               | What it defines                                                                   | Start here                                                                                |
| -------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `docs/ai/`           | Assistant routing, repo map, simulation-readiness standards                       | [`docs/ai/guide.md`](./ai/guide.md)                                                       |
| `docs/architecture/` | App Router conventions, component placement, SEO, feature flags, error boundaries | [`docs/architecture/nextjs-conventions.md`](./architecture/nextjs-conventions.md)         |
| `docs/api/`          | API envelope contract, client fetch boundary, SWR patterns                        | [`docs/api/api-connection.md`](./api/api-connection.md)                                   |
| `docs/state/`        | Context-provider boundaries and client state responsibilities                     | [`docs/state/client-state.md`](./state/client-state.md)                                   |
| `docs/data/`         | Data model and typing conventions for API/SWR interfaces                          | [`docs/data/data-models.md`](./data/data-models.md)                                       |
| `docs/style/`        | UI conventions and styling rules used in app implementation                       | [`docs/style/conventions.md`](./style/conventions.md)                                     |
| `docs/security/`     | Auth/JWT/middleware invariants and server-only boundaries                         | [`docs/security/auth-patterns.md`](./security/auth-patterns.md)                           |
| `docs/performance/`  | Rate-limiting, optimization hooks, SWR performance patterns                       | [`docs/performance/patterns.md`](./performance/patterns.md)                               |
| `docs/testing/`      | Unit/E2E strategy, fixtures, and test responsibilities                            | [`docs/testing/strategy.md`](./testing/strategy.md)                                       |
| `docs/billing/`      | Stripe billing lifecycle and billing-state integration                            | [`docs/billing/stripe-billing.md`](./billing/stripe-billing.md)                           |
| `docs/product/`      | Product glossary and user-domain language                                         | [`docs/product/glossary.md`](./product/glossary.md)                                       |
| `docs/workflow/`     | Step-by-step operational flows that reference canonical docs                      | [`docs/workflow/README.md`](./workflow/README.md)                                         |
| `docs/adr/`          | Architectural decisions and rationale history                                     | [`docs/adr/0001-docs-architecture-mvp.md`](./adr/0001-docs-architecture-mvp.md)           |
| `docs/operations/`   | Operational review protocols (for example retrieval smoke tests)                  | [`docs/operations/ai-retrieval-smoke-tests.md`](./operations/ai-retrieval-smoke-tests.md) |

---

## Layering Rule: Canonical vs Workflow

- Canonical domain docs (`architecture`, `api`, `security`, etc.) define reusable rules and invariants.
- Workflow docs under `docs/workflow/` define process steps and handoffs.
- Workflow docs must reference canonical rules instead of redefining them.

When similar content appears in both places, keep normative rule text in the canonical domain doc and link from the workflow doc.

---

## How `docs/` and `ai_oriented_kanban/` Work Together

The project uses a docs-first loop for planning and implementation.

1. **Route the task** with [`docs/ai/guide.md`](./ai/guide.md).
2. **Load canonical docs** from the relevant domain(s) before code scanning.
3. **Plan rollout artifacts** in `ai_oriented_kanban/` using:
   - [`ai_oriented_kanban/templates/rollout-plan-template.md`](../ai_oriented_kanban/templates/rollout-plan-template.md)
   - required `Docs Needed` and decision evidence sections.
4. **Implement changes**.
5. **Sync docs in the same rollout/PR** when findings expose missing or outdated documentation.
6. **Validate retrieval quality** with [`docs/operations/ai-retrieval-smoke-tests.md`](./operations/ai-retrieval-smoke-tests.md) when routing/index or major docs topology changes.

This creates a traceable chain:

`canonical docs` → `kanban planning evidence` → `implementation` → `docs reconciliation`.

---

## Quick Start for Contributors and Assistants

1. Read [`docs/ai/assistant-context-index.md`](./ai/assistant-context-index.md).
2. Pick the domain from the table above.
3. Read only the docs needed for your task.
4. If docs are insufficient, do a bounded fallback code scan and capture what needs doc updates.
5. Update docs and kanban evidence before closing the work item.

---

## Related Docs

- [`docs/ai/guide.md`](./ai/guide.md)
- [`docs/ai/assistant-context-index.md`](./ai/assistant-context-index.md)
- [`docs/ai/repo-map.md`](./ai/repo-map.md)
- [`docs/workflow/README.md`](./workflow/README.md)
- [`docs/operations/ai-retrieval-smoke-tests.md`](./operations/ai-retrieval-smoke-tests.md)
- [`ai_oriented_kanban/templates/rollout-plan-template.md`](../ai_oriented_kanban/templates/rollout-plan-template.md)
