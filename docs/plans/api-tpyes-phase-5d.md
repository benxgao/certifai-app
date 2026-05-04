# Phase 5d: Other Endpoints & Special Cases — API Type Contracts

**Completed**: May 5, 2026
**Backend Commit**: (Phase 5d commit — see certifai-api type-enforcement.md)
**Status**: ✅ Documentation Complete (Phase 6b)

---

## Overview

Phase 5d typed the remaining endpoint categories not covered by Phases 5a–5c:

| Category              | Files   | Frontend Impact                                   |
| --------------------- | ------- | ------------------------------------------------- |
| Admin (`/api/admin/`) | 5 files | ⚪ None (internal/admin-only)                     |
| AI (`/api/ai/`)       | 5 files | ⚪ None (server-side delegated calls only)        |
| Auth (`/api/auth/`)   | 4 files | 🟡 Additive only — `api_user_id` already consumed |
| Stripe (`/stripe/`)   | 5 files | 🟡 Internal fix — no API response shape change    |
| Cloud Task Delegators | 4 files | ⚪ None (server-to-server only)                   |

**Breaking Changes for Frontend**: **Zero** — all Phase 5d changes are internal type enforcement or additive.

---

## Auth Endpoints (`/api/auth/`)

### `POST /api/auth/login` & `POST /api/auth/register`

**Response Shape** (confirmed in Phase 5d):

```typescript
{
  success: true,
  api_user_id: string,         // Primary — Our internal UUID for API operations
  firebase_user_id: string,    // Firebase UID for reference
  user_id: string,             // @deprecated — alias for api_user_id, kept for backward compat
}
```

**Frontend Status**: ✅ No change required

- `src/lib/auth-setup.ts` already reads `api_user_id` (line 123)
- `user_id` is a backward-compat alias — frontend does not depend on it

### `POST /api/auth/generate-token`

**Response Shape** (confirmed):

```typescript
{
  success: true,
  data: {
    token: string,             // Signed JWT service token
    expires_in: number,        // Seconds until expiry
  }
}
```

**Frontend Status**: ✅ Internal/server-side only — called from `src/lib/jwt-utils.ts` using `generateTokenUrl`

### `GET /api/auth/generate-service-token`

**Response Shape** (confirmed):

```typescript
{
  success: true,
  data: {
    token: string,
    service: string,
    expires_in: number,
  }
}
```

**Frontend Status**: ✅ Server-side only — see `src/lib/jwt-utils.ts`

---

## Stripe Endpoints (`/stripe/`)

### Stripe v18 Breaking Change Fix (Internal)

**Change**: Stripe v18 moved `current_period_start` / `current_period_end` from the root `Stripe.Subscription` object to `subscription.items.data[0]`.

**Fix applied**: `getSubscriptionPeriod()` helper introduced in `subscriptions.ts`:

```typescript
function getSubscriptionPeriod(sub: Stripe.Subscription): { start: number; end: number } {
  const item = sub.items?.data?.[0];
  return {
    start: item?.current_period_start ?? 0,
    end: item?.current_period_end ?? 0,
  };
}
```

**Frontend Impact**: ✅ **None** — API response shape is **unchanged**. The fix only affects how the backend reads from Stripe's SDK internally.

### `GET /stripe/subscriptions/status`

**Response Shape** (confirmed):

```typescript
// No active subscription
{ success: true, data: null, message: 'No subscription found' }

// Active subscription
{
  success: true,
  data: {
    /* SubscriptionData shape via StripeFirestoreService.convertToSubscriptionData() */
    /* Fields mirror UnifiedAccountData.stripe_* fields */
  }
}
```

**Frontend Status**: ✅ Already consumed via `useUnifiedAccountData()` / `useAccountStatus()` — no changes needed

### `DELETE /stripe/subscriptions` (cancel)

**Response Shape** (confirmed):

```typescript
{
  success: true,
  data: {
    subscription_id: string,
    status: string,                // Stripe subscription status
    cancel_at_period_end: boolean,
    current_period_end: number,    // Unix timestamp — correctly read via getSubscriptionPeriod()
  }
}
```

**Frontend Status**: ✅ Consumed by `useCancelSubscription()` in `src/stripe/client/swr.ts`

### `PUT /stripe/subscriptions` (resume)

**Response Shape** (confirmed):

```typescript
{
  success: true,
  data: {
    subscription_id: string,
    status: string,
    cancel_at_period_end: boolean,
  }
}
```

**Frontend Status**: ✅ Consumed by `useResumeSubscription()` in `src/stripe/client/swr.ts`

---

## Admin Endpoints (`/api/admin/`)

All admin endpoints are **internal/admin-only**. They are not called from the frontend application.

| Endpoint                                         | Description                          | Frontend |
| ------------------------------------------------ | ------------------------------------ | -------- |
| `GET /api/admin/exam-generation/health`          | Exam generation system health check  | ⚪ None  |
| `GET /api/admin/exam-generation/metrics`         | Generation performance metrics       | ⚪ None  |
| `POST /api/admin/exam-generation/force-complete` | Force-complete stuck exam            | ⚪ None  |
| `GET /api/admin/exam-generation/stuck-exams`     | List stuck exam generations          | ⚪ None  |
| `POST /api/admin/exams/auto-fail-stuck`          | Auto-fail stuck exams via Cloud Task | ⚪ None  |

**Frontend Impact**: Zero

---

## AI Endpoints (`/api/ai/`)

All AI endpoints are called **server-side** (e.g., from Cloud Task delegators or internal service flows) and not directly from the browser frontend.

| Endpoint                                   | Description                      | Frontend            |
| ------------------------------------------ | -------------------------------- | ------------------- |
| `POST /api/ai/cert-summary-generator`      | Generate certification summary   | ⚪ Server-side only |
| `POST /api/ai/exam-planner`                | Generate exam question plan      | ⚪ Server-side only |
| `POST /api/ai/exam-report-generator`       | Generate exam performance report | ⚪ Server-side only |
| `POST /api/ai/knowledge-pooling-generator` | Generate knowledge pooling data  | ⚪ Server-side only |
| `POST /api/ai/quiz-generator`              | Generate quiz questions          | ⚪ Server-side only |

**Frontend Impact**: Zero — these endpoints are consumed via Stripe webhooks, Cloud Task callbacks, and internal delegators.

---

## Cloud Task Delegators

The buildExam pipeline delegators (`knowledgePooling`, `examReport`, `buildExam`) were typed as part of Phase 5d:

- `ExamTopicItem[]` now used throughout `buildExam/` instead of `any[]`
- `QuizItem[]` used for generated question arrays
- `ExamAttempt` used for exam state validation
- `ExamPlan | null` used for RTDB plan data

**Frontend Impact**: Zero — Cloud Task handlers are server-to-server only.

---

## Summary: No Frontend Changes Required

All Phase 5d typing changes are **internal type enforcement** with **zero impact** on frontend API consumers:

1. ✅ Auth endpoints: Already aligned — frontend uses `api_user_id` correctly
2. ✅ Stripe endpoints: API response shapes unchanged — only internal Stripe v18 SDK read fix
3. ✅ Admin endpoints: Not consumed by frontend
4. ✅ AI endpoints: Not consumed directly by frontend
5. ✅ Cloud Task delegators: Not exposed as frontend API

**Frontend action required**: None for Phase 5d.
