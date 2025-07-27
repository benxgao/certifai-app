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

export function useExamGeneratingProgress(apiUserId: string, examId: string) {
  const shouldFetch = Boolean(apiUserId && examId);
  const key = shouldFetch ? `/api/users/${apiUserId}/exams/${examId}/generating-progress` : null;

  const { data, error, isLoading, mutate } = useAuthSWR<ExamGeneratingProgressResponse>(key, {
    refreshInterval: 2000, // Poll every 2 seconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 1000, // Prevent duplicate requests within 1 second
  });

  return {
    progress: data?.success ? data.data : undefined,
    isLoading,
    error: error || (data?.success === false ? new Error(data.error) : undefined),
    mutate,
  };
}
