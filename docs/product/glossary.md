# Glossary

> **Source of truth**: `src/types/`, `app/main/`, `src/swr/`
> **Last reviewed**: 2026-05-24
> **Owner**: product / engineering

## Purpose

Shared terminology for product, engineering, and AI assistants. Definitions here are authoritative — use these terms consistently across code, docs, and prompts.

## Terms

### Certification
A professional certification that users can study for and track (e.g., AWS Solutions Architect). Represented as `certification` in API responses. The primary grouping entity — users register for certifications, and exams belong to certifications.

### Exam
A generated practice test within a certification. Has a lifecycle: `GENERATING` → `READY` → `IN_PROGRESS` → `COMPLETED` / `FAILED`. See `src/types/exam-status.ts` for the full status enum.

### Question
An individual question within an exam. Has an answer submission flow managed by `src/swr/questions.ts`.

### Firm
An organization or professional body associated with certifications. Certifications are grouped under firms. See `src/swr/firms.ts`.

### SWR Hook
A data-fetching hook using the SWR library. In this codebase, all SWR hooks live in `src/swr/` and must use `useAuthSWR` (for reads) or `useAuthMutation` (for mutations). Never call the API directly from components.

### Auth Cookie
An `httpOnly` JWT cookie set by `app/api/auth-cookie/set/route.ts` after Firebase authentication. Used to authenticate server-side requests and middleware checks.

### Rate Limit
A per-user limit on exam generation or API calls. Tracked via `src/swr/rateLimitInfo.ts` and enforced server-side.

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
Read-only credentials used to demonstrate the app without full registration. See `src/swr/demoCredentials.ts`.

### Protected Route
Any route under `/main/*`. Access is gated by `middleware.proxy.ts` using JWT validation.

### Server Component / Client Component
Next.js App Router distinction. `page.tsx` is a server component by default. Files named `client.tsx` are explicitly marked `'use client'` for interactive UI.

## Related Docs

- [Repo Map](../ai/repo-map.md)
- [Data Models](../data/data-models.md)
- [Architecture: Next.js Conventions](../architecture/nextjs-conventions.md)
