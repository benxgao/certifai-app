// === All Data (Firms + Certifications Combined) API Response Types ===

/**
 * Certification item from GET /api/public/certifications
 * Matches the actual API response structure with nested firm object
 * Also includes flattened firm_id for component access compatibility
 * @guaranteed cert_id, name, slug, min_quiz_counts, max_quiz_counts, pass_score, firm_id, description, created_at
 * @optional exam_guide_url, firm.name, firm.code (firm.firm_id is guaranteed if firm exists)
 */
export interface FirmCertificationItemData {
  cert_id: number;
  name: string;
  slug: string;
  exam_guide_url?: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
  /** Flattened from firm.firm_id for component access */
  firm_id: number;
  /** Description - not provided by API, defaults to empty string */
  description: string;
  /** created_at - not provided by API, defaults to current ISO timestamp */
  created_at: string;
  /** Nested firm object as returned by API */
  firm?: {
    firm_id: number;
    name: string;
    code: string;
    logo_url: string | null;
  };
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
 * Reflects actual API response from GET /api/public/firms with null-coalescing defaults
 * Note: Hook applies || '' defaults to description, website_url, and logo_url
 * @guaranteed firm_id, name, code, created_at, description, website_url, logo_url (all have defaults)
 */
export interface AllFirmData {
  firm_id: number;
  name: string;
  code: string;
  description: string;
  website_url: string;
  logo_url: string;
  created_at: string;
  _count?: {
    certifications: number;
  };
}

/**
 * Response data type for all firms across all pages
 * useAllFirms hook resolves to an array of this type
 */
export type SwrDataAllFirmsResponse = AllFirmData[];
