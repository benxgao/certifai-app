import { useAuthSWR } from './useAuthSWR';
import { useEffect } from 'react';

interface ExamLiveStatus {
  exam_id: string;
  exam_status: string;
  progress_percentage: number;
  topics_with_questions: number;
  total_topics: number;
  total_questions: number;
  estimated_seconds_remaining: number;
  is_complete: boolean;
  query_duration_ms: number;
  timestamp_ms: number;
}

interface ExamLiveStatusResponse {
  success: boolean;
  data: ExamLiveStatus;
  error?: string;
}

/**
 * Real-time exam status hook that bypasses Redis cache for freshness
 * Provides actual exam status + real-time progress percentage from RTDB
 *
 * Call this hook when you need up-to-the-second exam status and completion info
 * especially useful during exam generation where status changes frequently
 */
export function useExamLiveStatus(
  apiUserId: string | null,
  examId: string | null,
  pollingEnabled: boolean = true
) {
  // Enable polling while exam is generating
  const shouldFetch = Boolean(apiUserId && examId && pollingEnabled);
  const key = shouldFetch ? `/api/users/${apiUserId}/exams/${examId}/live-status` : null;

  const { data, error, isLoading, mutate } = useAuthSWR<ExamLiveStatusResponse>(
    key,
    {
      refreshInterval: 2000, // Poll every 2 seconds for real-time updates
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 500, // Very short dedup to ensure freshness (bypasses Redis cache anyway)
      keepPreviousData: true,
      shouldRetryOnError: true,
      onError: (err) => {
        if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
          console.log('Exam not found - may have been deleted');
          return;
        }
        // Silently continue on other errors - don't break polling
      },
    }
  );

  // Clear cache when polling is disabled
  useEffect(() => {
    if (!pollingEnabled && data) {
      mutate(undefined, false);
    }
  }, [pollingEnabled, data, mutate]);

  return {
    liveStatus: data?.success ? data.data : undefined,
    isLoading: shouldFetch ? isLoading : false,
    error: shouldFetch ? error : undefined,
    mutate,
    /**
     * Convenience methods for common status checks
     */
    isGenerating: data?.data?.exam_status === 'QUESTIONS_GENERATING',
    isReady: data?.data?.exam_status === 'READY',
    isFailed: data?.data?.exam_status === 'QUESTION_GENERATION_FAILED',
    progressPercent: data?.data?.progress_percentage ?? 0,
  };
}
