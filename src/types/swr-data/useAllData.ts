// === All Data (Firms + Certifications Combined) API Response Types ===

/**
 * Certification item within a firm's certification list
 * Derived from GET /api/public/certifications (filtered by firm)
 */
export interface FirmCertificationItemData {
  cert_id: number;
  firm_id: number;
  name: string;
  exam_guide_url: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
}

/**
 * Firm with its associated certifications
 * Aggregated from GET /api/public/firms (with includeCount) and GET /api/public/certifications
 */
export interface FirmWithCertificationsData {
  id: number;
  code: string;
  name: string;
  description: string;
  website_url: string;
  logo_url: string;
  certification_count: number;
  certifications: FirmCertificationItemData[];
}

/**
 * Response data type for the combined firms + certifications data
 * useAllFirmsWithCertifications hook resolves to an array of this type
 */
export type SwrDataAllFirmsWithCertificationsResponse = FirmWithCertificationsData[];

/**
 * Response data type for all certifications across all pages
 * useAllCertifications hook resolves to an array of this type
 */
export type SwrDataAllCertificationsResponse = FirmCertificationItemData[];

/**
 * Firm data for the all-firms hook
 * useAllFirms hook resolves to an array of this type
 */
export interface AllFirmData {
  firm_id: number;
  name: string;
  code: string;
  description: string;
  website_url: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  _count?: {
    certifications: number;
  };
}

/**
 * Response data type for all firms across all pages
 * useAllFirms hook resolves to an array of this type
 */
export type SwrDataAllFirmsResponse = AllFirmData[];
