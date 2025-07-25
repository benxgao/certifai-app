import { useEffect, useRef } from 'react';
import { getSmartPollingInterval } from '@/src/lib/examGenerationUtils';

/**
 * Hook to monitor exams list for generation status and enable smart polling
 * This helps keep the exam list updated when exams are generating
 */
export function useExamListGenerationMonitor(
  exams: any[] | undefined,
  mutateExams: () => void,
  isLoading: boolean,
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastGeneratingCountRef = useRef<number>(0);

  useEffect(() => {
    if (!exams || isLoading) return;

    // Count exams that are currently generating
    const generatingExams = exams.filter((exam) => exam.exam_status === 'QUESTIONS_GENERATING');
    const generatingCount = generatingExams.length;

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (generatingCount > 0) {
      // Find the fastest polling interval needed among all generating exams
      let fastestInterval = 60000; // Default to 1 minute

      generatingExams.forEach((exam) => {
        const interval = getSmartPollingInterval(exam);
        if (interval > 0 && interval < fastestInterval) {
          fastestInterval = interval;
        }
      });

      // Set up polling with the fastest needed interval
      intervalRef.current = setInterval(() => {
        mutateExams();
      }, fastestInterval);

      console.log(
        `🔄 Started exam list polling: ${generatingCount} exams generating, interval: ${fastestInterval}ms`,
      );
    } else if (lastGeneratingCountRef.current > 0) {
      // Just stopped generating - do one final update
      console.log('✅ Stopped exam list polling - no more generating exams');
      mutateExams();
    }

    lastGeneratingCountRef.current = generatingCount;

    // Cleanup on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [exams, mutateExams, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    generatingCount:
      exams?.filter((exam) => exam.exam_status === 'QUESTIONS_GENERATING').length || 0,
  };
}
