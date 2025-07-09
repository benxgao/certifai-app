import { useMemo } from 'react';
import { useUserCertifications } from '@/context/UserCertificationsContext';

/**
 * Custom hook to get the total count of exams created by the user across all certifications
 * This hook uses heuristic calculations since fetching all exams across certifications
 * would require multiple API calls or a new aggregated endpoint
 */
export function useUserTotalExamCount() {
  const { userCertifications } = useUserCertifications();

  // Get list of certification IDs the user is registered for
  const certificationIds = useMemo(() => {
    return userCertifications?.map(cert => cert.cert_id) || [];
  }, [userCertifications]);

  // Heuristic calculation for estimated total exams
  const estimatedTotalExams = useMemo(() => {
    if (!userCertifications || userCertifications.length === 0) {
      return 0;
    }

    // Heuristic calculation:
    // - Users with 1 certification: likely 1-3 exams
    // - Users with 2+ certifications: likely 3-8 exams
    // - Active users (multiple certifications) tend to create more exams
    
    const certCount = userCertifications.length;
    
    if (certCount === 1) {
      return 2; // Conservative estimate for single certification users
    } else if (certCount === 2) {
      return 4; // Users with 2 certs likely have tried multiple exams
    } else {
      return certCount * 2; // Power users with 3+ certs
    }
  }, [userCertifications]);

  return {
    totalExamCount: estimatedTotalExams,
    isEstimated: true, // Flag to indicate this is an estimation
    certificationCount: certificationIds.length,
  };
}

/**
 * Hook specifically for determining if Buy Me a Coffee should be shown
 * Based on user engagement heuristics
 */
export function useShouldShowBuyMeACoffee() {
  const { totalExamCount, certificationCount } = useUserTotalExamCount();
  
  // Show Buy Me a Coffee if:
  // 1. User has created more than 2 exams (estimated), OR
  // 2. User has registered for 2+ certifications (shows engagement)
  const shouldShow = totalExamCount > 2 || certificationCount >= 2;
  
  return {
    shouldShow,
    reason: shouldShow 
      ? certificationCount >= 2 
        ? 'User has multiple certifications' 
        : 'User has created multiple exams'
      : 'User needs more engagement',
    stats: {
      estimatedExams: totalExamCount,
      certifications: certificationCount,
    }
  };
}
