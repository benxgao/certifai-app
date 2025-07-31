/**
 * Utility functions for handling paginated API responses
 * Recursively fetches all pages to get complete datasets
 */

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    currentPage?: number;
    pageSize?: number;
    totalItems?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    total?: number; // Alternative total field name
  };
}

/**
 * Recursively fetch all pages from a paginated API endpoint
 * @param baseUrl - The base API endpoint URL (without query parameters)
 * @param options - Additional fetch options
 * @param pageSize - Items per page (default: 100)
 * @param maxPages - Maximum pages to fetch as a safety limit (default: 100)
 * @returns Promise resolving to all data from all pages
 */
export async function fetchAllPages<T>(
  baseUrl: string,
  options: RequestInit = {},
  pageSize: number = 100,
  maxPages: number = 100,
): Promise<T[]> {
  let page = 1;
  let allData: T[] = [];
  let hasMore = true;

  while (hasMore && page <= maxPages) {
    const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${page}&pageSize=${pageSize}`;

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        break;
      }

      const result: PaginatedResponse<T> = await response.json();

      if (!result.data || !Array.isArray(result.data)) {
        break;
      }

      allData = allData.concat(result.data);

      // Determine if there are more pages based on available metadata
      if (result.meta) {
        const { totalItems, total, hasNextPage, totalPages } = result.meta;
        const totalCount = totalItems || total;

        if (hasNextPage !== undefined) {
          hasMore = hasNextPage;
        } else if (totalCount !== undefined) {
          hasMore = allData.length < totalCount;
        } else if (totalPages !== undefined) {
          hasMore = page < totalPages;
        } else {
          // Fallback: if we got a full page, assume there might be more
          hasMore = result.data.length === pageSize;
        }
      } else {
        // No meta information, use data length as indicator
        hasMore = result.data.length === pageSize;
      }

      page++;

      // Add a small delay to be respectful to the API
      if (hasMore) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    } catch (error) {
      break;
    }
  }

  if (page > maxPages) {
  }

  return allData;
}

/**
 * Fetch all firms recursively
 * @param includeCount - Whether to include certification counts
 * @param options - Additional fetch options
 * @returns Promise resolving to all firms
 */
export async function fetchAllFirms(
  includeCount: boolean = false,
  options: RequestInit = {},
): Promise<any[]> {
  const baseUrl = includeCount ? '/api/public/firms?includeCount=true' : '/api/public/firms';

  return fetchAllPages(baseUrl, options, 50); // Use smaller page size for firms
}

/**
 * Fetch all certifications recursively
 * @param options - Additional fetch options
 * @returns Promise resolving to all certifications
 */
export async function fetchAllCertifications(options: RequestInit = {}): Promise<any[]> {
  return fetchAllPages('/api/public/certifications', options, 100);
}

/**
 * Fetch all certifications for a specific firm recursively
 * @param firmId - The firm ID
 * @param options - Additional fetch options
 * @returns Promise resolving to all certifications for the firm
 */
export async function fetchAllCertificationsByFirm(
  firmId: number,
  options: RequestInit = {},
): Promise<any[]> {
  return fetchAllPages(`/api/public/firms/${firmId}/certifications`, options, 50);
}
