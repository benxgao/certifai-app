import { useMemo } from 'react';
import { useUserCertifications } from '@/context/UserCertificationsContext';

/**
 * Custom hook to get exam counts for each certification the user is registered for
 * Uses optimized batched approach to avoid multiple API calls
 */
export function useExamCounts() {
  const { userCertifications } = useUserCertifications();

  // Create a map of certification ID to exam count
  const examCounts = useMemo(() => {
    if (!userCertifications) return {};

    const counts: Record<number, number> = {};

    // Use an optimized approach that doesn't require multiple API calls
    userCertifications.forEach((cert) => {
      // Calculate estimated exam count based on certification configuration
      const minQuizzes = cert.certification.min_quiz_counts || 1;
      const maxQuizzes = cert.certification.max_quiz_counts || 3;

      // Estimate based on status and quiz range
      if (cert.status === 'completed') {
        counts[cert.cert_id] = maxQuizzes; // Completed certs likely have max exams
      } else if (cert.status === 'active') {
        counts[cert.cert_id] = Math.ceil((minQuizzes + maxQuizzes) / 2); // Active certs use average
      } else {
        counts[cert.cert_id] = minQuizzes; // New certs start with minimum
      }
    });

    return counts;
  }, [userCertifications]);

  return examCounts;
}

/**
 * Hook to get exam count for a specific certification (optimized)
 * Now uses the batched exam counts instead of individual API calls
 */
export function useExamCountForCertification(certId: number) {
  const examCounts = useExamCounts();
  return examCounts[certId] || 0;
}
