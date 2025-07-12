// Shared TypeScript types for exam status across the application

// Backend exam status as returned by the API
export type BackendExamStatus =
  | 'READY'
  | 'QUESTIONS_GENERATING'
  | 'QUESTION_GENERATION_FAILED'
  | 'PENDING_QUESTIONS';

// Derived exam status for UI display
export type DerivedExamStatus =
  | 'not_started'
  | 'ready'
  | 'generating'
  | 'generation_failed'
  | 'in_progress'
  | 'completed'
  | 'completed_successful'
  | 'completed_review';

// Interface for exam status display information
export interface ExamStatusInfo {
  status: DerivedExamStatus;
  label: string;
  bgColor: string;
  borderColor: string;
}

// Helper function to determine derived exam status from exam data
export const getDerivedExamStatus = (exam: {
  submitted_at: number | null;
  started_at: string | null; // Fixed: should be string | null to match API response
  exam_status?: BackendExamStatus;
  score?: number | null;
  certification?: {
    pass_score?: number;
  };
}): DerivedExamStatus => {
  const isCompleted = exam.submitted_at !== null;
  const hasStarted = exam.started_at !== null;
  const backendStatus = exam.exam_status;

  // Priority order: backend status first, then user actions
  if (backendStatus === 'QUESTIONS_GENERATING') {
    return 'generating';
  } else if (backendStatus === 'QUESTION_GENERATION_FAILED') {
    return 'generation_failed';
  } else if (isCompleted) {
    // If we have score and pass score, determine if passed
    if (
      exam.score !== null &&
      exam.score !== undefined &&
      exam.certification?.pass_score !== undefined
    ) {
      return exam.score >= exam.certification.pass_score
        ? 'completed_successful'
        : 'completed_review';
    }
    // Default to completed if no score/pass criteria available
    return 'completed';
  } else if (hasStarted) {
    return 'in_progress';
  } else if (backendStatus === 'READY') {
    return 'ready';
  } else if (backendStatus === 'PENDING_QUESTIONS') {
    return 'not_started';
  }

  return 'not_started';
};

// Helper function to get status information for UI display
export const getExamStatusInfo = (status: DerivedExamStatus): ExamStatusInfo => {
  const statusConfig: Record<DerivedExamStatus, ExamStatusInfo> = {
    not_started: {
      status: 'not_started',
      label: 'Not Started',
      bgColor: 'bg-blue-25 dark:bg-blue-950/20',
      borderColor: 'border-blue-100 dark:border-blue-900/30',
    },
    ready: {
      status: 'ready',
      label: 'Ready',
      bgColor: 'bg-green-25 dark:bg-green-950/20',
      borderColor: 'border-green-100 dark:border-green-900/30',
    },
    generating: {
      status: 'generating',
      label: 'Generating Questions...',
      bgColor: 'bg-yellow-25 dark:bg-yellow-950/20',
      borderColor: 'border-yellow-100 dark:border-yellow-900/30',
    },
    generation_failed: {
      status: 'generation_failed',
      label: 'Generation Failed',
      bgColor: 'bg-red-25 dark:bg-red-950/20',
      borderColor: 'border-red-100 dark:border-red-900/30',
    },
    in_progress: {
      status: 'in_progress',
      label: 'In Progress',
      bgColor: 'bg-green-25 dark:bg-green-950/20',
      borderColor: 'border-green-100 dark:border-green-900/30',
    },
    completed: {
      status: 'completed',
      label: 'Completed',
      bgColor: 'bg-blue-25 dark:bg-blue-950/20',
      borderColor: 'border-blue-100 dark:border-blue-900/30',
    },
    completed_successful: {
      status: 'completed_successful',
      label: 'Passed',
      bgColor: 'bg-emerald-25 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-100 dark:border-emerald-900/30',
    },
    completed_review: {
      status: 'completed_review',
      label: 'Failed',
      bgColor: 'bg-red-25 dark:bg-red-950/20',
      borderColor: 'border-red-100 dark:border-red-900/30',
    },
  };

  return statusConfig[status];
};
