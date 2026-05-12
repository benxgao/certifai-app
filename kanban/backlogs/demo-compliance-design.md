# Rollout: Demo Credentials Reveal-on-Agree (API-Ready)

## Summary

Visitors must explicitly click an **Agree and display credentials** button every time they want to use demo login credentials. Credentials are hidden by default and are only revealed after the click action.

This plan is intentionally designed for future scale:

- **Now**: click action fetches credentials through API (`SWR -> /api/demo-credentials -> backend /api/public/demo-credentials`), with hardcoded credentials currently served by backend.
- **Later**: backend credential storage can move to secret manager/database without changing the UI contract.

The UI contract stays stable while the data source switches from local hardcoded to server-managed.

## Core Product Rule

To see demo credentials, visitors must click the agree button each visit. Do not auto-show from prior consent state.

## Key Business Behavior

- Credentials are **always hidden on initial page load**.
- User must click **Agree and display demo account credentials** to reveal them.
- No long-lived credential reveal persistence (no 30-day localStorage reveal state).
- Privacy Policy and Terms links are visible near the agree action.
- Same behavior on both `signin` and `signup`.
- When API mode is enabled later, button click fetches latest credentials from backend before display.

## Scope

- Estimated files to modify: 6–9
- Estimated files to create: 2–4
- Risk level: **Low-Medium** (UI + hook + optional API integration path)

## Out of Scope

- Changing authentication flow semantics
- Managing demo account lifecycle in this rollout
- Persistent consent records in backend database

## Implementation Status (2026-05-12)

- ✅ Phase 0 complete
- ✅ Phase 1 complete
- ✅ Phase 2 complete (API fetch path implemented; backend values currently hardcoded)
- ✅ Phase 3 complete
- ✅ Phase 4 complete
- ✅ Phase 5 complete (tests hardening)

---

## Target State (Behavior Contract)

### Before Click

- Notification bar shows CTA and policy links
- Credentials are not present in DOM text content

### After Click

- Credentials are revealed in notification bar for current page lifecycle
- Reveal state may remain during current route/session memory only, but **must not bypass click requirement on a fresh visit**

### Fresh Visit Rule

On refresh/new tab/new session entry to signin/signup:

- credentials hidden again
- agree click required again

---

## Architecture for Scale (Provider Pattern)

Introduce a credential source abstraction so UI does not care where credentials come from:

```ts
type DemoCredentials = {
  username: string;
  password: string;
  updatedAt?: string;
};

interface DemoCredentialsProvider {
  getLatestCredentials(): Promise<DemoCredentials>;
}
```

### Provider Implementations

1. `HardcodedDemoCredentialsProvider` (current)
   - returns static credentials from config
2. `ApiDemoCredentialsProvider` (future)
   - fetches from backend endpoint (e.g. `/api/demo-credentials`)
   - supports freshness headers/versioning (`updatedAt`)

Selection can be controlled by feature flag without changing component API.

---

## Phase 0 — Contract Reset + Flags

### Goal

Align feature contract with always-click behavior and prepare safe rollout toggles.

### Implementation

1. Keep/introduce feature flags:
   - `DEMO_CREDENTIALS_CONSENT_ENABLED=true` (gating on)
   - `DEMO_CREDENTIALS_SOURCE='hardcoded' | 'api'` (default `hardcoded`)
2. Remove old requirement text implying 30-day reveal persistence.
3. Document invariant: no automatic reveal on page load.

### Acceptance Tests

1. Page load with flag on → button visible, credentials hidden.
2. Page load after previous successful reveal → still hidden, click required.

---

## Phase 1 — Replace Persistent Reveal Logic

### Goal

Remove `localStorage`-based auto-reveal behavior and switch to explicit click-triggered reveal state.

### Implementation

1. Replace consent storage hook behavior:
   - from persisted reveal (`hasConsented` with expiry)
   - to ephemeral reveal state (`isRevealed` after click)
2. If legal needs consent logging later, log event only (no auto-reveal persistence).
3. Keep SSR-safe behavior.

### Acceptance Tests

1. Click reveal → credentials display.
2. Refresh page → credentials hidden again.
3. No stale storage entries are required for reveal behavior.

---

## Phase 2 — Credential Provider Abstraction

### Goal

Make the click action provider-driven so we can swap hardcoded credentials to API later without UI redesign.

### Implementation

1. Add provider interface + factory:
   - hardcoded provider now
   - API provider skeleton for future
2. On agree click:
   - call `getLatestCredentials()`
   - show loading state while resolving
   - reveal credentials when resolved
3. Error fallback:
   - friendly message if fetch fails in API mode
   - retry action

### Acceptance Tests

1. Hardcoded mode: click reveals static credentials.
2. API mode (mock): click fetches and renders returned credentials.
3. API failure: error message shown, credentials remain hidden.

### Phase 2 Completion Notes

- Implemented chain:
   - frontend mutation hook: `src/swr/demoCredentials.ts`
   - Next API route: `app/api/demo-credentials/route.ts`
   - backend public route: `GET /api/public/demo-credentials`
- Backend route is protected by public JWT middleware and currently returns hardcoded credentials.

---

## Phase 3 — Notification Bar UX Update

### Goal

Ensure UI consistently enforces explicit action and remains clear/accessible.

### Implementation

1. CTA copy:
   - **Agree and display demo account credentials**
2. Keep policy links adjacent:
   - `/privacy`
   - `/terms`
3. Add loading/disabled button state during credential retrieval.
4. Keep keyboard accessibility and visible focus states.

### Acceptance Tests

1. Credentials absent before click in visible text and DOM.
2. CTA + policy links keyboard reachable in logical order.
3. Loading state prevents duplicate fetch spam.

### Phase 3 Completion Notes

- CTA copy implemented: **Agree and display demo account credentials**.
- Privacy/Terms links are adjacent to CTA and keyboard-focusable.
- Loading/disabled state implemented for credential retrieval.
- Accessibility polish added:
   - focus ring styling for consent button and links
   - `aria-busy` during loading
   - error message announced via `role="alert"` + `aria-live="assertive"`

---

## Phase 4 — Signin/Signup Integration

### Goal

Apply same reveal-on-click behavior across both auth entry pages.

### Implementation

1. `app/signin/page.tsx`: wire notification bar to reveal hook/provider.
2. `app/signup/page.tsx`: mirror exact behavior.
3. Keep message content source centralized to avoid drift.

### Acceptance Tests

1. Signin: click required each fresh visit.
2. Signup: click required each fresh visit.
3. Behavior parity between pages.

---

## Phase 5 — Tests

### Goal

Lock behavior so future refactors cannot reintroduce auto-show.

### Unit Tests

- reveal state defaults to hidden
- click triggers provider fetch
- fetch success reveals
- refresh/new mount returns hidden default

### E2E Tests

1. Open signin: hidden by default.
2. Click agree: credentials shown.
3. Reload: hidden again.
4. Repeat click: shown again.

### Phase 5 Completion Notes

- Added unit tests for reveal hook lifecycle (`useDemoCredentialsReveal`):
   - defaults hidden
   - click triggers fetch
   - success reveals
   - failure remains hidden
   - remount resets to hidden (fresh visit behavior)
- Hardened E2E coverage for consent flow:
   - `signin`: reveal, reload hidden, re-click reveal again
   - `signup`: same reveal/reload/re-click parity

---

## Exact Behavior Matrix

| Scenario                 | Agree Button     | Credentials Visible | Notes                  |
| ------------------------ | ---------------- | ------------------- | ---------------------- |
| Fresh page load          | ✅               | ❌                  | Must click to reveal   |
| After click success      | ❌ (or replaced) | ✅                  | Current page lifecycle |
| Reload/new tab/new visit | ✅               | ❌                  | Must click again       |
| API mode + fetch error   | ✅               | ❌                  | Show retry message     |

---

## Rollback Plan

1. Keep consent-gating flag controllable.
2. If issues occur, disable gating and fall back to immediate hardcoded display temporarily.
3. Keep provider abstraction in place to avoid rework when re-enabling.

---

## Open Questions

1. Should reveal remain visible only for current route or full in-memory SPA session? (Both still require click on fresh visit.)
2. Should API endpoint return a short-lived signed payload to prevent stale client caching?
3. Do we want a timestamp label like “Last updated at …” once API mode is enabled?
