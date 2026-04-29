// === Exams API Response Types ===

/**
 * Certification details embedded within exam data
 */
export interface ExamCertificationData {
  cert_id: number;
  name: string;
  exam_guide_url: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
}

/**
 * Rate limit information included in exam list responses
 */
export interface ExamRateLimitData {
  maxExamsAllowed: number;
  currentCount: number;
  remainingCount: number;
  canCreateExam: boolean;
  resetTime: string;
  nextAvailableTime?: string;
  hoursUntilNextExam?: number;
  error?: string;
}

/**
 * Single exam item returned in exam list responses
 * From GET /api/users/:user_id/exams
 * From GET /api/users/:user_id/certifications/:cert_id/exams
 */
export interface ExamListItemData {
  exam_id: string;
  api_user_id: string; // Our internal UUID for API operations
  cert_id: number;
  exam_status?: string; // Database exam status
  score: number | null;
  token_cost: number;
  total_questions: number;
  custom_prompt_text?: string | null;
  started_at: string | null;
  submitted_at: number | null;
  certification: ExamCertificationData;
  status: string; // Computed status from API
  // Deprecated: keeping for backward compatibility only
  user_id?: string; // @deprecated Use api_user_id instead
}

/**
 * Response data type for GET /api/users/:user_id/exams (paginated list with rate limit)
 * data?.data resolves to this type
 */
export type SwrDataApiExamListResponse = ExamListItemData[];

/**
 * Certification details with performance metrics (used in exam detail)
 */
export interface ExamCertificationWithPerformance extends ExamCertificationData {
  performance: {
    meets_threshold: boolean | null;
    threshold_score: number;
    current_score: number | null;
  };
}

/**
 * Exam generation progress embedded within exam detail
 */
export interface ExamGenerationProgressData {
  current_batch: number;
  total_batches: number;
  questions_generated: number;
  target_questions?: number;
  completion_percentage: number;
  updated_at: number;
}

/**
 * Exam answer progress (how many questions answered correctly)
 */
export interface ExamProgressData {
  total_questions: number;
  answered_questions: number;
  correct_answers: number;
  completion_percentage: number;
}

/**
 * Detailed exam data returned from a single exam fetch
 * From GET /api/users/:user_id/certifications/:cert_id/exams/:exam_id
 * From GET /api/users/:user_id/exams/:exam_id
 */
export interface ExamDetailData {
  exam_id: string;
  api_user_id: string; // Our internal UUID for API operations
  cert_id: number;
  exam_status: string;
  total_questions: number;
  score: number | null;
  token_cost: number;
  custom_prompt_text?: string | null;
  started_at: string | null;
  submitted_at: string | number | null;
  status: string; // Computed status from API
  // Deprecated: keeping for backward compatibility only
  user_id?: string; // @deprecated Use api_user_id instead
  progress?: ExamProgressData;
  certification?: ExamCertificationWithPerformance | null;
  generation_progress?: ExamGenerationProgressData | null;
}

/**
 * Response data type for GET /api/users/:user_id/certifications/:cert_id/exams/:exam_id
 * data?.data resolves to this type
 */
export type SwrDataApiExamDetailResponse = ExamDetailData;

/**
 * Response data for exam submission
 * From POST /api/users/:user_id/certifications/:cert_id/exams/:exam_id/submit
 */
export interface ExamSubmitData {
  score: number;
  tokens_deducted: number;
  energy_tokens_awarded: number;
  correct_answers: number;
}

/**
 * Response data type for POST .../submit
 * data?.data resolves to this type
 */
export type SwrDataApiExamSubmitResponse = ExamSubmitData;

/**
 * Deletion summary within exam delete response
 */
export interface ExamDeletionSummary {
  exam_user_answers_deleted: number;
  exam_user_answers_expected: number;
  answer_options_deleted: number;
  answer_options_expected: number;
  quiz_questions_deleted: number;
  quiz_questions_expected: number;
  quiz_question_ids_deleted: string[];
}

/**
 * RTDB cleanup info within exam delete response
 */
export interface ExamRtdbCleanup {
  exam_plan_deleted: boolean;
  exam_data_deleted: boolean;
}

/**
 * Validation info within exam delete response
 */
export interface ExamDeletionValidation {
  completely_deleted: boolean;
  remaining_data_check: {
    examAttempt: number;
    quizQuestions: number;
    answerOptions: number;
    examUserAnswers: number;
  };
}

/**
 * Response data for exam deletion
 * From DELETE /api/users/:user_id/exams/:exam_id
 */
export interface ExamDeleteData {
  exam_id: string;
  api_user_id: string; // Our internal UUID for API operations
  cert_id: number;
  certification_name: string;
  exam_status: string;
  total_questions: number;
  token_cost: number;
  // Deprecated: keeping for backward compatibility only
  user_id?: string; // @deprecated Use api_user_id instead
  deletion_summary: ExamDeletionSummary;
  rtdb_cleanup: ExamRtdbCleanup;
  validation: ExamDeletionValidation;
}

/**
 * Response data type for DELETE /api/users/:user_id/exams/:exam_id
 * data?.data resolves to this type
 */
export type SwrDataApiExamDeleteResponse = ExamDeleteData;
