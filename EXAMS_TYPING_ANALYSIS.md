# Exams.ts Type Enforcement Analysis

## Executive Summary

The `/Users/benxgao/workspace/certifai-app/src/swr/exams.ts` file contains several typing violations that undermine type safety. This document identifies all issues and their exact locations for systematic remediation using the SWR type enforcement pattern.

---

## 1. MUTATION FETCHERS & RETURN TYPES

### Issue 1.1: `submitExamFetcher` - Loose Parameter and Return Type

**Location**: [src/swr/exams.ts](src/swr/exams.ts#L118-L134)
**Lines**: 118-134

**Problem**:

- Parameter `body: any` (line 130)
- Return type `Promise<any>` (line 134)

**Current Code**:

```typescript
async function submitExamFetcher(
  _key: string,
  {
    arg,
  }: {
    arg: {
      apiUserId: string;
      certId: number;
      examId: string;
      body: any;  // <-- LOOSE TYPING
      refreshToken: () => Promise<string | null>;
    };
  },
): Promise<any> {  // <-- LOOSE TYPING
```

**Expected Type**:

- `body` should be `{ answers?: any[] }` or create a `SubmitExamRequest` interface
- Return type should be `ApiResponse<ExamSubmitData>` (already defined in `src/types/swr-data/exams.ts` lines 121-133)

**Impact**: Callers cannot safely access response data structure

---

### Issue 1.2: `useSubmitExam()` Hook - `body: any` Parameter

**Location**: [src/swr/exams.ts](src/swr/exams.ts#L175-L190)
**Lines**: 184

**Problem**:

```typescript
const submitExam = (arg: { apiUserId: string; certId: number; examId: string; body: any }) => {
                                                                                        ^^^^
```

**Expected Type**: Should match fetcher's expected body type (likely `{ answers: UserAnswer[] }`)

---

### Issue 1.3: `deleteExamFetcher` - Loose Return Type

**Location**: [src/swr/exams.ts](src/swr/exams.ts#L197-L226)
**Lines**: 207

**Problem**:

```typescript
): Promise<any> {  // <-- LOOSE TYPING
```

**Expected Type**: `Promise<ApiResponse<ExamDeleteData>>` (defined in `src/types/swr-data/exams.ts` lines 195-201)

**Impact**: Hook consumers cannot safely access deletion summary, validation status

---

## 2. HOOK FUNCTIONS & RETURN TYPES

### Hook 2.1: `useAllUserExams()`

**Location**: [src/swr/exams.ts](src/swr/exams.ts#L38-96)

**Status**: ✅ PROPERLY TYPED

- Returns typed `EnhancedExamListResponse`
- Generic parameters explicit: `useAuthSWR<EnhancedExamListResponse, Error>`
- Return object has proper types for `allExams`, `pagination`, `rateLimit`

---

### Hook 2.2: `useExamsForCertification()`

**Location**: [src/swr/exams.ts](src/swr/exams.ts#L98-116)

**Status**: ✅ PROPERLY TYPED

- Returns typed `EnhancedExamListResponse`
- All return properties properly typed

---

### Hook 2.3: `useSubmitExam()`

**Location**: [src/swr/exams.ts](src/swr/exams.ts#L175-191)

**Status**: ⚠️ PARTIALLY TYPED - Has issues

- ✅ `isSubmittingExam: isMutating` — properly typed
- ⚠️ `submitExam` parameter type — uses `body: any`
- ⚠️ `submitExamError: error` — should be typed as `Error | undefined` or proper error type

**Recommended Return Type**:

```typescript
return {
  submitExam: (arg: {
    apiUserId: string;
    certId: number;
    examId: string;
    body: ExamAnswerSubmission;
  }) => Promise<ApiResponse<ExamSubmitData>>,
  isSubmittingExam: boolean,
  submitExamError: Error | undefined,
};
```

---

### Hook 2.4: `useDeleteExam()`

**Location**: [src/swr/exams.ts](src/swr/exams.ts#L193-213)

**Status**: ⚠️ PARTIALLY TYPED - Has issues

- ✅ `isDeletingExam: isMutating` — properly typed
- ⚠️ `deleteExamError: error` — should be typed as `Error | undefined`

**Recommended Return Type**:

```typescript
return {
  deleteExam: (arg: { apiUserId: string; examId: string }) => Promise<ApiResponse<ExamDeleteData>>,
  isDeletingExam: boolean,
  deleteExamError: Error | undefined,
};
```

---

### Hook 2.5: `useExamState()`

**Location**: [src/swr/exams.ts](src/swr/exams.ts#L304-386)

**Status**: ✅ PROPERLY TYPED

- Generic type parameters explicit: `useAuthSWR<ApiResponse<ExamState>, Error>`
- Return object properly typed with `ExamState`

---

## 3. LOOSE TYPING PATTERNS

### Pattern 3.1: String Literals for Status Comparisons

**Location**: Multiple lines in [src/swr/exams.ts](src/swr/exams.ts)

**Lines with `'QUESTIONS_GENERATING'` hardcoded**:

- Line 31 (appears 2× in same line): `exam.exam_status === 'QUESTIONS_GENERATING'`
- Line 91 (appears 2× in same line): `exam.exam_status === 'QUESTIONS_GENERATING'`
- Line 310: `if (examStatus === 'QUESTIONS_GENERATING')`
- Line 328: `if (examStatus && examStatus !== 'QUESTIONS_GENERATING')`

**Problem**:
Magic string literals make code fragile and error-prone. Should use `BackendExamStatus` enum which is already imported.

**Current**:

```typescript
exam.exam_status === 'QUESTIONS_GENERATING';
```

**Expected**:

```typescript
exam.exam_status === BackendExamStatus.QUESTIONS_GENERATING;
```

**Available Enum**: `BackendExamStatus` is imported from `src/types/exam-status` (line 5) and has:

- `READY`
- `QUESTIONS_GENERATING`
- `PENDING_QUESTIONS`
- `IN_PROGRESS`
- `COMPLETED`
- `QUESTION_GENERATION_FAILED`

---

### Pattern 3.2: Field Type Inconsistencies in `ExamState` Interface

**Location**: [src/swr/exams.ts](src/swr/exams.ts#L261-291)

**Lines**: 261-291

**Issues Found**:

| Field                 | Current               | Issue                                         | Expected                                                  |
| --------------------- | --------------------- | --------------------------------------------- | --------------------------------------------------------- |
| `exam_status`         | `string \| undefined` | Should use enum                               | `BackendExamStatus \| undefined`                          |
| `status`              | `string`              | Computed status, but magic string comparisons | Use enum or define computed status enum                   |
| `certification`       | `{ ... }`             | No explicit type                              | Create `ExamCertificationDetails` interface               |
| `generation_progress` | `{ ... }`             | No explicit type                              | Use existing `ExamGenerationProgressData` from types file |

**Details**:

- `exam_status?: string` (line 269) — Should be `exam_status?: BackendExamStatus`
- `status: string` (line 271) — Should document what valid values are or use derived enum

---

## 4. COMPONENTS USING THESE HOOKS

### Component 4.1: `ExamCard.tsx`

**Location**: [src/components/custom/ExamCard.tsx](src/components/custom/ExamCard.tsx)

**Issues Found**:

- **Line 40**: `deleteExamError: any` — Should be `Error | undefined`

**How It's Used**:

```typescript
interface ExamCardProps {
  exam: ExamListItem; // ✅ Properly typed
  displayCertification: CertificationData; // ✅ Properly typed
  deleteExamError: any; // ⚠️ LOOSE TYPING
}
```

**Expected Type**: `deleteExamError?: Error`

---

### Component 4.2: `ExamOverview.tsx`

**Location**: [src/components/custom/ExamOverview.tsx](src/components/custom/ExamOverview.tsx#L10)

**Issues Found**:

- **Line 11**: `pagination?: any` — Should be `PaginationMeta | undefined`

**How It's Used**:

```typescript
interface ExamOverviewProps {
  examId: string | null;
  pagination?: any; // ⚠️ LOOSE TYPING
  fallbackSubmittedAt?: number | null;
}
```

**Expected Type**:

```typescript
import { PaginationMeta } from '@/src/types/api';

interface ExamOverviewProps {
  examId: string | null;
  pagination?: PaginationMeta; // Properly typed
  fallbackSubmittedAt?: number | null;
}
```

**Impact**: Component cannot safely access `pagination.totalPages`, `pagination.currentPage`, etc.

---

### Component 4.3: `useRateLimitFromExams` Hook

**Location**: [src/hooks/useRateLimitFromExams.ts](src/hooks/useRateLimitFromExams.ts#L16-19)

**Issues Found**:

- **Line 16**: `rateLimit?: any` — Should be `ExamRateLimitData | undefined`
- **Line 19**: `mutateExams?: () => Promise<any>` — Should specify return type

**How It's Used**:

```typescript
export function useRateLimitFromExams(
  rateLimit?: any,  // ⚠️ LOOSE TYPING
  exams?: ExamListItem[],
  isLoading: boolean = false,
  mutateExams?: () => Promise<any>,  // ⚠️ LOOSE TYPING
) {
```

**Expected Types**:

```typescript
import { ExamRateLimitData } from '@/src/types/swr-data/exams';

export function useRateLimitFromExams(
  rateLimit?: ExamRateLimitData,
  exams?: ExamListItem[],
  isLoading: boolean = false,
  mutateExams?: () => Promise<void>,
) {
```

---

## 5. MISSING TYPE DEFINITIONS

### Missing 5.1: `ExamAnswerSubmission` Request Type

**Where Needed**: `submitExamFetcher` parameter

**Current Gap**: The `body` parameter in submit exam has no type definition

**Required Type**:

```typescript
// Add to src/types/swr-data/exams.ts
export interface ExamAnswerSubmission {
  answers: UserAnswer[]; // or appropriate structure
  // other submit-specific fields
}
```

**Then Export Re-export from Hook**:

```typescript
// In src/swr/exams.ts
export type { ExamAnswerSubmission } from '@/src/types/swr-data/exams';
```

---

## 6. IMPLEMENTATION CHECKLIST

### Phase 1: Type Definition Fixes

- [ ] Create `ExamCertificationDetails` interface (or use existing `ExamCertificationData`)
- [ ] Create `ExamAnswerSubmission` interface for submit POST body
- [ ] Update `ExamState.exam_status` from `string | undefined` to `BackendExamStatus | undefined`
- [ ] Update `ExamState.certification` to use explicit `ExamCertificationData` type
- [ ] Update `ExamState.generation_progress` to use `ExamGenerationProgressData` type
- [ ] Add JSDoc comments marking @guaranteed vs @optional fields on `ExamState`
- [ ] Verify TypeScript compilation: `npx tsc --noEmit`

### Phase 2: SWR Hook Updates

- [x] Update `submitExamFetcher` return type to `Promise<ApiResponse<ExamSubmitData>>`
- [x] Update `submitExamFetcher` parameter to use `ExamAnswerSubmission`
- [x] Update `useSubmitExam()` error type — added `Error` generic to `useSWRMutation`
- [x] Update `deleteExamFetcher` return type to `Promise<ApiResponse<ExamDeleteData>>`
- [x] Update `useDeleteExam()` error type — added `Error` generic to `useSWRMutation`
- [x] Update all string literal `'QUESTIONS_GENERATING'` comparisons to use `BackendExamStatus.QUESTIONS_GENERATING`
- [x] Verify TypeScript compilation: `npx tsc --noEmit`

### Phase 3: Consumer Component Updates

- [x] Update `ExamCard.tsx` line 40: `deleteExamError: any` → `deleteExamError?: Error | null`
- [x] Update `ExamOverview.tsx` line 11: `pagination?: any` → `pagination?: PaginationMeta`
- [x] Update `useRateLimitFromExams.ts` line 16: `rateLimit?: any` → `rateLimit?: ExamRateLimitData`
- [x] Update `useRateLimitFromExams.ts` line 19: `mutateExams?: () => Promise<any>` → `mutateExams?: () => Promise<void>`
- [x] Add required imports for new types (`BackendExamStatus` in `ExamCard.tsx`)
- [x] Verify TypeScript compilation: `npx tsc --noEmit`

### Phase 4: Verification

- [ ] Run TypeScript compiler: `npx tsc --noEmit 2>&1 | grep "^src/"`
- [ ] Grep for remaining `any` in exam-related code
- [ ] Search for remaining string literal `'QUESTIONS_GENERATING'` comparisons
- [ ] Spot-check that component optional fields use `?.` operator

---

## 7. RELATED MEMORY & PATTERNS

This analysis follows the **SWR Consumer Type Enforcement Pattern** documented in user memory. Key principles:

1. **Type Definition Foundation**: All API response types must be explicit (no `[key: string]: any`)
2. **Enum for Status Fields**: Use enums (`BackendExamStatus`) instead of string literals
3. **Field Optionality**: Mark each field as required or optional based on API behavior
4. **Re-export for Backward Compatibility**: Export types from SWR hook files for ease of import

---

## 8. FILES TO MODIFY (Summary)

| File                                     | Issue                                                         | Fix                                      |
| ---------------------------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| `src/swr/exams.ts`                       | `body: any`, `Promise<any>`, string literals, loose interface | Update fetchers, enums, interfaces       |
| `src/types/swr-data/exams.ts`            | Missing request type, loose interface fields                  | Create `ExamAnswerSubmission`, add JSDoc |
| `src/components/custom/ExamCard.tsx`     | `deleteExamError: any`                                        | Type as `Error \| undefined`             |
| `src/components/custom/ExamOverview.tsx` | `pagination?: any`                                            | Type as `PaginationMeta \| undefined`    |
| `src/hooks/useRateLimitFromExams.ts`     | `rateLimit?: any`, `Promise<any>`                             | Type `ExamRateLimitData`, fix return     |

---

## 9. SUCCESS CRITERIA

✅ **All of the following must be true**:

1. No `any` type used in:
   - Mutation fetcher parameters
   - Mutation fetcher return types
   - SWR hook return objects
   - Component prop interfaces for exam data
   - Hook parameters for exam data

2. All string literal status comparisons replaced with `BackendExamStatus` enum

3. All interfaces have explicit, required fields (no `[key: string]: any`)

4. TypeScript compilation shows 0 errors in `src/swr/exams.ts` and components

5. All component props that receive exam data are properly typed (not `any`)

---

## Next Steps

1. **Save this analysis** as reference during implementation
2. **Start with Phase 1** (type definitions) since components and hooks depend on it
3. **Apply changes systematically** using the multi_replace_string_in_file tool for efficiency
4. **Verify with TypeScript** after each phase to catch errors early
5. **Document any new types** that are created for future reference
