# Performance Patterns

> **Source of truth**: `src/lib/rate-limiting.ts`, `src/hooks/useOptimizedForm.ts`, `src/hooks/useOptimizedRateLimit.ts`, `src/hooks/useOptimizedScroll.ts`, `src/swr/useAuthSWR.ts`
> **Last reviewed**: 2026-05-24
> **Owner**: engineering

## Purpose

Documents caching configuration, rate limiting, optimized hook patterns, and loading UI strategies used to keep `certifai-app` responsive.

## Key Concepts

- **SWR cache**: deduplication and revalidation windows prevent redundant API calls.
- **Rate limiting**: server-side in-memory limiter in `src/lib/rate-limiting.ts` protects auth endpoints.
- **Optimized hooks**: `src/hooks/useOptimized*.ts` reduce re-renders for forms, rate limit polling, and scroll handling.
- **`loading.tsx`**: Next.js streaming skeleton shown instantly while a route segment fetches data.

## SWR Cache Defaults

Set globally in `src/swr/useAuthSWR.ts`:

```typescript
{
  dedupingInterval: 5000,       // 5 s — prevents duplicate in-flight requests per key
  focusThrottleInterval: 10000, // 10 s — limits revalidation triggered by window focus
}
```

Override per domain hook when real-time data is needed:

```typescript
// Polling for long-running exam generation
useAuthSWR<ProgressData>('/exam/generating-progress', {
  refreshInterval: 2000,
  revalidateOnFocus: false,
});

// Live exam status updates
useAuthSWR<StatusData>('/exam/live-status', {
  refreshInterval: 3000,
});
```

Disable revalidation entirely for static reference data:

```typescript
useAuthSWR<FirmsData>('/firms', {
  revalidateOnFocus: false,
  revalidateIfStale: false,
});
```

## Server-Side Rate Limits

Configured in `src/lib/rate-limiting.ts`:

| Endpoint type | Max attempts | Window |
| --- | --- | --- |
| `LOGIN` | 10 | 15 minutes |
| `REGISTER` | 3 | 1 hour |
| `PASSWORD_RESET` | 3 | 1 hour |
| `TOKEN_REFRESH` | 10 | 5 minutes |

The limiter uses in-memory storage (`Map`). For production scale, replace with Redis. Client identifier is derived from `x-forwarded-for`, `x-real-ip`, or `cf-connecting-ip` headers.

## Optimized Hooks

| Hook | Purpose |
| ---- | ------- |
| `src/hooks/useOptimizedForm.ts` | Debounced form state — reduces re-renders on rapid input |
| `src/hooks/useOptimizedRateLimit.ts` | Efficient polling for rate limit status — avoids redundant SWR calls |
| `src/hooks/useOptimizedScroll.ts` | Throttled scroll event handler — prevents layout thrash on exam pages |

Use these hooks before adding raw `useState` + `useEffect` for the same patterns.

## Loading UI Strategy

Next.js `loading.tsx` files provide instant skeleton UI while route data loads:

```
app/main/loading.tsx                → dashboard skeleton
app/main/certifications/loading.tsx → certification list skeleton
app/main/certifications/[cert_id]/exams/loading.tsx → exam list skeleton
```

Rules:
- Every route segment that fetches async data must have a co-located `loading.tsx`.
- Skeletons use `src/components/ui/card-skeletons.tsx` and `src/components/ui/loading-spinner.tsx`.
- Never use a spinner that blocks the entire viewport — show a structural skeleton instead.

## Lazy Loading

```typescript
// Use Next.js dynamic() for heavy components not needed on initial render
import dynamic from 'next/dynamic';

const LazyComponent = dynamic(() => import('@/src/components/custom/HeavyComponent'), {
  loading: () => <CardSkeleton />,
});
```

Example: `src/components/custom/LazyAvailableCertificationsButton.tsx`.

## Conventions / Rules

- Always set `revalidateOnFocus: false` for data that changes infrequently (firms, certifications list).
- Always set `refreshInterval` for polling hooks (exam generation progress, live exam status).
- Never add `useEffect` + `setInterval` for polling — use SWR `refreshInterval` instead.
- Use `dedupingInterval` to collapse burst requests for the same key.

## Dangerous Areas / Anti-patterns

- **Polling with `useEffect` + `setInterval`** — causes memory leaks and uncancelled timers. Use `refreshInterval` in SWR.
- **No `loading.tsx`** on async routes — Next.js will block rendering until data resolves, making the app feel slow.
- **Rate limiter in-memory store** — restarts lose all rate limit state; migrate to Redis before high-traffic launch.

## Related Docs

- [API: SWR Patterns](../api/swr-patterns.md)
- [Architecture: Next.js Conventions](../architecture/nextjs-conventions.md)
- [Security: Auth Patterns](../security/auth-patterns.md)
