import { useAuthSWR } from './useAuthSWR';
import { useEffect } from 'react';
import { ExamLiveStatusData } from '@/src/types/swr-data/useExamLiveStatus';
import {
  isExamGeneratingStatus,
  isExamReadyStatus,
  isExamGenerationFailedStatus,
} from '../types/exam-status';
import { isApiError } from '@/src/types/api';

export type { ExamLiveStatusData } from '@/src/types/swr-data/useExamLiveStatus';

interface ExamLiveStatusResponse {
  success: boolean;
  data: ExamLiveStatusData;
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
  pollingEnabled: boolean = true,
) {
  // Enable polling while exam is generating
  const shouldFetch = Boolean(apiUserId && examId && pollingEnabled);
  const key = shouldFetch ? `/api/users/${apiUserId}/exams/${examId}/live-status` : null;

  const { data, error, isLoading, mutate } = useAuthSWR<ExamLiveStatusResponse, Error>(
    key,
    {
      refreshInterval: 2000, // Poll every 2 seconds for real-time updates
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 500, // Very short dedup to ensure freshness (bypasses Redis cache anyway)
      keepPreviousData: true,
      shouldRetryOnError: true,
      onError: (err) => {
        if (isApiError(err)) {
          const status = err.status;
          if (status === 404) {
            console.log('Exam not found - may have been deleted');
            return;
          }
          // Log warnings for other errors to aid debugging
          if (typeof status === 'number' && status >= 500) {
            console.warn('[live-status] Server error:', status);
          } else if (!status) {
            console.warn('[live-status] Network error or timeout:', err.message);
          } else if (typeof status === 'number' && status >= 400) {
            console.warn('[live-status] Client error:', status);
          }
        }
        // Continue polling despite errors (except 404)
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
    isGenerating: isExamGeneratingStatus(data?.data?.exam_status),
    isReady: isExamReadyStatus(data?.data?.exam_status),
    isFailed: isExamGenerationFailedStatus(data?.data?.exam_status),
    progressPercent: data?.data?.progress_percentage ?? 0,
  };
}
