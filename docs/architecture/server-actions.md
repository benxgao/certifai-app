# Server Actions

> **Source of truth**: `src/lib/server-actions/certifications.ts`, `src/lib/jwt-utils.ts`
> **Last reviewed**: 2026-05-26
> **Owner**: engineering

## Purpose

Documents the server-only public data-fetching pattern used by marketing and SEO routes. Despite the folder name, this is not a general replacement for client-side SWR hooks; it is a narrowly scoped server-only helper pattern for public data.

## Key Concepts

- **Server-only helper**: a module guarded by `import 'server-only'` so it cannot be imported into client bundles.
- **Public JWT**: a short-lived service token created by `generatePublicJWTToken()` for `public:read` access.
- **Public API request**: request made through `makePublicAPIRequest()` to `/api/public/*` endpoints.
- **Fallback data**: mock/default data returned when the API URL or service secret is unavailable.

## Scope Boundary

> **This pattern is for Server Components fetching public data only — never call from SWR hooks.**

Use this pattern when all of the following are true:

- the route is public or SEO-oriented,
- the code runs on the server only,
- the data can be fetched with a `public:read` token,
- and caching/revalidation at the server layer is preferred.

Do **not** use this pattern for authenticated dashboard data, interactive client views, or any component that should rely on `src/swr/` conventions.

## How the Pattern Works

1. `src/lib/server-actions/certifications.ts` imports `server-only` so the module cannot be consumed from client code.
2. The helper requests a service token via `generatePublicJWTToken()` in `src/lib/jwt-utils.ts`.
3. `generatePublicJWTToken()` posts to `${NEXT_PUBLIC_SERVER_API_URL}/api/auth/generate-service-token` using `SERVICE_SECRET`.
4. The returned token is passed to `makePublicAPIRequest()` for `/api/public/*` endpoints.
5. Public responses are normalized into server-friendly objects and often cached with `cache: 'force-cache'` plus `next.revalidate`.
6. If the token request or API call fails, the helper falls back to mock data instead of breaking the public route.

## Current Server-Only Helpers

| Function | Purpose | Typical consumers |
| -------- | ------- | ----------------- |
| `fetchCertificationsData()` | Fetch all firms with certifications, recursively following pagination | `app/certifications/page.tsx`, firm-level listing pages, `app/sitemap.ts` |
| `fetchCertificationData(certificationId)` | Fetch a single certification by ID for public route rendering | certification detail and training pages |
| `fetchCertificationDataBySlug(slug)` | Fetch a certification by SEO slug | SEO-friendly public certification pages |
| `fetchCertificationsByFirmId(firmId)` | Fetch all certifications for one firm | reserved helper for future/public firm-specific routes |

## Environment Requirements

These helpers depend on server environment values:

- `NEXT_PUBLIC_SERVER_API_URL`
- `SERVICE_SECRET`

If either value is missing, the helpers intentionally fall back to mock data. That is acceptable for local development and public-route resilience, but it should not be mistaken for a production data path.

## When to Use This vs. SWR

| Scenario | Use server-only helper? | Why |
| -------- | ----------------------- | --- |
| Public certification landing page rendered on the server | Yes | Supports SEO-friendly server rendering and cache revalidation |
| `app/sitemap.ts` generating public URLs | Yes | Runs on the server and should not depend on client hooks |
| Authenticated dashboard page under `app/main/` | No | Use authenticated SWR hooks from `src/swr/` |
| Interactive client component that updates while the user navigates | No | SWR owns client-side caching, revalidation, and auth refresh |
| Public route that needs progressive client refresh after first render | Usually no | Initial server fetch may be fine, but client updates should still use an explicit client data strategy |

## Caching and Resilience Rules

- Prefer explicit server-side cache hints such as `cache: 'force-cache'` and `next: { revalidate: 3600 }` for slow-changing marketing data.
- Keep returned shapes normalized for route consumption rather than leaking raw API response envelopes into page components.
- Preserve the fallback behavior unless product requirements explicitly remove mock data support.

## Dangerous Areas / Anti-patterns

- Do not import files from `src/lib/server-actions/` into client components or `'use client'` modules.
- Do not call these helpers from hooks in `src/hooks/` or `src/swr/`; that mixes the server-only public path with the authenticated client path.
- Do not bypass `generatePublicJWTToken()` by hardcoding public tokens.
- Do not assume the presence of `NEXT_PUBLIC_SERVER_API_URL` or `SERVICE_SECRET`; the implementation is intentionally defensive.
- Do not confuse these helpers with Next.js form/server actions using `'use server'`; they are server-only utility modules.

## Related Docs

- [Hooks Catalog](hooks-catalog.md)
- [API: SWR Patterns](../api/swr-patterns.md)
- [API Connection](../api/api-connection.md)
- [Architecture: Next.js Conventions](nextjs-conventions.md)
