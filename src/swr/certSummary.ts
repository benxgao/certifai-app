import useSWR from 'swr';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import {
  CertSummaryData,
  SwrDataCertSummaryFetchResponse,
  SwrDataCertSummaryGenerateResponse,
} from '@/src/types/swr-data/certSummary';
import { SWRFetchError } from './utils';
import { isApiError } from '@/src/types/api';

export type { CertSummaryData } from '@/src/types/swr-data/certSummary';

// Fetcher function for cert summaries
async function certSummaryFetcher(url: string): Promise<CertSummaryData | null> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      // Return null for 404 (no summary exists yet)
      return null;
    }

    // Try to parse error response as JSON, fallback to text
    let errorMessage = response.statusText;
    let info: unknown = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
      info = errorData;
    } catch {
      try {
        const text = await response.text();
        errorMessage = text || errorMessage;
        info = text;
      } catch {
        // Use statusText fallback already set above
      }
    }
    throw new SWRFetchError(errorMessage, response.status, info);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch certification summary');
  }

  return result.data; // SwrDataCertSummaryFetchResponse
}

// Generate cert summary (regenerate)
async function generateCertSummary(userId: string, certId: string): Promise<CertSummaryData> {
  const response = await fetch(`/api/users/${userId}/certifications/${certId}/cert-summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    let info: unknown = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
      info = errorData;
    } catch {
      try {
        const text = await response.text();
        errorMessage = text || errorMessage;
        info = text;
      } catch {
        // Use statusText fallback already set above
      }
    }
    throw new SWRFetchError(errorMessage, response.status, info);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to generate certification summary');
  }

  return result.data; // SwrDataCertSummaryGenerateResponse
}

/**
 * Hook to fetch certification summary for a specific user and certification
 */
export function useCertSummary(userId: string, certId: string) {
  const { firebaseUser } = useFirebaseAuth();

  const shouldFetch = firebaseUser && userId && certId;
  const key = shouldFetch ? `/api/users/${userId}/certifications/${certId}/cert-summary` : null;

  const { data, error, isLoading, mutate } = useSWR<CertSummaryData | null, Error>(key, certSummaryFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    shouldRetryOnError: (err) => {
      const status = isApiError(err) ? err.status : undefined;
      // Don't retry on 404 (summary doesn't exist)
      if (status === 404) return false;
      // Don't retry on client errors (400-499)
      if (status !== undefined && status >= 400 && status < 500) return false;
      return true;
    },
  });

  return {
    certSummary: data, // SwrDataCertSummaryFetchResponse
    isLoading,
    error,
    mutate,
    hasSummary: !!data,
  };
}

/**
 * Hook to generate/regenerate certification summary
 */
export function useGenerateCertSummary() {
  const generateSummary = async (userId: string, certId: string) => {
    return await generateCertSummary(userId, certId);
  };

  return {
    generateCertSummary: generateSummary,
  };
}
