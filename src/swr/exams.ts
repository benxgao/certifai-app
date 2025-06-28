import useSWRMutation from 'swr/mutation';
import { useAuthSWR } from './useAuthSWR';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { ApiResponse, PaginatedApiResponse } from '../types/api';

export interface ExamListItem {
  exam_id: string;
  user_id: string;
  cert_id: number;
  exam_status?: string; // Database exam status
  score: number | null;
  token_cost: number;
  started_at: string;
  submitted_at: number | null;
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

export function useExamsForCertification(apiUserId: string | null, certId: number | null) {
  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    PaginatedApiResponse<ExamListItem[]>,
    Error
  >(
    certId ? `/api/users/${apiUserId}/certifications/${certId}/exams` : null, // Conditional fetching
    {
      // Enable polling if there are exams in generating status
      refreshInterval: (data) => {
        const hasGeneratingExams = data?.data?.some(
          (exam) =>
            exam.exam_status === 'QUESTIONS_GENERATING' || exam.status === 'QUESTIONS_GENERATING',
        );
        return hasGeneratingExams ? 5000 : 0; // Poll every 5 seconds if generating
      },
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    },
  );

  return {
    exams: data?.data,
    pagination: data?.meta,
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

// Interface for exam state/details
export interface ExamState {
  exam_id: string;
  user_id: string;
  cert_id: number;
  exam_status?: string; // Database exam status
  score: number | null;
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
}

// Hook to get exam state/details
export function useExamState(
  apiUserId: string | null,
  certId: number | null,
  examId: string | null,
) {
  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    ApiResponse<ExamState>,
    Error
  >(
    apiUserId && certId && examId
      ? `/api/users/${apiUserId}/certifications/${certId}/exams/${examId}`
      : null,
    {
      // Enable polling if exam is in generating status
      refreshInterval: (data) => {
        const examStatus = data?.data?.exam_status || data?.data?.status;
        return examStatus === 'QUESTIONS_GENERATING' ? 5000 : 0; // Poll every 5 seconds if generating
      },
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      revalidateOnFocus: true,
    },
  );

  return {
    examState: data?.data,
    isLoadingExamState: isLoading,
    isExamStateError: error,
    isValidatingExamState: isValidating,
    mutateExamState: mutate,
  };
}
