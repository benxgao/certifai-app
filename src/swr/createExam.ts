import useSWRMutation from 'swr/mutation';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { ApiResponse } from '../types/api';
import {
  CreateExamRequest,
  CreateExamResponse,
  SwrDataCreateExamResponse,
  RateLimitError,
  CreateExamError,
} from '@/src/types/swr-data/createExam';

// Re-export types for backward compatibility
export type {
  CreateExamRequest,
  CreateExamResponse,
  RateLimitError,
  CreateExamError,
} from '@/src/types/swr-data/createExam';

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

  return response.json(); // ApiResponse<SwrDataCreateExamResponse>
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
