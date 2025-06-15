import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

export interface ExamListItem {
  exam_id: string;
  user_id: string;
  cert_id: number;
  score: number | null;
  started_at: string;
  submitted_at: number | null;
  certification: {
    cert_id: number;
    // cert_category_id: number;
    name: string;
    exam_guide_url: string;
    min_quiz_counts: number;
    max_quiz_counts: number;
    pass_score: number;
  };
  status: string;
}

async function fetchExamsForCertification(url: string): Promise<{ data: ExamListItem[] }> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch exams for certification.');
  }
  return response.json();
}

export function useExamsForCertification(apiUserId: string | null, certId: number | null) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: ExamListItem[] }, Error>(
    certId ? `/api/users/${apiUserId}/certifications/${certId}/exams` : null, // Conditional fetching
    fetchExamsForCertification,
  );

  return {
    exams: data?.data,
    isLoadingExams: isLoading,
    isExamsError: error,
    isValidatingExams: isValidating,
    mutateExams: mutate,
  };
}

// New SWR Mutation hook for submitting an exam
async function submitExamFetcher(
  url: string,
  { arg }: { arg: { apiUserId: string; certId: number; examId: string; body: any } },
) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg.body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to submit exam.');
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export function useSubmitExam(
  apiUserId: string | null,
  certId: number | null,
  examId: string | null,
) {
  const { trigger, isMutating, error } = useSWRMutation(
    apiUserId && certId && examId
      ? `/api/users/${apiUserId}/certifications/${certId}/exams/${examId}/submit`
      : null,
    submitExamFetcher,
  );

  return {
    submitExam: trigger,
    isSubmittingExam: isMutating,
    submitExamError: error,
  };
}

// Interface for exam state/details
export interface ExamState {
  exam_id: string;
  user_id: string;
  cert_id: number;
  score: number | null;
  started_at: string;
  submitted_at: number | null;
  status: string;
  certification?: {
    cert_id: number;
    name: string;
    exam_guide_url: string;
    min_quiz_counts: number;
    max_quiz_counts: number;
    pass_score: number;
  };
}

// Fetcher for exam state
async function fetchExamState(url: string): Promise<{ data: ExamState }> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to fetch exam state.');
  }
  return response.json();
}

// Hook to get exam state/details
export function useExamState(
  apiUserId: string | null,
  certId: number | null,
  examId: string | null,
) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<{ data: ExamState }, Error>(
    apiUserId && certId && examId
      ? `/api/users/${apiUserId}/certifications/${certId}/exams/${examId}`
      : null,
    fetchExamState,
    {
      refreshInterval: 0, // Don't auto-refresh
      revalidateOnFocus: false,
    },
  );

  return {
    examState: data?.data,
    isLoadingExamState: isLoading,
    isExamStateError: error,
    isValidatingExamState: isValidating,
    mutateExamState: mutate,
  };
}
