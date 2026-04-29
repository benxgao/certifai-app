// === Exam Info API Response Types ===

/**
 * Exam answer progress info within exam info response
 */
export interface ExamInfoProgressData {
  total_questions: number;
  answered_questions: number;
  correct_answers: number;
  completion_percentage: number;
}

/**
 * Data structure for exam info response
 * From GET /api/users/:user_id/exams/:exam_id
 */
export interface ExamInfoData {
  exam_id: string;
  api_user_id: string; // Our internal UUID for API operations
  cert_id: number;
  exam_status: string;
  total_questions: number;
  score: number | null;
  token_cost: number;
  custom_prompt_text: string | null;
  started_at: string | null;
  submitted_at: string | null;
  status: string; // Computed status from API
  // Deprecated: keeping for backward compatibility only
  user_id?: string; // @deprecated Use api_user_id instead
  progress?: ExamInfoProgressData;
}

/**
 * Response data type for GET /api/users/:user_id/exams/:exam_id
 * data?.data resolves to this type
 */
export type SwrDataApiExamInfoResponse = ExamInfoData;
