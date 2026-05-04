import useSWRMutation from 'swr/mutation';
import { useAuthSWR } from './useAuthSWR';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { ApiResponse, PaginatedApiResponse } from '../types/api';
import { BackendExamStatus } from '../types/exam-status';
import { fetchAllPages } from '@/src/lib/pagination-utils';
import { getRateLimitInfo } from '@/src/lib/rateLimitUtils';
import { useRef, useCallback, useEffect } from 'react';
import {
  ExamListItemData,
  ExamRateLimitData,
  ExamAnswerSubmission,
  ExamSubmitData,
  ExamDeleteData,
  ExamDetailData,
} from '@/src/types/swr-data/exams';

// Type aliases for backward compatibility
export type ExamListItem = ExamListItemData;

// Enhanced response that includes rate limit information
export interface EnhancedExamListResponse extends PaginatedApiResponse<ExamListItem[]> {
  rateLimit: ExamRateLimitData;
}

// Hook to get all exams for a user across all certifications with rate limit info
export function useAllUserExams(apiUserId: string | null) {
  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    EnhancedExamListResponse,
    Error
  >(
    apiUserId ? `/api/users/${apiUserId}/exams?pageSize=50` : null, // Fetch larger page size to get more exams
    {
      // Enable more conservative polling if there are exams in generating status
      refreshInterval: (data) => {
        const hasGeneratingExams = data?.data?.some(
          (exam) =>
            exam.exam_status === BackendExamStatus.QUESTIONS_GENERATING ||
            exam.status === BackendExamStatus.QUESTIONS_GENERATING,
        );
        return hasGeneratingExams ? 5000 : 0; // Poll every 5 seconds if generating (more conservative)
      },
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      // Add deduplication settings to prevent duplicate requests
      dedupingInterval: 2000, // 2 seconds - reduce to allow faster updates when exam status changes
      focusThrottleInterval: 10000, // 10 seconds
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: true, // Enable revalidation for fresh dashboard stats
      keepPreviousData: true,
      errorRetryCount: 1, // Allow 1 retry for exams
      errorRetryInterval: 5000,
    },
  );

  // Use totalItems from pagination metadata if available, otherwise fall back to data length
  const totalExamCount =
    data?.meta?.totalItems !== undefined && data.meta.totalItems > (data.data?.length || 0)
      ? data.meta.totalItems
      : data?.data?.length || 0;

  // Function to fetch all exams across all pages
  const fetchAllExams = async (): Promise<ExamListItem[]> => {
    if (!apiUserId) return [];
    return fetchAllPages<ExamListItem>(`/api/users/${apiUserId}/exams`, {}, 50, 20);
  };

  // Function to get rate limit info with fallback calculation
  const getRateLimitFromData = () => {
    return getRateLimitInfo(data?.rateLimit, data?.data);
  };

  return {
    allExams: data?.data,
    totalExamCount: totalExamCount,
    pagination: data?.meta,
    rateLimit: data?.rateLimit, // Include rate limit information from the enhanced response
    getRateLimitInfo: getRateLimitFromData, // Convenience function to get rate limit info
    isLoadingAllExams: isLoading,
    isAllExamsError: error,
    isValidatingAllExams: isValidating,
    mutateAllExams: mutate,
    fetchAllExams, // Add this function for cases where all data is needed
  };
}

export function useExamsForCertification(apiUserId: string | null, certId: number | null) {
  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    EnhancedExamListResponse,
    Error
  >(
    apiUserId && certId ? `/api/users/${apiUserId}/certifications/${certId}/exams` : null, // Conditional fetching
    {
      // Enable more conservative polling if there are exams in generating status
      refreshInterval: (data) => {
        const hasGeneratingExams = data?.data?.some(
          (exam) =>
            exam.exam_status === BackendExamStatus.QUESTIONS_GENERATING ||
            exam.status === BackendExamStatus.QUESTIONS_GENERATING,
        );
        return hasGeneratingExams ? 5000 : 0; // Poll every 5 seconds if generating (more conservative)
      },
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      // Add deduplication settings to prevent duplicate requests
      dedupingInterval: 10000, // 10 seconds for exams (shorter than certifications since exams can change state)
      focusThrottleInterval: 30000, // 30 seconds
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: true, // Enable revalidation for updated exam lists
      keepPreviousData: true,
      errorRetryCount: 1, // Allow 1 retry for exams since they're more dynamic
      errorRetryInterval: 5000,
    },
  );

  return {
    exams: data?.data,
    pagination: data?.meta,
    rateLimit: data?.rateLimit, // Include rate limit information from the enhanced response
    isLoadingExams: isLoading,
    isExamsError: error,
    isValidatingExams: isValidating,
    mutateExams: mutate,
  };
}

// Fetcher function for submitting exams with auth refresh support
async function submitExamFetcher(
  _key: string,
  {
    arg,
  }: {
    arg: {
      apiUserId: string;
      certId: number;
      examId: string;
      body: ExamAnswerSubmission;
      refreshToken: () => Promise<string | null>;
    };
  },
): Promise<ApiResponse<ExamSubmitData>> {
  const { apiUserId, certId, examId, body, refreshToken } = arg;
  const url = `/api/users/${apiUserId}/certifications/${certId}/exams/${examId}/submit`;

  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  // If we get a 401, try to refresh token and retry
  if (response.status === 401) {
    const newToken = await refreshToken();

    if (newToken) {
      // Retry the request with refreshed token (cookie should be updated automatically)
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to submit exam.');
  }

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
    return { success: true, data: { score: 0, tokens_deducted: 0, energy_tokens_awarded: 0, correct_answers: 0 } };
  }

  const result = await response.json();
  return result;
}

export function useSubmitExam() {
  const { refreshToken } = useFirebaseAuth();

  const { trigger, isMutating, error } = useSWRMutation<
    ApiResponse<ExamSubmitData>,
    Error,
    string,
    {
      apiUserId: string;
      certId: number;
      examId: string;
      body: ExamAnswerSubmission;
      refreshToken: () => Promise<string | null>;
    }
  >(
    'SUBMIT_EXAM', // Static key for this type of mutation
    submitExamFetcher,
  );

  // Wrapper to inject refreshToken function
  const submitExam = (arg: {
    apiUserId: string;
    certId: number;
    examId: string;
    body: ExamAnswerSubmission;
  }) => {
    return trigger({ ...arg, refreshToken });
  };

  return {
    submitExam,
    isSubmittingExam: isMutating,
    submitExamError: error,
  };
}

// Fetcher function for deleting exams with auth refresh support
async function deleteExamFetcher(
  _key: string,
  {
    arg,
  }: {
    arg: {
      apiUserId: string;
      examId: string;
      refreshToken: () => Promise<string | null>;
    };
  },
): Promise<ApiResponse<ExamDeleteData>> {
  const { apiUserId, examId, refreshToken } = arg;
  const url = `/api/users/${apiUserId}/exams/${examId}`;

  let response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // If we get a 401, try to refresh token and retry
  if (response.status === 401) {
    const newToken = await refreshToken();

    if (newToken) {
      // Retry the request with refreshed token (cookie should be updated automatically)
      response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to delete exam.');
  }

  const result = await response.json();
  return result;
}

export function useDeleteExam() {
  const { refreshToken } = useFirebaseAuth();

  const { trigger, isMutating, error } = useSWRMutation<
    ApiResponse<ExamDeleteData>,
    Error,
    string,
    {
      apiUserId: string;
      examId: string;
      refreshToken: () => Promise<string | null>;
    }
  >(
    'DELETE_EXAM', // Static key for this type of mutation
    deleteExamFetcher,
  );

  // Wrapper to inject refreshToken function
  const deleteExam = (arg: { apiUserId: string; examId: string }) => {
    return trigger({ ...arg, refreshToken });
  };

  return {
    deleteExam,
    isDeletingExam: isMutating,
    deleteExamError: error,
  };
}

/**
 * ExamState is an alias for ExamDetailData — the full exam detail shape.
 * Kept for backward compatibility with existing consumers.
 * Source of Truth: functions/src/endpoints/api/users/exams/getUserExam.ts
 */
export type ExamState = ExamDetailData;

/**
 * Hook to fetch full exam detail for a single exam.
 *
 * Updated in Phase 5b.3:
 * - URL fixed to `/api/users/{userId}/exams/{examId}` (certId is NOT in backend path)
 * - Returns `answers`, `progress`, `generationProgress`, `certification` directly
 * - `ExamState` is now an alias for `ExamDetailData` (single source of truth)
 *
 * @param apiUserId - User ID
 * @param certId - Certification ID (kept for backward-compatibility, not used in URL)
 * @param examId - Exam ID
 *
 * @example
 * const { examState, answers, progress, isLoadingExamState } = useExamState(apiUserId, certId, examId);
 *
 * @see functions/src/endpoints/api/users/exams/getUserExam.ts
 */
export function useExamState(
  apiUserId: string | null,
  certId: number | null, // Not used in URL — kept for backward compatibility
  examId: string | null,
) {
  // Create a stable key for caching and conditional fetching
  // Backend endpoint: GET /api/users/:user_id/exams/:exam_id (certId is NOT in path)
  const cacheKey =
    apiUserId && examId
      ? `/api/users/${apiUserId}/exams/${examId}`
      : null;

  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    ApiResponse<ExamDetailData>,
    Error
  >(cacheKey, {
    // Enable simple polling for generating exams
    refreshInterval: (data) => {
      const examStatus = data?.data?.exam_status || data?.data?.status;
      if (examStatus === BackendExamStatus.QUESTIONS_GENERATING) {
        return 2000; // Poll every 2 seconds for generating exams (aligned with liveStatus)
      }
      return 0;
    },
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    // Disable revalidation on focus and reconnect for ready exams to prevent unnecessary requests
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    // Maximum deduplication to prevent any duplicate requests
    dedupingInterval: 60000, // Increased to 60 seconds for complete deduplication
    // Disable focus throttle entirely
    focusThrottleInterval: 300000, // 5 minutes
    // Prevent retries for stable states
    shouldRetryOnError: (error) => {
      // Don't retry if we have a successful response with stable status
      const examStatus = data?.data?.exam_status || data?.data?.status;
      if (examStatus && examStatus !== BackendExamStatus.QUESTIONS_GENERATING) {
        return false;
      }
      return true;
    },
    // Minimal retries
    errorRetryCount: 0, // Changed to 0 to prevent any retry-based duplicates
    errorRetryInterval: 10000,
    // Enable automatic revalidation to get fresh data after exam submission
    revalidateIfStale: true,
    // Keep previous data to prevent unnecessary loading states
    keepPreviousData: true,
    // Enable revalidation when component mounts to fetch initial data
    revalidateOnMount: true,
  });

  // Add deduplication wrapper for mutateExamState
  const lastMutateTime = useRef<number>(0);
  const MUTATE_COOLDOWN = 2000; // 2 seconds minimum between mutations

  const debouncedMutate = useCallback(
    (...args: Parameters<typeof mutate>) => {
      const now = Date.now();
      if (now - lastMutateTime.current > MUTATE_COOLDOWN) {
        lastMutateTime.current = now;
        return mutate(...args);
      }
      // Return a resolved promise to maintain the same API
      return Promise.resolve(data);
    },
    [mutate, data],
  );

  return {
    examState: data?.data,
    answers: data?.data?.answers,
    progress: data?.data?.progress,
    generationProgress: data?.data?.generation_progress,
    certification: data?.data?.certification,
    isLoadingExamState: isLoading,
    isExamStateError: error,
    isValidatingExamState: isValidating,
    mutateExamState: debouncedMutate,
  };
}
