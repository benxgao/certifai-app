// Shared TypeScript types for exam status across the application

// Exam generation progress stages
export enum ExamGenerationStage {
  Starting = 'starting',
  Generating = 'generating',
  Finalizing = 'finalizing',
  Complete = 'complete',
}

// Backend exam status as returned by the API
export enum BackendExamStatus {
  READY = 'READY',
  QUESTIONS_GENERATING = 'QUESTIONS_GENERATING',
  PENDING_QUESTIONS = 'PENDING_QUESTIONS',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  QUESTION_GENERATION_FAILED = 'QUESTION_GENERATION_FAILED',
}

// Derived exam status for UI display
export enum DerivedExamStatus {
  not_started = 'not_started',
  ready = 'ready',
  generating = 'generating',
  generation_failed = 'generation_failed',
  in_progress = 'in_progress',
  completed = 'completed',
  completed_successful = 'completed_successful',
  completed_review = 'completed_review',
}

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
  if (backendStatus === BackendExamStatus.QUESTIONS_GENERATING) {
    return DerivedExamStatus.generating;
  } else if (backendStatus === BackendExamStatus.QUESTION_GENERATION_FAILED) {
    return DerivedExamStatus.generation_failed;
  } else if (isCompleted) {
    // If we have score and pass score, determine if passed
    if (
      exam.score !== null &&
      exam.score !== undefined &&
      exam.certification?.pass_score !== undefined
    ) {
      return exam.score >= exam.certification.pass_score
        ? DerivedExamStatus.completed_successful
        : DerivedExamStatus.completed_review;
    }
    // Default to completed if no score/pass criteria available
    return DerivedExamStatus.completed;
  } else if (hasStarted) {
    return DerivedExamStatus.in_progress;
  } else if (backendStatus === BackendExamStatus.READY) {
    return DerivedExamStatus.ready;
  } else if (backendStatus === BackendExamStatus.PENDING_QUESTIONS) {
    return DerivedExamStatus.not_started; // Treat pending questions as not started for user clarity
  }

  return DerivedExamStatus.not_started;
};

// Helper function to get status information for UI display
export const getExamStatusInfo = (status: DerivedExamStatus): ExamStatusInfo => {
  const statusConfig: Record<DerivedExamStatus, ExamStatusInfo> = {
    [DerivedExamStatus.not_started]: {
      status: DerivedExamStatus.not_started,
      label: 'Not Started',
      bgColor: 'bg-blue-25 dark:bg-blue-950/20',
      borderColor: 'border-blue-100 dark:border-blue-900/30',
    },
    [DerivedExamStatus.ready]: {
      status: DerivedExamStatus.ready,
      label: 'Ready',
      bgColor: 'bg-green-25 dark:bg-green-950/20',
      borderColor: 'border-green-100 dark:border-green-900/30',
    },
    [DerivedExamStatus.generating]: {
      status: DerivedExamStatus.generating,
      label: 'Generating Questions...',
      bgColor: 'bg-yellow-25 dark:bg-yellow-950/20',
      borderColor: 'border-yellow-100 dark:border-yellow-900/30',
    },
    [DerivedExamStatus.generation_failed]: {
      status: DerivedExamStatus.generation_failed,
      label: 'Generation Failed',
      bgColor: 'bg-red-25 dark:bg-red-950/20',
      borderColor: 'border-red-100 dark:border-red-900/30',
    },
    [DerivedExamStatus.in_progress]: {
      status: DerivedExamStatus.in_progress,
      label: 'In Progress',
      bgColor: 'bg-green-25 dark:bg-green-950/20',
      borderColor: 'border-green-100 dark:border-green-900/30',
    },
    [DerivedExamStatus.completed]: {
      status: DerivedExamStatus.completed,
      label: 'Completed',
      bgColor: 'bg-blue-25 dark:bg-blue-950/20',
      borderColor: 'border-blue-100 dark:border-blue-900/30',
    },
    [DerivedExamStatus.completed_successful]: {
      status: DerivedExamStatus.completed_successful,
      label: 'Score Above Threshold',
      bgColor: 'bg-emerald-25 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-100 dark:border-emerald-900/30',
    },
    [DerivedExamStatus.completed_review]: {
      status: DerivedExamStatus.completed_review,
      label: 'Score Below Threshold',
      bgColor: 'bg-amber-25 dark:bg-amber-950/20',
      borderColor: 'border-amber-100 dark:border-amber-900/30',
    },
  };

  return statusConfig[status];
};
