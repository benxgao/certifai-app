// src/swr/questions.ts
import useSWRMutation from 'swr/mutation'; // Import useSWRMutation
import { PaginationInfo } from './utils';
import { useAuthSWR } from './useAuthSWR';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

export interface AnswerOption {
  option_id: string; // Or number, depending on API
  option_text: string;
  is_correct?: boolean; // Optional field to indicate if this is the correct answer
}

export interface Question {
  quiz_question_id: string;
  question_text: string;
  answerOptions: AnswerOption[];
  selected_option_id: string | null;
  difficulty: string;
  // topic_id: number;
  cert_id: number;
  exam_topic?: string | null; // AI-generated exam topic for this question
  user_answer_id: string;
  explanations?: string;
  user_answer_is_correct: boolean | null;
  correct_option_id?: string | null; // Optional field to indicate the correct answer
}

export interface ExamQuestionsResponse {
  data: { questions: Question[] };
  meta: PaginationInfo; // Updated to use meta instead of pagination to match API
}

// Hook to fetch questions for a specific exam page URL
export function useExamQuestions(
  url: string | null, // The full API URL for the questions (can be first page or next_page)
) {
  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<ExamQuestionsResponse, Error>(
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
    pagination: data?.meta,
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
): Promise<any> {
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
    console.log('Token expired during answer submission, attempting refresh...');
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
    trigger,
    isMutating, // Renaming this in the return object
    error,
    data,
    reset, // Optional: if the component needs to reset mutation state
  } = useSWRMutation(
    'SUBMIT_ANSWER', // A unique static key for this type of mutation
    submitAnswerFetcher,
    // Optional: Configuration for the mutation can be added here
    // e.g., for optimistic updates or revalidation strategies.
  );

  // Wrapper to inject refreshToken function
  const submitAnswer = (arg: {
    apiUserId: string;
    certId: number;
    examId: string;
    questionId: string;
    optionId: string;
  }) => {
    return trigger({ ...arg, refreshToken });
  };

  return {
    submitAnswer, // The function to trigger the mutation
    isAnswering: isMutating, // Renamed from isSubmitting
    submitError: error, // Error state of the mutation
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
