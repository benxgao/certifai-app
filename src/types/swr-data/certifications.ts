
// === Certification API Response Types ===

/**
 * Data structure for a single certification item from GET /api/public/certifications
 * This matches the CertificationListItem in certifications.ts
 */
export interface CertificationListItemData {
  cert_id: number;
  firm_id: number;
  name: string;
  exam_guide_url: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
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
 * Response data type for GET /api/public/certifications (list all certifications)
 * data?.data resolves to this type
 */
export type SwrDataApiCertificationsListResponse = CertificationListItemData[];

/**
 * Data structure for a certification when registered by a user
 * From GET /api/users/:user_id/certifications
 * This matches the UserRegisteredCertification in certifications.ts
 */
export interface UserRegisteredCertificationData {
  api_user_id: string;
  cert_id: number;
  status: string;
  assigned_at: string;
  updated_at: string;
  user_id?: string; // @deprecated Use api_user_id instead
  certification: {
    cert_id: number;
    name: string;
    exam_guide_url: string;
    min_quiz_counts: number;
    max_quiz_counts: number;
    pass_score: number;
  };
}

/**
 * Response data type for GET /api/users/:user_id/certifications
 * data?.data resolves to this type
 */
export type SwrDataApiUserCertificationsResponse = UserRegisteredCertificationData[];

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

/**
 * Response data type for GET /api/public/certifications/:certId (certification detail)
 * data?.data resolves to this type
 */
export type SwrDataApiCertificationDetailResponse = CertificationDetailData;

/**
 * Generic response type for certification mutation operations (POST/DELETE)
 * Used by register, unregister, and other mutation operations
 */
export interface CertificationMutationResponseData {
  id?: string;
  message?: string;
  cert_id?: number;
  status?: string;
  assigned_at?: string;
  updated_at?: string;
  [key: string]: any;
}

/**
 * Response data type for certification mutations (register, unregister, etc.)
 * data?.data resolves to this type
 */
export type SwrDataApiCertificationMutationResponse = CertificationMutationResponseData;
