import useSWR from 'swr';
import React from 'react';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { ExamReportData } from '@/src/types/swr-data/examReport';
import { CanonicalApiErrorResponse, isCanonicalApiErrorResponse } from '@/src/types/api';
import { SWRFetchError } from './utils';

export type { ExamReportData } from '@/src/types/swr-data/examReport';

type ExamReportErrorInfo = Partial<CanonicalApiErrorResponse> & {
  raw?: unknown;
};

function getFallbackErrorCode(status: number): string {
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHENTICATED';
  if (status === 403) return 'ACCESS_DENIED';
  if (status === 404) return 'EXAM_REPORT_NOT_FOUND';
  if (status >= 500) return 'UPSTREAM_ERROR';
  return 'UPSTREAM_REQUEST_FAILED';
}

async function parseErrorResponse(
  response: Response,
  fallbackMessage: string,
): Promise<{ message: string; info: ExamReportErrorInfo }> {
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

// Fetcher function for exam reports
async function examReportFetcher(url: string): Promise<ExamReportData> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const { message, info } = await parseErrorResponse(response, 'Failed to fetch exam report');
    throw new SWRFetchError(message, response.status, info);
  }

  const data = await response.json();
  return data.data;
}

// Fetcher function for generating exam reports
async function generateExamReportFetcher(url: string): Promise<ExamReportData> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const { message, info } = await parseErrorResponse(response, 'Failed to generate exam report');
    throw new SWRFetchError(message, response.status, info);
  }

  const data = await response.json();
  return data.data;
}

// Hook to get exam report
export function useExamReport(examId: string | null, shouldFetch: boolean = true) {
  const { firebaseUser, apiUserId } = useFirebaseAuth();

  const { data, error, isLoading, mutate } = useSWR<ExamReportData, Error>(
    examId && shouldFetch && firebaseUser && apiUserId
      ? `/api/users/${apiUserId}/exams/${examId}/exam-report`
      : null,
    examReportFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 3,
      errorRetryInterval: 1000,
      shouldRetryOnError: (error) => {
        if (!(error instanceof SWRFetchError)) {
          return false;
        }

        if (error.status >= 400 && error.status < 500) {
          return false;
        }

        const info = error.info;
        if (isCanonicalApiErrorResponse(info)) {
          return error.status >= 500 && info.retriable;
        }

        return error.status >= 500;
      },
    },
  );

  return {
    examReport: data,
    isLoadingReport: isLoading,
    reportError: error,
    mutateReport: mutate,
  };
}

// Hook to generate exam report
export function useGenerateExamReport() {
  const { apiUserId } = useFirebaseAuth();

  const generateReport = async (examId: string): Promise<ExamReportData> => {
    if (!apiUserId) {
      throw new Error('User not authenticated');
    }

    return generateExamReportFetcher(`/api/users/${apiUserId}/exams/${examId}/exam-report`);
  };

  return { generateReport };
}

// Hook that automatically triggers report generation for completed exams without reports
export function useAutoGenerateExamReport(
  examId: string | null,
  isCompleted: boolean,
  hasReport: boolean,
) {
  const { generateReport } = useGenerateExamReport();
  const [hasTriggeredGeneration, setHasTriggeredGeneration] = React.useState(false);

  React.useEffect(() => {
    const shouldTriggerGeneration = examId && isCompleted && !hasReport && !hasTriggeredGeneration;

    if (shouldTriggerGeneration) {
      setHasTriggeredGeneration(true);
      // Trigger generation after a short delay to avoid overwhelming the API
      const timer = setTimeout(() => {
        generateReport(examId).catch((error) => {
          // Reset the flag so user can manually trigger generation
          setHasTriggeredGeneration(false);
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [examId, isCompleted, hasReport, hasTriggeredGeneration, generateReport]);

  return { hasTriggeredGeneration };
}
