import { useMemo } from 'react';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { useAllUserExams } from '@/src/swr/exams';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

/**
 * Custom hook to get the total count of exams created by the user across all certifications
 * Uses the actual API to fetch real exam count instead of heuristics
 */
export function useUserTotalExamCount() {
  const { userCertifications } = useUserCertifications();
  const { firebaseUser } = useFirebaseAuth();
  const { allExams, totalExamCount, isLoadingAllExams, isAllExamsError } = useAllUserExams(
    firebaseUser?.uid || null
  );

  // Debug logging
  console.log('🔍 Debug - useUserTotalExamCount:', {
    firebaseUserId: firebaseUser?.uid,
    totalExamCount,
    allExamsLength: allExams?.length,
    isLoadingAllExams,
    isAllExamsError: isAllExamsError?.message,
    userCertifications: userCertifications?.length
  });

  // Get list of certification IDs the user is registered for
  const certificationIds = useMemo(() => {
    return userCertifications?.map(cert => cert.cert_id) || [];
  }, [userCertifications]);

  return {
    totalExamCount: totalExamCount,
    isEstimated: false, // Now using actual data
    certificationCount: certificationIds.length,
    isLoading: isLoadingAllExams,
    isError: isAllExamsError,
    allExams: allExams,
  };
}

/**
 * Hook specifically for determining if Buy Me a Coffee should be shown
 * Based on user engagement using actual exam counts
 */
export function useShouldShowBuyMeACoffee() {
  const { totalExamCount, certificationCount, isLoading, isError } = useUserTotalExamCount();
  
  // Don't show if we're still loading or there's an error
  if (isLoading || isError) {
    return {
      shouldShow: false,
      reason: 'Loading or error',
      stats: {
        actualExams: 0,
        certifications: 0,
      },
      isLoading,
      isError,
    };
  }
  
  // Show Buy Me a Coffee if:
  // 1. User has created more than 2 exams (actual count), OR
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
      actualExams: totalExamCount,
      certifications: certificationCount,
    },
    isLoading,
    isError,
  };
}
