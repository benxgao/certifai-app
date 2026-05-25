# Hooks Catalog

> **Source of truth**: `src/hooks/`, `src/swr/`, `src/context/`
> **Last reviewed**: 2026-05-26
> **Owner**: engineering

## Purpose

Documents every custom hook in `src/hooks/`, what category it belongs to, and whether it is a pure UI/browser helper or a coordinator that composes SWR or context state.

## Key Concepts

- **UI utility hook**: browser/UI state helper with no backend data access.
- **Coordinator hook**: combines SWR, context, or multiple hooks into a higher-level interface for a screen.
- **Domain hook**: focused on a specific app concern such as auth, exams, profile, or rate limiting.
- **`src/hooks/` vs `src/swr/`**: `src/hooks/` is for orchestration and local/browser behavior; `src/swr/` is for API resource fetching.

## Hook Inventory

| File | Exported hooks | Category | When to use | Coordination surface |
| ---- | -------------- | -------- | ----------- | -------------------- |
| `use-mobile.ts` | `useIsMobile` | UI utility | Responsive layout decisions based on viewport size | Browser media query only |
| `useAnalytics.ts` | `useAnalytics` | Analytics | Track page views and product events through the shared GA wrapper | Browser analytics only |
| `useApiUserId.ts` | `useApiUserId` | Auth | Read `apiUserId`, loading state, and Firebase user identity from auth context | React Context |
| `useDemoCredentialsReveal.ts` | `useDemoCredentialsReveal` | Demo | Reveal demo credentials with mutation state for the demo flow | SWR mutation |
| `useDisplayNameUpdate.ts` | `useDisplayNameUpdate` | Profile/account | Update Firebase display name with validation and optimistic UI state | Firebase/browser state |
| `useEmailUpdate.ts` | `useEmailUpdate` | Profile/account | Update account email with re-auth and verification handling | Firebase/browser state |
| `useExamCounts.ts` | `useExamCounts`, `useExamCountForCertification` | Exam | Derive total exam counts per certification for cards and lists | SWR-derived data |
| `useExamListGenerationMonitor.ts` | `useExamListGenerationMonitor` | Exam | Poll the exam list while generation is still in progress | SWR polling coordination |
| `useExamPageLogic.ts` | `useExamPageLogic` | Exam | Drive the active exam page end-to-end: questions, answers, navigation, submission, notifications | Multiple SWR hooks + UI state |
| `useExamStatusNotifications.ts` | `useExamStatusNotifications` | Exam | Show one-time notifications when exam status transitions complete or fail | SWR state monitoring |
| `useInitCertId.ts` | `useInitCertId` | Auth | Read `init_cert_id` from Firebase custom claims during auth bootstrap | Firebase auth token claims |
| `useOptimizedForm.ts` | `useOptimizedForm` | UI utility | Manage generic form values, validation, touched state, and submission flags | Local component state |
| `useOptimizedRateLimit.ts` | `useOptimizedRateLimit`, `useRateLimitInfo` | Rate-limit | Show or derive rate-limit state using existing exam data before falling back to API calls | SWR coordination |
| `useOptimizedScroll.ts` | `useOptimizedScroll`, `useScrollIntersection` | UI utility | Track scroll direction/position or element visibility for animation and lazy UI | Browser scroll + IntersectionObserver |
| `useProfileData.ts` | `useProfileData` | Profile/account | Read a unified profile view that combines auth identity and profile context data | Context aggregation |
| `usePublicCertifications.ts` | _(none yet — file is currently empty)_ | Public data | Do not use until implemented; currently a placeholder file with no exports | None |
| `useRateLimitFromExams.ts` | `useRateLimitFromExams` | Rate-limit | Extract rate-limit information from exam responses without another dedicated request | SWR-derived data |
| `useSigninHooks.ts` | `useAuthRedirect`, `useSigninInitialization` | Auth | Handle sign-in page init and redirect logic in one auth-screen-focused file | Router + auth state |
| `useSystemErrorNotification.ts` | `useSystemErrorNotification` | UI utility | Surface system-level profile/network errors as throttled notifications | Context monitoring |
| `useUserExamStats.ts` | `useUserTotalExamCount`, `useShouldShowBuyMeACoffee` | Public data | Compute user exam engagement stats for UI conditions and community/support prompts | SWR-derived data |

## Hook Placement Rules

- Put a hook in `src/swr/` when its main job is to fetch or mutate one API resource.
- Put a hook in `src/hooks/` when it composes multiple data sources, coordinates polling/notifications, or manages browser/UI state.
- It is acceptable for one file in `src/hooks/` to export multiple related hooks when they belong to the same screen or concern, as in `useSigninHooks.ts` and `useUserExamStats.ts`.
- Prefer deriving secondary values from existing SWR data (`useExamCounts`, `useRateLimitFromExams`) instead of creating duplicate fetch paths.

## High-Value Coordinator Hooks

- `useExamPageLogic` is the main orchestration hook for the exam-taking route; treat it as the screen-level controller for active exams.
- `useExamListGenerationMonitor` and `useExamStatusNotifications` work together around long-running exam generation and status transitions.
- `useOptimizedRateLimit` centralizes rate-limit display logic and should be preferred over ad hoc rate-limit calculations in components.

## Dangerous Areas / Anti-patterns

- Do not add direct `fetch()` calls to hooks in `src/hooks/` when the data belongs in `src/swr/`.
- Do not duplicate auth-context extraction logic in components; reuse `useApiUserId`, `useProfileData`, or `useSigninHooks`.
- Do not treat `usePublicCertifications.ts` as implemented; the file currently exists but exports nothing.
- Do not create separate polling loops in components when an existing coordinator hook already owns the polling behavior.

## Related Docs

- [Component Catalog](component-catalog.md)
- [Server Actions](server-actions.md)
- [API: SWR Patterns](../api/swr-patterns.md)
- [Performance Patterns](../performance/patterns.md)
