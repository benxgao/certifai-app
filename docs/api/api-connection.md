# API Connection

> **Source of truth**: `src/types/api.ts`, `src/lib/client-fetch.ts`, `src/lib/fetch-config.ts`, `src/lib/api-utils.ts`
> **Last reviewed**: 2026-05-25
> **Owner**: engineering

## Purpose

Documents how `certifai-app` connects to the `certifai-api` backend: the `ApiResponse<T>` envelope, fetch utilities, error types, and the cookie-based auth header flow.

For marketing signup-subscription lifecycle details, use [`marketing-subscription-workflow.md`](marketing-subscription-workflow.md).

## Key Concepts

- **`ApiResponse<T>`**: standard envelope wrapping all successful backend responses.
- **`ApiErrorResponse`**: envelope wrapping all error responses.
- **`CanonicalApiErrorResponse`**: extended error with machine-readable `error_code` and `retriable` flag.
- **`client-fetch.ts`**: thin fetch wrapper that attaches auth cookies and handles common HTTP error cases.
- **`fetch-config.ts`**: base URL and default request options for all backend calls.

## Request / Response Shapes

```typescript
// src/types/api.ts

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;       // present on paginated endpoints
}

interface PaginatedApiResponse<T> {
  success: boolean;
  data: T;
  meta: PaginationMeta;        // always present on paginated endpoints
}

interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiErrorResponse {
  success: false;
  error: string;
}

interface CanonicalApiErrorResponse extends ApiErrorResponse {
  error_code: string;
  retriable: boolean;
  details?: unknown;
}

// Extended Error for HTTP/API errors surfaced by SWR hooks
interface ApiError extends Error {
  status?: number;
  response?: { status?: number };
  code?: string;
  info?: unknown;               // response body on non-ok status
}
```

## Auth Flow

Authentication uses `httpOnly` JWT cookies managed by `app/api/auth-cookie/`. The cookie is automatically sent with every same-origin fetch. There is no manual `Authorization` header in client code — the browser attaches the cookie.

```
Firebase Auth → app/api/auth-cookie/set → httpOnly cookie
Client fetch  → cookie attached automatically by browser
Backend API   → reads cookie from request
```

If a request returns `401`, the SWR hooks automatically trigger a Firebase token refresh and retry exactly once (see `src/swr/utils.ts: fetcherWithAuth`).

## Fetch Utilities

| File | Purpose |
| ---- | ------- |
| `src/lib/client-fetch.ts` | Thin wrapper for client-side API calls |
| `src/lib/fetch-config.ts` | Base URL, default headers, environment config |
| `src/lib/api-utils.ts` | Shared request/response utilities |
| `src/swr/utils.ts` | `fetcherWithAuth` — SWR fetcher with 401 retry |

## Type Guards

```typescript
// Narrow an unknown error to ApiError
isApiError(err: unknown): err is ApiError

// Narrow an unknown value to CanonicalApiErrorResponse
isCanonicalApiErrorResponse(value: unknown): value is CanonicalApiErrorResponse
```

## Conventions / Rules

- Always import `ApiResponse<T>` and `ApiError` from `src/types/api.ts` — do not redefine locally.
- Use `isApiError()` before accessing `.status` or `.info` on caught errors.
- Use `isCanonicalApiErrorResponse()` to safely extract `error_code` and `retriable` from API error bodies.
- Never hardcode base URLs — use the config from `src/lib/fetch-config.ts`.

## Dangerous Areas / Anti-patterns

- Never use `fetch()` directly in components — always use SWR hooks (see [SWR Patterns](swr-patterns.md)).
- Never re-implement the 401 refresh logic locally — it is handled by `fetcherWithAuth` in `src/swr/utils.ts`.
- Never expose the auth cookie value to JavaScript — `httpOnly` must be respected; changes to `app/api/auth-cookie/` require careful review.

## Related Docs

- [Marketing Subscription Workflow](marketing-subscription-workflow.md)
- [SWR Patterns](swr-patterns.md)
- [Data Models](../data/data-models.md)
- [Security: Auth Patterns](../security/auth-patterns.md)
