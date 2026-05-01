# SWR Type Enforcement - Work Tracker (Per-File Commits)

**Purpose**: One file per commit - check off as you complete each file

---

# SWR Type Enforcement - Work Tracker (Per-File Commits)

**Purpose**: One file per commit - check off as you complete each file

---

## 📊 Overall Progress

- **Completed**: 8/17 files (certifications.ts, exams.ts, exams.ts types, questions.ts, examInfo.ts, profile.ts, useSubmitAnswer hook, useSubmitExam/useDeleteExam hooks)
- **In Progress**: ⏹️ None (ready to start)
- **Remaining**: 9 files

**Progress Bar**: `████████░░░░░░░░░░░░░░░░░░░░░░` (47%)

---

## 📋 NEXT FILE TO WORK ON

**→ [Phase 3] useAllData.ts** - Complex data transformation hook

- **File**: `src/swr/useAllData.ts`
- **Time**: 2-3 hours | **Complexity**: HIGH
- **Impact**: Type safety for firms and certifications arrays
- **Commit Message**: `chore: enforce strict types in useAllData callbacks`

---

## ✅ COMPLETED FILES (8)

- [x] certifications.ts (Phase 1)
- [x] exams.ts (Phase 2 - major refactor)
- [x] exams.ts types - Phase 1.1 (Remove `[key: string]: any` from UserAnswer & ExamAnswerSubmission)
- [x] questions.ts - Phase 1.2 (Change `Promise<any>` to `Promise<ApiResponse<SubmitAnswerData>>`)
- [x] examInfo.ts - Phase 1.3 (Replace `'QUESTIONS_GENERATING'` string literal with `BackendExamStatus.QUESTIONS_GENERATING`)
- [x] profile.ts - Phase 2 (Added `avatar_url?: string` to UserProfileData interface)
- [x] questions.ts (hook) - Phase 2 (Added SubmitAnswerError type with questionId field, fixed useSWRMutation generics)
- [x] exams.ts (hooks) - Phase 2 (Fixed useSWRMutation generics for submitExam and deleteExam hooks)

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

### PHASE 3️⃣: HIGH EFFORT (2-3 hours | 1 major file)

#### [ ] 3.1 - useAllData.ts (Complex Data Transformation)

**Status**: ⏹️ NOT STARTED | **Est**: 2-3 hours
**File**: `src/swr/useAllData.ts` (lines ~27, 36, 37)
**What to do** (split into sub-commits if needed):

```
STEP 1 - Discovery (Read-only, no changes):
  a) Find file: grep -r "export.*useAllData\|function useAllData" src/
  b) Open file, read overall structure
  c) Find fetchAllFirms() and fetchAllCertifications() functions
  d) Check what Firm and Certification types they return
  e) Note the exact 3 locations with (param: any)

STEP 2 - Type Creation:
  a) Create proper Firm and Certification data types (if missing)
  b) Add to src/types/swr-data/ files
  c) Export clean, no [key: string]: any
  d) Commit: chore: create explicit Firm and Certification data types

STEP 3 - Implementation:
  a) Import Firm type for line 27 callback
  b) Replace (firm: any) with (firm: Firm)
  c) Import Certification type for lines 36-37 callbacks
  d) Replace (cert: any) with (cert: Certification)
  e) Verify: npx tsc --noEmit
  f) Commit: chore: enforce strict types in useAllData callbacks
```

---

### PHASE 4️⃣: FINAL VERIFICATION (30 minutes | cleanup)

#### [ ] 4.1 - Verify "Known Good" Files

**Status**: ⏹️ NOT STARTED | **Est**: 15 min
**Files**: firms.ts, certSummary.ts, createExam.ts
**What to do**:

```
- Spot-check each file for proper typing
- Confirm generic types are explicit
- Add note to memory: "Verified good - no issues"
- Commit: docs: verify good typing patterns in firms, certSummary, createExam
```

#### [ ] 4.2 - Final Cleanup & Verification

**Status**: ⏹️ NOT STARTED | **Est**: 15 min
**What to do**:

```
- Run: npx tsc --noEmit 2>&1 | grep "^src/" (should be empty)
- Run: grep -r "Promise<any>" src/swr (should be empty)
- Run: grep -r "[key: string]: any" src/types/swr-data (should be empty)
- Run: grep -r "(.*: any).*=>" src/swr (should be empty)
- Delete: EXAMS_TYPING_ANALYSIS.md
- Update: /memories/swr-type-enforcement-pattern.md with final status
- Commit: chore: complete SWR type enforcement - all 17 files typed
```

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
| 2.3   | useAuthMutation/AuthSWR | Document          | ⏹️     | 10m  | 🔵 DOCS    |
| 3     | useAllData.ts           | 3× any callbacks  | ⏹️     | 2-3h | 🔴 HIGH    |
| 4     | Good files              | Verify            | ⏹️     | 15m  | 🔵 DOCS    |
| 4     | Final check             | Cleanup           | ⏹️     | 15m  | 🟢 LOW     |

**Total Progress**: 8/17 files | ~5 hours done | **~4 hours remaining**

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

### Phase 2.5 (Next - Infrastructure Documentation) ⏹️ 10 min

- [ ] Open `src/hooks/useAuthMutation.ts` and `src/hooks/useAuthSWR.ts`
- [ ] Add JSDoc explaining why `any` generics are acceptable here (they're reusable wrappers)
- [ ] Document: "Generic wrapper pattern - any defaults are safe because type narrowing happens at call sites"

### Phase 3 (Next - useAllData.ts) ⏹️ 2-3 hours

- [ ] Find all callback parameters with `(param: any)`
- [ ] Create Firm and Certification data types (if missing)
- [ ] Replace `(firm: any)` with `(firm: Firm)`
- [ ] Replace `(cert: any)` with `(cert: Certification)`

### Phase 4 (Verification) ⏹️ 30 min

- [ ] Spot-check "good" files (firms.ts, certSummary.ts, createExam.ts)
- [ ] Run final verification: `npx tsc --noEmit` (should be empty)
- [ ] Verify no remaining `any` patterns with targeted greps
- [ ] Delete EXAMS_TYPING_ANALYSIS.md and update memories

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
| 2.3   | useAuthMutation/AuthSWR | ⏹️     | 10m  |
| 3     | useAllData.ts           | ⏹️     | 2-3h |
| 4     | Verification            | ⏹️     | 30m  |

**Completed**: 6/9 work items | **Remaining**: 3/9

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

## 🎯 Success Criteria (Final Checklist for Phase 4)

- [x] 0 TypeScript errors in `src/` (verified after fixes)
- [x] 0 `Promise<any>` in SWR fetchers (fixed in Phase 1.2)
- [x] 0 `[key: string]: any` in data interfaces (fixed in Phase 1.1)
- [ ] 0 `(param: any)` in callbacks (pending Phase 3)
- [x] All status strings → enums (fixed in Phases 1-5)
- [ ] All remaining files fixed/verified (8/17 done)
- [ ] EXAMS_TYPING_ANALYSIS.md handled (currently updated, will delete in Phase 4)
- [ ] Memory files updated (pending final update)

---

**Last Updated**: 1 May 2026 (Session: Type Enforcement Commit Review)
**Workflow**: One file per session/commit
**Next Session Should Start With**: Phase 2.5 (useAuthMutation/AuthSWR documentation)
