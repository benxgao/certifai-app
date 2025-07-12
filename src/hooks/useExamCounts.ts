import { useMemo } from 'react';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { useAllUserExams } from '@/src/swr/exams';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

/**
 * Custom hook to get exam counts for each certification the user is registered for
 * Uses actual API data from useAllUserExams to get real exam counts
 */
export function useExamCounts() {
  const { userCertifications } = useUserCertifications();
  const { firebaseUser } = useFirebaseAuth();
  const { allExams } = useAllUserExams(firebaseUser?.uid || null);

  // Create a map of certification ID to actual exam count
  const examCounts = useMemo(() => {
    if (!userCertifications || !allExams) return {};

    const counts: Record<number, number> = {};

    // Initialize counts for all registered certifications
    userCertifications.forEach((cert) => {
      counts[cert.cert_id] = 0;
    });

    // Count actual exams from API data
    allExams.forEach((exam) => {
      if (counts.hasOwnProperty(exam.cert_id)) {
        counts[exam.cert_id]++;
      }
    });

    return counts;
  }, [userCertifications, allExams]);

  return examCounts;
}

/**
 * Hook to get exam count for a specific certification
 * Now uses actual API data instead of estimates
 */
export function useExamCountForCertification(certId: number) {
  const examCounts = useExamCounts();
  return examCounts[certId] || 0;
}
