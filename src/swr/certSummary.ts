import useSWR from 'swr';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { CertSummaryData } from '@/src/types/swr-data/certSummary';
import { SWRFetchError } from './utils';
import { CanonicalApiErrorResponse, isCanonicalApiErrorResponse } from '@/src/types/api';

export type { CertSummaryData } from '@/src/types/swr-data/certSummary';

type CertSummaryErrorInfo = Partial<CanonicalApiErrorResponse> & {
  raw?: unknown;
};

function getFallbackErrorCode(status: number): string {
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHENTICATED';
  if (status === 403) return 'ACCESS_DENIED';
  if (status === 404) return 'CERT_SUMMARY_NOT_FOUND';
  if (status >= 500) return 'UPSTREAM_ERROR';
  return 'UPSTREAM_REQUEST_FAILED';
}

async function parseErrorResponse(
  response: Response,
  fallbackMessage: string,
): Promise<{ message: string; info: CertSummaryErrorInfo }> {
  const responseText = await response.text();
  let parsedBody: unknown;

  try {
    parsedBody = JSON.parse(responseText);
  } catch {
    parsedBody = responseText;
  }

  if (isCanonicalApiErrorResponse(parsedBody)) {
    return {
      message: parsedBody.error || fallbackMessage,
      info: parsedBody,
    };
  }

  if (parsedBody && typeof parsedBody === 'object') {
    const body = parsedBody as Record<string, unknown>;
    const message =
      (typeof body.error === 'string' && body.error) ||
      (typeof body.message === 'string' && body.message) ||
      fallbackMessage;

    return {
      message,
      info: {
        error: message,
        error_code: getFallbackErrorCode(response.status),
        retriable: response.status >= 500,
        details: body.details,
        raw: body,
      },
    };
  }

  const plainMessage =
    typeof parsedBody === 'string' && parsedBody.length > 0
      ? parsedBody
      : fallbackMessage || response.statusText;

  return {
    message: plainMessage,
    info: {
      error: plainMessage,
      error_code: getFallbackErrorCode(response.status),
      retriable: response.status >= 500,
      raw: parsedBody,
    },
  };
}

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

    const { message, info } = await parseErrorResponse(response, 'Failed to fetch certification summary');
    throw new SWRFetchError(message, response.status, info);
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
    const { message, info } = await parseErrorResponse(
      response,
      'Failed to generate certification summary',
    );
    throw new SWRFetchError(message, response.status, info);
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

  const { data, error, isLoading, mutate } = useSWR<CertSummaryData | null, Error>(
    key,
    certSummaryFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      shouldRetryOnError: (err) => {
        if (!(err instanceof SWRFetchError)) {
          return false;
        }

        if (err.status === 404) {
          return false;
        }

        if (err.status >= 400 && err.status < 500) {
          return false;
        }

        const info = err.info;
        if (isCanonicalApiErrorResponse(info)) {
          return err.status >= 500 && info.retriable;
        }

        return err.status >= 500;
      },
    },
  );

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
