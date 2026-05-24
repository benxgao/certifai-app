# Client State

> **Source of truth**: `src/context/FirebaseAuthContext.tsx`, `src/context/UserProfileContext.tsx`, `src/context/UserCertificationsContext.tsx`, `src/context/ExamStatsContext.tsx`
> **Last reviewed**: 2026-05-24
> **Owner**: engineering

## Purpose

Documents the three-layer state architecture: server state (SWR), shared client state (React Context), and local UI state (`useState`). Explains when to use each layer and how the four Context providers are structured.

## State Layers

| Layer | Mechanism | Location | When to use |
| ----- | --------- | -------- | ----------- |
| Server state | SWR (`useAuthSWR`) | `src/swr/` | API-backed data: exams, certifications, profile, questions |
| Auth state | React Context | `src/context/FirebaseAuthContext.tsx` | Firebase user session, token refresh, sign-out |
| Shared client state | React Context | `src/context/UserProfileContext.tsx`, etc. | Data needed by many components but not suited for SWR |
| Local UI state | `useState` / `useReducer` | Component | Ephemeral: open/close, selected tab, input value |

## Context Providers

### `FirebaseAuthContext`
`src/context/FirebaseAuthContext.tsx`

The auth source of truth. Exposes:
- `user` — Firebase `User` object (null when unauthenticated)
- `refreshToken()` — forces a Firebase token refresh; used by SWR hooks on 401
- `signOut()` — clears Firebase session and auth cookie

Mounted in `app/layout.tsx`. All other context providers and SWR hooks depend on this.

### `UserProfileContext`
`src/context/UserProfileContext.tsx`

Provides the authenticated user's profile data (API user ID, display name, avatar, plan). Populated from `src/swr/profile.ts` and shared to avoid redundant SWR calls.

### `UserCertificationsContext`
`src/context/UserCertificationsContext.tsx`

Provides the list of certifications the user has registered for. Shared across the dashboard, certification list, and exam views to avoid redundant SWR calls.

### `ExamStatsContext`
`src/context/ExamStatsContext.tsx`

Provides aggregated exam counts and stats for the dashboard. Avoids prop-drilling stats down through multiple layout levels.

## Decision Guide

| Scenario | Use |
| -------- | --- |
| Fetching a list from the API | `useAuthSWR` in `src/swr/` |
| Reading auth user, token refresh | `useFirebaseAuth()` from `FirebaseAuthContext` |
| Reading current user profile | `useUserProfile()` from `UserProfileContext` |
| Reading user certifications list in multiple sibling components | `useUserCertifications()` from `UserCertificationsContext` |
| A modal's open/close toggle | `useState` in the component |
| Form field value | `useState` or `useOptimizedForm` from `src/hooks/` |

## Conventions / Rules

- Never duplicate SWR data in Context — if SWR already fetches it, do not re-store in a Context provider.
- Context providers that depend on auth must be mounted **below** `FirebaseAuthContext` in the tree.
- Use `null` as the initial value for async context data, not `undefined`, to distinguish "not loaded" from "absent".
- Custom hooks (`useFirebaseAuth`, `useUserProfile`, etc.) must throw if used outside their provider.

## Dangerous Areas / Anti-patterns

- **Never** call `refreshToken()` manually from components — it is handled automatically by `fetcherWithAuth` in `src/swr/utils.ts`.
- **Never** store sensitive data (raw tokens, passwords) in React Context — Context is not secured storage.
- **Do not** add a new Context provider for data that can be fetched directly via SWR.
- **Do not** consume `FirebaseAuthContext` directly — always use the `useFirebaseAuth()` hook which includes the provider guard.

## Related Docs

- [API: SWR Patterns](../api/swr-patterns.md)
- [Security: Auth Patterns](../security/auth-patterns.md)
- [Data Models](../data/data-models.md)
