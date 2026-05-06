# Phase 5a: User Endpoints Contract Alignment Plan

**Backend Commit Reviewed**: `9a571f7a2b84c5faaaa18d3e1d395dd2ebadb5b6`
**Date**: May 4, 2026
**Status**: Reviewed — **No blocker-level frontend break detected**

---

## 🎯 Objective

Validate whether Phase 5a API user-endpoint type-enforcement changes require critical updates in `certifai-app`.

---

## 🔍 What Changed in API (Phase 5a)

Changed files in API:

- `functions/src/endpoints/api/users/deleteUser.ts`
- `functions/src/endpoints/api/users/ensure-account.ts`
- `functions/src/endpoints/api/users/getRateLimit.ts`
- `functions/src/endpoints/api/users/getUserProfile.ts`
- `functions/src/types/api/users.ts`

Primary changes were handler typing hardening (`AuthenticatedRequestHandler`, removal of `any`, safer logger payload typing) plus minor response-shape clarifications.

---

## 📊 Frontend Impact Assessment

### ✅ No Critical/Blocking Drift Found

1. **`GET /api/users/:user_id/profile`**
   - API now normalizes date fields to ISO strings and includes deprecated `user_id` for compatibility.
   - API currently coalesces `firebase_user_id` to empty string (`''`) instead of nullable in response payload.
   - Frontend `UserProfileData` already tolerates this (`string | null` + optional `user_id`) and remains runtime-safe.

2. **`DELETE /api/users/:user_id`**
   - API response is typed more explicitly and includes rich deletion metadata.
   - Frontend delete-account types are a subset of returned payload, so existing behavior remains compatible.

3. **`POST /api/users/ensure-account`**
   - Typing tightened in API; frontend route usage checks HTTP success and does not depend on strict body shape.

4. **`GET /api/users/:user_id/rate-limit`**
   - API handler now typed to `ExamRateLimitInfo` (fields like `isAllowed`, `resetTimeMs`).
   - Frontend already has normalization/fallback logic for rate-limit data, so no immediate break observed.

---

## ⚠️ Recommended (Non-Critical) Follow-ups

### Phase 5a.1 — Profile Contract Tightening (Low)

- Consider narrowing `src/types/swr-data/profile.ts` field:
  - `firebase_user_id: string | null` → `firebase_user_id: string`
- Keep deprecated `user_id?: string` until backend removes it and all consumers migrate.

### Phase 5a.2 — Rate Limit Shape Guardrails (Medium)

- In `src/lib/rateLimitUtils.ts`, ensure normalization supports both payload styles:
  - legacy: `canCreateExam`, `resetTime`
  - typed service shape: `isAllowed`, `resetTimeMs`
- Add/verify unit coverage for both shapes.

### Phase 5a.3 — Delete Account Type Completeness (Low)

- Optionally expand `src/types/swr-data/deleteAccount.ts` to include richer API metadata for better observability/debugging.

---

## ✅ Immediate Action Decision

**Critical change needed now?** **No.**
Phase 5a backend commit is primarily type-safety hardening and is app-compatible as-is.

---

## 🧪 Verification Checklist (When Implementing Follow-ups)

- [ ] `npx tsc --noEmit 2>&1 | grep "^(app|src)/"` returns no errors
- [ ] Profile page renders with no `firebase_user_id` regressions
- [ ] Rate-limit UI works for both `canCreateExam` and `isAllowed` shaped payloads
- [ ] Delete-account flow still succeeds and toast behavior remains unchanged

---

## 🔗 References

- API commit: `9a571f7a2b84c5faaaa18d3e1d395dd2ebadb5b6`
- API files:
  - `certifai-api/functions/src/endpoints/api/users/getUserProfile.ts`
  - `certifai-api/functions/src/endpoints/api/users/getRateLimit.ts`
  - `certifai-api/functions/src/endpoints/api/users/deleteUser.ts`
  - `certifai-api/functions/src/endpoints/api/users/ensure-account.ts`
  - `certifai-api/functions/src/types/api/users.ts`
- App files reviewed:
  - `src/types/swr-data/profile.ts`
  - `src/types/swr-data/rateLimitInfo.ts`
  - `src/types/swr-data/deleteAccount.ts`
  - `src/swr/profile.ts`
  - `app/api/stripe/account/route.ts`
  - `src/lib/rateLimitUtils.ts`
