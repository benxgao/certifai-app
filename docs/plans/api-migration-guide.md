# API Type Contracts Migration Guide

**Created**: May 5, 2026 (Phase 6b)
**Source**: certifai-api TypeScript type enforcement Phases 5a–5d
**Purpose**: Reference for frontend developers consuming certifai-api endpoints

---

## Overview

This document consolidates the confirmed API response contracts discovered and formalized during the backend type enforcement project (Phases 5a–5d). Use it as a reference when:

- Building new SWR hooks for certifai-api endpoints
- Debugging type mismatches between frontend and backend
- Updating existing hooks after backend changes

For the implementation tracker, see [type-enforce.md](./type-enforce.md).
For per-phase details, see the `api-types-phase-5*.md` / `api-tpyes-phase-5*.md` files.

---

## Key Principles (Learned from Enforcement)

### 1. Always use `ApiResponse<T>` wrapper

All certifai-api endpoints return:

```typescript
{ success: boolean, data: T, meta?: PaginationMeta }
```

Import from `@/src/types/api`:

```typescript
import type { ApiResponse, PaginatedApiResponse } from '@/src/types/api';
```

### 2. DateTimes are always ISO 8601 strings

Prisma `DateTime` fields serialize as ISO strings in JSON:

```typescript
submitted_at: string | null; // ✅ "2026-01-15T10:30:00Z"
submitted_at: number | null; // ❌ Not a Unix timestamp
```

### 3. Pagination uses `meta`, not `pagination`

```typescript
// ✅ Correct
const meta = data?.meta as PaginationMeta | undefined;

// ❌ Wrong
const pagination = data?.pagination;
```

---

## Auth Endpoints

### `POST /api/auth/login`

### `POST /api/auth/register`

```typescript
interface AuthResponse {
  success: true;
  api_user_id: string; // Primary — use this in all subsequent API calls
  firebase_user_id: string; // Firebase UID
  user_id: string; // @deprecated — alias for api_user_id
}
```

**Usage in frontend**: `src/lib/auth-setup.ts` reads `api_user_id`.

---

## User Endpoints

### `GET /api/users/:userId/profile`

```typescript
interface UserProfileData {
  user_id: string; // @deprecated — use api_user_id
  api_user_id: string;
  firebase_user_id: string | null;
  email: string;
  display_name: string | null;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

Source: `certifai-api/functions/src/endpoints/api/users/getUserProfile.ts`

### `GET /api/users/:userId/rate-limit`

```typescript
interface ExamRateLimitInfo {
  exams_taken_today: number;
  daily_limit: number;
  can_take_exam: boolean;
  next_reset_time: string | null; // ISO 8601
}
```

---

## Exam Endpoints

### `POST /api/users/:userId/certifications/:certId/exams` (Create Exam)

```typescript
interface CreateExamResponse {
  exam_id: string;
  status: string; // ExamStatus enum value
  cert_id: number;
  created_at: string;
}
```

### `GET /api/users/:userId/exams` (List Exams)

```typescript
// PaginatedApiResponse<ExamListItemData[]>
interface ExamListItemData {
  exam_id: string;
  cert_id: number;
  status: string; // ExamStatus enum value
  score: number | null;
  submitted_at: string | null; // ISO 8601
  created_at: string; // ISO 8601
  total_questions: number;
  answered_questions: number;
}
```

### `GET /api/users/:userId/exams/:examId` (Exam Detail)

```typescript
interface ExamDetailData {
  exam_id: string;
  cert_id: number;
  status: string;
  score: number | null;
  submitted_at: string | null;
  created_at: string;
  progress: {
    total_questions: number;
    answered_questions: number;
    completion_percentage: number;
  };
  generation_progress?: {
    status: string;
    progress_percentage: number;
    message?: string;
  };
  certification: {
    cert_id: number;
    name: string;
    provider?: string;
  };
  answers: ExamAnswerWithQuestion[];
}

interface ExamAnswerWithQuestion {
  answer_id: string;
  question_id: string;
  selected_option_id: string | null;
  is_correct: boolean | null;
  answered_at: string | null;
  question: {
    question_text: string;
    exam_topic: string;
    difficulty: string;
    options: { option_id: string; option_text: string }[];
    correct_option_id?: string; // Only present after exam submission
  };
}
```

### `GET /api/users/:userId/exams/:examId/questions` (Exam Questions)

```typescript
// ApiResponse<ExamQuestionsData> with pagination in meta
interface ExamQuestionsData {
  questions: QuestionData[];
  total_questions: number;
  answered_questions: number;
}

interface QuestionData {
  question_id: string;
  question_text: string;
  exam_topic: string;
  difficulty: string;
  options: { option_id: string; option_text: string }[];
  user_answer?: {
    selected_option_id: string;
    is_correct: boolean | null;
  };
}
```

**Note**: Pagination is in `data.meta`, NOT in `data.data`.

### `GET /api/users/:userId/exams/:examId/live-status`

```typescript
interface ExamLiveStatusData {
  exam_id: string;
  status: string;
  generation_progress?: {
    status: string;
    progress_percentage: number;
    message?: string;
  };
  is_ready: boolean;
}
```

---

## Certification Endpoints

### `POST /api/users/:userId/certifications` (Register)

```typescript
// Request body uses cert_id (NOT a path param)
interface RegisterCertificationRequest {
  cert_id: number;
}

// Response
interface RegisterCertificationResponse {
  success: true;
  data: UserCertification;
  performance?: object;
}
```

### `GET /api/users/:userId/certifications` (List)

```typescript
// PaginatedApiResponse<UserRegisteredCertification[]>
// Frontend type: src/types/swr-data/certifications.ts → UserRegisteredCertification
interface UserRegisteredCertification {
  user_id: string;    // Internal Prisma UUID (NOT Firebase UID)
  cert_id: number;
  status: CertificationStatus; // PASSED | IN_PROGRESS | INTERESTED | DELETING | NOT_STARTED | EXPIRED | SUSPENDED
  assigned_at: string; // ISO 8601
  updated_at: string;  // ISO 8601
  certification: {
    cert_id: number;
    name: string;
    exam_guide_url?: string;
    min_quiz_counts: number;
    max_quiz_counts: number;
    pass_score: number;
  };
}
```

**Note**: Pagination metadata uses `currentPage`/`pageSize`/`totalItems` — NOT `page`/`pageSize`/`total`.
**Note**: `assigned_at` is the registration timestamp (Prisma field name), NOT `registered_at`.
**Note**: `certification` does NOT include `firm` — only direct scalar fields of the `Certification` model.

### `DELETE /api/users/:userId/certifications/:certId`

```typescript
// Frontend type: src/types/swr-data/certifications.ts → CertificationDeletionData
// Note: Frontend proxy at app/api/users/[api_user_id]/certifications/route.ts
//       converts ?cert_id= query param to /:cert_id path param before forwarding to backend
interface CertificationDeletionData {
  cert_id: number;
  user_id: string;
  certification_name: string;
  firm_name: string;
  certification_status: CertificationStatus;
  deletion_summary: {
    exams_deleted: number;
    exams_expected: number;
    exam_ids_deleted: string[];
    exam_user_answers_deleted: number;
    exam_user_answers_expected: number;
    answer_options_deleted: number;
    answer_options_expected: number;
    quiz_questions_deleted: number;
    quiz_questions_expected: number;
    quiz_question_ids_deleted: string[];
  };
  rtdb_cleanup: {
    exam_plans_deleted: number;
    exam_data_deleted: number;
    total_exams_processed: number;
  };
  validation: {
    completely_deleted: boolean;
    remaining_data_check: Record<string, number>;
  };
  timing: {
    total_duration_ms: number;
    database_transaction_ms: number;
    rtdb_cleanup_ms: number;
  };
}
```

### `GET /api/users/:userId/certifications/:certId/knowledge-pooling`

```typescript
// Frontend type: src/types/swr-data/certifications.ts → KnowledgePoolingData
// Hook: src/swr/certifications.ts → useGetKnowledgePooling / useGenerateKnowledgePooling
interface KnowledgePoolingData {
  cert_id: number;
  user_id: string;
  knowledge_insights: KnowledgeInsight[];
  certification_name: string;
  last_updated: string;
  stats: {
    total_insights: number;
    unique_exams: number;
    unique_topics: number;
  };
}
// POST response also includes top-level: generated: boolean, message: string, metadata: object
```

### `GET /api/users/:userId/certifications/:certId/cert-summary`

```typescript
// Frontend type: src/types/swr-data/certSummary.ts → CertSummaryData
// Hook: src/swr/certSummary.ts → useCertSummary / useGenerateCertSummary
interface CertSummaryData {
  cert_id: string;
  user_id: string;
  summary: string;
  structured_data: CertSummaryStructuredData; // see certSummary.ts for full shape
  already_existed: boolean;                   // only on POST response
  generated_at: string;
  summary_stats: CertSummarySummaryStats;
}
```

---

## Stripe Endpoints

### `GET /stripe/account`

```typescript
// Consumed via useUnifiedAccountData() hook
// See src/stripe/client/hooks/useUnifiedAccountData.ts for full interface
interface UnifiedAccountData {
  api_user_id: string;
  firebase_user_id: string;
  email: string;
  has_stripe_customer: boolean;
  has_subscription: boolean;
  subscription_status?: string;
  stripe_plan_id?: string;
  stripe_plan_name?: string;
  stripe_amount?: number;
  stripe_currency?: string;
  stripe_current_period_start?: number; // Unix timestamp
  stripe_current_period_end?: number; // Unix timestamp
  stripe_trial_end?: number;
  stripe_cancel_at_period_end?: boolean;
  is_active_subscription: boolean;
  is_trial: boolean;
  is_canceled: boolean;
  created_at: string;
  updated_at: string;
}
```

### `DELETE /stripe/subscriptions` (cancel)

```typescript
{
  success: true;
  data: {
    subscription_id: string;
    status: string;
    cancel_at_period_end: boolean;
    current_period_end: number; // Unix timestamp (from Stripe v18 item-level field)
  }
}
```

---

## Phase-by-Phase Breaking Change Log

| Phase | Endpoints               | Frontend Impact | Details                                              |
| ----- | ----------------------- | --------------- | ---------------------------------------------------- |
| 5a    | User endpoints          | Additive        | `user_id` deprecated in favor of `api_user_id`       |
| 5b    | Exam endpoints          | Contract drift  | See [api-types-phase-5b.md](./api-types-phase-5b.md) |
| 5c    | Certification endpoints | Contract drift  | See [api-tpyes-phase-5c.md](./api-tpyes-phase-5c.md) |
| 5d    | Admin/AI/Auth/Stripe    | None            | See [api-tpyes-phase-5d.md](./api-tpyes-phase-5d.md) |

---

## Frontend Implementation Status

| Endpoint Category | Type Status | Hooks Updated               | Components Updated          |
| ----------------- | ----------- | --------------------------- | --------------------------- |
| Auth endpoints    | ✅ Typed    | ✅ No change needed         | ✅ No change needed         |
| User profile      | ✅ Typed    | Phase 5a complete           | Phase 5a complete           |
| Exam list/detail  | ✅ Typed    | Phase 5b.2/5b.3 ✅          | Phase 5b.4 ✅               |
| Exam questions    | ✅ Typed    | Phase 5b.2 ✅               | Phase 5b.4 ✅               |
| Certifications    | ✅ Typed    | Phase 5c complete ✅         | Phase 5c complete ✅         |
| Stripe            | ✅ Typed    | No change needed            | No change needed            |

See [type-enforce.md](./type-enforce.md) for implementation checklist.
