// === Exam Questions API Response Types ===

/**
 * Answer option within a question
 */
export interface AnswerOptionData {
  option_id: string;
  option_text: string;
  is_correct?: boolean; // Only present when exam has been submitted
}

/**
 * Single question with user answer state
 * From GET /api/users/:user_id/exams/:exam_id/questions (paginated)
 */
export interface QuestionData {
  quiz_question_id: string;
  question_text: string;
  difficulty: string | null;
  generated_from: string | null;
  cert_id: number;
  exam_topic: string | null;
  user_answer_id: string;
  selected_option_id: string | null;
  explanations?: string | null; // Only present when exam has been submitted
  user_answer_is_correct?: boolean | null; // Only present when exam has been submitted
  correct_option_id?: string | null; // Optional field to indicate the correct answer
  answerOptions: AnswerOptionData[];
}

/**
 * Questions list wrapped within the paginated response data
 * From GET /api/users/:user_id/exams/:exam_id/questions
 * Response shape: { success, data: { questions: [...] }, pagination }
 * Note: total_questions / answered_questions are in pagination.totalItems and
 * getUserExam.progress respectively — NOT in this data object.
 */
export interface ExamQuestionsData {
  questions: QuestionData[];
}

/**
 * Alias for ExamQuestionsData — preferred name going forward
 */
export type ExamQuestionsResponseData = ExamQuestionsData;

/**
 * Alias for QuestionData — preferred name going forward
 * Matches the structure returned by getExamQuestions handler
 */
export type ExamQuestionWithAnswer = QuestionData;

/**
 * Response data type for GET /api/users/:user_id/exams/:exam_id/questions
 * data?.data resolves to this type
 */
export type SwrDataApiExamQuestionsResponse = ExamQuestionsResponseData;

/**
 * Updated answer record returned after submitting an answer
 * From PUT /api/users/:user_id/certifications/:cert_id/exams/:exam_id/questions/:question_id
 */
export interface SubmitAnswerData {
  user_answer_id: string;
  exam_id: string;
  quiz_question_id: string;
  selected_option_id: string | null;
  is_correct: boolean | null;
}

/**
 * Response data type for PUT .../questions/:question_id (submit answer)
 * data?.data resolves to this type
 */
export type SwrDataApiSubmitAnswerResponse = SubmitAnswerData;

/**
 * Custom error type for answer submission failures
 * Includes the questionId that failed to help identify which question had the error
 */
export class SubmitAnswerError extends Error {
  constructor(
    message: string,
    public questionId: string,
  ) {
    super(message);
    this.name = 'SubmitAnswerError';
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, SubmitAnswerError.prototype);
  }
}
