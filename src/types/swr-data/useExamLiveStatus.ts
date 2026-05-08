// === Exam Live Status API Response Types ===
import type { BackendExamStatus } from '../exam-status';

/**
 * Real-time exam status data returned from the live-status endpoint
 * From GET /api/users/:user_id/exams/:exam_id/live-status
 */
export interface ExamLiveStatusData {
  exam_id: string;
  exam_status: BackendExamStatus;
  progress_percentage: number;
  topics_with_questions: number;
  total_topics: number;
  total_questions: number;
  estimated_seconds_remaining: number;
  is_generating_completed: boolean;
  query_duration_ms: number;
  timestamp_ms: number;
}

/**
 * Response data type for GET /api/users/:user_id/exams/:exam_id/live-status
 * data?.data resolves to this type
 */
export type SwrDataApiExamLiveStatusResponse = ExamLiveStatusData;
