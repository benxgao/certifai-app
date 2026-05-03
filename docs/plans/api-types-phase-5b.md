# Phase 5b: Exam Endpoints Contract Alignment Plan

**Backend Commit**: `9039b7cb37ee4186c57cadd81db644bfeaf99825` (Type Enforcement Phase 5b)
**Date**: May 4, 2026
**Status**: Ready for Implementation

---

## 🎯 Objective

Align certifai-app frontend with certifai-api exam endpoint type enforcement changes. The backend has standardized all exam endpoint handler signatures and response shapes. This plan ensures the frontend SWR hooks and types match the actual API contracts.

---

## 📊 Contract Drift Analysis

### ✅ Already Aligned (No Changes Needed)

1. **POST /api/users/:user_id/certifications/:cert_id/exams** (Create Exam)
   - Backend returns: `exam_id`, `api_user_id`, `cert_id`, `status`, `total_questions`, `token_cost`, `total_batches`, `topics_generated`, `custom_prompt`
   - Frontend `CreateExamResponse`: Already matches ✅

2. **GET /api/users/:user_id/exams/:exam_id/live-status** (Live Status)
   - Backend returns: `exam_id`, `exam_status`, `progress_percentage`, `topics_with_questions`, `total_topics`, `total_questions`, `estimated_seconds_remaining`, `is_complete`, etc.
   - Frontend `ExamLiveStatusData`: Already matches ✅

3. **POST /api/users/:user_id/certifications/:cert_id/exams/:exam_id/submit** (Submit Exam)
   - Backend returns: `score`, `tokens_deducted`, `energy_tokens_awarded`, `correct_answers`
   - Frontend `ExamSubmitData`: Already matches ✅

4. **GET /api/users/:user_id/exams** (List Exams)
   - Backend returns paginated exam list with rate limit info
   - Frontend `ExamListItemData`: Already matches ✅

### ⚠️ Contract Drift Requiring Updates

1. **GET /api/users/:user_id/exams/:exam_id** (Get Exam Detail)
   - **Issue**: Response includes nested answer objects with full question data that frontend doesn't type correctly
   - **Impact**: Medium - affects exam detail page
   - **Priority**: High

2. **GET /api/users/:user_id/exams/:exam_id/questions** (Get Exam Questions)
   - **Issue**: Response shape is `{ success, data: { questions: [...] }, pagination }` not flat `data: ExamQuestion[]`
   - **Impact**: High - affects question display
   - **Priority**: High

3. **DELETE /api/users/:user_id/exams/:exam_id** (Delete Exam)
   - **Issue**: Response includes detailed deletion summary, RTDB cleanup info, validation data (already typed in frontend but may need verification)
   - **Impact**: Low - already typed but needs verification
   - **Priority**: Medium

---

## 🏗️ Implementation Phases

### Phase 5b.1: Type Definition Updates (20 min)

**Goal**: Update type definitions to match actual API response shapes

**Files to Update**:

- `src/types/swr-data/exams.ts`
- `src/types/swr-data/questions.ts` (if needed)

**Changes**:

1. **Update `ExamDetailData`** to reflect actual getUserExam response:

   ```typescript
   export interface ExamDetailData {
     exam_id: string;
     api_user_id: string;
     cert_id: number;
     exam_status: BackendExamStatus;
     total_questions: number;
     score: number | null;
     token_cost: number;
     custom_prompt_text: string | null;
     started_at: string | null;
     submitted_at: string | null;
     status: string; // Computed status
     certification: ExamCertificationWithPerformance;
     // Nested answer data with full question details
     answers: ExamAnswerWithQuestion[];
     // Generation progress (only present if status === QUESTIONS_GENERATING)
     generation_progress?: ExamGenerationProgressData | null;
     // Progress metrics
     progress: ExamProgressData;
   }
   ```

2. **Add `ExamAnswerWithQuestion` interface**:

   ```typescript
   export interface ExamAnswerWithQuestion {
     user_answer_id: string;
     selected_option_id: string | null;
     is_correct: boolean | null;
     quizQuestion: {
       quiz_question_id: string;
       question_text: string;
       difficulty: string | null;
       generated_from: string | null;
       cert_id: number;
       explanations: string | null;
       exam_topic: string | null;
       answerOptions: {
         option_id: string;
         option_text: string;
         is_correct?: boolean; // Only present after submission
       }[];
     };
     selectedOption: {
       option_id: string;
       option_text: string;
       is_correct?: boolean;
     } | null;
   }
   ```

3. **Update `ExamQuestionResponse` type** (for getExamQuestions endpoint):

   ```typescript
   // Response from GET /api/users/:user_id/exams/:exam_id/questions
   export interface ExamQuestionsResponseData {
     questions: ExamQuestionWithAnswer[];
     total_questions: number;
     answered_questions: number;
   }

   export interface ExamQuestionWithAnswer {
     quiz_question_id: string;
     question_text: string;
     difficulty: string | null;
     generated_from: string | null;
     cert_id: number;
     user_answer_id: string; // ID of ExamUserAnswers record
     selected_option_id: string | null;
     explanations: string | null;
     exam_topic: string | null;
     user_answer_is_correct: boolean | null;
     answerOptions: {
       option_id: string;
       option_text: string;
       is_correct?: boolean; // Only shown after submission
     }[];
   }
   ```

**Testing**:

```bash
# After type updates
npx tsc --noEmit 2>&1 | grep "src/types/swr-data/exams"
# Should show no errors
```

**Commit Message**: `types: align ExamDetailData and ExamQuestionResponse with Phase 5b API contracts`

---

### Phase 5b.2: Questions Hook Refactor (25 min)

**Goal**: Update `useExamQuestions` hook to handle nested response shape

**Files to Update**:

- `src/swr/questions.ts`
- Any components using `useExamQuestions`

**Changes**:

1. **Update `useExamQuestions` hook return type**:

   ```typescript
   export function useExamQuestions(
     apiUserId: string | null,
     examId: string | null,
     options?: { pageSize?: number; page?: number },
   ) {
     const { data, error, isLoading, mutate } = useAuthSWR<
       ApiResponse<ExamQuestionsResponseData> & {
         pagination?: PaginationMeta;
       },
       Error
     >(
       apiUserId && examId
         ? `/api/users/${apiUserId}/exams/${examId}/questions?pageSize=${options?.pageSize || 10}&page=${options?.page || 1}`
         : null,
     );

     return {
       questions: data?.data?.questions, // Access nested questions array
       totalQuestions: data?.data?.total_questions,
       answeredQuestions: data?.data?.answered_questions,
       pagination: data?.pagination,
       isLoadingQuestions: isLoading,
       questionsError: error,
       mutateQuestions: mutate,
     };
   }
   ```

2. **Update components consuming questions**:
   - Search for `useExamQuestions` usage
   - Verify they access `questions` not `data` directly
   - Update any hardcoded response shape assumptions

**Testing**:

```bash
# 1. Type check
npx tsc --noEmit 2>&1 | grep "src/swr/questions\|useExamQuestions"

# 2. Component check - find all consumers
grep -r "useExamQuestions" app/ --include="*.tsx" --include="*.ts"

# 3. Manual test: Navigate to exam page, verify questions load correctly
```

**Commit Message**: `refactor: update useExamQuestions to handle nested response shape`

---

### Phase 5b.3: Exam Detail Hook Updates (25 min)

**Goal**: Update exam detail hooks and components to use new answer structure

**Files to Update**:

- `src/swr/exams.ts` (useExamState)
- Components consuming `ExamDetailData`

**Changes**:

1. **Update `useExamState` (or create `useExamDetail`)**:

   ```typescript
   export function useExamDetail(apiUserId: string | null, examId: string | null) {
     const { data, error, isLoading, mutate } = useAuthSWR<ApiResponse<ExamDetailData>, Error>(
       apiUserId && examId ? `/api/users/${apiUserId}/exams/${examId}` : null,
       {
         refreshInterval: (data) => {
           const status = data?.data?.exam_status;
           return status === BackendExamStatus.QUESTIONS_GENERATING ? 2000 : 0;
         },
         revalidateOnFocus: false,
       },
     );

     return {
       exam: data?.data,
       answers: data?.data?.answers, // Direct access to nested answers
       progress: data?.data?.progress,
       generationProgress: data?.data?.generation_progress,
       certification: data?.data?.certification,
       isLoadingExam: isLoading,
       examError: error,
       mutateExam: mutate,
     };
   }
   ```

2. **Find and update components**:

   ```bash
   # Find components using ExamState or ExamDetailData
   grep -r "ExamState\|ExamDetailData" app/ --include="*.tsx" --include="*.ts"
   ```

3. **Update exam detail page components**:
   - Access `exam.answers` instead of separate questions fetch (if applicable)
   - Use `exam.progress` for completion metrics
   - Use `exam.generation_progress` for generation status

**Testing**:

```bash
# 1. Type check
npx tsc --noEmit 2>&1 | grep "ExamDetailData\|useExamDetail"

# 2. Manual test
# - Navigate to exam detail page
# - Verify exam info displays correctly
# - Verify answers/questions load (if shown on detail page)
# - Check generation progress for QUESTIONS_GENERATING status
```

**Commit Message**: `refactor: update exam detail hooks to use nested answer structure`

---

### Phase 5b.4: Component Integration Testing (20 min)

**Goal**: Verify all exam-related components work with updated types

**Test Scenarios**:

1. **Exam List Page**:
   - [ ] All exams load correctly
   - [ ] Rate limit info displays
   - [ ] Exam statuses render properly
   - [ ] No console errors

2. **Exam Creation Flow**:
   - [ ] Create exam with custom prompt
   - [ ] Verify response structure matches `CreateExamResponse`
   - [ ] Generation status updates correctly

3. **Exam Detail Page**:
   - [ ] Exam details load
   - [ ] Progress metrics display correctly
   - [ ] Generation progress shows for QUESTIONS_GENERATING exams
   - [ ] Submitted exam shows score and answers

4. **Exam Questions Page**:
   - [ ] Questions load with pagination
   - [ ] Answer options display correctly
   - [ ] Selected answers persist
   - [ ] Explanations show after submission (if applicable)

5. **Live Status Polling**:
   - [ ] `useExamLiveStatus` polls during generation
   - [ ] Progress percentage updates
   - [ ] Stops polling when exam ready

6. **Exam Submission**:
   - [ ] Submit exam succeeds
   - [ ] Response shows score, tokens, energy awarded
   - [ ] UI updates with submission result

**Testing Commands**:

```bash
# Full type check
npx tsc --noEmit

# Run Jest tests (if any exist for exam hooks)
npm test -- --testPathPattern=exam

# E2E tests (if configured)
npm run test:e2e -- exam.spec.ts
```

**Commit Message**: `test: verify Phase 5b exam endpoint integration`

---

### Phase 5b.5: Documentation & Cleanup (15 min)

**Goal**: Update documentation and mark type-enforce.md changes as complete

**Tasks**:

1. **Update `type-enforce.md`**:
   - Mark Phase 5b exam endpoint items as completed
   - Update "Last Sync" date to May 4, 2026
   - Move completed items to "Verified Complete ✅" section

2. **Update hook JSDoc comments**:
   - Add `@example` usage for updated hooks
   - Document response shape changes
   - Add `@see` references to backend endpoints

3. **Add migration notes** (if breaking changes):
   - Document in `docs/plans/type-enforce.md`
   - Note any deprecated fields or changed patterns

**Example Documentation Update**:

```typescript
/**
 * Hook to fetch exam questions with pagination
 *
 * Response shape changed in Phase 5b:
 * - Questions are now nested in `data.questions` array
 * - Includes `total_questions` and `answered_questions` metadata
 *
 * @param apiUserId - User ID
 * @param examId - Exam ID
 * @param options - Pagination options
 *
 * @example
 * const { questions, totalQuestions, pagination } = useExamQuestions(userId, examId);
 *
 * @see functions/src/endpoints/api/users/exams/getExamQuestions.ts
 */
```

**Commit Message**: `docs: update Phase 5b exam endpoint documentation`

---

## 🔄 Rollback Plan

If issues arise during implementation:

1. **Phase 5b.1 Rollback**: Revert type definition changes

   ```bash
   git revert <commit-sha>
   ```

2. **Phase 5b.2 Rollback**: Revert questions hook changes, restore old fetcher

   ```bash
   git revert <commit-sha>
   ```

3. **Phase 5b.3 Rollback**: Revert exam detail changes
   ```bash
   git revert <commit-sha>
   ```

**Recovery**: Each phase is isolated with individual commits, allowing selective rollback without affecting previous phases.

---

## 📈 Success Criteria

- [ ] All TypeScript compilation passes (`npx tsc --noEmit`)
- [ ] No runtime errors in exam pages
- [ ] Exam list, creation, detail, questions, submission all work
- [ ] Live status polling updates correctly during generation
- [ ] All console errors related to exam types resolved
- [ ] Updated `type-enforce.md` reflects completed work

---

## 🔗 Related Files

**Backend (certifai-api)**:

- `functions/src/endpoints/api/users/exams/getUserExam.ts`
- `functions/src/endpoints/api/users/exams/getUserExams.ts`
- `functions/src/endpoints/api/users/exams/getExamQuestions.ts`
- `functions/src/endpoints/api/users/exams/createExam.ts`
- `functions/src/endpoints/api/users/exams/submitExamForUser.ts`
- `functions/src/endpoints/api/users/exams/getExamLiveStatus.ts`
- `functions/src/endpoints/api/users/exams/deleteExam.ts`

**Frontend (certifai-app)**:

- `src/types/swr-data/exams.ts`
- `src/types/swr-data/questions.ts`
- `src/swr/exams.ts`
- `src/swr/questions.ts`
- `src/swr/useExamLiveStatus.ts`
- `src/swr/createExam.ts`

---

## ⏱️ Time Estimates

| Phase     | Task                          | Time                   | Complexity |
| --------- | ----------------------------- | ---------------------- | ---------- |
| 5b.1      | Type Definition Updates       | 20 min                 | LOW        |
| 5b.2      | Questions Hook Refactor       | 25 min                 | MEDIUM     |
| 5b.3      | Exam Detail Hook Updates      | 25 min                 | MEDIUM     |
| 5b.4      | Component Integration Testing | 20 min                 | MEDIUM     |
| 5b.5      | Documentation & Cleanup       | 15 min                 | LOW        |
| **Total** |                               | **105 min (~2 hours)** |            |

---

## 🚀 Next Steps

After Phase 5b completion:

- [ ] Continue with Phase 5c: Certification Endpoints (if needed)
- [ ] Run full E2E test suite
- [ ] Update API documentation if contracts changed
- [ ] Consider creating schema validation tests for API responses

---

## 📝 Notes

- **Backend commit verified**: All exam handlers now use `AuthenticatedRequestHandler` with typed params/query/body
- **Contract validation**: Backend responses align with existing frontend types except for nested structures
- **Breaking changes**: None - mostly additive changes and better typing of existing fields
- **Performance**: No performance implications - type-only changes
