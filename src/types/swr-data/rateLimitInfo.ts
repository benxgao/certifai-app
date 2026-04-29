// === Rate Limit Info API Response Types ===

/**
 * Data structure for rate limit information
 * From GET /api/users/:user_id/rate-limit
 */
export interface RateLimitInfoData {
  maxExamsAllowed: number;
  currentCount: number;
  remainingCount: number;
  canCreateExam: boolean;
  resetTime?: string;
  nextAvailableTime?: string; // Only present if canCreateExam is false
  hoursUntilNextExam?: number; // Only present if canCreateExam is false
  isAllowed?: boolean;
  error?: string;
}

/**
 * Response data type for GET /api/users/:user_id/rate-limit
 * data?.data resolves to this type
 */
export type SwrDataApiRateLimitInfoResponse = RateLimitInfoData;
