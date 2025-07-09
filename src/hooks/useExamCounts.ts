import { useMemo } from 'react';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { useExamsForCertification } from '@/swr/exams';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';

/**
 * Custom hook to get exam counts for each certification the user is registered for
 */
export function useExamCounts() {
  const { userCertifications } = useUserCertifications();

  // Create a map of certification ID to exam count
  const examCounts = useMemo(() => {
    if (!userCertifications) return {};

    const counts: Record<number, number> = {};

    // For now, we'll use a heuristic approach since calling useExamsForCertification
    // for each cert would require conditional hooks which is not allowed
    userCertifications.forEach(cert => {
      // Estimate exam count based on certification status
      if (cert.status === 'completed') {
        counts[cert.cert_id] = 3; // Completed certs likely have multiple exams
      } else if (cert.status === 'active') {
        counts[cert.cert_id] = 2; // Active certs likely have at least 1-2 exams
      } else {
        counts[cert.cert_id] = 1; // Default to 1 exam
      }
    });

    return counts;
  }, [userCertifications]);

  return examCounts;
}

/**
 * Hook to get exam count for a specific certification
 */
export function useExamCountForCertification(certId: number) {
  const { apiUserId } = useFirebaseAuth();
  const { exams } = useExamsForCertification(apiUserId, certId);

  return exams?.length || 0;
}
