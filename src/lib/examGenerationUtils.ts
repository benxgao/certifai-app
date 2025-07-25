/**
 * Utility to estimate exam generation completion based on batch information
 * This helps provide better feedback to users about generation progress
 */

export interface BatchProgressInfo {
  totalBatches: number;
  currentBatch?: number;
  completedBatches?: number;
  estimatedCompletionTime: number; // in milliseconds
  averageBatchTime: number; // estimated time per batch in ms
  questionsGenerated?: number;
  totalQuestions?: number;
}

export interface ExamGenerationEstimate {
  isLikelyComplete: boolean;
  estimatedTimeRemaining: number; // in milliseconds
  completionPercentage: number; // 0-100
  nextCheckTime: number; // suggested next check time in ms
  stage: 'initializing' | 'generating' | 'finalizing' | 'complete';
  questionsProgress?: number; // 0-100 based on actual questions generated
  realProgress?: {
    currentBatch: number;
    totalBatches: number;
    questionsGenerated: number;
    targetQuestions?: number;
  };
}

/**
 * Estimates exam generation progress based on batch information and elapsed time
 */
export function estimateExamGenerationProgress(
  examCreatedAt: string | Date,
  batchInfo?: BatchProgressInfo,
): ExamGenerationEstimate {
  const createdTime = new Date(examCreatedAt).getTime();
  const currentTime = Date.now();
  const elapsedTime = currentTime - createdTime;

  // Default batch timing estimates (can be refined based on actual data)
  const DEFAULT_BATCH_TIME = 35000; // 35 seconds per batch (conservative estimate)
  const MIN_GENERATION_TIME = 70000; // 70 seconds minimum
  const MAX_GENERATION_TIME = 420000; // 7 minutes maximum

  const totalBatches = batchInfo?.totalBatches || 5; // Default assumption
  const averageBatchTime = batchInfo?.averageBatchTime || DEFAULT_BATCH_TIME;

  // Calculate expected total time
  const expectedTotalTime = Math.max(
    MIN_GENERATION_TIME,
    Math.min(MAX_GENERATION_TIME, totalBatches * averageBatchTime),
  );

  // Calculate completion percentage
  const completionPercentage = Math.min(100, (elapsedTime / expectedTotalTime) * 100);

  // Determine generation stage
  let stage: 'initializing' | 'generating' | 'finalizing' | 'complete';
  if (completionPercentage < 15) {
    stage = 'initializing';
  } else if (completionPercentage < 85) {
    stage = 'generating';
  } else if (completionPercentage < 100) {
    stage = 'finalizing';
  } else {
    stage = 'complete';
  }

  // Calculate questions progress if batch info is available
  let questionsProgress: number | undefined;
  if (batchInfo?.questionsGenerated !== undefined && batchInfo?.totalQuestions !== undefined) {
    questionsProgress = Math.min(
      100,
      (batchInfo.questionsGenerated / batchInfo.totalQuestions) * 100,
    );
  }

  // Estimate if generation is likely complete
  const isLikelyComplete = elapsedTime >= expectedTotalTime * 0.9; // 90% of expected time

  // Calculate remaining time
  const estimatedTimeRemaining = Math.max(0, expectedTotalTime - elapsedTime);

  // Suggest next check timing based on progress
  let nextCheckTime: number;
  if (completionPercentage < 50) {
    nextCheckTime = 60000; // Check every 60 seconds early on
  } else if (completionPercentage < 80) {
    nextCheckTime = 15000; // Check every 15 seconds as we get closer
  } else {
    nextCheckTime = 3000; // Check every 3 seconds when likely complete
  }

  return {
    isLikelyComplete,
    estimatedTimeRemaining,
    completionPercentage,
    nextCheckTime,
    stage,
    questionsProgress,
  };
}

/**
 * Creates a smart polling interval based on generation progress
 */
export function getSmartPollingInterval(examState: any, batchInfo?: BatchProgressInfo): number {
  if (examState?.exam_status !== 'QUESTIONS_GENERATING') {
    return 0; // No polling needed
  }

  const startedAt = examState?.started_at || examState?.created_at;
  if (!startedAt) {
    return 5000; // Default to 5 seconds if no start time
  }

  const estimate = estimateExamGenerationProgress(startedAt, batchInfo);

  // Use the suggested check time from the estimate
  return estimate.nextCheckTime;
}

/**
 * Determines if we should show a "Check Status" button to the user
 */
export function shouldShowStatusCheckButton(
  examState: any,
  batchInfo?: BatchProgressInfo,
): boolean {
  if (examState?.exam_status !== 'QUESTIONS_GENERATING') {
    return false;
  }

  const startedAt = examState?.started_at || examState?.created_at;
  if (!startedAt) {
    return false;
  }

  const estimate = estimateExamGenerationProgress(startedAt, batchInfo);

  // Show button if we're likely past completion time
  return estimate.isLikelyComplete;
}
