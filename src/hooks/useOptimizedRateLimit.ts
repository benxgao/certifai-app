import { useRateLimitFromExams } from './useRateLimitFromExams';
import { useAllUserExams } from '@/src/swr/exams';

// Re-export the type for backward compatibility
export type { RateLimitInfo } from '@/src/lib/rateLimitUtils';

/**
 * Comprehensive hook for rate limit information
 * Automatically tries to use exam data from various sources to avoid redundant API calls
 *
 * @param apiUserId - The user's API ID
 * @param examData - Optional exam data to use for rate limit calculation
 * @param rateLimit - Optional rate limit data from API response
 * @param isLoading - Whether exam data is loading
 * @param mutateExams - Function to refresh exam data
 * @returns Rate limit information and utilities
 */
export function useOptimizedRateLimit(
  apiUserId: string | null,
  examData?: any[],
  rateLimit?: any,
  isLoading?: boolean,
  mutateExams?: () => Promise<any>,
) {
  // Try to get rate limit from all user exams if no specific data is provided
  const {
    allExams,
    rateLimit: allExamsRateLimit,
    isLoadingAllExams,
    mutateAllExams,
  } = useAllUserExams(examData ? null : apiUserId);

  // Use the provided data if available, otherwise fall back to all exams data
  const effectiveExamData = examData || allExams;
  const effectiveRateLimit = rateLimit || allExamsRateLimit;
  const effectiveIsLoading = isLoading ?? isLoadingAllExams;
  const effectiveMutateExams = mutateExams || mutateAllExams;

  return useRateLimitFromExams(
    effectiveRateLimit,
    effectiveExamData,
    effectiveIsLoading,
    effectiveMutateExams,
  );
}

/**
 * Legacy compatibility hook for existing code
 * Provides the same interface as the old useRateLimitInfo but uses optimized data fetching
 *
 * @param apiUserId - The user's API ID
 * @returns Rate limit information compatible with the old interface
 */
export function useRateLimitInfo(apiUserId: string | null) {
  return useOptimizedRateLimit(apiUserId);
}
