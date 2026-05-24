# Auth Patterns

> **Source of truth**: `middleware.proxy.ts`, `src/lib/auth-state-manager.ts`, `src/lib/auth-state-types.ts`, `src/lib/jwt-utils.ts`, `src/firebase/verifyTokenByAdmin.ts`, `app/api/auth-cookie/`
> **Last reviewed**: 2026-05-24
> **Owner**: engineering

## Purpose

Documents the Firebase Authentication flow, JWT cookie lifecycle, protected route middleware, auth state machine, and security rules for `certifai-app`.

## Key Concepts

- **Firebase Auth**: client-side identity provider. Issues Firebase JWTs after sign-in.
- **Auth cookie**: an `httpOnly` cookie set by `app/api/auth-cookie/set/route.ts` after Firebase sign-in. Used to authenticate all same-origin requests without exposing tokens to JavaScript.
- **`middleware.proxy.ts`**: Next.js middleware that validates the JWT cookie on every request to `/main/*`. Redirects to `/signin` on failure.
- **`AuthState` enum**: explicit state machine (`NotAuthenticated`, `Authenticating`, `Authenticated`, `SessionExpired`, `Error`). Prevents implicit state detection bugs.
- **`clearAuthTokens(scope)`**: unified function that clears all auth state on sign-out. Never use ad-hoc `localStorage.clear()`.

## Auth Flow

```
1. User submits sign-in form
2. Firebase client SDK authenticates → issues Firebase JWT
3. Client calls app/api/auth-cookie/set (POST, body: Firebase ID token)
4. Server verifies token via firebase-admin (verifyTokenByAdmin.ts)
5. Server sets httpOnly cookie (name: COOKIE_AUTH_NAME from src/config/constants.ts)
6. Subsequent requests to /main/* send cookie automatically
7. middleware.proxy.ts validates cookie JWT → allows or redirects

On token expiry:
  → SWR hook receives 401 response
  → fetcherWithAuth calls refreshToken() (FirebaseAuthContext)
  → refreshToken() calls app/api/auth-cookie/refresh
  → Cookie updated silently
  → SWR retries the original request

On sign-out:
  → clearAuthTokens('all') called (src/lib/auth-state-manager.ts)
  → app/api/auth-cookie/clear called (server cookie cleared)
  → Client localStorage/sessionStorage cleared
  → Firebase client signed out
```

## Protected Routes

Only routes under `/main/*` are protected. The middleware configuration in `middleware.proxy.ts`:

- Skips static assets (`.svg`, `.png`, `.js`, `.css`, etc.)
- Skips Next.js `_next/` internals
- Applies JWT check to all remaining `/main/*` paths
- Redirects to `/signin?redirect=<originalPath>` on auth failure

All new authenticated pages must be added under `app/main/` — adding protected routes elsewhere will bypass the middleware.

## Auth State Machine

```typescript
// src/lib/auth-state-types.ts
enum AuthState {
  NotAuthenticated = 'not-authenticated',
  Authenticating   = 'authenticating',
  Authenticated    = 'authenticated',
  SessionExpired   = 'session-expired',
  Error            = 'error',
}
```

State transitions are managed by `src/lib/auth-state-transitions.ts`. Never infer auth state from the presence or absence of a user object — always use the enum.

## Token Clearing

```typescript
// src/lib/auth-state-manager.ts
clearAuthTokens(scope: TokenClearScope): Promise<void>

// Scopes:
// 'all'     — clear server-side cookie + client storage + Firebase (use on logout)
// 'client'  — clear localStorage/sessionStorage only (use before fresh sign-in)
// 'cookies' — clear document.cookie entries only
// 'storage' — clear localStorage and sessionStorage only
```

Always use `clearAuthTokens('all')` for logout. Never call `localStorage.clear()` or `document.cookie = ''` directly.

## Auth Cookie Routes

| Route | Purpose |
| ----- | ------- |
| `app/api/auth-cookie/set` | Set cookie after Firebase sign-in |
| `app/api/auth-cookie/clear` | Clear cookie on sign-out |
| `app/api/auth-cookie/refresh` | Refresh cookie with a new Firebase token |
| `app/api/auth-cookie/verify` | Verify the current cookie (used by middleware) |
| `app/api/auth-cookie/server-refresh` | Server-side token refresh |
| `app/api/auth-cookie/clear-cache` | Clear server-side auth cache |

## Input Validation

All user inputs must be validated with `src/lib/input-validation.ts` before processing. Never trust raw form values.

## Conventions / Rules

- All new authenticated pages must be placed under `app/main/`.
- Always use `useFirebaseAuth()` hook — never consume `FirebaseAuthContext` directly.
- Use `AuthState` enum for conditional rendering — never check `user === null` as a proxy for auth state.
- Never store the Firebase ID token in `localStorage` — the `httpOnly` cookie is the only storage location.
- All API route handlers under `app/api/auth*` must verify the service secret or Firebase token before responding.

## Dangerous Areas / Anti-patterns ⚠️

- **`src/firebase/firebaseAdminConfig.ts` is server-only** — it uses the Firebase Admin SDK. Importing it in any client component (`'use client'`) will throw a build error.
- **`app/api/auth-cookie/` routes are sensitive** — changes to cookie name, expiry, or `httpOnly` flag affect all authenticated sessions immediately.
- **`middleware.proxy.ts` bugs block all of `/main/*`** — always test middleware changes against sign-in, token expiry, and redirect flows before merging.
- **`auth-state-transitions.ts`** — incorrect state transitions cause infinite redirect loops; review with care.
- **Never use `any` for auth types** — `User`, `AuthState`, and token types are all explicitly typed.

## Related Docs

- [Architecture: Next.js Conventions](../architecture/nextjs-conventions.md)
- [State: Client State](../state/client-state.md)
- [API Connection](../api/api-connection.md)
- [Repo Map](../ai/repo-map.md)
