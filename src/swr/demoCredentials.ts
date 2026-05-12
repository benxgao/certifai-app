import useSWRMutation from 'swr/mutation';
import { ApiResponse } from '@/src/types/api';
import { DemoCredentials } from '@/src/lib/demoCredentialsProvider';

async function fetchDemoCredentials(): Promise<ApiResponse<DemoCredentials>> {
  const response = await fetch('/api/demo-credentials', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch demo credentials.');
  }

  return response.json();
}

export function useRevealDemoCredentials() {
  const { trigger, data, error, isMutating, reset } = useSWRMutation<
    ApiResponse<DemoCredentials>,
    Error,
    string,
    void
  >('/api/demo-credentials', () => fetchDemoCredentials());

  return {
    reveal: () => trigger(),
    data,
    error,
    isLoading: isMutating,
    reset,
  };
}
