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
    firebaseUser?.uid || null,
  );

  // Debug logging
  console.log('🔍 Debug - useUserTotalExamCount:', {
    firebaseUserId: firebaseUser?.uid,
    totalExamCount,
    allExamsLength: allExams?.length,
    isLoadingAllExams,
    isAllExamsError: isAllExamsError?.message,
    userCertifications: userCertifications?.length,
  });

  // Get list of certification IDs the user is registered for
  const certificationIds = useMemo(() => {
    return userCertifications?.map((cert) => cert.cert_id) || [];
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
 * REFACTORED: Now uses getUserExams API response directly for better performance and accuracy
 *
 * This hook leverages the comprehensive data from the getUserExams API to make intelligent
 * decisions about when to show the Buy Me a Coffee button based on multiple engagement metrics:
 * - Total exam count (from API totalExamCount)
 * - Completed exams (derived from exam status/submitted_at)
 * - High-scoring exams (score >= 70)
 * - Recent activity (exams created in last 30 days)
 * - Certification registrations
 *
 * Benefits of using getUserExams API:
 * - Single API call provides all necessary data
 * - Real-time exam status and completion info
 * - Rate limit information included
 * - Comprehensive exam history and scoring data
 */
export function useShouldShowBuyMeACoffee() {
  const { firebaseUser } = useFirebaseAuth();
  const { allExams, totalExamCount, rateLimit, isLoadingAllExams, isAllExamsError } =
    useAllUserExams(firebaseUser?.uid || null);
  const { userCertifications } = useUserCertifications();

  // Don't show if we're still loading or there's an error
  if (isLoadingAllExams || isAllExamsError) {
    return {
      shouldShow: false,
      reason: 'Loading or error',
      stats: {
        actualExams: 0,
        certifications: 0,
        completedExams: 0,
        highScoringExams: 0,
        recentExamsCount: 0,
      },
      isLoading: isLoadingAllExams,
      isError: isAllExamsError,
    };
  }

  // Calculate engagement metrics directly from getUserExams API response
  const certificationCount = userCertifications?.length || 0;
  const completedExamsCount =
    allExams?.filter((exam) => exam.status === 'COMPLETED' || exam.submitted_at !== null).length ||
    0;

  // Calculate additional engagement metrics from getUserExams API data
  const highScoringExams =
    allExams?.filter((exam) => exam.score !== null && exam.score >= 70).length || 0;

  const recentExamsCount =
    allExams?.filter((exam) => {
      if (!exam.started_at) return false;
      const examDate = new Date(exam.started_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return examDate >= thirtyDaysAgo;
    }).length || 0;

  // Enhanced logic using getUserExams API data:
  // Show Buy Me a Coffee if user shows significant engagement:
  // 1. Has created more than 2 exams (from totalExamCount), OR
  // 2. Has completed at least 2 exams (shows they're actively using the platform), OR
  // 3. Has registered for 2+ certifications (shows commitment), OR
  // 4. Has scored 70+ on any exam (shows success with the platform), OR
  // 5. Has been active recently (created exams in last 30 days) and has multiple exams
  const shouldShow =
    totalExamCount > 2 ||
    completedExamsCount >= 2 ||
    certificationCount >= 2 ||
    highScoringExams >= 1 ||
    (recentExamsCount >= 2 && totalExamCount >= 2);

  // Determine the primary reason for showing the button
  let reason = 'User needs more engagement';
  if (shouldShow) {
    if (highScoringExams >= 1) {
      reason = 'User has achieved high scores';
    } else if (completedExamsCount >= 2) {
      reason = 'User has completed multiple exams';
    } else if (recentExamsCount >= 2 && totalExamCount >= 2) {
      reason = 'User is actively using the platform';
    } else if (totalExamCount > 2) {
      reason = 'User has created multiple exams';
    } else if (certificationCount >= 2) {
      reason = 'User has multiple certifications';
    }
  }

  return {
    shouldShow,
    reason,
    stats: {
      actualExams: totalExamCount,
      certifications: certificationCount,
      completedExams: completedExamsCount,
      highScoringExams,
      recentExamsCount,
    },
    isLoading: isLoadingAllExams,
    isError: isAllExamsError,
    // Additional context from getUserExams API
    rateLimit,
    examDetails: allExams,
  };
}
