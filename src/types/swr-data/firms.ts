// === Firms API Response Types ===

/**
 * Data structure for a single firm
 * From GET /api/public/firms
 * From GET /api/public/firms/:firm_id
 */
export interface FirmData {
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
 * Response data type for GET /api/public/firms (list)
 * data?.data resolves to this type
 */
export type SwrDataApiFirmsListResponse = FirmData[];

/**
 * Response data type for GET /api/public/firms/:firm_id (single)
 * data?.data resolves to this type
 */
export type SwrDataApiFirmDetailResponse = FirmData;

/**
 * Data structure for a certification associated with a firm
 * From GET /api/public/certifications/firms/:firm_id
 */
export interface CertificationByFirmData {
  cert_id: number;
  firm_id: number;
  name: string;
  exam_guide_url: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
  firm?: FirmData;
}

/**
 * Response data type for GET /api/public/certifications/firms/:firm_id
 * data?.data resolves to this type
 */
export type SwrDataApiCertificationsByFirmResponse = CertificationByFirmData[];
