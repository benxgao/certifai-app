# Error Handling

> **Source of truth**: `src/types/api.ts`, `src/swr/utils.ts`, `src/lib/auth-error-handler.ts`, `src/components/custom/ErrorBoundary.tsx`, `src/swr/examReport.ts`, `src/types/swr-data/questions.ts`
> **Last reviewed**: 2026-05-26
> **Owner**: engineering

## Purpose

Documents the main error-handling layers in `certifai-app`: API error envelopes, SWR fetch/mutation error transport, auth error parsing, and React component failure containment with `ErrorBoundary`.

## Key Concepts

- **API error envelope**: backend-style `{ success: false, error: string }` response body.
- **Canonical API error**: richer error envelope including `error_code` and `retriable`.
- **SWR fetch error**: thrown `Error` object that carries HTTP status plus parsed response info.
- **Contextual mutation error**: custom error class that preserves feature-specific context such as a failed question id.
- **Error boundary**: React component-level containment for render/lifecycle failures.
- **Auth error parsing**: conversion of low-level Firebase/auth failures into user-friendly messages.

## Error Layers

```text
Backend/API error body
  ↓
ApiErrorResponse / CanonicalApiErrorResponse
  ↓
SWRFetchError or mutation error
  ↓
Feature hook / component decides retry, toast, fallback, or boundary handling
```

## API Error Contracts

### `ApiErrorResponse`

Use this for the baseline error envelope:

```typescript
{
  success: false,
  error: string,
}
```

### `CanonicalApiErrorResponse`

Use this when callers need structured retry and classification signals:

```typescript
{
  success: false,
  error: string,
  error_code: string,
  retriable: boolean,
  details?: unknown,
}
```

### Type guards

- `isApiError(err)` narrows thrown errors that carry HTTP-ish properties like `status`, `code`, `response`, or `info`.
- `isCanonicalApiErrorResponse(value)` narrows parsed response bodies to the canonical error envelope.

## SWR Error Transport

### `SWRFetchError`

`src/swr/utils.ts` defines `SWRFetchError`, which adds:

- `status`
- `info`

This is the preferred transport for read-hook failures where callers need both the HTTP status and the parsed response body.

### Why it matters

It lets components and hooks distinguish between:

- client errors vs. server errors,
- retriable vs. non-retriable failures,
- canonical envelope errors vs. generic text/JSON bodies.

## Type Decision Table

| Scenario | Catch / inspect | Why |
| -------- | --------------- | --- |
| Generic authenticated SWR fetch fails | `SWRFetchError` or `isApiError()` | gives access to HTTP status and parsed `info` |
| Parsed backend body may include retry metadata | `isCanonicalApiErrorResponse(error.info)` | exposes `error_code` and `retriable` |
| Answer-submission failure must identify the exact question | `SubmitAnswerError` | preserves `questionId` for contextual UI handling |
| Firebase/auth UI failure | `parseAuthError()` | converts low-level auth codes into user-facing messages |
| API route utility needs a uniform failure body | `createErrorResponse()` | returns a normalized `{ success: false, error, statusCode }` object |
| React render crashes | `ErrorBoundary` | keeps a subtree failure from blanking the whole UI |

## Auth Error Handling

`src/lib/auth-error-handler.ts` provides the centralized auth-error parsing layer.

### Main exports

| Helper | Purpose |
| ------ | ------- |
| `parseAuthError()` | maps Firebase/auth failures to user-friendly messages and retry hints |
| `isRetriableError()` | identifies likely network/transient auth failures |
| `createErrorResponse()` | generates standardized API-route-style failure objects |

## Custom Feature Errors

### `SubmitAnswerError`

`src/types/swr-data/questions.ts` defines `SubmitAnswerError`, which extends `Error` and adds a `questionId` field.

Use this pattern when downstream UI needs to know **which specific item failed**, not just that a mutation failed.

In the exam question flow, `useSubmitAnswer()` wraps lower-level mutation failures in `SubmitAnswerError` so answer-save failures can be associated with the exact question that triggered them.

### Common mappings

| Auth code | User-facing outcome |
| --------- | ------------------- |
| `auth/email-already-in-use` | non-retriable signup guidance |
| `auth/invalid-email` | non-retriable input correction |
| `auth/user-not-found` / `auth/wrong-password` | invalid credentials |
| `auth/too-many-requests` | throttling message |
| `auth/network-request-failed` | retriable network guidance |
| `auth/internal-error` | retriable internal error guidance |
| `auth/expired-action-code` / `auth/invalid-action-code` | verification-link recovery guidance |

## React Error Boundary

`src/components/custom/ErrorBoundary.tsx` is the app’s component-failure containment primitive.

### Behavior

- `getDerivedStateFromError()` flips the boundary into fallback mode.
- `componentDidCatch()` is present as the lifecycle capture point.
- The default fallback renders a full-page retry UI.
- Consumers may pass a custom `fallback` component that receives `{ error, retry }`.

### When to use it

- around unstable or integration-heavy client subtrees,
- around pages that should degrade gracefully instead of white-screening,
- when a retry button is a better UX than route-level failure.

### What it does not handle

- request errors automatically,
- event-handler errors,
- server-side data validation by itself.

## Example: Exam Report Error Handling

`src/swr/examReport.ts` demonstrates the preferred richer pattern.

### What it does

- parses non-OK responses into either canonical or fallback error info,
- throws `SWRFetchError(message, status, info)`,
- retries only on appropriate server-side/transient failures,
- allows components like `src/components/custom/ExamReport.tsx` to branch on `error_code`.

### Error codes used in the report flow

| Error code | Meaning | Typical UI response |
| ---------- | ------- | ------------------- |
| `REPORT_GENERATION_TRANSIENT` | report is still being generated | wait / do not spam generation |
| `EXAM_REPORT_NOT_FOUND` | report not ready yet | allow manual generation |
| retriable 5xx canonical error | temporary upstream issue | retry guidance |

## Practical Rules

- Prefer structured backend error envelopes when the UI needs to know whether to retry.
- Use `SWRFetchError` for fetch-based read hooks so status and body stay attached.
- Use custom feature errors like `SubmitAnswerError` when the caller needs domain context, not just a message.
- Parse auth/provider errors through `parseAuthError()` instead of re-implementing message mapping in forms.
- Use `ErrorBoundary` for render-tree containment, not as a substitute for request-state handling.
- When you need status-aware branching in a component, narrow with `isApiError()` or inspect `SWRFetchError` rather than using `any` casts.

## Dangerous Areas / Anti-patterns

- Do not throw plain strings when the caller needs status or retry metadata.
- Do not assume every failed response body matches `CanonicalApiErrorResponse`.
- Do not use `ErrorBoundary` as the only error UX for fetch-driven components.
- Do not duplicate Firebase auth error mappings across signin/signup components.
- Do not hide retriable vs. non-retriable differences when the UX should guide the user differently.

## Related Docs

- [API Connection](../api/api-connection.md)
- [API: SWR Patterns](../api/swr-patterns.md)
- [Security: Auth Patterns](../security/auth-patterns.md)
- [Workflow: Signin](../workflow/signin-workflow.md)
