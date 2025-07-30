# Neutral Language Update for Exam Status

## Overview

Updated exam status language to use neutral, descriptive terms instead of judgmental pass/fail language, as the system is not in a position to determine success or failure for users.

## Changes Made

### Frontend Status Labels (exam-status.ts)

**Before:**

- `completed_successful`: "Passed" (emerald background)
- `completed_review`: "Failed" (red background)

**After:**

- `completed_successful`: "Score Above Threshold" (emerald background)
- `completed_review`: "Score Below Threshold" (amber background)

**Key improvements:**

- Neutral, descriptive language that states facts rather than making judgments
- Changed color from red to amber for "below threshold" to be less harsh
- Maintains clear distinction while being respectful

### Backend API Status Values (getUserExam.ts)

**Before:**

- Status: `'PASSED'` or `'FAILED'`
- Performance fields: `is_passing`, `score_needed_to_pass`

**After:**

- Status: `'SCORE_ABOVE_THRESHOLD'` or `'SCORE_BELOW_THRESHOLD'`
- Performance fields: `meets_threshold`, `threshold_score`

### UI Button Text (ExamCard.tsx)

**Before:**

- `completed_successful`: "View Certificate"

**After:**

- `completed_successful`: "View Results & Certificate"

## Rationale

### Why These Changes Matter

1. **Respectful Language**: Avoids making judgments about user performance
2. **Accurate Representation**: The system measures scores against thresholds, not success/failure
3. **User Experience**: Less intimidating language encourages continued learning
4. **Professional Tone**: More appropriate for educational/certification platforms

### Technical Benefits

- **Consistency**: Aligned frontend and backend terminology
- **Clarity**: More descriptive of what the system actually measures
- **Flexibility**: Easier to adapt to different certification requirements

## Impact

- **User-facing**: Status badges now show "Score Above/Below Threshold" instead of "Passed/Failed"
- **API responses**: Updated status values to use neutral terminology
- **Visual design**: Changed harsh red color to softer amber for below-threshold results
- **Button text**: More inclusive language that doesn't assume certificate eligibility

## Backward Compatibility

- Frontend changes are purely cosmetic and don't break existing functionality
- Backend API changes maintain the same data structure with updated values
- All existing components continue to work with the new neutral language
