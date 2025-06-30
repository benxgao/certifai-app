import useSWR from 'swr';
import { fetchAllFirms, fetchAllCertifications } from '../lib/pagination-utils';

interface FirmWithCertifications {
  id: number;
  code: string;
  name: string;
  description: string;
  website_url: string;
  logo_url: string;
  certification_count: number;
  certifications: any[];
}

/**
 * Custom hook to fetch all firms with their certifications
 * This hook will recursively fetch all pages to ensure complete data
 */
export function useAllFirmsWithCertifications() {
  const { data, error, isLoading, mutate } = useSWR(
    'all-firms-with-certifications',
    async () => {
      // Fetch all firms and certifications in parallel
      const [allFirms, allCertifications] = await Promise.all([
        fetchAllFirms(true), // Include certification counts
        fetchAllCertifications(),
      ]);

      if (!allFirms || !allCertifications) {
        throw new Error('Failed to fetch complete data');
      }

      // Group certifications by firm
      const firmsWithCerts: FirmWithCertifications[] = allFirms.map((firm: any) => ({
        id: firm.firm_id,
        code: firm.code,
        name: firm.name,
        description: firm.description || '',
        website_url: firm.website_url || '',
        logo_url: firm.logo_url || '',
        certification_count: firm._count?.certifications || 0,
        certifications: allCertifications.filter(
          (cert: any) => (cert.firm?.firm_id || cert.firm_id) === firm.firm_id,
        ),
      }));

      return firmsWithCerts;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // Cache for 5 minutes since this is expensive
      refreshInterval: 0, // Don't auto-refresh
    },
  );

  return {
    firms: data,
    isLoading,
    error,
    mutate,
    totalCertifications: data?.reduce((sum, firm) => sum + firm.certification_count, 0) || 0,
  };
}

/**
 * Custom hook to fetch all certifications across all pages
 * This is a convenience hook that wraps the utility function
 */
export function useAllCertifications() {
  const { data, error, isLoading, mutate } = useSWR(
    'all-certifications',
    () => fetchAllCertifications(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // Cache for 5 minutes
      refreshInterval: 0, // Don't auto-refresh
    },
  );

  return {
    certifications: data,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Custom hook to fetch all firms across all pages
 * This is a convenience hook that wraps the utility function
 */
export function useAllFirms(includeCount: boolean = false) {
  const { data, error, isLoading, mutate } = useSWR(
    `all-firms-${includeCount ? 'with-count' : 'basic'}`,
    () => fetchAllFirms(includeCount),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // Cache for 5 minutes
      refreshInterval: 0, // Don't auto-refresh
    },
  );

  return {
    firms: data,
    isLoading,
    error,
    mutate,
  };
}
