# Repo Map

> **Source of truth**: `app/`, `src/swr/`, `src/context/`, `middleware.proxy.ts`
> **Last reviewed**: 2026-05-24
> **Owner**: engineering

## System Boundary

- **Entrypoints**:
  - `app/layout.tsx` — root layout, global providers, analytics
  - `middleware.proxy.ts` — JWT validation gate for all `/main/*` routes
  - `app/page.tsx` — public landing page
  - `app/main/page.tsx` — authenticated dashboard

- **Core domains**:
  - `app/main/` — authenticated app (certifications, exams, billing, profile)
  - `app/api/` — Next.js API routes (auth, auth-cookie, demo, marketing, public certifications)
  - `src/swr/` — all server-state data fetching (18 hook files)
  - `src/context/` — React context providers for auth and user state
  - `src/lib/` — auth utilities, fetch config, validation, rate limiting
  - `src/components/` — UI components (ui/, custom/, auth/, billing/, analytics/)

- **External dependencies**:
  - Firebase Authentication (client: `src/firebase/firebaseWebConfig.ts`, server: `src/firebase/firebaseAdminConfig.ts`)
  - Backend API (`certifai-api`) — all domain data via SWR hooks
  - Stripe — billing callbacks at `app/main/stripe/callback/`
  - Google Analytics — `src/components/analytics/`

## Route Map

| Route | Auth | Purpose |
| ----- | ---- | ------- |
| `/` | Public | Landing page |
| `/signin`, `/signup`, `/forgot-password` | Public | Auth flows |
| `/certifications` | Public | Certification listing (marketing) |
| `/pricing`, `/about`, `/blog`, `/docs` | Public | Marketing pages |
| `/main` | Protected | Dashboard |
| `/main/certifications` | Protected | User certification list |
| `/main/certifications/[cert_id]` | Protected | Certification detail |
| `/main/certifications/[cert_id]/exams` | Protected | Exam list for cert |
| `/main/certifications/[cert_id]/exams/[exam_id]` | Protected | Active exam |
| `/main/profile` | Protected | User profile |
| `/main/billing` | Protected | Billing management |
| `/main/stripe/callback` | Protected | Stripe callback handler |

## Critical Invariants

1. **Never call the backend API directly from components.** All data fetching must go through SWR hooks in `src/swr/`.
2. **All authenticated routes must be under `app/main/`.** The middleware only guards `/main/*`.
3. **Never bypass `cn()` for className merging.** All conditional class logic must use `cn()` from `src/lib/utils.ts`.
4. **No `any` types.** Use explicit interfaces from `src/types/swr-data/` and Prisma-generated types.
5. **`src/firebase/firebaseAdminConfig.ts` is server-only.** Never import it in client components or `src/swr/`.
6. **SWR hooks must have explicit generic parameters.** `useAuthSWR<ResponseType, Error>(...)`.
7. **Auth cookie routes (`app/api/auth-cookie/`) handle sensitive operations.** Never expose cookie internals to client code.

## Dangerous Areas ⚠️

- `src/firebase/firebaseAdminConfig.ts` — server-only Firebase Admin SDK; importing in client code will break the build.
- `app/api/auth-cookie/` — manages `httpOnly` JWT cookies; changes here affect all authenticated sessions.
- `middleware.proxy.ts` — any bug here blocks the entire authenticated section; test carefully before merging.
- `src/lib/auth-state-transitions.ts` — auth state machine; incorrect transitions cause infinite redirect loops.
- `src/types/swr-data/` — removing or renaming fields breaks consumer components silently without TypeScript errors if `any` types sneak in.

## Test Strategy

- **Unit**: `__tests__/` (Jest) — 6 files covering exam-status, exam-cert-error-contract, exam-report phases, demo-credentials.
- **E2E**: `e2e/` (Playwright) — full user flows with `authenticatedPage` fixture.
- **Setup**: `__tests__/setup.ts` — test environment initialization.

## Related Docs

- [Assistant Context Index](assistant-context-index.md)
- [Architecture: Next.js Conventions](../architecture/nextjs-conventions.md)
- [Security: Auth Patterns](../security/auth-patterns.md)
- [API: SWR Patterns](../api/swr-patterns.md)
- [State: Client State](../state/client-state.md)
