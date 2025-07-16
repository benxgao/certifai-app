import useSWRMutation from 'swr/mutation';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { ApiResponse } from '../types/api';

export interface CreateExamRequest {
  numberOfQuestions: number;
  customPromptText?: string;
}

export interface CreateExamResponse {
  exam_id: string;
  user_id: string;
  cert_id: number;
  status: string;
  total_questions: number;
  token_cost: number;
  total_batches: number;
  topics_generated: number; // NEW: Number of AI-generated topics
  custom_prompt: string;
}

export interface RateLimitError {
  maxExamsAllowed: number;
  currentCount: number;
  remainingCount: number;
  resetTime: string;
}

export interface CreateExamError extends Error {
  status?: number;
  rateLimitInfo?: RateLimitError;
}

// Fetcher function for creating exams with auth refresh support
async function createExamFetcher(
  _key: string,
  {
    arg,
  }: {
    arg: {
      apiUserId: string;
      certId: number;
      body: CreateExamRequest;
      refreshToken: () => Promise<string | null>;
    };
  },
): Promise<ApiResponse<CreateExamResponse>> {
  const { apiUserId, certId, body, refreshToken } = arg;
  const url = `/api/users/${apiUserId}/certifications/${certId}/exams`;

  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  // If we get a 401, try to refresh token and retry
  if (response.status === 401) {
    console.log('Token expired during exam creation, attempting refresh...');
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
    const errorData = await response.json().catch(() => ({
      success: false,
      error: response.statusText,
    }));

    const error = new Error(errorData.error || 'Failed to create exam.') as CreateExamError;
    error.status = response.status;

    // Handle rate limiting error (429)
    if (response.status === 429 && errorData.data) {
      error.rateLimitInfo = errorData.data;
    }

    throw error;
  }

  return response.json();
}

export function useCreateExam() {
  const { refreshToken } = useFirebaseAuth();

  const { trigger, isMutating, error } = useSWRMutation(
    'CREATE_EXAM', // Static key for this type of mutation
    createExamFetcher,
  );

  // Wrapper to inject refreshToken function
  const createExam = (arg: { apiUserId: string; certId: number; body: CreateExamRequest }) => {
    return trigger({ ...arg, refreshToken });
  };

  return {
    createExam,
    isCreatingExam: isMutating,
    createExamError: error as CreateExamError | undefined,
  };
}
