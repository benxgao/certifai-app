import useSWR from 'swr';
import React from 'react';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

export interface ExamReportData {
  exam_id: string;
  report: string;
  already_existed: boolean;
  generated_at: string;
  performance_summary: {
    overall_score: number;
    total_questions: number;
    correct_answers: number;
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
    if (response.status === 404) {
      throw new Error('Exam report not found');
    }
    if (response.status === 403) {
      throw new Error('Access denied to this exam report');
    }
    if (response.status === 400) {
      throw new Error('Report can only be generated for completed exams');
    }
    throw new Error(`Failed to fetch exam report: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

// Fetcher function for generating exam reports
async function generateExamReportFetcher(url: string, examId: string): Promise<ExamReportData> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ exam_id: examId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || 'Failed to generate exam report');
  }

  const data = await response.json();
  return data.data;
}

// Hook to get exam report
export function useExamReport(examId: string | null, shouldFetch: boolean = true) {
  const { firebaseUser } = useFirebaseAuth();

  const { data, error, isLoading, mutate } = useSWR(
    examId && shouldFetch && firebaseUser ? `/api/ai/exam-report?exam_id=${examId}` : null,
    examReportFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      // Retry only for specific errors (not 404 which means no report exists)
      onError: (error) => {
        // Don't retry if it's a 404 (report doesn't exist) or 403 (access denied)
        if (error.message.includes('not found') || error.message.includes('Access denied')) {
          return false;
        }
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
  const generateReport = async (examId: string): Promise<ExamReportData> => {
    return generateExamReportFetcher('/api/ai/exam-report', examId);
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
          console.error('Auto-generation of exam report failed:', error);
          // Reset the flag so user can manually trigger generation
          setHasTriggeredGeneration(false);
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [examId, isCompleted, hasReport, hasTriggeredGeneration, generateReport]);

  return { hasTriggeredGeneration };
}
