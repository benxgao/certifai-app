// === Exam Generating Progress API Response Types ===
// @deprecated Use useExamLiveStatus types instead

/**
 * Exam generation progress data from the generating-progress endpoint
 * From GET /api/users/:user_id/exams/:exam_id/generating-progress
 *
 * @deprecated Use ExamLiveStatusData from useExamLiveStatus instead
 */
export interface ExamGeneratingProgressData {
  exam_id: string;
  total_topics: number;
  topics_with_questions: number;
  topics_remaining: number;
  progress_percentage: number;
  status: 'starting' | 'generating' | 'finalizing' | 'complete';
  estimated_time_remaining_seconds: number;
  created_at: number;
  last_updated: number;
}

/**
 * Response data type for GET /api/users/:user_id/exams/:exam_id/generating-progress
 * data?.data resolves to this type
 *
 * @deprecated Use SwrDataApiExamLiveStatusResponse from useExamLiveStatus instead
 */
export type SwrDataApiExamGeneratingProgressResponse = ExamGeneratingProgressData;
