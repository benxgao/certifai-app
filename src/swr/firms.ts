import { useAuthSWR } from './useAuthSWR';
import { PaginatedApiResponse, ApiResponse } from '../types/api';

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
 */
export function useFirms(includeCount: boolean = false, page: number = 1, pageSize: number = 50) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(includeCount && { includeCount: 'true' }),
  });

  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    PaginatedApiResponse<Firm[]>,
    Error
  >(`/api/firms?${queryParams.toString()}`, {
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
  };
}

/**
 * Hook to fetch a specific firm by ID with optional certifications
 */
export function useFirm(firmId: number | null, includeCertifications: boolean = false) {
  const queryParams = includeCertifications 
    ? `?includeCertifications=true` 
    : '';

  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    ApiResponse<Firm>,
    Error
  >(
    firmId ? `/api/firms/${firmId}${queryParams}` : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // Cache for 30 seconds
      refreshInterval: 0, // Don't auto-refresh
    }
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
 */
export function useSearchFirms(query: string | null, page: number = 1, pageSize: number = 50) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(query && { q: query }),
  });

  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    PaginatedApiResponse<Firm[]>,
    Error
  >(
    query ? `/api/firms/search?${queryParams.toString()}` : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // Cache search results for 10 seconds
      refreshInterval: 0, // Don't auto-refresh
    }
  );

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
export function useCertificationsByFirm(firmId: number | null, page: number = 1, pageSize: number = 50) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const { data, error, isLoading, isValidating, mutate } = useAuthSWR<
    PaginatedApiResponse<CertificationByFirm[]>,
    Error
  >(
    firmId ? `/api/certifications/firms/${firmId}?${queryParams.toString()}` : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // Cache for 30 seconds
      refreshInterval: 0, // Don't auto-refresh
    }
  );

  return {
    certifications: data?.data,
    pagination: data?.meta,
    isLoadingCertifications: isLoading,
    isCertificationsError: error,
    isValidatingCertifications: isValidating,
    mutateCertifications: mutate,
  };
}
