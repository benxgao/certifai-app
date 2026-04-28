// === Certification Summary API Response Types ===

/**
 * Topic mastery breakdown for certification summary
 */
export interface TopicMasteryData {
  topic: string;
  exams_covered: number;
  average_accuracy: number;
  mastery_level: 'novice' | 'developing' | 'proficient' | 'advanced' | 'expert';
  total_questions: number;
  total_correct: number;
}

/**
 * Structured data within certification summary
 */
export interface CertSummaryStructuredData {
  cert_id: string;
  user_id: string;
  certification_name: string;
  total_exams_taken: number;
  average_score: number;
  best_score: number;
  worst_score: number;
  total_questions_answered: number;
  total_correct_answers: number;
  overall_accuracy_rate: number;
  topic_mastery: TopicMasteryData[];
  performance_trend: 'improving' | 'declining' | 'stable';
  strengths: string[];
  areas_for_improvement: string[];
  generated_at: string;
  ai_summary: string;
}

/**
 * Summary statistics for certification summary
 */
export interface CertSummarySummaryStats {
  total_exams: number;
  average_score: number;
  best_score: number;
  topics_mastered: number;
  performance_trend: 'improving' | 'declining' | 'stable';
  strengths_count: number;
  improvement_areas_count: number;
}

/**
 * Data structure for certification summary
 * From GET /api/users/:user_id/certifications/:cert_id/cert-summary
 * From POST /api/users/:user_id/certifications/:cert_id/cert-summary
 */
export interface CertSummaryData {
  cert_id: string;
  user_id: string;
  summary: string;
  structured_data: CertSummaryStructuredData;
  already_existed: boolean;
  generated_at: string;
  summary_stats: CertSummarySummaryStats;
}

/**
 * Response data type for GET /api/users/:user_id/certifications/:cert_id/cert-summary
 * data resolves to this type (in certSummaryFetcher)
 */
export type SwrDataCertSummaryFetchResponse = CertSummaryData;

/**
 * Response data type for POST /api/users/:user_id/certifications/:cert_id/cert-summary
 * data resolves to this type (in generateCertSummary)
 */
export type SwrDataCertSummaryGenerateResponse = CertSummaryData;
