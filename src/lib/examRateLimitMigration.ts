/**
 * Migration guide for exam rate limiting refactoring
 *
 * This file provides examples of how to update existing code to use the new
 * optimized rate limiting system that reuses getUserExams API responses.
 */

// === BEFORE (OLD APPROACH) ===
// Multiple separate API calls:
// 1. useExamsForCertification(apiUserId, certId) - gets certification exams
// 2. useRateLimitInfo(apiUserId) - separate API call for rate limit
//
// function ExamPage() {
//   const { exams, isLoadingExams, mutateExams } = useExamsForCertification(apiUserId, certId);
//   const { rateLimitInfo, isLoadingRateLimit, mutateRateLimit } = useRateLimitInfo(apiUserId);
//   // ... rest of component
// }

// === AFTER (NEW OPTIMIZED APPROACH) ===
// Single API call with rate limit included:
//
// function ExamPage() {
//   const { exams, rateLimit, isLoadingExams, mutateExams } = useExamsForCertification(apiUserId, certId);
//   const { rateLimitInfo, isLoadingRateLimit, mutateRateLimit } = useRateLimitFromExams(
//     rateLimit,
//     exams,
//     isLoadingExams,
//     mutateExams
//   );
//   // ... rest of component
// }

// === ALTERNATIVE APPROACH (DROP-IN REPLACEMENT) ===
// For existing code that can't be easily changed:
//
// function ExamPage() {
//   const { rateLimitInfo, isLoadingRateLimit, mutateRateLimit } = useRateLimitInfo(apiUserId);
//   // This now automatically uses the optimized approach under the hood
// }

// === REUSABLE PATTERNS ===

import { useRateLimitFromExams } from '@/src/hooks/useRateLimitFromExams';
import { useExamsForCertification, useAllUserExams } from '@/src/swr/exams';

/**
 * Pattern 1: Certification-specific exams with rate limiting
 * Best for pages that show exams for a specific certification
 */
export function useCertificationExamsWithRateLimit(
  apiUserId: string | null,
  certId: number | null,
) {
  const { exams, rateLimit, isLoadingExams, mutateExams } = useExamsForCertification(
    apiUserId,
    certId,
  );
  const rateLimitResult = useRateLimitFromExams(rateLimit, exams, isLoadingExams, mutateExams);

  return {
    exams,
    ...rateLimitResult,
    isLoadingExams,
    mutateExams,
  };
}

/**
 * Pattern 2: All user exams with rate limiting
 * Best for dashboard or overview pages
 */
export function useAllExamsWithRateLimit(apiUserId: string | null) {
  const { allExams, rateLimit, isLoadingAllExams, mutateAllExams } = useAllUserExams(apiUserId);

  const rateLimitResult = useRateLimitFromExams(
    rateLimit,
    allExams,
    isLoadingAllExams,
    mutateAllExams,
  );

  return {
    exams: allExams,
    ...rateLimitResult,
    isLoadingExams: isLoadingAllExams,
    mutateExams: mutateAllExams,
  };
}

/**
 * Pattern 3: Custom exam data with rate limiting
 * Best for components that already have exam data from other sources
 */
export function useRateLimitFromCustomData(
  examData: any[],
  rateLimit?: any,
  isLoading: boolean = false,
  mutateFunction?: () => Promise<any>,
) {
  return useRateLimitFromExams(rateLimit, examData, isLoading, mutateFunction);
}

// === MIGRATION CHECKLIST ===
/*
1. ✅ Update useExamsForCertification to return rate limit data
2. ✅ Create useRateLimitFromExams hook to extract rate limit from exam data
3. ✅ Update certification exam pages to use the new approach
4. ✅ Create backward compatibility layer for useRateLimitInfo
5. ✅ Create utility functions for rate limit calculations
6. ✅ Test that rate limiting still works correctly
7. ⏳ Update other pages that use rate limiting
8. ⏳ Remove unused rate limit API endpoints (optional)
9. ⏳ Update documentation

Benefits of the new approach:
- Reduces API calls from 2 to 1 for pages showing exams + rate limit
- Rate limit info is always in sync with exam data
- Eliminates race conditions between exam and rate limit updates
- Better performance and reduced server load
- Maintains backward compatibility for existing code
*/
