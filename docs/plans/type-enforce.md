# SWR Type Enforcement - Work Tracker (Per-File Commits)

**Purpose**: One file per commit - check off as you complete each file

---

# 🚨 BACKEND API CHANGES TO IMPLEMENT

**Last Sync with certifai-api type enforcement**: 2026-05-04 (Phase 5b Complete)
**Status**: Implementation Ready - See [api-types-phase-5b.md](./api-types-phase-5b.md)

---

## 📋 Phase 5b: Exam Endpoints Alignment

**Detailed Plan**: [api-types-phase-5b.md](./api-types-phase-5b.md)
**Backend Commit**: `9039b7cb37ee4186c57cadd81db644bfeaf99825`
**Estimated Time**: 105 minutes (~2 hours)
**Status**: Ready for Implementation

### Implementation Tracking

- [ ] **Phase 5b.1**: Type Definition Updates (20 min)
  - Update `ExamDetailData` with nested answers structure
  - Add `ExamAnswerWithQuestion` interface
  - Update `ExamQuestionsResponseData` type
  - **Commit**: `types: align ExamDetailData and ExamQuestionResponse with Phase 5b API contracts`

- [ ] **Phase 5b.2**: Questions Hook Refactor (25 min)
  - Update `useExamQuestions` for nested response shape
  - Update components consuming questions hook
  - **Commit**: `refactor: update useExamQuestions to handle nested response shape`

- [ ] **Phase 5b.3**: Exam Detail Hook Updates (25 min)
  - Update `useExamState`/`useExamDetail` for new answer structure
  - Update exam detail page components
  - **Commit**: `refactor: update exam detail hooks to use nested answer structure`

- [ ] **Phase 5b.4**: Component Integration Testing (20 min)
  - Test all exam flows end-to-end
  - Verify no console errors
  - **Commit**: `test: verify Phase 5b exam endpoint integration`

- [ ] **Phase 5b.5**: Documentation & Cleanup (15 min)
  - Update this file with completion status
  - Add JSDoc to updated hooksallie
  - **Commit**: `docs: update Phase 5b exam endpoint documentation`

---

## Pending Frontend Updates (Detailed Breakdown)

### ✅ Already Aligned (No Changes Needed)

- [x] Endpoint: `POST /api/users/{userId}/certifications/{certId}/exams` (Create Exam)
  - Frontend `CreateExamResponse` matches backend ✅

- [x] Endpoint: `GET /api/users/{userId}/exams/{examId}/live-status` (Live Status)
  - Frontend `ExamLiveStatusData` matches backend ✅

- [x] Endpoint: `POST /api/users/{userId}/certifications/{certId}/exams/{examId}/submit` (Submit)
  - Frontend `ExamSubmitData` matches backend ✅

- [x] Endpoint: `GET /api/users/{userId}/exams` (List Exams)
  - Frontend `ExamListItemData` matches backend ✅

### High Priority (Contract Drift - Phase 5b)

- [ ] Endpoint: `GET /api/users/{userId}/exams/{examId}`
  - CHANGED: response includes `progress`, `generation_progress`, and nested `answers` array with full question data
  - Components/Hooks Affected: exam detail consumers using `ExamDetailData`
  - Backend Source: `certifai-api/functions/src/endpoints/api/users/exams/getUserExam.ts`
  - **Phase**: 5b.1, 5b.3
  - PR: (link)

- [ ] Endpoint: `GET /api/users/{userId}/exams/{examId}/questions`
  - CHANGED: response shape is `{ success, data: { questions: [...], total_questions, answered_questions }, pagination }`
  - Components/Hooks Affected: question list hooks/components expecting flat array
  - Backend Source: `certifai-api/functions/src/endpoints/api/users/exams/getExamQuestions.ts`
  - **Phase**: 5b.1, 5b.2
  - PR: (link)

### Medium Priority (Verification Needed - Phase 5b)

- [ ] Endpoint: `DELETE /api/users/{userId}/exams/{examId}`
  - VERIFY: response includes detailed `deletion_summary`, `rtdb_cleanup`, `validation` (already typed, needs verification)
  - Components/Hooks Affected: exam deletion flows
  - Backend Source: `certifai-api/functions/src/endpoints/api/users/exams/deleteExam.ts`
  - **Phase**: 5b.4 (testing)
  - PR: (link)

---

## Phase 5c: Certification Endpoints (Future Work)

**Status**: Pending Phase 5b completion
**Backend Source**: certifai-api Phase 5c commit (TBD)

### High Priority (Phase 5c certification contract drift)

- [ ] Endpoint: `POST /api/users/{userId}/certifications`
  - CHANGED: route accepts `cert_id` in request **body** (not `/{certId}` path), and returns `{ success, data: UserCertification, performance }`
  - Components/Hooks Affected: certification registration mutation hooks and payload typing
  - Backend Source: `certifai-api/functions/src/endpoints/api/users/certifications/register.ts`
  - PR: (link)

- [ ] Endpoint: `DELETE /api/users/{userId}/certifications/{certId}`
  - CHANGED: response is detailed `{ success, message, data: { deletion_summary, rtdb_cleanup, validation, timing, ... } }` (not `success: true` only)
  - Components/Hooks Affected: certification deletion flows expecting minimal delete response
  - Backend Source: `certifai-api/functions/src/endpoints/api/users/certifications/deleteCertification.ts`
  - PR: (link)

- [ ] Endpoint: `GET /api/users/{userId}/certifications`
  - CHANGED: pagination metadata shape is `{ currentPage, pageSize, totalItems, totalPages, hasNextPage, hasPreviousPage }` and data items are DB-shaped user-certification records with nested `certification`
  - Components/Hooks Affected: certification list hooks expecting `ListResponse<UserRegisteredCertification>` with `{ page, pageSize, total }`
  - Backend Source: `certifai-api/functions/src/endpoints/api/users/certifications/getUserCertifications.ts`
  - PR: (link)

### Medium Priority (Phase 5c additional typed endpoints not covered by Phase 2 cert DTOs)

- [ ] Endpoint: `GET/POST /api/users/{userId}/certifications/{certId}/knowledge-pooling`
  - ADDED/DIFF: returns envelope with `message`, `metadata`, and consolidated knowledge insights payload; currently not represented in `types/api/certifications.ts`
  - Components/Hooks Affected: knowledge pooling hooks/components
  - Backend Source: `certifai-api/functions/src/endpoints/api/users/certifications/getKnowledgePooling.ts`, `.../generateKnowledgePooling.ts`
  - PR: (link)

- [ ] Endpoint: `GET/POST /api/users/{userId}/certifications/{certId}/cert-summary`
  - ADDED/DIFF: returns cert summary payload with `structured_data`, `summary_stats`, and contextual `message`; currently not represented in `types/api/certifications.ts`
  - Components/Hooks Affected: cert summary hooks/components
  - Backend Source: `certifai-api/functions/src/endpoints/api/users/certifications/getCertSummary.ts`
  - PR: (link)

---

# SWR Type Enforcement - Work Tracker (Per-File Commits)

**Purpose**: One file per commit - check off as you complete each file

---

## 📊 Overall Progress

- **Completed**: 17/17 files - ALL SWR hooks fully typed with explicit generics ✅ FINAL
- **In Progress**: ⏹️ None (Complete!)
- **Remaining**: 0 files

**Progress Bar**: `████████████████████████████████████░░` (100%)

---

## ⚠️ CRITICAL DISCOVERIES - API SOURCE OF TRUTH VALIDATION

**These patterns MUST be followed for remaining files to avoid type mismatches:**

### 1. **Always Verify Fields Exist in API Before Type Definition**

**Problem Found**: Added `avatar_url`, `first_name`, `last_name` to `UserProfileData` - NONE exist in the API
**Source Check**:

- Open `certifai-api/functions/src/endpoints/api/users/getUserProfile.ts`
- Search response object - if field isn't in the return statement, don't add it to type
  **Action**: Before defining any SWR data type, grep the API endpoint to see exact fields returned

### 2. **Check API DateTime Handling - Always String, Never Number**

**Problem Found**: Defined `submitted_at: number | null` when API returns ISO 8601 strings
**Why**: Prisma DateTime fields serialize as ISO 8601 strings in JSON, never as timestamps
**How to Verify**: Look for `DateTime` type in Prisma schema → API returns it as string
**Example**:

```prisma
model ExamAttempt {
  submitted_at DateTime?
}
// Returns as JSON: submitted_at: "2026-01-15T10:30:00Z" (string), NOT milliseconds
```

### 3. **Duplicate Type Definitions Will Cause Mismatches**

**Problem**: `ExamState` interface shadowed `ExamListItemData` with different `submitted_at` type
**Risk**: When one type is fixed, duplicates aren't updated → cascading errors
**Prevention**: Search codebase for duplicate interfaces before fixing

```bash
grep -r "interface ExamState\|interface ExamListItem" src/
# Should ideally have only ONE definition of each
```

### 4. **Component Usage Can Reveal Missing API Fields (But Beware False Positives)**

**Pattern**: Components trying to access `profile.avatar_url` → doesn't mean API returns it
**Reality Check**: Always verify in API endpoint, don't assume UI is correct
**Better Process**:

1. Fix TypeScript error → shows missing field
2. Don't blindly add field to type
3. Check API endpoint for that field
4. If not in API: remove from component usage instead

---

## 📋 NEXT FILE TO WORK ON

**→ [Phase 4] Verification & Cleanup** - Final review and cleanup

- **Tasks**: Spot-check firms.ts, certSummary.ts, createExam.ts; run final TypeScript check; cleanup
- **Time**: 30 min | **Complexity**: LOW
- **Impact**: Confirm no remaining type issues before marking complete
- **Commit Message**: `docs: final verification of SWR type enforcement`

---

## ✅ COMPLETED FILES (11)

- [x] certifications.ts (Phase 1)
- [x] exams.ts (Phase 2 - major refactor)
- [x] exams.ts types - Phase 1.1 (Remove `[key: string]: any` from UserAnswer & ExamAnswerSubmission)
- [x] questions.ts - Phase 1.2 (Change `Promise<any>` to `Promise<ApiResponse<SubmitAnswerData>>`)
- [x] examInfo.ts - Phase 1.3 (Replace `'QUESTIONS_GENERATING'` string literal with `BackendExamStatus.QUESTIONS_GENERATING`)
- [x] profile.ts (types) - Phase 2.3 (Removed non-API fields: avatar_url, first_name, last_name; fixed firebase_user_id to nullable)
- [x] questions.ts (hook) - Phase 2.4 (Added SubmitAnswerError type with questionId field, fixed useSWRMutation generics)
- [x] exams.ts (hooks) - Phase 2.4 (Fixed useSWRMutation generics for submitExam and deleteExam hooks)
- [x] exams.ts (ExamState) - Phase 2.6 (Aligned submitted_at type with ExamListItemData: string | null)
- [x] useAuthMutation.ts & useAuthSWR.ts - Phase 2.5 (Added JSDoc explaining generic wrapper pattern)
- [x] useAllData.ts - Phase 3 (Replaced all callback any types with AllFirmData and FirmCertificationItemData)

---

## 📝 WORK QUEUE - BY COMMITMENT ORDER

### PHASE 1️⃣: QUICK WINS (45 minutes total | 3 files) ✅ COMPLETE

#### [x] 1.1 - exams.ts (Request Types)

**Status**: ✅ COMPLETE

#### [x] 1.2 - questions.ts (Fetcher Return Type)

**Status**: ✅ COMPLETE

#### [x] 1.3 - examInfo.ts (String Literal → Enum)

**Status**: ✅ COMPLETE

---

### PHASE 2️⃣: MEDIUM EFFORT (1.5 hours total | 4 files) ✅ COMPLETE

#### [x] 2.1 - profile.ts (avatar_url Field)

**Status**: ✅ COMPLETE | Added optional `avatar_url?: string` field to UserProfileData interface

---

### PHASE 2.2️⃣: MUTATION HOOKS (1 hour | 2 files) ✅ COMPLETE

#### [x] 2.2.1 - questions.ts useSubmitAnswer Hook

**Status**: ✅ COMPLETE | Added SubmitAnswerError class with questionId field, fixed useSWRMutation generic types

**Changes Made**:

- Created `SubmitAnswerError` class extending Error in src/types/swr-data/questions.ts
- Updated `useSubmitAnswer()` to use proper generic types: `useSWRMutation<ApiResponse<SubmitAnswerData>, Error, string, {apiUserId, certId, examId, questionId, optionId, refreshToken}>`
- Updated `QuestionCard.tsx` to import and use `SubmitAnswerError` instead of generic `Error`
- Updated `ExamQuestionsContainer.tsx` to import and use `SubmitAnswerError` instead of generic `Error`

**Key Learning**: When using useSWRMutation with extra arguments (like refreshToken injection), must specify all 4 type parameters:

1. Data type (response)
2. Error type
3. Key type (always string for static keys)
4. **ExtraArgument type** (the object passed to trigger())

#### [x] 2.2.2 - exams.ts useSubmitExam & useDeleteExam Hooks

**Status**: ✅ COMPLETE | Fixed useSWRMutation generic types for both exam mutation hooks

**Changes Made**:

- Updated `useSubmitExam()` with proper generic types
- Updated `useDeleteExam()` with proper generic types
- Both now explicitly specify the argument object structure including `refreshToken` function

---

### PHASE 2.3️⃣: PROFILE TYPE (20 minutes | 1 file) ✅ COMPLETE

#### [x] 2.3 - profile.ts (avatar_url Missing Field)

**Status**: ✅ COMPLETE | Added optional `avatar_url?: string` field

**Changes Made**:

- Added `avatar_url?: string` to UserProfileData interface
- Fixed 3 TypeScript errors in app/main/profile/client.tsx and src/components/custom/appheader.tsx

---

### PHASE 2.5️⃣: AUTH HOOK DOCUMENTATION (10 minutes | 1 file) ✅ COMPLETE

#### [x] 2.5 - useAuthMutation.ts & useAuthSWR.ts (Generic Wrapper Documentation)

**Status**: ✅ COMPLETE | Added JSDoc explaining generic wrapper pattern

**Changes Made**:

- Added comprehensive JSDoc to `useAuthMutation()` explaining why generic `<Data = any, Arg = any>` defaults are acceptable
- Added comprehensive JSDoc to `useAuthSWR()` explaining why generic `<Data = any, Error = any>` defaults are acceptable
- Documented the generic wrapper pattern: concrete types are specified at call sites, not in the wrapper
- Provided examples of correct usage

**Key Pattern**:

```typescript
// Generic wrapper - any defaults are OK
export function useAuthSWR<Data = any, Error = any>(key, config) { ... }

// Concrete types at call site - where real type narrowing happens
useAuthSWR<UserProfileData>('/profile')
```

---

### PHASE 3️⃣: HIGH EFFORT (2-3 hours | 1 major file) ✅ COMPLETE

#### [x] 3.1 - useAllData.ts (Complex Data Transformation)

**Status**: ✅ COMPLETE | All 3 callback parameters now have explicit types

**Changes Made**:

- Imported `AllFirmData` and `FirmCertificationItemData` types
- Line 27: Changed `allFirms.map((firm) =>` to `allFirms.map((firm: AllFirmData) =>`
- Line 36: Changed `.filter((cert) =>` to `.filter((cert: FirmCertificationItemData) =>`
- Line 37: Changed `.map((cert) =>` to `.map((cert: FirmCertificationItemData) =>`
- Verified: `npx tsc --noEmit` shows 0 errors in src/

**Key Learning**: Callback parameters in high-level hooks should match the return types of their data sources (fetchAllFirms and fetchAllCertifications functions).

---

### PHASE 4️⃣: FINAL VERIFICATION (30 minutes | cleanup) ✅ COMPLETE

#### [x] 4.1 - Verify "Known \Good" Files

**Status**: ✅ COMPLETE | **Time**: 15 min
**Files**: firms.ts, certSummary.ts, createExam.ts

**Findings & Fixes**:

- **firms.ts**: ✅ Already properly typed with `useAuthSWR<PaginatedApiResponse<Firm[]>, Error>`
- **certSummary.ts**: ⚠️ Fixed missing generic types on useSWR
  - Before: `useSWR(key, certSummaryFetcher, {`
  - After: `useSWR<CertSummaryData, Error>(key, certSummaryFetcher, {`
- **createExam.ts**: ⚠️ Fixed missing generic types on useSWRMutation with all 4 parameters
  - Before: `useSWRMutation('CREATE_EXAM', createExamFetcher)`
  - After: `useSWRMutation<ApiResponse<CreateExamResponse>, CreateExamError, string, {apiUserId, certId, body, refreshToken}>`

#### [x] 4.2 - Final Cleanup & Verification

**Status**: ✅ COMPLETE | **Time**: 15 min

**All Verification Checks Passed**:

```
✅ npx tsc --noEmit 2>&1 | grep "^src/" → 0 errors
✅ grep -r "Promise<any>" src/swr → 0 matches
✅ grep -r "[key: string]: any" src/types/swr-data → 0 matches
✅ grep -rn "(.*: any)" src/swr (non-comments) → 0 matches
```

**Final Status**:

- ✅ All actively used SWR hooks are fully typed
- ✅ All generic parameters explicitly specified
- ✅ No loose `any` types in callbacks or return values
- ✅ TypeScript compilation clean in src/

---

## 🚦 Progress Matrix (Easy to Scan)

| Phase | File                    | Steps             | Status | Est  | Complexity |
| ----- | ----------------------- | ----------------- | ------ | ---- | ---------- |
| 1     | exams.ts (types)        | Remove any        | ✅     | 15m  | 🟢 LOW     |
| 1     | questions.ts            | Fix return type   | ✅     | 15m  | 🟢 LOW     |
| 1     | examInfo.ts             | Replace string    | ✅     | 15m  | 🟢 LOW     |
| 2.1   | profile.ts              | Add avatar_url    | ✅     | 10m  | 🟢 LOW     |
| 2.2.1 | useSubmitAnswer hook    | SubmitAnswerError | ✅     | 30m  | 🟡 MEDIUM  |
| 2.2.2 | useSubmitExam/Delete    | Generic types     | ✅     | 30m  | 🟡 MEDIUM  |
| 2.5   | useAuthMutation/AuthSWR | Doc patterns      | ✅     | 10m  | 🔵 DOCS    |
| 3     | useAllData.ts           | 3× any callbacks  | ✅     | 2-3h | 🔴 HIGH    |
| 4.1   | Good files              | Verify & fix      | ✅     | 15m  | 🔵 VERIFY  |
| 4.2   | Final check             | Cleanup           | ✅     | 15m  | 🟢 LOW     |
| 4.3   | Remaining 4 files       | Final typing      | ✅     | 20m  | 🟢 LOW     |

**Total Progress**: 17/17 files | ~8 hours done | **✅ PROJECT COMPLETE**

---

## 🎉 FINAL COMPLETION NOTES

### Phase 4.3 - Final 4 Files (Session completed)

**Files Fixed**:

1. **examReport.ts**
   - Added generic types: `useSWR<ExamReportData, Error>`
   - Fully typed report fetching and generation functions

2. **useExamGeneratingProgress.ts** (Deprecated but typed)
   - Added Error generic: `useAuthSWR<ExamGeneratingProgressResponse, Error>`
   - Proper error handling and type narrowing

3. **useExamLiveStatus.ts**
   - Added Error generic: `useAuthSWR<ExamLiveStatusResponse, Error>`
   - Fixed type narrowing for status code checks with proper type guards

4. **deleteAccount.ts** (verified existing)
   - Already properly typed: `useAuthMutation<DeleteAccountResponse, void>`
   - No changes needed

**Verification Results**:
- ✅ TypeScript compilation: CLEAN (0 src/ errors)
- ✅ Promise<any> patterns: 0
- ✅ [key: string]: any patterns: 0
- ✅ (param: any) callbacks: 0
- ✅ All hooks use explicit generic parameters
- ✅ All error types properly specified

---

## � LESSONS LEARNED (Commit Review Session)

From analyzing the recent commits, several key patterns emerged that should guide the remaining work:

### 1. **useSWRMutation Generic Types Are Critical**

**Problem**: Both `useSubmitExam` and `useDeleteExam` were missing the 4th generic parameter (extra argument type).
**Root Cause**: The library signature is `useSWRMutation<Data, Error, Key, ExtraArgument>`, but docs often show simplified versions without the argument type.
**Fix Applied**: Explicitly specify all 4 types, with ExtraArgument including the `refreshToken` function.
**Action for Remaining Files**: Check any mutations that pass extra objects to `trigger()` - they need the 4th generic parameter.

### 2. **Error Type Extensibility**

**Problem**: Using generic `Error | undefined` doesn't provide context about which question failed.
**Solution**: Create error classes that extend Error with custom fields (e.g., `SubmitAnswerError` with `questionId`).
**Pattern**:

```typescript
export class SubmitAnswerError extends Error {
  constructor(
    message: string,
    public questionId: string,
  ) {
    super(message);
    this.name = 'SubmitAnswerError';
    Object.setPrototypeOf(this, SubmitAnswerError.prototype);
  }
}
```

**Action for Remaining Files**: Look for error handling that needs context - create custom error types instead of using generic `Error`.

### 3. **Optional Field Inference from UI Usage**

**Problem**: `avatar_url` was missing from `UserProfileData` despite being used in 3 components.
**Root Cause**: Type definitions lag behind actual UI usage - components often know about fields that types don't mention.
**Fix Applied**: Search TypeScript errors for "Property X does not exist" and trace back to API response types.
**Action for Remaining Files**: Run `npx tsc --noEmit` early and often - it catches these gaps automatically.

### 4. **Component Prop Types Must Match Hook Returns**

**Problem**: `QuestionCard` received `submitError: Error | undefined` but tried to access `submitError.questionId`.
**Root Cause**: Misalignment between what the hook returns and what components expect.
**Fix Applied**: Update component props to match the actual error type from the hook.
**Action for Remaining Files**: When updating hooks, check all consumers - 1 hook change → multiple component updates.

### 5. **Discriminated Unions for Complex State** (from recent commits)

**Pattern Observed**: `SubmissionResult` was correctly refined to use discriminated union:

```typescript
type SubmissionResult =
  | (ApiResponse<ExamSubmitData> & { error?: never })
  | { error: string; success?: false }
  | null;
```

**Key Insight**: Using discriminated unions prevents impossible states and ensures type narrowing works correctly.
**Action for Remaining Files**: When dealing with multiple response shapes, use discriminated unions instead of simple unions.

---

## 📋 Updated Todo for Remaining Files

### Phase 2.3 (Completed - Profile) ✅

- [x] Added `avatar_url?: string` to UserProfileData

### Phase 2.4 (Completed - Mutation Hooks) ✅

- [x] Fixed `useSubmitAnswer()` with SubmitAnswerError class
- [x] Fixed `useSubmitExam()` with proper 4-param generic
- [x] Fixed `useDeleteExam()` with proper 4-param generic

### Phase 2.5 (Completed - Auth Hook Documentation) ✅

- [x] Added JSDoc to useAuthMutation.ts explaining generic wrapper pattern
- [x] Added JSDoc to useAuthSWR.ts explaining generic wrapper pattern
- [x] Documented that type narrowing happens at call sites, not in wrappers

### Phase 3 (Completed - useAllData.ts) ✅

- [x] Imported AllFirmData and FirmCertificationItemData types
- [x] Replaced `(firm: any)` with `(firm: AllFirmData)`
- [x] Replaced `(cert: any)` with `(cert: FirmCertificationItemData)` (2 locations)
- [x] Verified: `npx tsc --noEmit 2>&1 | grep "^src/"` returns 0 errors

### Phase 4 (Verification) ✅ COMPLETE - 30 min

- [x] Spot-checked "good" files (firms.ts, certSummary.ts, createExam.ts)
  - Fixed certSummary.ts: Added generic types to useSWR
  - Fixed createExam.ts: Added all 4 generic parameters to useSWRMutation
- [x] Final verification: `npx tsc --noEmit 2>&1 | grep "^src/"` returns 0 errors
- [x] Verified no remaining `any` patterns (0 Promise<any>, 0 [key: string]: any, 0 (param: any))
- [x] All commits made for Phase 4 fixes

---

## 🚦 Progress Matrix (Updated)

| Phase | File                    | Status | Est  |
| ----- | ----------------------- | ------ | ---- |
| 1.1   | exams.ts (types)        | ✅     | 15m  |
| 1.2   | questions.ts            | ✅     | 15m  |
| 1.3   | examInfo.ts             | ✅     | 15m  |
| 2.1   | profile.ts              | ✅     | 10m  |
| 2.2.1 | useSubmitAnswer         | ✅     | 30m  |
| 2.2.2 | useSubmitExam/Delete    | ✅     | 30m  |
| 2.5   | useAuthMutation/AuthSWR | ✅     | 10m  |
| 3     | useAllData.ts           | ✅     | 2-3h |
| 4     | Verification            | ✅     | 30m  |

**Completed**: 9/9 work items | **Phase 4 Complete!**

---

## 💾 How to Use This File

Each time you complete a file:

1. ✅ Check the box: `[x]` (was `[ ]`)
2. Update "Overall Progress" bar at top
3. Move "NEXT FILE" pointer down to next unchecked item
4. Make your commit with the suggested message
5. Note: Save this file after each commit so next session you know exactly where you left off

**Example after completing 1.1**:

```
- [x] 1.1 - exams.ts (Request Types)
→ NEXT: [Phase 1.2] questions.ts
```

---

## 🎯 Success Criteria (FINAL - Project Complete) ✅

- [x] 0 TypeScript errors in `src/` (verified session 5)
- [x] 0 `Promise<any>` in SWR fetchers (verified session 5)
- [x] 0 `[key: string]: any` in data interfaces (verified session 5)
- [x] 0 `(param: any)` in callbacks (verified session 5)
- [x] All status strings → enums (fixed in Phases 1-2)
- [x] All actively used SWR files fixed/verified (17/17 complete)
- [x] All 4 remaining files completed (examReport, useExamGeneratingProgress, useExamLiveStatus, deleteAccount)
- [x] Final API documentation created for certifai-api team

---

**Last Updated**: 1 May 2026 (Session 5: Completed all 17 files + API guide)
**Latest Commits**:
  - examReport.ts: Add explicit generic types to useSWR
  - useExamGeneratingProgress.ts: Add Error generic parameter
  - useExamLiveStatus.ts: Add Error generic parameter + type guards
  - type-enforce.md: Mark Phase 4.3 complete - ALL 17 FILES DONE
  - certifai-api/type-enforcement.md: Create comprehensive API guide
**Status**: ✅ PROJECT COMPLETE - All SWR hooks fully typed
**Next**: certifai-api type enforcement implementation (based on documented patterns)

---

## 🔴 CRITICAL DISCOVERIES FOR FUTURE REFACTORING

**These must be applied to all remaining 8 files to avoid wasted time:**

1. **Never Trust TypeScript Errors Alone**
   - "Property X does not exist" error ≠ "Add field X to type"
   - ALWAYS check the API endpoint source code first
   - If field not in API → remove from component, don't add to type

2. **Prisma DateTime Always = ISO 8601 String**
   - Any `DateTime` field in Prisma schema → `string | null` in JSON API response
   - NEVER type as `number` (milliseconds) - will cause type mismatches
   - Check: `grep "DateTime" functions/prisma/schema.prisma`

3. **Duplicate Type Definitions Cause Cascading Errors**
   - When you fix one type (e.g., ExamListItemData), grep for similar types (ExamState, ExamDetailData)
   - Fix ALL of them to match - difference will cause type incompatibility errors
   - Command: `grep -rn "interface.*Exam" src/types/ src/swr/`

4. **Always Verify Against API Before Coding**
   - Step 1: Find the endpoint that returns this data
   - Step 2: Read the exact response object structure
   - Step 3: Check Prisma schema for field types
   - Step 4: Search for duplicate type definitions
   - Step 5: Run TypeScript - should have 0 errors

5. **Process For Remaining 8 Files**
   - Open API endpoint in certifai-api
   - Compare API response with SWR type definition
   - Fix mismatches (DateTime→string, remove non-existent fields, etc.)
   - Check for duplicate types that need same fix
   - Update all components that use the type
   - Run `npx tsc --noEmit` - verify 0 errors

This will save hours of debugging and prevent the avatar_url/submitted_at/ExamState mistakes from happening again.
