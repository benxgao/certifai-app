'use client';

import { useAuthSWR } from './useAuthSWR';
import { ApiResponse } from '@/src/types/api';

export interface ExamInfoData {
  exam_id: string;
  api_user_id: string; // Our internal UUID for API operations
  cert_id: number;
  exam_status: string;
  total_questions: number;
  score: number | null;
  token_cost: number;
  custom_prompt_text: string | null;
  started_at: string | null;
  submitted_at: string | null;
  status: string;
  // Deprecated: keeping for backward compatibility only
  user_id?: string; // @deprecated Use api_user_id instead
  progress?: {
    total_questions: number;
    answered_questions: number;
    correct_answers: number;
    completion_percentage: number;
  };
}

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
    revalidateIfStale: false,
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
