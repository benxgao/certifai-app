// src/swr/questions.ts
import useSWRMutation from 'swr/mutation'; // Import useSWRMutation
import { useAuthSWR } from './useAuthSWR';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { AnswerOptionData, QuestionData, ExamQuestionsData, SubmitAnswerData, SubmitAnswerError } from '@/src/types/swr-data/questions';
import { ApiResponse, PaginationMeta } from '@/src/types/api';

// Type aliases for backward compatibility
export type AnswerOption = AnswerOptionData;
export type Question = Omit<QuestionData, 'answerOptions'> & { answerOptions: AnswerOption[] };

/**
 * Hook to fetch paginated exam questions.
 *
 * Response shape changed in Phase 5b:
 * - Questions are nested in `data.data.questions` (ApiResponse<ExamQuestionsData>)
 * - Pagination metadata is in `data.meta` (PaginationMeta)
 *
 * @param url - Full API URL for the questions page, e.g.
 *   `/api/users/{userId}/exams/{examId}/questions?page=1&pageSize=10`
 *
 * @example
 * const { questions, pagination, isLoadingQuestions } = useExamQuestions(questionsApiUrl);
 *
 * @see functions/src/endpoints/api/users/exams/getExamQuestions.ts
 */
export function useExamQuestions(
  url: string | null, // The full API URL for the questions (can be first page or next_page)
) {
  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<ApiResponse<ExamQuestionsData>, Error>(
    url, // SWR key is the URL itself; SWR re-fetches if this changes
    {
      shouldRetryOnError: false, // Optional: configure SWR behavior
      revalidateOnFocus: false, // Optional: prevent revalidation on window focus
      revalidateOnReconnect: false, // Prevent revalidation on reconnect
      dedupingInterval: 3000, // Increase to 3 seconds to prevent rapid successive calls (overrides useAuthSWR's 5 second default)
      refreshInterval: 0, // Disable auto refresh
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      keepPreviousData: true, // Keep previous data while loading new data
      focusThrottleInterval: 15000, // Throttle focus revalidation to 15 seconds
    },
  );

  return {
    questions: data?.data?.questions,
    pagination: data?.meta as PaginationMeta | undefined,
    isLoadingQuestions: isLoading,
    isQuestionsError: error,
    isValidatingQuestions: isValidating,
    mutateQuestions: mutate,
  };
}

// Fetcher function for submitting answers with auth refresh support
async function submitAnswerFetcher(
  _key: string,
  {
    arg,
  }: {
    arg: {
      apiUserId: string;
      certId: number;
      examId: string;
      questionId: string;
      optionId: string;
      refreshToken: () => Promise<string | null>;
    };
  },
): Promise<ApiResponse<SubmitAnswerData>> {
  const { apiUserId, certId, examId, questionId, optionId, refreshToken } = arg;
  const apiUrl = `/api/users/${apiUserId}/certifications/${certId}/exams/${examId}/questions/${questionId}`;

  let response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quiz_question_id: questionId,
      answer_option_id: optionId,
    }),
  });

  // If we get a 401, try to refresh token and retry
  if (response.status === 401) {
    const newToken = await refreshToken();

    if (newToken) {
      // Retry the request with refreshed token (cookie should be updated automatically)
      response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz_question_id: questionId,
          answer_option_id: optionId,
        }),
      });
    } else {
      // If refresh failed, throw authentication error
      throw new Error('Authentication failed. Please sign in again.');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to save answer');
  }

  return response.json();
}

// Custom hook for submitting an answer using useSWRMutation
export function useSubmitAnswer() {
  const { refreshToken } = useFirebaseAuth();

  const {
    trigger: rawTrigger,
    isMutating, // Renaming this in the return object
    error: rawError,
    data,
    reset, // Optional: if the component needs to reset mutation state
  } = useSWRMutation<
    ApiResponse<SubmitAnswerData>,
    Error,
    string,
    {
      apiUserId: string;
      certId: number;
      examId: string;
      questionId: string;
      optionId: string;
      refreshToken: () => Promise<string | null>;
    }
  >(
    'SUBMIT_ANSWER', // A unique static key for this type of mutation
    submitAnswerFetcher,
    // Optional: Configuration for the mutation can be added here
    // e.g., for optimistic updates or revalidation strategies.
  );

  // Wrapper to inject refreshToken function and transform errors
  const submitAnswer = async (arg: {
    apiUserId: string;
    certId: number;
    examId: string;
    questionId: string;
    optionId: string;
  }) => {
    try {
      return await rawTrigger({ ...arg, refreshToken });
    } catch (err) {
      // Transform caught errors to include questionId for better error tracking
      if (err instanceof Error) {
        throw new SubmitAnswerError(err.message, arg.questionId);
      }
      throw err;
    }
  };

  // Transform raw error to SubmitAnswerError if available
  // Note: This handles errors from useSWRMutation's internal state
  let submitError: SubmitAnswerError | undefined;
  if (rawError instanceof Error) {
    // We don't have questionId from the hook state, so we use a generic error with empty questionId
    // The actual questionId is added by the submitAnswer wrapper above
    submitError = rawError as SubmitAnswerError;
  }

  return {
    submitAnswer, // The function to trigger the mutation
    isAnswering: isMutating, // Renamed from isSubmitting
    submitError, // Error state of the mutation
    submitData: data, // Data returned from a successful mutation
    resetSubmitState: reset, // Function to reset the mutation state
  };
}

// ...existing code...

// Utility function to extract topics from questions
export function extractTopicsFromQuestions(questions: Question[]): {
  topics: Array<{
    topic_name: string;
    question_count: number;
    question_ids: string[];
  }>;
  totalTopics: number;
  totalQuestions: number;
} {
  if (!questions || questions.length === 0) {
    return { topics: [], totalTopics: 0, totalQuestions: 0 };
  }

  // Group questions by topic
  const topicMap = new Map<string, { question_count: number; question_ids: string[] }>();

  questions.forEach((question) => {
    const topicName = question.exam_topic || 'General';
    if (!topicMap.has(topicName)) {
      topicMap.set(topicName, { question_count: 0, question_ids: [] });
    }
    const topicData = topicMap.get(topicName)!;
    topicData.question_count++;
    topicData.question_ids.push(question.quiz_question_id);
  });

  // Convert to array format
  const topics = Array.from(topicMap.entries()).map(([topic_name, data]) => ({
    topic_name,
    question_count: data.question_count,
    question_ids: data.question_ids,
  }));

  return {
    topics,
    totalTopics: topics.length,
    totalQuestions: questions.length,
  };
}
