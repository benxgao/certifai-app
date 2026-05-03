# Phase 5c — Frontend Type Sync

**TL;DR**: The API's Phase 5c changes introduced contract drift in 5 areas: a critical enum mismatch, wrong field names in `UserRegisteredCertification`, wrong mutation response types for both register and delete, and missing knowledge pooling client support (hooks + proxy route + accurate request/response types).

---

## 📊 Overall Progress

| Phase | Title                                        | Status         |
| ----- | -------------------------------------------- | -------------- |
| A     | Fix `CertificationStatus` Enum               | ⬜ Not Started |
| B     | Fix `UserRegisteredCertification` Field Name | ⬜ Not Started |
| C     | Fix Mutation Response Types                  | ⬜ Not Started |
| D     | Add Knowledge Pooling Client Support         | ⬜ Not Started |

**Current Phase → Phase A**

---

## 🔑 Key Facts (read before starting)

- All types: `src/types/swr-data/certifications.ts`
- All hooks: `src/swr/certifications.ts`
- DELETE proxy at `app/api/users/[api_user_id]/certifications/route.ts` correctly converts `?cert_id=` to path param before calling the backend — **no change needed there**
- Correct Prisma enum (source of truth): `PASSED`, `IN_PROGRESS`, `INTERESTED`, `DELETING`, `NOT_STARTED`, `EXPIRED`, `SUSPENDED`
- `CertificationStatus.ACTIVE` in dashboard → should be `IN_PROGRESS`; `.COMPLETED` → `PASSED`
- `CertSummaryData.already_existed` — leave as-is
- Knowledge pooling endpoints in API are live at: `GET/POST /api/users/:user_id/certifications/:cert_id/knowledge-pooling`
- Knowledge pooling `POST` requires body `exam_id: string`; `forceGenerate?: boolean` is optional (defaults true in API)
- Knowledge pooling success payload includes top-level `generated: boolean` and `metadata` in addition to `data`
- Current app does **not** have `app/api/users/[api_user_id]/certifications/[cert_id]/knowledge-pooling/route.ts` proxy yet

---

## Phase A — Fix `CertificationStatus` Enum

> **Scope**: 3 files. Self-contained. Dashboard cert count will be wrong at runtime until this is done.

### Tasks

- [ ] **A1** — Fix enum in `src/types/swr-data/certifications.ts`
  - Replace values `ACTIVE`, `INACTIVE`, `PENDING`, `COMPLETED`
  - New values: `PASSED`, `IN_PROGRESS`, `INTERESTED`, `DELETING`, `NOT_STARTED`, `EXPIRED`, `SUSPENDED`

- [ ] **A2** — Update `src/components/custom/DashboardStats.tsx`
  - `CertificationStatus.ACTIVE` → `CertificationStatus.IN_PROGRESS`

- [ ] **A3** — Update `src/components/custom/EnhancedWelcomeSection.tsx`
  - `CertificationStatus.ACTIVE` → `CertificationStatus.IN_PROGRESS`
  - `CertificationStatus.COMPLETED` → `CertificationStatus.PASSED`

- [ ] **A4** — Scan for any other consumers
  ```bash
  grep -r "CertificationStatus\." src app --include="*.ts" --include="*.tsx"
  ```

### Build & Test Checklist

- [ ] `npx tsc --noEmit 2>&1 | grep "^(app|src)/"` → 0 errors
- [ ] `npm run dev` — open Dashboard, verify "In Progress" cert count shows correctly
- [ ] Certification list page renders without errors

### Commit

```
fix(types): align CertificationStatus enum with Prisma schema values
```

---

## Phase B — Fix `UserRegisteredCertification` Field Name

> **Scope**: 1 type file. Very low risk — grep confirmed no consumer uses `api_user_id` today.

### Tasks

- [ ] **B1** — In `src/types/swr-data/certifications.ts`, rename field in `UserRegisteredCertification`:
  - `api_user_id: string` → `user_id: string`
  - Remove the `@deprecated` comment for `user_id` that was there before

- [ ] **B2** — Verify no consumer breaks:
  ```bash
  grep -r "api_user_id" src app --include="*.ts" --include="*.tsx"
  ```
  Expected: 0 results

### Build & Test Checklist

- [ ] `npx tsc --noEmit 2>&1 | grep "^(app|src)/"` → 0 errors
- [ ] `npm run dev` — open certifications page, list loads without errors

### Commit

```
fix(types): rename api_user_id to user_id in UserRegisteredCertification
```

---

## Phase C — Fix Mutation Response Types

> **Scope**: 1 types file + 1 hooks file. Register and delete flows are affected. Test both after.

### Tasks

- [ ] **C1** — Add `UserCertificationData` type to `src/types/swr-data/certifications.ts` (register response — what API returns inside `data`):

  ```typescript
  export interface UserCertificationData {
    user_id: string;
    cert_id: number;
    status: CertificationStatus;
    assigned_at: string; // ISO string (Prisma DateTime serializes as string)
    updated_at: string;
  }
  ```

- [ ] **C2** — Add `CertificationDeletionData` type to `src/types/swr-data/certifications.ts` (delete response — what API returns inside `data`):

  ```typescript
  export interface DeletionSummary {
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
  }
  export interface CertificationDeletionData {
    cert_id: number;
    user_id: string;
    certification_name: string;
    firm_name: string;
    certification_status: CertificationStatus;
    deletion_summary: DeletionSummary;
    rtdb_cleanup: {
      exam_plans_deleted: number;
      exam_data_deleted: number;
      total_exams_processed: number;
    };
    validation: { completely_deleted: boolean; remaining_data_check: Record<string, number> };
    timing: { total_duration_ms: number; database_transaction_ms: number; rtdb_cleanup_ms: number };
  }
  ```

- [ ] **C3** — Keep `CertificationMutationResponse` as a **deprecated alias** pointing to `UserCertificationData` for backward compat:

  ```typescript
  /** @deprecated Use UserCertificationData instead */
  export type CertificationMutationResponse = UserCertificationData;
  ```

- [ ] **C4** — Update `registerUserForCertificationFetcher` in `src/swr/certifications.ts`:
  - Return type: `Promise<UserCertificationData>`
  - The API responds `{ success, data: UserCertification, performance }` so `result.data` is correct

- [ ] **C5** — Update `unregisterCertificationFetcher` in `src/swr/certifications.ts`:
  - Return type: `Promise<CertificationDeletionData>`
  - The API responds `{ success, message, data: {...} }` so `result.data` is correct

- [ ] **C6** — Add explicit generic types to `useSWRMutation` calls:
  - `useRegisterUserForCertification`:
    ```typescript
    useSWRMutation<
      UserCertificationData,
      Error,
      string | null,
      { apiUserId: string; certificationId: number; refreshToken: () => Promise<string | null> }
    >;
    ```
  - `useUnregisterCertification`:
    ```typescript
    useSWRMutation<
      CertificationDeletionData,
      Error,
      string | null,
      { apiUserId: string; certificationId: number; refreshToken: () => Promise<string | null> }
    >;
    ```

### Build & Test Checklist

- [ ] `npx tsc --noEmit 2>&1 | grep "^(app|src)/"` → 0 errors
- [ ] `npm run dev` — register for a certification and confirm no console errors
- [ ] Delete a certification and confirm no console errors (deletion summary logged)

### Commit

```
fix(types): replace CertificationMutationResponse with accurate register/delete types
```

---

## Phase D — Add Knowledge Pooling Client Support

> **Scope**: 1 types file + 1 hooks file + 1 app API proxy route. **New feature** — no existing consumers to break.

### Pre-work (do before coding)

- [x] **D0** — Read `certifai-api/functions/src/endpoints/api/users/certifications/generateKnowledgePooling.ts` to confirm POST response shape
  - Confirmed: request body requires `exam_id`; response includes `{ success, data, message, generated, metadata }`

### Tasks

- [ ] **D1** — Add knowledge pooling types to `src/types/swr-data/certifications.ts`:

  ```typescript
  export interface KnowledgeInsight {
    insight_id: string;
    exam_id: string;
    topic: string;
    insight: string;
    generated_at: string;
  }
  export interface KnowledgePoolingStats {
    total_insights: number;
    unique_exams: number;
    unique_topics: number;
  }
  export interface KnowledgePoolingData {
    cert_id: number;
    user_id: string;
    knowledge_insights: KnowledgeInsight[];
    certification_name: string;
    last_updated: string;
    stats: KnowledgePoolingStats;
  }
  export interface KnowledgePoolingGenerateMetadata {
    exam_id_used: string;
    force_regenerate: boolean;
    processing_time_ms: number;
    analysis_needed: boolean;
    timestamp: string;
  }
  export interface KnowledgePoolingGenerateData {
    success: boolean;
    data: KnowledgePoolingData;
    message: string;
    generated: boolean;
    metadata: KnowledgePoolingGenerateMetadata;
  }
  ```

- [ ] **D2** — Add `useGetKnowledgePooling(apiUserId, certId)` hook to `src/swr/certifications.ts`:
  - Uses `useAuthSWR<ApiResponse<KnowledgePoolingData>, Error>`
  - Key: `/api/users/${apiUserId}/certifications/${certId}/knowledge-pooling`
  - Returns `{ knowledgePooling, isLoading, error, mutate }`

- [ ] **D3** — Add `useGenerateKnowledgePooling(apiUserId)` hook to `src/swr/certifications.ts`:
  - Uses `useSWRMutation<KnowledgePoolingGenerateData, Error, string | null, { apiUserId: string; certId: number; examId: string; forceGenerate?: boolean; refreshToken: () => Promise<string | null> }>`
  - Key: `GENERATE_KNOWLEDGE_POOLING_${apiUserId}`
  - POST to `/api/users/${apiUserId}/certifications/${certId}/knowledge-pooling` with body `{ exam_id: examId, forceGenerate }`

- [ ] **D4** — Add proxy route in app: `app/api/users/[api_user_id]/certifications/[cert_id]/knowledge-pooling/route.ts`
  - Implement `GET` and `POST`
  - Forward Firebase bearer token
  - Follow existing user-route pattern (including Firebase UID → API user ID conversion safeguard)

### Build & Test Checklist

- [ ] `npx tsc --noEmit 2>&1 | grep "^(app|src)/"` → 0 errors
- [ ] Hooks are importable — add a temporary import in any component to confirm no module errors, then remove
- [ ] Proxy route compiles and returns backend payload for both GET and POST
- [ ] (No UI to test yet — hooks are ready for future feature components)

### Commit

```
feat(swr): add useGetKnowledgePooling and useGenerateKnowledgePooling hooks
```

---

## 📝 Open Questions

1. **Legacy `useRegisterCertification` hook** — calls `/api/public/certifications`, different from `useRegisterUserForCertification` which calls `/api/users/:id/certifications`. Is the public one still needed or a legacy artifact? Clarify before removing.

2. **Knowledge Pooling toast/notification** — Should `useGenerateKnowledgePooling` fire a success toast when generation completes, matching the pattern used in `useCreateExam`? Recommend yes.

---

## 🔑 Architecture Decisions

| Decision                                                  | Rationale                                                                                          |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `CertificationStatus.ACTIVE` → `IN_PROGRESS` in dashboard | "Active" certifications are those being studied, which matches `IN_PROGRESS` in Prisma             |
| `CertificationStatus.COMPLETED` → `PASSED`                | Exam passed = certification completed; `PASSED` is the terminal success state                      |
| DELETE proxy URL unchanged                                | `route.ts` proxy converts `?cert_id=` to path param before calling backend — no hook change needed |
| `CertificationMutationResponse` kept as deprecated alias  | Avoid breaking any consumers not yet found; remove in Phase 5d follow-up                           |
| Knowledge Pooling hooks in `certifications.ts`            | Feature cohesion — not a new file                                                                  |
| `CertSummaryData.already_existed` left as-is              | Present on POST response, absent on GET — doesn't break anything                                   |
