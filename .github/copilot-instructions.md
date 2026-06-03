# certifai Copilot Instructions (Lean Router)

This file is intentionally minimal. Domain rules live in `docs/` and should be loaded by task type.

## Start Here (Mandatory)

1. Read [`docs/ai/guide.md`](../docs/ai/guide.md) first.
2. Use [`docs/ai/assistant-context-index.md`](../docs/ai/assistant-context-index.md) to route to the correct domain docs.
3. If docs are insufficient (missing/ambiguous/outdated), do a bounded code scan and update the docs in the same change.

## Domain Instruction Allocation (`docs/` is canonical)

| Domain | Canonical folder | Primary entry docs |
| --- | --- | --- |
| AI retrieval + routing | `docs/ai/` | `guide.md`, `assistant-context-index.md`, `repo-map.md` |
| Architecture (Next.js, flags, errors, SEO) | `docs/architecture/` | `nextjs-conventions.md`, `feature-flags.md`, `error-handling.md`, `seo-patterns.md` |
| API + SWR | `docs/api/` | `api-connection.md`, `swr-patterns.md` |
| State + data contracts | `docs/state/`, `docs/data/` | `client-state.md`, `data-models.md` |
| Styling + component rules | `docs/style/` | `conventions.md` |
| Auth + security | `docs/security/` | `auth-patterns.md` |
| Billing | `docs/billing/` | `stripe-billing.md` |
| Performance | `docs/performance/` | `patterns.md` |
| Testing | `docs/testing/` | `strategy.md` |
| Product vocabulary | `docs/product/` | `glossary.md` |
| Process + governance | `docs/operations/`, `docs/workflow/`, `ai_oriented_kanban/templates/` | `docs-maintenance.md`, `spec-first-kanban-integration.md`, workflow docs, rollout template |

## Non-Negotiable Guardrails

- Never run `npm run build` during assistant sessions.
- Never reset the database.
- Never commit Firebase config/service-account credentials.
- Never hardcode API endpoints; use env/config.
- Never bypass `cn()` for className merging.
- Keep scope tight: no unsolicited refactors or feature expansion.

## Validation Defaults

- Run targeted verification for touched code paths.
- Run TypeScript checks after significant type changes.
- `npm run lint` and `npm run test:e2e` may be skipped only when a known repo-level blocker exists; record the reason in rollout/session notes.

## Rollout Planning Trigger

For rollout/migration/implementation plans, use `ai_oriented_kanban/templates/rollout-plan-template.md` and follow spec-first evidence requirements from `docs/operations/spec-first-kanban-integration.md`.
