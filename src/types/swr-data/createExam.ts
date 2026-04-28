// === Create Exam API Response Types ===

/**
 * Request payload for creating an exam
 * POST /api/users/:user_id/certifications/:cert_id/exams
 */
export interface CreateExamRequest {
  numberOfQuestions: number;
  customPromptText?: string;
}

/**
 * Data structure for exam creation response
 * From POST /api/users/:user_id/certifications/:cert_id/exams
 */
export interface CreateExamResponse {
  exam_id: string;
  api_user_id: string; // Our internal UUID for API operations
  cert_id: number;
  status: string;
  total_questions: number;
  token_cost: number;
  total_batches: number;
  topics_generated: number; // Number of AI-generated topics
  custom_prompt: string;
  // Deprecated: keeping for backward compatibility only
  user_id?: string; // @deprecated Use api_user_id instead
}

/**
 * Response data type for POST /api/users/:user_id/certifications/:cert_id/exams
 * response.data resolves to this type
 */
export type SwrDataCreateExamResponse = CreateExamResponse;

/**
 * Rate limiting error information
 */
export interface RateLimitError {
  maxExamsAllowed: number;
  currentCount: number;
  remainingCount: number;
  resetTime: string;
}

/**
 * Custom error type for exam creation with additional context
 */
export interface CreateExamError extends Error {
  status?: number;
  rateLimitInfo?: RateLimitError;
}
