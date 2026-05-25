# Glossary

> **Source of truth**: `src/types/`, `app/main/`, `src/swr/`, `src/context/AccountContext.tsx`, `src/stripe/`
> **Last reviewed**: 2026-05-26
> **Owner**: product / engineering

## Purpose

Shared terminology for product, engineering, and AI assistants. Definitions here are authoritative — use these terms consistently across code, docs, and prompts.

## Terms

### Certification
A professional certification that users can study for and track (e.g., AWS Solutions Architect). Represented as `certification` in API responses. The primary grouping entity — users register for certifications, and exams belong to certifications.

### Exam
A generated practice test within a certification. In backend state it moves through statuses such as `PENDING_QUESTIONS`, `QUESTIONS_GENERATING`, `READY`, `IN_PROGRESS`, `COMPLETED`, or `QUESTION_GENERATION_FAILED`. See `src/types/exam-status.ts` for the full enum and derived UI status mapping.

### Question
An individual question within an exam. Has an answer submission flow managed by `src/swr/questions.ts`.

### Firm
An organization or professional body associated with certifications. Firms are the top-level grouping for public certification discovery, sitemap generation, and firm-specific certification pages. Each certification belongs to a firm. See `src/swr/firms.ts` and server-side certification page generation.

### SWR Hook
A data-fetching hook using the SWR library. In this codebase, all SWR hooks live in `src/swr/` and must use `useAuthSWR` (for reads) or `useAuthMutation` (for mutations). Never call the API directly from components.

### Auth Cookie
An `httpOnly` JWT cookie set by `app/api/auth-cookie/set/route.ts` after Firebase authentication. Used to authenticate server-side requests and middleware checks.

### Rate Limit
A per-user limit on exam generation or related API activity. In the exam domain, rate-limit info is surfaced alongside exam lists and create-exam failures so the UI can explain remaining capacity, reset timing, and whether the user can create another exam.

### ApiResponse\<T\>
The standard envelope returned by all backend API endpoints:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}
```
Defined in `src/types/api.ts`.

### Cert Summary
An aggregated summary of a user's performance across a certification. See `src/swr/certSummary.ts`.

### Exam Report
A detailed breakdown of exam results after submission. See `src/swr/examReport.ts`.

### Demo Credentials
Read-only credentials used to demonstrate the app without full registration. The reveal flow may be consent-gated and the credentials can be sourced from hardcoded values or an API path depending on feature flags. See `src/swr/demoCredentials.ts` and `src/config/featureFlags.ts`.

### Adaptive Learning
A coming-soon product capability centered on personalized study paths, dynamic question selection, and progress-aware difficulty adjustment. In the current app it appears primarily as marketing language and interest-capture UI, not as an active study engine.

### Account
The authenticated user’s billing/account record exposed through `AccountContext` and backed by `useUnifiedAccountData()`. It combines user identity, Stripe customer state, subscription state, plan information, and billing-period metadata.

### Subscription
The billing relationship between a user account and a Stripe plan. In the frontend this is represented through fields such as `hasSubscription`, `hasActiveSubscription`, `subscriptionStatus`, `isTrialing`, and `isCanceled`.

### Plan
The commercial billing tier associated with a subscription. Frontend plan fields include `planId`, `planName`, `planAmount`, and `planCurrency`, all exposed through `AccountContext` / billing hooks.

### Checkout
The Stripe Checkout flow started from pricing or billing UI. It creates a checkout session, redirects the user to Stripe-hosted payment screens, and returns through `/main/stripe/callback`.

### Protected Route
Any route under `/main/*`. Access is gated by `middleware.proxy.ts` using JWT validation.

### Server Component / Client Component
Next.js App Router distinction. `page.tsx` is a server component by default. Files named `client.tsx` are explicitly marked `'use client'` for interactive UI.

## Related Docs

- [Repo Map](../ai/repo-map.md)
- [Data Models](../data/data-models.md)
- [Architecture: Next.js Conventions](../architecture/nextjs-conventions.md)
- [Stripe Billing](../billing/stripe-billing.md)
