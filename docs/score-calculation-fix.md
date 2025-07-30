# Score Calculation Bug Fix

## Issue

Exam scores were being calculated incorrectly, showing much lower percentages than expected. For example:

- 15 questions in exam, 5 correct answers
- Expected: 33% (5/15 \* 100)
- Actual: 3.07% (incorrect calculation)

## Root Cause

The score calculation in `submitExamForUser.ts` was dividing correct answers by the total number of questions in the **entire certification pool** instead of the number of questions in the **specific exam**.

```typescript
// WRONG: Using total questions in certification
currentScore = (correctlyAnsweredCount / totalQuestionsInExamDefinition) * 100;

// CORRECT: Using questions in this specific exam
currentScore = Math.round((correctlyAnsweredCount / examAttempt.total_questions) * 100);
```

## Changes Made

### Backend (certifai-api)

**File:** `functions/src/endpoints/api/users/exams/submitExamForUser.ts`

1. **Fixed score calculation logic:**

   - Now uses `examAttempt.total_questions` instead of `totalQuestionsInExamDefinition`
   - Added null safety check for `total_questions`
   - Removed unnecessary certification question counting logic

2. **Changed to integer scores:**

   - Uses `Math.round()` to avoid floating-point decimals
   - Stores integer value directly in database (no `parseFloat(toFixed(2))`)
   - Returns integer value in API response

3. **Improved logging:**
   - Updated log messages to reflect correct calculation
   - Simplified debugging information

### Frontend (certifai-app)

No changes required - the frontend already handles integer scores correctly:

- Score types are already `number | null`
- Average score calculation already uses `Math.round()`
- Display components work with integer values

## Verification

With the fix:

- 15 questions, 5 correct = 33% (5/15 \* 100 = 33.33, rounded to 33)
- No more floating-point precision issues
- Scores are consistent across all components

## Impact

- All future exam submissions will calculate scores correctly
- Existing exams with incorrect scores would need to be recalculated (if desired)
- No breaking changes to frontend components or API contracts
