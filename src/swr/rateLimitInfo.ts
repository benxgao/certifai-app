import useSWR from 'swr';

export interface RateLimitInfo {
  maxExamsAllowed: number;
  currentCount: number;
  remainingCount: number;
  canCreateExam: boolean;
  nextAvailableTime?: string;
  hoursUntilNextExam?: number;
}

// Fetcher function for getting rate limit info
async function rateLimitFetcher(url: string): Promise<RateLimitInfo> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch rate limit info');
  }

  const data = await response.json();
  return data.data || data;
}

export function useRateLimitInfo(apiUserId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<RateLimitInfo>(
    apiUserId ? `/api/users/${apiUserId}/rate-limit` : null,
    rateLimitFetcher,
    {
      refreshInterval: 0, // Don't auto-refresh, update on demand
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    rateLimitInfo: data,
    isLoadingRateLimit: isLoading,
    rateLimitError: error,
    mutateRateLimit: mutate,
  };
}
