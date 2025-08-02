import { useAuthSWR } from './useAuthSWR';
import { useEffect } from 'react';

interface ExamGeneratingProgress {
  exam_id: string;
  total_topics: number;
  topics_with_questions: number;
  topics_remaining: number;
  progress_percentage: number;
  status: 'starting' | 'generating' | 'complete';
  estimated_time_remaining_seconds: number;
  created_at: number;
  last_updated: number;
}

interface ExamGeneratingProgressResponse {
  success: boolean;
  data: ExamGeneratingProgress;
  error?: string;
}

export function useExamGeneratingProgress(apiUserId: string, examId: string, examStatus?: string) {
  // Only fetch when exam is actually generating
  const isGenerating = examStatus === 'QUESTIONS_GENERATING';
  const shouldFetch = Boolean(apiUserId && examId && isGenerating);
  const key = shouldFetch ? `/api/users/${apiUserId}/exams/${examId}/generating-progress` : null;

  const { data, error, isLoading, mutate } = useAuthSWR<ExamGeneratingProgressResponse>(key, {
    refreshInterval: 2000, // Poll every 2 seconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 1000, // Prevent duplicate requests within 1 second
    // Don't retry if exam is not in generating state
    shouldRetryOnError: (err) => {
      // If we get a 400 error with exam status message, don't retry
      if (err && typeof err === 'object' && 'status' in err && err.status === 400) {
        return false;
      }
      return true;
    },
    // Handle errors that occur when exam status changes
    onError: (err) => {
      // If we get a 400 error about exam status, it's expected - don't log as error
      if (err && typeof err === 'object' && 'status' in err && err.status === 400) {
        console.log('Exam generation progress check stopped - exam is no longer generating');
        return;
      }
      console.error('Error fetching exam generating progress:', err);
    },
  });

  // Filter out expected 400 errors when exam is no longer generating
  const filteredError =
    error && typeof error === 'object' && 'status' in error && error.status === 400
      ? undefined
      : error;

  // Clear any cached data when exam is no longer generating
  useEffect(() => {
    if (!isGenerating && data) {
      // Clear the cache when exam is no longer generating
      mutate(undefined, false);
    }
  }, [isGenerating, data, mutate]);

  return {
    progress: data?.success ? data.data : undefined,
    isLoading: shouldFetch ? isLoading : false, // Don't show loading if not fetching
    error: shouldFetch
      ? filteredError || (data?.success === false ? new Error(data.error) : undefined)
      : undefined,
    mutate,
  };
}
