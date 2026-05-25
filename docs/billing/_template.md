# <Title>

> **Source of truth**: `src/context/AccountContext.tsx`, `src/stripe/client/`, `app/main/billing/`
> **Last reviewed**: YYYY-MM-DD
> **Owner**: engineering

## Purpose

What billing or subscription domain this document covers.

## Key Concepts

- **AccountContext**: Centralized account and subscription state for authenticated dashboard routes.
- **Unified account data**: Normalized Stripe/customer/subscription response returned by `useUnifiedAccountData()`.
- **Checkout flow**: Client flow that creates a Stripe Checkout session and redirects the user.
- **Billing portal**: Stripe-hosted self-service page for invoices and payment methods.

## Critical Invariants

- Never call Stripe API endpoints directly from presentational components.
- Prefer `AccountContext` or higher-level billing hooks over ad hoc `fetch()` calls.
- Treat pricing and account status as separate concerns: pricing may be public; account state is authenticated.

## Flow Overview

```text
User action → billing hook / AccountContext → `/api/stripe/*` route → backend Stripe integration
```

## Related Docs

- [State: Client State](../state/client-state.md)
- [API: SWR Patterns](../api/swr-patterns.md)
- [Architecture: Next.js Conventions](../architecture/nextjs-conventions.md)
