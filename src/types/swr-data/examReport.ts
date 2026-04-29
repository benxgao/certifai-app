// === Exam Report API Response Types ===

/**
 * Performance breakdown for a single topic within a report
 */
export interface ExamReportTopicPerformance {
  topic: string;
  correct_answers: number;
  total_attempts: number;
  accuracy_rate: number;
  difficulty_level: string;
  performance_category: string;
}

/**
 * Structured analytical data within the exam report
 */
export interface ExamReportStructuredData {
  exam_id: string;
  overall_score: number;
  total_questions: number;
  correct_answers: number;
  topic_performance: ExamReportTopicPerformance[];
  generated_at: string;
  text_summary: string;
  // Additional Firestore-stored fields
  user_id?: string;
  cert_id?: number;
}

/**
 * High-level performance summary within the exam report
 */
export interface ExamReportPerformanceSummary {
  overall_score: number;
  total_questions: number;
  correct_answers: number;
  topics_analyzed?: number;
  topic_breakdown?: Array<{
    topic: string;
    accuracy: number;
    questions: number;
  }>;
}

/**
 * Data structure for an exam report
 * From GET /api/users/:user_id/exams/:exam_id/exam-report
 * From POST /api/users/:user_id/exams/:exam_id/exam-report
 */
export interface ExamReportData {
  exam_id: string;
  report: string;
  already_existed: boolean;
  generated_at: string;
  structured_data?: ExamReportStructuredData;
  performance_summary: ExamReportPerformanceSummary;
}

/**
 * Response data type for GET /api/users/:user_id/exams/:exam_id/exam-report
 * data?.data resolves to this type
 */
export type SwrDataApiExamReportFetchResponse = ExamReportData;

/**
 * Response data type for POST /api/users/:user_id/exams/:exam_id/exam-report
 * data?.data resolves to this type
 */
export type SwrDataApiExamReportGenerateResponse = ExamReportData;
