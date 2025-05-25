import useSWR from 'swr';

export interface ExamListItem {
  exam_id: string;
  user_id: string;
  cert_id: number;
  score: number | null;
  started_at: string;
  submitted_at: number | null;
  certification: {
    cert_id: number;
    cert_category_id: number;
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
      // Add Authorization header if needed
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
