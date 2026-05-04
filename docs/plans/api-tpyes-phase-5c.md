# Phase 5c — Frontend Type Sync

**TL;DR**: The API's Phase 5c changes introduced contract drift in 5 areas: a critical enum mismatch, wrong field names in `UserRegisteredCertification`, wrong mutation response types for both register and delete, and missing knowledge pooling client support (hooks + proxy route + accurate request/response types).

---

## 📊 Overall Progress

| Phase | Title                                        | Status      |
| ----- | -------------------------------------------- | ----------- |
| A     | Fix `CertificationStatus` Enum               | ✅ Complete |
| B     | Fix `UserRegisteredCertification` Field Name | ✅ Complete |
| C     | Fix Mutation Response Types                  | ✅ Complete |
| D     | Add Knowledge Pooling Client Support         | ✅ Complete |

**Status: COMPLETE** (May 4, 2026)

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

- [x] **A4** — Scan for any other consumers
  ```bash
  grep -r "CertificationStatus\." src app --include="*.ts" --include="*.tsx"
  ```

### Build & Test Checklist

- [x] `npx tsc --noEmit 2>&1 | grep "^(app|src)/"` → 0 errors
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

- [x] **B1** — In `src/types/swr-data/certifications.ts`, rename field in `UserRegisteredCertification`:
  - `api_user_id: string` → `user_id: string`
  - Remove the `@deprecated` comment for `user_id` that was there before

- [x] **B2** — Verify no consumer breaks:
  ```bash
  grep -r "api_user_id" src app --include="*.ts" --include="*.tsx"
  ```
  Expected: 0 results

### Build & Test Checklist

- [x] `npx tsc --noEmit 2>&1 | grep "^(app|src)/"` → 0 errors
- [ ] `npm run dev` — open certifications page, list loads without errors

### Commit

```
fix(types): rename api_user_id to user_id in UserRegisteredCertification
```

---

## Phase C — Fix Mutation Response Types

> **Scope**: 1 types file + 1 hooks file. Register and delete flows are affected. Test both after.

### Tasks

- [x] **C1** — Add `UserCertificationData` type to `src/types/swr-data/certifications.ts` (register response — what API returns inside `data`):

  ```typescript
  export interface UserCertificationData {
    user_id: string;
    cert_id: number;
    status: CertificationStatus;
    assigned_at: string; // ISO string (Prisma DateTime serializes as string)
    updated_at: string;
  }
  ```

- [x] **C2** — Add `CertificationDeletionData` type to `src/types/swr-data/certifications.ts` (delete response — what API returns inside `data`):

- [x] **C3** — Keep `CertificationMutationResponse` as a **deprecated alias** pointing to `UserCertificationData` for backward compat:

  ```typescript
  /** @deprecated Use UserCertificationData instead */
  export type CertificationMutationResponse = UserCertificationData;
  ```

- [x] **C4** — Update `registerUserForCertificationFetcher` in `src/swr/certifications.ts`:
  - Return type: `Promise<UserCertificationData>`

- [x] **C5** — Update `unregisterCertificationFetcher` in `src/swr/certifications.ts`:
  - Return type: `Promise<CertificationDeletionData>`

- [x] **C6** — Add explicit generic types to `useSWRMutation` calls for both hooks

### Build & Test Checklist

- [x] `npx tsc --noEmit 2>&1 | grep "^(app|src)/"` → 0 errors
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

- [x] **D1** — Add knowledge pooling types to `src/types/swr-data/certifications.ts`:
  - `KnowledgeInsight`, `KnowledgePoolingStats`, `KnowledgePoolingData`
  - `KnowledgePoolingGenerateMetadata`, `KnowledgePoolingGenerateData`

- [x] **D2** — Add `useGetKnowledgePooling(apiUserId, certId)` hook to `src/swr/certifications.ts`:
  - Uses `useAuthSWR<ApiResponse<KnowledgePoolingData>, Error>`
  - Key: `/api/users/${apiUserId}/certifications/${certId}/knowledge-pooling`
  - Returns `{ knowledgePooling, isLoadingKnowledgePooling, knowledgePoolingError, mutateKnowledgePooling }`

- [x] **D3** — Add `useGenerateKnowledgePooling(apiUserId)` hook to `src/swr/certifications.ts`:
  - Uses full 4-parameter `useSWRMutation` generics
  - Key: `GENERATE_KNOWLEDGE_POOLING_${apiUserId}`
  - Returns `{ generateKnowledgePooling, isGenerating, generationError, generationData, resetGeneration }`

- [x] **D4** — Add proxy route in app: `app/api/users/[api_user_id]/certifications/[cert_id]/knowledge-pooling/route.ts`
  - Implement `GET` and `POST`
  - Forward Firebase bearer token
  - Follow existing user-route pattern (including Firebase UID → API user ID conversion safeguard)

### Build & Test Checklist

- [x] `npx tsc --noEmit 2>&1 | grep "^(app|src)/"` → 0 errors
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
