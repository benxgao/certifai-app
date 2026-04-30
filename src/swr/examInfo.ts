'use client';

import { useAuthSWR } from './useAuthSWR';
import { ApiResponse } from '@/src/types/api';
import { ExamInfoData } from '@/src/types/swr-data/examInfo';

/**
 * Hook to fetch exam info data independently for the ExamProgressInfo component
 * This provides a clean separation of concerns and allows the progress card to have its own data fetching
 */
export function useExamInfo(apiUserId: string | null, examId: string | null) {
  // Create the API URL - note: we don't need certId for this endpoint
  const apiUrl = apiUserId && examId ? `/api/users/${apiUserId}/exams/${examId}` : null;

  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    ApiResponse<ExamInfoData>,
    Error
  >(apiUrl, {
    // Conservative caching for exam progress data
    dedupingInterval: 30000, // 30 seconds
    focusThrottleInterval: 60000, // 1 minute
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: true, // Enable revalidation for updated exam status
    keepPreviousData: true,
    errorRetryCount: 2,
    errorRetryInterval: 3000,
    // Only refresh if exam is in generating state
    refreshInterval: (data) => {
      const examStatus = data?.data?.exam_status || data?.data?.status;
      if (examStatus === 'QUESTIONS_GENERATING') {
        return 10000; // Poll every 10 seconds for generating exams
      }
      return 0; // No polling for stable states
    },
  });

  return {
    examInfoData: data?.data || null,
    isLoadingExamInfo: isLoading,
    isValidatingExamInfo: isValidating,
    examInfoError: error,
    mutateExamInfo: mutate,
  };
}
