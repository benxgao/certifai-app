// src/swr/questions.ts
import useSWRMutation from 'swr/mutation'; // Import useSWRMutation
import { PaginationInfo } from './utils';
import { useAuthSWR } from './useAuthSWR';

export interface AnswerOption {
  option_id: string; // Or number, depending on API
  option_text: string;
}

export interface Question {
  quiz_question_id: string;
  question_text: string;
  answerOptions: AnswerOption[];
  selected_option_id: string | null;
  difficulty: string;
  // topic_id: number;
  cert_id: number;
  user_answer_id: string;
  explanations?: string;
  user_answer_is_correct: boolean | null;
}

export interface ExamQuestionsResponse {
  data: { questions: Question[] };
  pagination: PaginationInfo; // Use imported PaginationInfo
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
    },
  );

  return {
    questions: data?.data?.questions,
    pagination: data?.pagination,
    isLoadingQuestions: isLoading,
    isQuestionsError: error,
    isValidatingQuestions: isValidating,
    mutateQuestions: mutate,
  };
}

// New fetcher function for the mutation
async function submitAnswerFetcher(
  _key: string, // The static key passed to useSWRMutation (e.g., "SUBMIT_ANSWER")
  {
    arg,
  }: {
    arg: {
      apiUserId: string;
      certId: number;
      examId: string;
      questionId: string; // This is the quiz_question_id
      optionId: string;
    };
  },
): Promise<any> {
  // Return type can be more specific based on actual API response
  const { apiUserId, certId, examId, questionId, optionId } = arg;
  const apiUrl = `/api/users/${apiUserId}/certifications/${certId}/exams/${examId}/questions/${questionId}`;

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quiz_question_id: questionId, // Matching the body of the original fetch call
      answer_option_id: optionId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to save answer');
  }
  // Assuming the API returns the updated question data or a success message
  return response.json();
}

// Custom hook for submitting an answer using useSWRMutation
export function useSubmitAnswer() {
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

  return {
    submitAnswer: trigger, // The function to trigger the mutation
    isAnswering: isMutating, // Renamed from isSubmitting
    submitError: error, // Error state of the mutation
    submitData: data, // Data returned from a successful mutation
    resetSubmitState: reset, // Function to reset the mutation state
  };
}
