# Assistant Context Index

> **Source of truth**: All `docs/` sections
> **Last reviewed**: 2026-05-28
> **Owner**: engineering

## Purpose

Fast retrieval index for AI assistants and new contributors. Each entry points to the canonical document for a given concern. Start here — do not duplicate content from linked docs.

## Quick Reference

| I want to understand... | Go to |
| --- | --- |
| **How to navigate docs for a specific task type, and docs-first retrieval protocol** | [docs/ai/guide.md](guide.md) |
| Overall system map, routes, invariants, dangerous areas | [docs/ai/repo-map.md](repo-map.md) |
| Next.js App Router conventions, page/layout/loading patterns | [docs/architecture/nextjs-conventions.md](../architecture/nextjs-conventions.md) |
| Where a component should live and how component folders are organized | [docs/architecture/component-catalog.md](../architecture/component-catalog.md) |
| Which local hooks exist and what each one is for | [docs/architecture/hooks-catalog.md](../architecture/hooks-catalog.md) |
| Server-only public data fetch pattern for marketing and SEO routes | [docs/architecture/server-actions.md](../architecture/server-actions.md) |
| Feature flags, boolean vs variant flags, and gating rules | [docs/architecture/feature-flags.md](../architecture/feature-flags.md) |
| SEO metadata, structured data, sitemap, and robots patterns | [docs/architecture/seo-patterns.md](../architecture/seo-patterns.md) |
| API / SWR / auth / boundary error-handling layers | [docs/architecture/error-handling.md](../architecture/error-handling.md) |
| How to call the backend API, `ApiResponse<T>` shape | [docs/api/api-connection.md](../api/api-connection.md) |
| How to write or extend SWR hooks | [docs/api/swr-patterns.md](../api/swr-patterns.md) |
| When to use Context vs SWR, auth state lifecycle | [docs/state/client-state.md](../state/client-state.md) |
| Type files, interface conventions, enums, `any` prohibition | [docs/data/data-models.md](../data/data-models.md) |
| Tailwind, shadcn/ui, `cn()`, dark mode, component location rules | [docs/style/conventions.md](../style/conventions.md) |
| Billing, Stripe checkout, account context, subscription management | [docs/billing/stripe-billing.md](../billing/stripe-billing.md) |
| Firebase Auth, JWT, protected routes, middleware | [docs/security/auth-patterns.md](../security/auth-patterns.md) |
| Detailed signin lifecycle, logout behavior, cookie troubleshooting | [docs/workflow/signin-workflow.md](../workflow/signin-workflow.md) |
| Detailed signup + verification lifecycle, UAT differences | [docs/workflow/signup-workflow.md](../workflow/signup-workflow.md) |
| Exam creation → generation → submission → report lifecycle | [docs/workflow/exam-lifecycle-workflow.md](../workflow/exam-lifecycle-workflow.md) |
| Cookie consent banner, analytics gating, consent reset flow | [docs/workflow/consent-workflow.md](../workflow/consent-workflow.md) |
| Marketing signup-subscription pipeline (MailerLite/AWS Lambda) | [docs/api/marketing-subscription-workflow.md](../api/marketing-subscription-workflow.md) |
| SWR caching options, rate limiting, optimization hooks | [docs/performance/patterns.md](../performance/patterns.md) |
| Unit test patterns, E2E fixtures, coverage targets | [docs/testing/strategy.md](../testing/strategy.md) |
| Shared product terms (Exam, Certification, Firm, etc.) | [docs/product/glossary.md](../product/glossary.md) |
| Why this docs structure was adopted | [docs/adr/0001-docs-architecture-mvp.md](../adr/0001-docs-architecture-mvp.md) |
| Docs ownership, update cadence, freshness SLA | [docs/operations/docs-maintenance.md](../operations/docs-maintenance.md) |
| AI retrieval smoke-test QA protocol | [docs/operations/ai-retrieval-smoke-tests.md](../operations/ai-retrieval-smoke-tests.md) |
| Workflow docs naming/location convention | [docs/workflow/README.md](../workflow/README.md) |
| How to author phased rollout plans and mandatory closing phases | [ai_oriented_kanban/templates/rollout-plan-template.md](../../ai_oriented_kanban/templates/rollout-plan-template.md) |

## Key Source Paths

```
src/
├── swr/              ← all data fetching hooks (18 files)
├── stripe/           ← billing and checkout client/server integration
├── types/
│   ├── api.ts        ← ApiResponse<T> base type
│   ├── exam-status.ts
│   └── swr-data/     ← typed response interfaces (16 files, 1:1 with swr/ hooks)
├── context/          ← React Context providers (auth, profile, certifications, exam stats, account)
├── lib/              ← auth utilities, fetch config, validation, rate limiting
├── hooks/            ← local custom hooks (exam logic, profile, sign-in, optimized utils)
├── firebase/         ← Firebase config (web + admin — admin is SERVER ONLY)
└── components/
    ├── ui/           ← shadcn/ui primitives
    ├── custom/       ← domain-specific components
    ├── auth/         ← auth-specific components
    └── ...
app/
├── main/             ← authenticated section (protected by middleware)
└── api/              ← Next.js API routes (auth, auth-cookie, demo, marketing)
middleware.proxy.ts   ← JWT guard for /main/*
docs/billing/         ← billing/Stripe domain docs
```

## Adding New Documentation

1. Identify the domain: architecture, api, state, data, style, security, performance, testing, or ai.
2. Copy `docs/<domain>/_template.md` to a new file in the same folder.
3. Fill in the `Source of truth` metadata field with the real source path.
4. Follow the standard headings defined in the template.
5. Add an entry to this index.
6. Link from the nearest related doc's `## Related Docs` section.

## Related Docs

- [AI Guide](guide.md)
- [Repo Map](repo-map.md)
- [Docs Maintenance](../operations/docs-maintenance.md)
- [Rollout Plan Template](../../ai_oriented_kanban/templates/rollout-plan-template.md)
