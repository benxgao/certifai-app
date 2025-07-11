import { useMemo } from 'react';
import { ExamListItem } from '@/src/swr/exams';
import { getRateLimitInfo } from '@/src/lib/rateLimitUtils';

/**
 * Hook to extract rate limit information from exam data
 * This eliminates the need for separate rate limit API calls
 *
 * @param rateLimit - Rate limit data from exam API response
 * @param exams - Array of exam data for fallback calculation
 * @param isLoading - Whether exam data is still loading
 * @param mutateExams - Function to refresh exam data (used when rate limit needs to be refreshed)
 * @returns Rate limit information and loading state
 */
export function useRateLimitFromExams(
  rateLimit?: any,
  exams?: ExamListItem[],
  isLoading: boolean = false,
  mutateExams?: () => Promise<any>,
) {
  const rateLimitInfo = useMemo(() => {
    if (isLoading) return null;
    return getRateLimitInfo(rateLimit, exams);
  }, [rateLimit, exams, isLoading]);

  const mutateRateLimit = useMemo(() => {
    return mutateExams || (() => Promise.resolve());
  }, [mutateExams]);

  return {
    rateLimitInfo,
    isLoadingRateLimit: isLoading,
    mutateRateLimit,
  };
}
