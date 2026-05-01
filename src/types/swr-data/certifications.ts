// /memories/swr-type-enforcement-pattern.md

// === Enums ===

/**
 * Status values for user certification registration
 * @guaranteed ACTIVE | INACTIVE | PENDING | COMPLETED - follows backend enum
 */
export enum CertificationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
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
 * Generic response type for certification mutation operations (POST/DELETE)
 * Used by register, unregister, and other mutation operations
 * @note This is a strict interface - no extra fields allowed. If API returns additional fields, add them explicitly.
 */
export interface CertificationMutationResponse {
  id?: string;
  message?: string;
  cert_id?: number;
  status?: string;
  assigned_at?: string;
  updated_at?: string;
}

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
  /** Internal UUID for API operations @guaranteed */
  api_user_id: string;
  /** Certification ID @guaranteed */
  cert_id: number;
  /** Current status of user registration (ACTIVE, INACTIVE, PENDING, COMPLETED) @guaranteed */
  status: CertificationStatus;
  /** Timestamp when certification was assigned to user @guaranteed */
  assigned_at: string;
  /** Timestamp when registration was last updated @guaranteed */
  updated_at: string;
  /** @deprecated Use api_user_id instead */
  // user_id?: string;
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
