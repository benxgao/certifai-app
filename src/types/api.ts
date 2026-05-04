/**
 * Standardized API response types for certifai-api
 * All API responses follow the format: { success: boolean, data: T, meta?: PaginationMeta }
 */

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T;
  meta: PaginationMeta;
}

// Error response from API
export interface ApiErrorResponse {
  success: false;
  error: string;
}

/**
 * Extended Error type for HTTP/API errors returned by SWR hooks
 * Includes additional properties commonly present on fetch-based errors
 */
export interface ApiError extends Error {
  status?: number;
  response?: { status?: number };
  code?: string;
  /** Response body attached when the fetch succeeded structurally but returned a non-ok status */
  info?: unknown;
}

/**
 * Type guard to narrow an unknown value to ApiError.
 * Checks that the value is an Error instance and carries at least one of the
 * extended HTTP / API error properties defined above.
 */
export function isApiError(err: unknown): err is ApiError {
  return (
    err instanceof Error &&
    ('status' in err || 'code' in err || 'info' in err || 'response' in err)
  );
}

// Legacy pagination format for backward compatibility
export interface LegacyPaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
