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

// Legacy pagination format for backward compatibility
export interface LegacyPaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
