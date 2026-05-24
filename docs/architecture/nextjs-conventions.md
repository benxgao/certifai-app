# Next.js Conventions

> **Source of truth**: `app/layout.tsx`, `app/main/layout.tsx`, `app/main/certifications/`, `middleware.proxy.ts`
> **Last reviewed**: 2026-05-24
> **Owner**: engineering

## Purpose

Documents the App Router structure, layout hierarchy, routing conventions, loading patterns, and server/client component split used across `certifai-app`.

## Key Concepts

- **App Router**: Next.js 15 file-system router. Every folder with a `page.tsx` becomes a route.
- **Layout**: `layout.tsx` wraps all child routes in a shared shell (providers, nav, etc.).
- **Loading state**: `loading.tsx` provides instant skeleton UI while a segment's data loads.
- **Template**: `template.tsx` re-mounts on every navigation (used for animation resets).
- **Server component**: Default in App Router. Has access to server-only APIs, no `useState`/`useEffect`.
- **Client component**: Marked with `'use client'`. Required for interactivity, hooks, and browser APIs.

## Route Structure

```
app/
├── layout.tsx                          ← Root layout (global providers, analytics, fonts)
├── page.tsx                            ← Public landing page
├── loading.tsx                         ← Root loading skeleton
├── not-found.tsx                       ← 404 page
│
├── signin/, signup/, forgot-password/  ← Public auth pages
├── certifications/                     ← Public certification listing (marketing)
├── pricing/, about/, blog/, docs/      ← Marketing pages
│
├── main/                               ← Protected section (gated by middleware.proxy.ts)
│   ├── layout.tsx                      ← Authenticated shell (nav, auth guard)
│   ├── loading.tsx
│   ├── template.tsx                    ← Re-mounts on navigation for animation resets
│   ├── page.tsx                        ← Dashboard
│   │
│   ├── certifications/
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── page.tsx                    ← Certification list
│   │   └── [cert_id]/
│   │       ├── page.tsx                ← Certification detail
│   │       └── exams/
│   │           ├── loading.tsx
│   │           ├── page.tsx            ← Exam list
│   │           └── [exam_id]/
│   │               └── page.tsx        ← Active exam
│   │
│   ├── profile/
│   │   ├── page.tsx
│   │   └── client.tsx
│   ├── billing/
│   │   ├── page.tsx
│   │   └── client.tsx
│   └── stripe/callback/
│       ├── page.tsx
│       └── client.tsx
│
└── api/                                ← Next.js API routes
    ├── auth/                           ← login, logout, register, set-claims
    ├── auth-cookie/                    ← set, clear, refresh, verify cookie
    ├── demo-credentials/
    ├── marketing/
    └── public/certifications/[id]/
```

## Server vs Client Split Pattern

Pages that need both data fetching and interactivity use a `page.tsx` + `client.tsx` file pair:

```
main/profile/
├── page.tsx     ← Server component: auth check, initial data fetch
└── client.tsx   ← Client component: interactive UI, form state
```

`page.tsx` imports `client.tsx` and passes server-fetched data as props. Never add `'use client'` to `page.tsx`.

## Layout Hierarchy

```
app/layout.tsx          ← Root: HTML shell, global CSS, Firebase providers, Analytics
  └── app/main/layout.tsx  ← Auth shell: navigation, auth guard, user context
```

Providers are added at the highest layout that needs them. Do not add providers in `page.tsx`.

## Conventions / Rules

- `loading.tsx` must be co-located with any route segment that uses async data.
- Use `template.tsx` only when navigation should re-trigger animations/transitions.
- API routes (`app/api/`) are always server-only — never import them in client components.
- Dynamic segments use kebab-case brackets: `[cert_id]`, `[exam_id]`.
- Use absolute imports: `@/app/...`, `@/src/...`.

## Dangerous Areas / Anti-patterns

- Never add `'use client'` to `layout.tsx` — it breaks streaming and nested server components.
- Never fetch data directly in client components — always use SWR hooks from `src/swr/`.
- Never import `src/firebase/firebaseAdminConfig.ts` in any file under `app/main/` — it is server-only.

## Related Docs

- [Repo Map](../ai/repo-map.md)
- [API Connection](../api/api-connection.md)
- [Security: Auth Patterns](../security/auth-patterns.md)
- [State: Client State](../state/client-state.md)
