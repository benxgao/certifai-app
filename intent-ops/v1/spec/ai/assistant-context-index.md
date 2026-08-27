# Assistant Context Index

> **Source of truth**: All `v1/spec/` sections
> **Last reviewed**: 2026-08-27
> **Owner**: package maintainer

## Purpose

Fast retrieval index for AI assistants and new contributors. Each entry points to the canonical document for a given concern. Start here — do not duplicate content from linked docs.

## Quick Reference

| I want to understand...                                                              | Go to                                                                                                                                                           |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How to navigate docs for a specific task type, and the docs-first retrieval protocol | [`v1/spec/ai/guide.md`](guide.md)                                                                                                                               |
| Overall system map, routes, invariants, dangerous areas                              | [`v1/spec/ai/repo-map.md`](repo-map.md)                                                                                                                         |
| Framework/routing conventions, component placement                                   | [`v1/spec/architecture/_template.md`](../architecture/_template.md)                                                                                             |
| API envelope contract and data-fetching patterns                                     | [`v1/spec/api/_template.md`](../api/_template.md)                                                                                                               |
| Client state responsibilities and provider boundaries                                | [`v1/spec/state/_template.md`](../state/_template.md)                                                                                                           |
| Data model and typing conventions                                                    | [`v1/spec/data/_template.md`](../data/_template.md)                                                                                                             |
| UI conventions and styling rules                                                     | [`v1/spec/style/_template.md`](../style/_template.md)                                                                                                           |
| Auth/JWT/middleware invariants and server-only boundaries                            | [`v1/spec/security/_template.md`](../security/_template.md)                                                                                                     |
| Optimization hooks and performance patterns                                          | [`v1/spec/performance/_template.md`](../performance/_template.md)                                                                                               |
| Unit/E2E strategy, fixtures, and test responsibilities                               | [`v1/spec/testing/_template.md`](../testing/_template.md)                                                                                                       |
| Product glossary and user-domain language                                            | [`v1/spec/product/_template.md`](../product/_template.md)                                                                                                       |
| User journey stories and route flows                                                 | [`v1/spec/product/user-journey.md`](../product/user-journey.md)                                                                                                 |
| Step-by-step operational workflows                                                   | [`v1/spec/workflow/README.md`](../workflow/README.md)                                                                                                           |
| Why this docs structure was adopted (decision history)                               | [`v1/spec/adr/README.md`](../adr/README.md)                                                                                                                     |
| ADRs recorded in a given month (`YYYY-MM.md` pattern)                                | [`v1/spec/adr/2026-08.md`](../adr/2026-08.md)                                                                                                                   |
| Template to copy for a new canonical/ops/ADR doc                                     | [`v1/spec/ai/_template.md`](_template.md) · [`v1/spec/operations/_template.md`](../operations/_template.md) · [`v1/spec/adr/_template.md`](../adr/_template.md) |
| Docs ownership, update cadence, freshness SLA                                        | [`v1/spec/operations/docs-maintenance.md`](../operations/docs-maintenance.md)                                                                                   |
| Spec-first rollout governance contract and reviewer gates                            | [`v1/spec/operations/spec-first-kanban-integration.md`](../operations/spec-first-kanban-integration.md)                                                         |
| AI retrieval smoke-test QA protocol                                                  | [`v1/spec/operations/ai-retrieval-smoke-tests.md`](../operations/ai-retrieval-smoke-tests.md)                                                                   |
| Docs-only simulation-readiness rubric and run-log template                           | [`v1/spec/ai/project-simulation-readiness.md`](project-simulation-readiness.md)                                                                                 |
| Workflow docs naming/location convention                                             | [`v1/spec/workflow/README.md`](../workflow/README.md)                                                                                                           |
| How to build rollout plans from specs/docs first with mandatory closing phases       | [`v1/flow/templates/rollout-plan-template.md`](../../flow/templates/rollout-plan-template.md)                                                                   |

## Key Source Paths

```
[project: fill in — replace with your project's real directory map]

src/
├── <data-fetching layer>      ← all server-state hooks
├── <domain integration>       ← external service client/server integration
├── types/                     ← typed response interfaces
├── <state layer>              ← context providers
├── <lib>                      ← shared utilities, fetch config, validation
└── components/                ← UI components (primitives, custom, domain-specific)
app/ / routes/                 ← page routes (public + protected)
middleware                     ← auth guard (if applicable)
```

## Adding New Documentation

1. Identify the domain: architecture, api, state, data, style, security, performance, testing, product, ai, operations, or workflow.
2. Copy `v1/spec/<domain>/_template.md` to a new file in the same folder.
3. Fill in the `Source of truth` metadata field with the real source path.
4. Follow the standard headings defined in the template.
5. Add an entry to this index.
6. Link from the nearest related doc's `## Related Docs` section.

## Related Docs

- [AI Guide](guide.md)
- [Repo Map](repo-map.md)
- [Docs Maintenance](../operations/docs-maintenance.md)
- [Rollout Plan Template](../../flow/templates/rollout-plan-template.md)
