import useSWRMutation from 'swr/mutation';
import { useAuthSWR } from './useAuthSWR';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { ApiResponse, PaginatedApiResponse } from '../types/api';
import { BackendExamStatus } from '../types/exam-status';
import { fetchAllPages } from '@/src/lib/pagination-utils';
import { getRateLimitInfo } from '@/src/lib/rateLimitUtils';
import { useRef, useCallback } from 'react';

// Enhanced response that includes rate limit information
export interface EnhancedExamListResponse extends PaginatedApiResponse<ExamListItem[]> {
  rateLimit: {
    maxExamsAllowed: number;
    currentCount: number;
    remainingCount: number;
    canCreateExam: boolean;
    resetTime: string;
    error?: string;
  };
}

export interface ExamListItem {
  exam_id: string;
  api_user_id: string; // Our internal UUID for API operations
  cert_id: number;
  exam_status?: BackendExamStatus; // Database exam status
  score: number | null;
  token_cost: number;
  total_questions: number; // Actual number of questions in this exam
  custom_prompt_text?: string | null; // Custom prompt used for question generation
  // Deprecated: keeping for backward compatibility only
  user_id?: string; // @deprecated Use api_user_id instead
  started_at: string | null; // Fixed: should be string | null to match backend
  submitted_at: number | null; // Fixed: should be number | null to match backend timestamp
  certification: {
    cert_id: number;
    // cert_category_id: number;
    name: string;
    exam_guide_url: string;
    min_quiz_counts: number;
    max_quiz_counts: number;
    pass_score: number;
  };
  status: string; // Computed status from API
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
            exam.exam_status === 'QUESTIONS_GENERATING' || exam.status === 'QUESTIONS_GENERATING',
        );
        return hasGeneratingExams ? 5000 : 0; // Poll every 5 seconds if generating (more conservative)
      },
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      // Add deduplication settings to prevent duplicate requests
      dedupingInterval: 10000, // 10 seconds
      focusThrottleInterval: 30000, // 30 seconds
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
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
            exam.exam_status === 'QUESTIONS_GENERATING' || exam.status === 'QUESTIONS_GENERATING',
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
      revalidateIfStale: false,
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
      body: any;
      refreshToken: () => Promise<string | null>;
    };
  },
): Promise<any> {
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
    console.log('Token expired during exam submission, attempting refresh...');
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
    return null;
  }

  return response.json();
}

export function useSubmitExam() {
  const { refreshToken } = useFirebaseAuth();

  const { trigger, isMutating, error } = useSWRMutation(
    'SUBMIT_EXAM', // Static key for this type of mutation
    submitExamFetcher,
  );

  // Wrapper to inject refreshToken function
  const submitExam = (arg: { apiUserId: string; certId: number; examId: string; body: any }) => {
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
): Promise<any> {
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
    console.log('Token expired during exam deletion, attempting refresh...');
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

  return response.json();
}

export function useDeleteExam() {
  const { refreshToken } = useFirebaseAuth();

  const { trigger, isMutating, error } = useSWRMutation(
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

// Interface for exam state/details
export interface ExamState {
  exam_id: string;
  user_id: string;
  cert_id: number;
  exam_status?: string; // Database exam status
  score: number | null;
  total_questions: number; // Actual number of questions in this exam
  custom_prompt_text?: string | null; // Custom prompt used for question generation
  started_at: string;
  submitted_at: number | null;
  status: string; // Computed status from API
  certification?: {
    cert_id: number;
    name: string;
    exam_guide_url: string;
    min_quiz_counts: number;
    max_quiz_counts: number;
    pass_score: number;
  };
  generation_progress?: {
    current_batch: number;
    total_batches: number;
    questions_generated: number;
    target_questions?: number;
    completion_percentage: number;
    updated_at: number;
  };
}

// Hook to get exam state/details with optimized polling for generation status
export function useExamState(
  apiUserId: string | null,
  certId: number | null,
  examId: string | null,
) {
  // Create a stable key for caching and conditional fetching
  const cacheKey =
    apiUserId && certId && examId
      ? `/api/users/${apiUserId}/certifications/${certId}/exams/${examId}`
      : null;

  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    ApiResponse<ExamState>,
    Error
  >(cacheKey, {
    // Enable simple polling for generating exams
    refreshInterval: (data) => {
      const examStatus = data?.data?.exam_status || data?.data?.status;
      if (examStatus === 'QUESTIONS_GENERATING') {
        return 3000; // Poll every 3 seconds for generating exams
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
      if (examStatus && examStatus !== 'QUESTIONS_GENERATING') {
        return false;
      }
      return true;
    },
    // Minimal retries
    errorRetryCount: 0, // Changed to 0 to prevent any retry-based duplicates
    errorRetryInterval: 10000,
    // Disable automatic revalidation to prevent duplicate requests
    revalidateIfStale: false,
    // Keep previous data to prevent unnecessary loading states
    keepPreviousData: true,
    // Disable revalidation when data is already cached
    revalidateOnMount: false,
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
    isLoadingExamState: isLoading,
    isExamStateError: error,
    isValidatingExamState: isValidating,
    mutateExamState: debouncedMutate,
  };
}
