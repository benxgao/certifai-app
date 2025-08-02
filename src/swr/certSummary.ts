import useSWR from 'swr';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

export interface CertSummaryData {
  cert_id: string;
  user_id: string;
  summary: string;
  structured_data: {
    cert_id: string;
    user_id: string;
    certification_name: string;
    total_exams_taken: number;
    average_score: number;
    best_score: number;
    worst_score: number;
    total_questions_answered: number;
    total_correct_answers: number;
    overall_accuracy_rate: number;
    topic_mastery: Array<{
      topic: string;
      exams_covered: number;
      average_accuracy: number;
      mastery_level: 'novice' | 'developing' | 'proficient' | 'advanced' | 'expert';
      total_questions: number;
      total_correct: number;
    }>;
    performance_trend: 'improving' | 'declining' | 'stable';
    strengths: string[];
    areas_for_improvement: string[];
    generated_at: string;
    ai_summary: string;
  };
  already_existed: boolean;
  generated_at: string;
  summary_stats: {
    total_exams: number;
    average_score: number;
    best_score: number;
    topics_mastered: number;
    performance_trend: 'improving' | 'declining' | 'stable';
    strengths_count: number;
    improvement_areas_count: number;
  };
}

// Fetcher function for cert summaries
async function certSummaryFetcher(url: string): Promise<CertSummaryData> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Try to parse error response as JSON, fallback to text
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (e) {
      // If JSON parsing fails, use statusText or response text
      try {
        errorMessage = await response.text();
      } catch (textError) {
        errorMessage = response.statusText;
      }
    }

    if (response.status === 404) {
      // Return null for 404 (no summary exists)
      return null as any;
    }

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch certification summary');
  }

  return result.data;
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
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (e) {
      try {
        errorMessage = await response.text();
      } catch (textError) {
        errorMessage = response.statusText;
      }
    }

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to generate certification summary');
  }

  return result.data;
}

/**
 * Hook to fetch certification summary for a specific user and certification
 */
export function useCertSummary(userId: string, certId: string) {
  const { firebaseUser } = useFirebaseAuth();

  const shouldFetch = firebaseUser && userId && certId;
  const key = shouldFetch ? `/api/users/${userId}/certifications/${certId}/cert-summary` : null;

  const { data, error, isLoading, mutate } = useSWR(key, certSummaryFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    shouldRetryOnError: (err) => {
      // Don't retry on 404 (summary doesn't exist)
      if ((err as any)?.status === 404) return false;
      // Don't retry on client errors (400-499)
      if ((err as any)?.status >= 400 && (err as any)?.status < 500) return false;
      return true;
    },
  });

  return {
    certSummary: data,
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
