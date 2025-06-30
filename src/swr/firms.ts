import { useAuthSWR } from './useAuthSWR';
import { PaginatedApiResponse, ApiResponse } from '../types/api';
import { fetchAllFirms, fetchAllCertificationsByFirm } from '../lib/pagination-utils';

// Define the type for a firm
export interface Firm {
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

// Define the type for certification data associated with a firm
export interface CertificationByFirm {
  cert_id: number;
  firm_id: number;
  name: string;
  exam_guide_url: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
  firm?: Firm;
}

/**
 * Hook to fetch all firms with optional certification counts
 * @param includeCount - Whether to include certification counts
 * @param page - Page number for pagination
 * @param pageSize - Number of items per page
 * @param usePublicEndpoint - Whether to use public endpoint (for public pages) or private endpoint (for authenticated pages)
 */
export function useFirms(includeCount: boolean = false, page: number = 1, pageSize: number = 50) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(includeCount && { includeCount: 'true' }),
  });

  // Always use public endpoint for all app requests
  const endpoint = '/api/public/firms';

  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    PaginatedApiResponse<Firm[]>,
    Error
  >(`${endpoint}?${queryParams.toString()}`, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // Cache for 30 seconds
    refreshInterval: 0, // Don't auto-refresh
  });

  return {
    firms: data?.data,
    pagination: data?.meta,
    isLoadingFirms: isLoading,
    isFirmsError: error,
    isValidatingFirms: isValidating,
    mutateFirms: mutate,
    // Function to fetch all firms across all pages
    fetchAllFirms: () => fetchAllFirms(includeCount),
  };
}

/**
 * Hook to fetch a specific firm by ID with optional certifications
 * @param firmId - The ID of the firm to fetch
 * @param includeCertifications - Whether to include certifications data
 * @param usePublicEndpoint - Whether to use public endpoint (for public pages) or private endpoint (for authenticated pages)
 */
export function useFirm(firmId: number | null, includeCertifications: boolean = false) {
  const queryParams = includeCertifications ? `?includeCertifications=true` : '';
  // Always use public endpoint for all app requests
  const endpoint = '/api/public/firms';

  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<ApiResponse<Firm>, Error>(
    firmId ? `${endpoint}/${firmId}${queryParams}` : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // Cache for 30 seconds
      refreshInterval: 0, // Don't auto-refresh
    },
  );

  return {
    firm: data?.data,
    isLoadingFirm: isLoading,
    isFirmError: error,
    isValidatingFirm: isValidating,
    mutateFirm: mutate,
  };
}

/**
 * Hook to search firms
 * @param query - Search query string
 * @param page - Page number for pagination
 * @param pageSize - Number of items per page
 * @param usePublicEndpoint - Whether to use public endpoint (for public pages) or private endpoint (for authenticated pages)
 */
export function useSearchFirms(query: string | null, page: number = 1, pageSize: number = 50) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(query && { q: query }),
  });

  // Always use public endpoint for all app requests
  const endpoint = '/api/public/firms';

  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    PaginatedApiResponse<Firm[]>,
    Error
  >(query ? `${endpoint}/search?${queryParams.toString()}` : null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 10000, // Cache search results for 10 seconds
    refreshInterval: 0, // Don't auto-refresh
  });

  return {
    searchResults: data?.data,
    pagination: data?.meta,
    isLoadingSearch: isLoading,
    isSearchError: error,
    isValidatingSearch: isValidating,
    mutateSearch: mutate,
  };
}

/**
 * Hook to fetch certifications for a specific firm
 */
export function useCertificationsByFirm(
  firmId: number | null,
  page: number = 1,
  pageSize: number = 50,
) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    PaginatedApiResponse<CertificationByFirm[]>,
    Error
  >(firmId ? `/api/public/certifications/firms/${firmId}?${queryParams.toString()}` : null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // Cache for 30 seconds
    refreshInterval: 0, // Don't auto-refresh
  });

  return {
    certifications: data?.data,
    pagination: data?.meta,
    isLoadingCertifications: isLoading,
    isCertificationsError: error,
    isValidatingCertifications: isValidating,
    mutateCertifications: mutate,
    // Function to fetch all certifications for the firm across all pages
    fetchAllCertificationsByFirm: firmId ? () => fetchAllCertificationsByFirm(firmId) : undefined,
  };
}

/**
 * Convenience hook for public pages to fetch firms data
 */
export function usePublicFirms(
  includeCount: boolean = false,
  page: number = 1,
  pageSize: number = 50,
) {
  return useFirms(includeCount, page, pageSize);
}

/**
 * Convenience hook for authenticated pages to fetch firms data
 */
export function useAuthenticatedFirms(
  includeCount: boolean = false,
  page: number = 1,
  pageSize: number = 50,
) {
  return useFirms(includeCount, page, pageSize);
}

/**
 * Convenience hook for public pages to fetch a specific firm
 */
export function usePublicFirm(firmId: number | null, includeCertifications: boolean = false) {
  return useFirm(firmId, includeCertifications);
}

/**
 * Convenience hook for authenticated pages to fetch a specific firm
 */
export function useAuthenticatedFirm(
  firmId: number | null,
  includeCertifications: boolean = false,
) {
  return useFirm(firmId, includeCertifications);
}

/**
 * Convenience hook for public pages to search firms
 */
export function usePublicSearchFirms(
  query: string | null,
  page: number = 1,
  pageSize: number = 50,
) {
  return useSearchFirms(query, page, pageSize);
}

/**
 * Convenience hook for authenticated pages to search firms
 */
export function useAuthenticatedSearchFirms(
  query: string | null,
  page: number = 1,
  pageSize: number = 50,
) {
  return useSearchFirms(query, page, pageSize);
}
