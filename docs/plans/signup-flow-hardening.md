# Signup Flow Hardening — Improvement Plan

## Background

The current signup flow works correctly on the happy path but has several critical failure modes where account creation _appears_ successful while backend registration or auth state is incomplete. Affected users can complete the full signup UI — including clicking the verification email — but then cannot sign in because no valid `api_user_id` was ever persisted.

These issues affect both **production** (silent backend failure → unrecoverable sign-in) and **UAT** (registration failure leaves tester in a non-actionable dead-end with no redirect or error).

---

## Open Design Decisions (resolve before Phase 1)

Two policy choices affect the implementation approach for Phase 1 and Phase 3:

### Decision 1 — Backend registration failure in production

When `/api/auth/register` fails (5xx, timeout, connection refused) before email verification:

| Option                                  | Behaviour                                                                                                     | Trade-off                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **A — Block and surface (recommended)** | Show an actionable error; prevent verification step                                                           | Slightly worse UX on transient failures, but user is never in an unrecoverable state           |
| B — Deferred recovery                   | Allow email verification; show "account setup pending" banner; retry background registration on first sign-in | More forgiving UX but adds complexity; user can end up verified-but-broken if retry also fails |

### Decision 2 — Firestore account creation coupling in backend

When Firestore write fails after a successful Prisma user create:

| Option                          | Behaviour                                                | Trade-off                                                             |
| ------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| **A — Fail registration (503)** | Registration returns 503; no partially-created state     | Simpler; forces retry; relies on Prisma transaction safety            |
| B — Async reconcile             | Return 200; schedule reconcile job; mark user incomplete | Higher resilience but deferred errors are harder to track and surface |

> **Default assumption for this plan**: Option A for both decisions. Update if policy changes.

---

## Phase 1 — Correctness Blockers

**What**: Fix the two paths where signup produces an unusable account state.

**Dependencies**: None. Start immediately.

### 1.1 — UAT registration-failure dead-end (`app/signup/page.tsx`)

**Problem**
In UAT, email verification is skipped. The 5-second redirect only fires if `handleUserRegistration` succeeds. If registration throws, the error is silently swallowed and the user lands on a form with no clear next step — no error, no redirect.

**Target behaviour**
On registration failure in UAT: show a clear error toast, then automatically redirect to `/signin` after a short delay. The Firebase account exists so the user can at least see the outcome, and support can investigate.

**Files**

- `app/signup/page.tsx` — registration catch block under UAT branch

**Testing (Phase 1.1 complete when)**

- [ ] In UAT, force `/api/auth/register` to return 500 (mock or temporarily break URL). Expect: error toast appears and browser navigates to `/signin` within ~3 seconds. No permanent spinner.
- [ ] In UAT, normal registration succeeds: 5s delay + redirect to `/signin` still works.

---

### 1.2 — Production backend-failure silent continuation (`app/signup/page.tsx`)

**Problem**
In production, if `/api/auth/register` fails (5xx or timeout), `registrationSuccess` stays `false` but the code continues unconditionally to `sendEmailVerificationWithRetry`. The user receives a verification email for an account with no `api_user_id`. After verifying, they try to sign in and get a 503 from `/api/auth/login` with no clear link to the root cause.

**Target behaviour** (assuming Decision 1 → Option A)
On hard backend registration failure in production: abort the flow with an explicit, actionable error _before_ sending the verification email. Give the user a "Try again" CTA. Do not advance to the verification step.

**Files**

- `app/signup/page.tsx` — Step 2 entry guard using `registrationSuccess`

**Testing (Phase 1.2 complete when)**

- [ ] In production/local, force `/api/auth/register` to return 503. Expect: error message shown, verification step NOT shown, button re-enabled.
- [ ] Normal production flow still works: registration succeeds → verification email sent → verification step shown.
- [ ] Registration timeout (15s): same error path as 503.

---

### 1.3 — Partial auth state after failed `transitionToSignedIn` (`src/context/FirebaseAuthContext.tsx`)

**Problem**
If `transitionToSignedIn` returns `success: false` (e.g. `/api/auth-cookie/set` fails), `firebaseUser` and `firebaseToken` remain set while `apiUserId` is null. Components that check `firebaseUser` alone may grant partial access or render inconsistently.

**Target behaviour**
On a failed transition: clear `firebaseUser` and `firebaseToken` in addition to `apiUserId`, so state is fully consistent. Redirect to `/signin` with an explanatory message rather than leaving the user on a partially rendered dashboard.

**Files**

- `src/context/FirebaseAuthContext.tsx` — transition result handler

**Testing (Phase 1.3 complete when)**

- [ ] Force `setAuthCookie` to fail (e.g. malform `JOSE_JWT_SECRET`). After Firebase sign-in, user is redirected to `/signin` with an error, not left on partial dashboard.
- [ ] All three auth context fields (`firebaseUser`, `firebaseToken`, `apiUserId`) are null after failed transition.

---

## Phase 2 — Security Hardening

**What**: Close two confirmed security gaps. Neither blocks Phase 1 but should be shipped as soon as Phase 1 is stable.

**Dependencies**: Phase 1 deployed and stable.

### 2.1 — CSRF guard on `/api/auth/register` (`app/api/auth/register/route.ts`)

**Problem**
All cookie-setting endpoints call `assertAllowedOrigin()` to reject cross-site requests. `/api/auth/register` has rate limiting but **no origin check**, making it possible for a cross-origin page to trigger spam registrations using victim Firebase tokens.

**Target behaviour**
Add `assertAllowedOrigin(request)` as the first check, reusing the same `allowedOrigins` list in `src/config/serverOnlyConfig.ts`.

**Files**

- `app/api/auth/register/route.ts`

**Testing (Phase 2.1 complete when)**

- [ ] `curl -X POST https://<host>/api/auth/register -H "Origin: https://evil.example.com" ...` returns 403.
- [ ] Normal signup from the app (same origin) still works end-to-end.
- [ ] Server-to-server call with no `Origin` header is allowed through.

---

### 2.2 — Server-side environment guard for `autoVerify` (`certifai-api/functions/src/endpoints/api/auth/register.ts`)

**Problem**
`autoVerify` is gated on the frontend (`isUATEnv()`), but the backend accepts and acts on the flag unconditionally. An attacker sending `autoVerify: true` to the production endpoint marks any newly registered email as verified without clicking a link — bypassing the email ownership check.

**Target behaviour**
Backend ignores the client-provided `autoVerify` flag entirely. Derive the environment from a server-only constant (`GCP_PROJECT_ID` or `APP_ENV`). Only auto-verify if running in a UAT project.

**Files**

- `certifai-api/functions/src/endpoints/api/auth/register.ts`

**Testing (Phase 2.2 complete when)**

- [ ] In production env, send `autoVerify: true` in registration body. Confirm the Firebase user's `emailVerified` remains `false`.
- [ ] In UAT env, normal signup still auto-verifies email (`emailVerified: true`). No regression.

---

## Phase 3 — Reliability and Data Consistency

**What**: Eliminate ambiguous partial states and make timeout/retry behaviour deterministic.

**Dependencies**: Phase 1 and Phase 2 merged.

### 3.1 — Firestore account creation failure policy (`certifai-api/functions/src/endpoints/api/auth/register.ts`)

**Problem**
Firestore `createAccount` failure is currently non-blocking: logs a warning but registration returns 200. Users can sign up and receive `api_user_id` in claims but have no Firestore account record. Downstream features (billing, profile, subscriptions) that query Firestore silently fail.

**Target behaviour** (assuming Decision 2 → Option A)
Promote the Firestore write to blocking. If it throws, return 503. The Prisma user row already exists so resubmitting is idempotent (upsert).

**Files**

- `certifai-api/functions/src/endpoints/api/auth/register.ts`

**Testing (Phase 3.1 complete when)**

- [ ] Simulate Firestore unavailability. Registration returns 503. Prisma row exists (verifiable via DB query). No 200 returned.
- [ ] Re-submit same registration after Firestore recovers: upsert succeeds, Firestore record created, user completes signup normally.

---

### 3.2 — Coherent timeout cascade and user-visible retry (`app/signup/page.tsx`, `app/api/auth/register/route.ts`)

**Problem**
The 60s global safety timeout can fire while inner operations (15s register + 20s verification = up to 35s) are still in flight. If it fires mid-registration, the user sees "timed out" but a Firebase account was already created — causing `auth/email-already-in-use` on their next attempt.

**Target behaviour**

- Raise global safety timeout to **90s** (15 + 20 + 20s buffer + margin).
- On registration `AbortError`: show inline error ("backend account setup timed out — please try again"), not just a dismissible toast.
- Skip the verification step on timeout (consistent with Phase 1.2).

**Files**

- `app/signup/page.tsx` — global timeout value; `AbortError` catch messaging
- `app/api/auth/register/route.ts` — backend proxy timeout (consider raising from 12s to 18s)

**Testing (Phase 3.2 complete when)**

- [ ] Simulate a 20-second registration delay. Global 90s timeout does NOT fire prematurely. Registration times out; inline error shown; button re-enabled.
- [ ] User retries with same email → pre-existing Firebase account triggers a "try signing in" suggestion instead of a raw `auth/email-already-in-use` error.

---

### 3.3 — Typed `api_user_id` validation in register proxy (`app/api/auth/register/route.ts`)

**Problem**
`apiUserId = result.api_user_id || result.user_id || result.id` is assigned without schema validation. If the backend returns `{ success: true }` with no id fields, `apiUserId` is `undefined` and claims are set with that value — causing missing or `fb_`-prefixed claim on sign-in.

**Target behaviour**
After extracting the id, assert it is a non-empty string. If not, return the same 503 path used for general backend failures — never set claims with an empty or undefined id.

**Files**

- `app/api/auth/register/route.ts`

**Testing (Phase 3.3 complete when)**

- [ ] Backend returns `{ success: true }` with no id field. Register proxy returns 503. Frontend shows inline error, not verification step.
- [ ] Backend returns `{ api_user_id: "abc-123" }`. Flow proceeds; custom claims include the correct id; user can sign in after verification.

---

## Phase 4 — Abuse Resistance and Observability

**What**: Strengthen rate limiting for multi-instance deployments and add the telemetry needed to detect regressions in the signup→signin loop.

**Dependencies**: Phase 2 merged. Can be developed in parallel with Phase 3.

### 4.1 — Distributed rate limiting (`src/lib/rate-limiting.ts`)

**Problem**
The current `Map`-based limiter resets on every cold start and is bypassed under horizontal scaling (each instance has its own counter → effective limit is `maxAttempts × instance count`).

**Target behaviour**
Replace the `Map` store with a Redis-backed (or equivalent) distributed store so limits are shared across instances and survive restarts. The public interface (`checkRateLimit`, `createRateLimitHeaders`) stays the same.

**Files**

- `src/lib/rate-limiting.ts` — store adapter abstraction

**Testing (Phase 4.1 complete when)**

- [ ] With two instances running concurrently, the REGISTER limit (3/hr) is enforced globally, not per-instance.
- [ ] Server restart does not reset the limit window for an active client.
- [ ] Existing behaviour for LOGIN, PASSWORD_RESET, TOKEN_REFRESH rates is unchanged.

---

### 4.2 — Trusted client IP derivation (`src/lib/rate-limiting.ts`)

**Problem**
`getClientId()` trusts `x-forwarded-for` first (spoofable) and falls back to `'unknown'`. All unidentifiable requests share the same `unknown` bucket, either bypassing limits or incorrectly throttling legitimate users.

**Target behaviour**
Prefer `cf-connecting-ip` (injected by Cloudflare, not spoofable by end-users). Fall back to `x-real-ip` only from a trusted proxy. Log a structured warning when IP is indeterminate. Never allow `unknown` to serve as an effective bypass.

**Files**

- `src/lib/rate-limiting.ts` — `getClientId()`

**Testing (Phase 4.2 complete when)**

- [ ] Request with `cf-connecting-ip: 1.2.3.4` uses `1.2.3.4` as key regardless of `x-forwarded-for`.
- [ ] Request with no IP headers hits the `unknown` bucket and is rate-limited (not bypassed).
- [ ] Spoofed `x-forwarded-for` when `cf-connecting-ip` is present has no effect on rate-limit key.

---

### 4.3 — Structured signup outcome telemetry (`app/signup/page.tsx`)

**Problem**
Without telemetry it is impossible to detect whether the UAT direct-signin shortcut is working reliably or failing silently. Post-Phase-1 fixes need observable signals to verify they hold.

**Target behaviour**
Emit structured events at each major signup outcome:

| Event name                   | When emitted                                   |
| ---------------------------- | ---------------------------------------------- |
| `signup.firebase_created`    | Firebase account created successfully          |
| `signup.backend_registered`  | `/api/auth/register` returned success          |
| `signup.backend_failed`      | `/api/auth/register` returned error or timeout |
| `signup.verification_sent`   | Email verification sent                        |
| `signup.verification_failed` | Email verification failed or timed out         |
| `signup.uat_redirected`      | UAT bypass redirect triggered                  |
| `signup.error`               | Top-level catch block reached                  |

Events must include `{ env: 'uat' | 'production' }` and must **not** include tokens, emails, or passwords.

**Files**

- `app/signup/page.tsx`
- `src/lib/analytics-events.ts` (new) or extend existing analytics utility

**Testing (Phase 4.3 complete when)**

- [ ] UAT happy path: `signup.firebase_created`, `signup.backend_registered`, `signup.uat_redirected` all fire with `env: 'uat'`.
- [ ] Production backend failure (post-Phase-1.2): `signup.backend_failed` fires; `signup.verification_sent` does NOT fire.
- [ ] No event payload contains raw token, email address, or password.

---

## Phase 5 — Documentation and Tester Workflow Alignment

**What**: Update `docs/signup.md` to reflect the final Phase 1–4 behaviour and provide a self-contained tester runbook.

**Dependencies**: All prior phases merged.

### 5.1 — Update `docs/signup.md`

- Reflect new failure/recovery branches for both UAT and production paths.
- Update timeout table with revised values from Phase 3.2.
- Document the server-side `autoVerify` guard (Phase 2.2).
- Remove any remaining references to the old "silent continuation on failure" behaviour.

### 5.2 — Tester runbook addition

Add a dedicated runbook section covering:

- Expected UAT happy path with step-by-step assertions at each stage.
- How to reproduce each error-recovery path using the network tab or mock tools (no code changes required).
- Known propagation delay for `api_user_id` claims and recommended wait window before retrying sign-in.
- Visual indicators for "legitimately in progress" vs "stuck".

**Testing (Phase 5 complete when)**

- [ ] A new engineer can follow the runbook to complete a UAT signup → sign-in end-to-end without additional context.
- [ ] Each failure scenario described in the doc can be reproduced by a tester using the documented method.

---

## Summary and Ordering

```
Phase 1 ──▶ Phase 2 ──▶ Phase 3 ──▶ Phase 5
                │                       ▲
                └──────▶ Phase 4 ───────┘
```

| Phase                    | Priority | Effort      | Risk if skipped                                                      |
| ------------------------ | -------- | ----------- | -------------------------------------------------------------------- |
| **1 — Correctness**      | P0       | Medium      | Users stuck post-signup; UAT completely blocked on backend failure   |
| **2 — Security**         | P0       | Low         | `autoVerify` exploit in production; CSRF gap on register endpoint    |
| **3 — Reliability**      | P1       | Medium      | Partial account states with no recovery; confusing timeout UX        |
| **4 — Abuse resistance** | P2       | Medium–High | Rate limits bypassable at scale; regressions invisible in production |
| **5 — Docs**             | P2       | Low         | Tester confusion; onboarding friction                                |

---

## Affected Files

| File                                                        | Phases             |
| ----------------------------------------------------------- | ------------------ |
| `certifai-app/app/signup/page.tsx`                          | 1.1, 1.2, 3.2, 4.3 |
| `certifai-app/app/api/auth/register/route.ts`               | 2.1, 3.2, 3.3      |
| `certifai-app/app/api/auth/login/route.ts`                  | 1.3 (verify only)  |
| `certifai-app/src/context/FirebaseAuthContext.tsx`          | 1.3                |
| `certifai-app/src/lib/rate-limiting.ts`                     | 4.1, 4.2           |
| `certifai-app/src/config/serverOnlyConfig.ts`               | 2.1 (reuse only)   |
| `certifai-app/src/lib/cookie-options.ts`                    | 2.1 (reuse only)   |
| `certifai-api/functions/src/endpoints/api/auth/register.ts` | 2.2, 3.1           |
| `certifai-app/docs/signup.md`                               | 5.1, 5.2           |
