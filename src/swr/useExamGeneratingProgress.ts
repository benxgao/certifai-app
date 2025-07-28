import { useAuthSWR } from './useAuthSWR';

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
  });

  return {
    progress: data?.success ? data.data : undefined,
    isLoading: shouldFetch ? isLoading : false, // Don't show loading if not fetching
    error: shouldFetch
      ? error || (data?.success === false ? new Error(data.error) : undefined)
      : undefined,
    mutate,
  };
}
