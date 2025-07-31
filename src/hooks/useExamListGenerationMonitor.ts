import { useEffect, useRef } from 'react';

/**
 * Hook to monitor exams list for generation status and enable simple polling
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
      // Use a simple static interval for polling
      const pollingInterval = 5000; // Poll every 5 seconds when exams are generating

      // Set up polling with the static interval
      intervalRef.current = setInterval(() => {
        mutateExams();
      }, pollingInterval);
    } else if (lastGeneratingCountRef.current > 0) {
      // Just stopped generating - do one final update
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
