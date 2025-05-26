// src/swr/questions.ts
import useSWR from 'swr';
import { fetcher, PaginationInfo } from './utils';

export interface AnswerOption {
  option_id: string; // Or number, depending on API
  option_text: string;
}

export interface Question {
  quiz_question_id: string; // Or number
  question_body: string;
  answerOptions: AnswerOption[];
  // Add other relevant question properties here
  // e.g., explanation: string;
  // e.g., user_answer_id: string | null;
  // e.g., is_correct: boolean | null;
}

export interface ExamQuestionsResponse {
  data: { questions: Question[] };
  pagination: PaginationInfo; // Use imported PaginationInfo
}

// Hook to fetch questions for a specific exam page URL
export function useExamQuestions(
  url: string | null, // The full API URL for the questions (can be first page or next_page)
) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<ExamQuestionsResponse, Error>(
    url, // SWR key is the URL itself; SWR re-fetches if this changes
    fetcher,
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
