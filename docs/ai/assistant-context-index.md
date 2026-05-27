# Assistant Context Index

> **Source of truth**: All `docs/` sections
> **Last reviewed**: 2026-05-27
> **Owner**: engineering

## Purpose

Fast retrieval index for AI assistants and new contributors. Each entry points to the canonical document for a given concern. Start here — do not duplicate content from linked docs.

## Quick Reference

| I want to understand... | Go to |
| --- | --- |
| **How to navigate docs for a specific task type, and docs-first retrieval protocol** | [docs/ai/guide.md](guide.md) |
| Overall system map, routes, invariants, dangerous areas | [docs/ai/repo-map.md](repo-map.md) |
| Next.js App Router conventions, page/layout/loading patterns | [docs/architecture/nextjs-conventions.md](../architecture/nextjs-conventions.md) |
| How to call the backend API, `ApiResponse<T>` shape | [docs/api/api-connection.md](../api/api-connection.md) |
| How to write or extend SWR hooks | [docs/api/swr-patterns.md](../api/swr-patterns.md) |
| When to use Context vs SWR, auth state lifecycle | [docs/state/client-state.md](../state/client-state.md) |
| Type files, interface conventions, enums, `any` prohibition | [docs/data/data-models.md](../data/data-models.md) |
| Tailwind, shadcn/ui, `cn()`, dark mode, component location rules | [docs/style/conventions.md](../style/conventions.md) |
| Firebase Auth, JWT, protected routes, middleware | [docs/security/auth-patterns.md](../security/auth-patterns.md) |
| Detailed signin lifecycle, logout behavior, cookie troubleshooting | [docs/security/signin-workflow.md](../security/signin-workflow.md) |
| Detailed signup + verification lifecycle, UAT differences | [docs/security/signup-workflow.md](../security/signup-workflow.md) |
| Marketing signup-subscription pipeline (MailerLite/AWS Lambda) | [docs/api/marketing-subscription-workflow.md](../api/marketing-subscription-workflow.md) |
| SWR caching options, rate limiting, optimization hooks | [docs/performance/patterns.md](../performance/patterns.md) |
| Unit test patterns, E2E fixtures, coverage targets | [docs/testing/strategy.md](../testing/strategy.md) |
| Shared product terms (Exam, Certification, Firm, etc.) | [docs/product/glossary.md](../product/glossary.md) |
| Why this docs structure was adopted | [docs/adr/0001-docs-architecture-mvp.md](../adr/0001-docs-architecture-mvp.md) |
| Docs ownership, update cadence, freshness SLA | [docs/operations/docs-maintenance.md](../operations/docs-maintenance.md) |
| AI retrieval smoke-test QA protocol | [docs/operations/ai-retrieval-smoke-tests.md](../operations/ai-retrieval-smoke-tests.md) |
| Workflow docs naming/location convention | [docs/workflow/README.md](../workflow/README.md) |

## Key Source Paths

```
src/
├── swr/              ← all data fetching hooks (18 files)
├── types/
│   ├── api.ts        ← ApiResponse<T> base type
│   ├── exam-status.ts
│   └── swr-data/     ← typed response interfaces (16 files, 1:1 with swr/ hooks)
├── context/          ← React Context providers (auth, profile, certifications, exam stats)
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
```

## Adding New Documentation

1. Identify the domain: architecture, api, state, data, style, security, performance, testing, or ai.
2. Copy `docs/<domain>/_template.md` to a new file in the same folder.
3. Fill in the `Source of truth` metadata field with the real source path.
4. Follow the standard headings defined in the template.
5. Add an entry to this index.
6. Link from the nearest related doc's `## Related Docs` section.
