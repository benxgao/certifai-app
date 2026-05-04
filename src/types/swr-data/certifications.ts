// /memories/swr-type-enforcement-pattern.md

// === Enums ===

/**
 * Status values for user certification registration
 * Matches Prisma enum values from certifai-api schema
 * @guaranteed PASSED | IN_PROGRESS | INTERESTED | DELETING | NOT_STARTED | EXPIRED | SUSPENDED
 */
export enum CertificationStatus {
  PASSED = 'PASSED',
  IN_PROGRESS = 'IN_PROGRESS',
  INTERESTED = 'INTERESTED',
  DELETING = 'DELETING',
  NOT_STARTED = 'NOT_STARTED',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

// === Request/Input Types ===

/**
 * Input type for creating a new certification
 * Used by POST /api/public/certifications
 */
export interface CertificationInput {
  name: string;
}

/**
 * Input type for registering a user for a certification
 * Used by POST /api/users/:user_id/certifications
 */
export interface UserCertificationRegistrationInput {
  certificationId: number;
}

/**
 * Data structure for a registered user certification (POST /api/users/:user_id/certifications)
 * Matches the `data` field of the API register response
 */
export interface UserCertificationData {
  user_id: string;
  cert_id: number;
  status: CertificationStatus;
  /** ISO 8601 datetime string (Prisma DateTime serializes as string) */
  assigned_at: string;
  updated_at: string;
}

/**
 * Deletion summary for a certification (DELETE /api/users/:user_id/certifications/:certId)
 */
export interface DeletionSummary {
  exams_deleted: number;
  exams_expected: number;
  exam_ids_deleted: string[];
  exam_user_answers_deleted: number;
  exam_user_answers_expected: number;
  answer_options_deleted: number;
  answer_options_expected: number;
  quiz_questions_deleted: number;
  quiz_questions_expected: number;
  quiz_question_ids_deleted: string[];
}

/**
 * Data structure for a certification deletion response
 * Matches the `data` field of the API delete response
 */
export interface CertificationDeletionData {
  cert_id: number;
  user_id: string;
  certification_name: string;
  firm_name: string;
  certification_status: CertificationStatus;
  deletion_summary: DeletionSummary;
  rtdb_cleanup: {
    exam_plans_deleted: number;
    exam_data_deleted: number;
    total_exams_processed: number;
  };
  validation: {
    completely_deleted: boolean;
    remaining_data_check: Record<string, number>;
  };
  timing: {
    total_duration_ms: number;
    database_transaction_ms: number;
    rtdb_cleanup_ms: number;
  };
}

/**
 * @deprecated Use UserCertificationData instead
 * Kept for backward compatibility
 */
export type CertificationMutationResponse = UserCertificationData;

/**
 * Data structure for a single certification item from GET /api/public/certifications
 * This matches the CertificationListItem in certifications.ts
 * @guaranteed cert_id, name, min_quiz_counts, max_quiz_counts, pass_score, firm.firm_id
 * @optional exam_guide_url, firm.name, firm.code, firm.logo_url
 */
export interface CertificationListItem {
  /** Globally unique certification ID @guaranteed */
  cert_id: number;
  /** Human-readable certification name @guaranteed */
  name: string;
  /** URL to exam guide/study materials (may not be provided by API) @optional */
  exam_guide_url?: string;
  /** Minimum quiz count requirement @guaranteed */
  min_quiz_counts: number;
  /** Maximum quiz count allowed @guaranteed */
  max_quiz_counts: number;
  /** Passing score requirement as percentage @guaranteed */
  pass_score: number;
  /** Related firm/organization details @optional */
  firm?: {
    firm_id: number;
    name: string;
    code: string;
    description?: string;
    website_url?: string | null;
    logo_url?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

/**
 * Explicit nested certification info within a user registration
 * Defines the structure of the certification field in UserRegisteredCertification
 * @guaranteed cert_id, name, min_quiz_counts, max_quiz_counts, pass_score
 * @optional exam_guide_url
 */
export interface CertificationInfo {
  /** Certification ID @guaranteed */
  cert_id: number;
  /** Certification name @guaranteed */
  name: string;
  /** Exam guide URL (may not be provided by API) @optional */
  exam_guide_url?: string;
  /** Minimum quiz count requirement @guaranteed */
  min_quiz_counts: number;
  /** Maximum quiz count allowed @guaranteed */
  max_quiz_counts: number;
  /** Passing score requirement as percentage @guaranteed */
  pass_score: number;
}

/**
 * Data structure for a certification when registered by a user
 * From GET /api/users/:user_id/certifications
 * @guaranteed api_user_id, cert_id, status, assigned_at, updated_at, certification
 */
export interface UserRegisteredCertification {
  /**
   * Internal Prisma user UUID — matches `User.user_id` in the database schema.
   * This is NOT the Firebase UID (`firebase_user_id`). The API serializes this
   * field as `user_id` in the JSON response, so the field name must stay `user_id`
   * (not `api_user_id`, which is only used as a variable name inside app-layer code
   * to distinguish it from the Firebase UID).
   * @guaranteed
   */
  user_id: string;
  /** Certification ID @guaranteed */
  cert_id: number;
  /** Current status of user registration @guaranteed */
  status: CertificationStatus;
  /** Timestamp when certification was assigned to user @guaranteed */
  assigned_at: string;
  /** Timestamp when registration was last updated @guaranteed */
  updated_at: string;
  /** Certification details for this registration @guaranteed */
  certification: CertificationInfo;
}

/**
 * Data structure for detailed certification info
 * From GET /api/public/certifications/:certId
 */
export interface CertificationDetailData {
  cert_id: number;
  firm_id: number;
  name: string;
  slug: string;
  description?: string;
  exam_guide_url?: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
  created_at?: string;
  updated_at?: string;
  firm?: {
    firm_id?: number;
    id?: number;
    code: string;
    name: string;
    description?: string;
    website_url?: string;
    logo_url?: string;
  };
  enrollment_count?: number;
  related_certifications?: Array<{
    cert_id: number;
    name: string;
    slug: string;
    description?: string;
    min_quiz_counts: number;
    max_quiz_counts: number;
    pass_score: number;
  }>;
}

// === Knowledge Pooling Types ===

export interface KnowledgeInsight {
  insight_id: string;
  exam_id: string;
  topic: string;
  insight: string;
  generated_at: string;
}

export interface KnowledgePoolingStats {
  total_insights: number;
  unique_exams: number;
  unique_topics: number;
}

export interface KnowledgePoolingData {
  cert_id: number;
  user_id: string;
  knowledge_insights: KnowledgeInsight[];
  certification_name: string;
  last_updated: string;
  stats: KnowledgePoolingStats;
}

export interface KnowledgePoolingGenerateMetadata {
  exam_id_used: string;
  force_regenerate: boolean;
  processing_time_ms: number;
  analysis_needed: boolean;
  timestamp: string;
}

export interface KnowledgePoolingGenerateData {
  success: boolean;
  data: KnowledgePoolingData;
  message: string;
  generated: boolean;
  metadata: KnowledgePoolingGenerateMetadata;
}
