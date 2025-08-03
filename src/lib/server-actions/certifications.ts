import 'server-only';
import { generatePublicJWTToken, makePublicAPIRequest } from '@/src/lib/jwt-utils';
import { createSlug } from '@/src/utils/slug';

interface Certification {
  cert_id: number;
  name: string;
  slug?: string;
  description?: string;
  exam_guide_url?: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
  created_at?: string;
  firm_id?: number; // For backward compatibility with mock data
  firm?: {
    firm_id: number;
    name: string;
    code: string;
    logo_url: string | null;
  };
}

interface Firm {
  firm_id: number;
  code: string;
  name: string;
  description: string;
  website_url: string | null;
  logo_url: string | null;
  _count?: {
    certifications: number;
  };
}

export interface FirmWithCertifications {
  id: number;
  code: string;
  name: string;
  description: string;
  website_url: string | null;
  logo_url: string | null;
  certification_count: number;
  certifications: Certification[];
}

/**
 * Fetch all firms with their certifications
 *
 * Used by:
 * - Main catalog: /app/certifications/page.tsx (main certifications overview)
 * - Main catalog: /app/certifications/[firmCode]/page.tsx (firm-specific certifications)
 * - SEO: /app/sitemap.ts (for generating sitemap)
 */
export async function fetchCertificationsData(): Promise<{
  firms: FirmWithCertifications[];
  error?: string;
}> {
  try {
    // For now, try to use the internal API endpoints directly without external JWT auth
    // This is a temporary solution until public endpoints are properly configured

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    if (!baseUrl) {
      console.info('SERVER_API_URL not configured, using mock data');
      const mockFirms = getMockFirmsData();
      const validatedMockFirms = validateAndCleanFirmsData(mockFirms);
      return {
        firms: validatedMockFirms,
        error: undefined,
      };
    }

    // Helper to recursively fetch all paginated data
    async function fetchAllPages(endpoint: string, token: string, pageSize: number) {
      let page = 1;
      let allData: any[] = [];
      let hasMore = true;
      while (hasMore) {
        /**
         *  GET /api/public/firms?includeCount=true&page=1&pageSize=50
            GET /api/public/certifications?page=1&pageSize=100
         */
        const url = `${endpoint}${
          endpoint.includes('?') ? '&' : '?'
        }page=${page}&pageSize=${pageSize}`;
        const response = await makePublicAPIRequest(url, token, {
          cache: 'force-cache',
          next: { revalidate: 3600 },
        });
        if (!response.ok) break;
        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          allData = allData.concat(result.data);
          // If API provides pagination info, use it; else, infer from data length
          if (result.nextPage) {
            page = result.nextPage;
          } else if (result.total && result.data.length > 0) {
            hasMore = allData.length < result.total;
            page++;
          } else if (result.data.length === pageSize) {
            page++;
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }
      return allData;
    }

    try {
      const token = await generatePublicJWTToken();
      if (token) {
        // Recursively fetch all firms and certifications
        // Use includeCount=true for consistency with client-side calls
        const [allFirms, allCerts] = await Promise.all([
          fetchAllPages('/firms?includeCount=true', token, 50),
          fetchAllPages('/certifications', token, 100),
        ]);

        if (allFirms.length && allCerts.length) {
          const firmsWithCerts: FirmWithCertifications[] = allFirms.map((firm: Firm) => {
            const firmCerts = allCerts.filter((cert: Certification) => {
              const certFirmId = cert.firm?.firm_id || cert.firm_id;
              return certFirmId === firm.firm_id;
            });
            const actualCertCount = firmCerts.length;
            return {
              id: firm.firm_id,
              code: firm.code,
              name: firm.name,
              description: firm.description,
              website_url: firm.website_url,
              logo_url: firm.logo_url,
              certification_count: actualCertCount,
              certifications: firmCerts.map((cert: Certification) => ({
                cert_id: cert.cert_id,
                name: cert.name,
                description: cert.description || cert.exam_guide_url || '',
                min_quiz_counts: cert.min_quiz_counts,
                max_quiz_counts: cert.max_quiz_counts,
                pass_score: cert.pass_score,
                created_at: cert.created_at || new Date().toISOString(),
                firm_id: cert.firm?.firm_id || cert.firm_id || firm.firm_id,
              })),
            };
          });
          // Do not filter out firms with no certifications, so all firms are listed
          const validatedFirms = validateAndCleanFirmsData(firmsWithCerts);
          return { firms: validatedFirms };
        } else {
          console.warn('Public API returned incomplete data, using fallback data');
        }
      } else {
        console.warn('Could not generate JWT token for firms data');
      }
    } catch (apiError) {
      console.warn('Public API call failed, falling back to mock data:', apiError);
    }

    // If API calls fail, use mock data
    console.info('API calls failed, using mock data for certifications');
    const mockFirms = getMockFirmsData();

    // Validate and ensure consistency
    const validatedMockFirms = validateAndCleanFirmsData(mockFirms);

    // Ensure mock data has proper structure
    console.info(
      `Loaded ${validatedMockFirms.length} mock firms with ${validatedMockFirms.reduce(
        (sum, f) => sum + f.certifications.length,
        0,
      )} total certifications`,
    );

    return {
      firms: validatedMockFirms,
      error: undefined,
    };
  } catch (error) {
    console.error('Error fetching certifications data:', error);
    const mockFirms = getMockFirmsData();
    const validatedMockFirms = validateAndCleanFirmsData(mockFirms);
    console.info(`Falling back to ${validatedMockFirms.length} mock firms due to error`);

    return {
      firms: validatedMockFirms,
      error: undefined,
    };
  }
}

/**
 * Fetch individual certification data server-side with authentication
 * This allows public pages to display certification details without client-side auth
 *
 * Used by:
 * - Marketing pages: /app/certifications/[firmCode]/[slug]/training/page.tsx (certification training/landing page)
 * - Main catalog: /app/certifications/[firmCode]/[slug]/page.tsx (certification detail page)
 * - Main catalog: /app/certifications/cert/[certId]/page.tsx (alternative certification detail route)
 * - Testing: /app/test-certification/page.tsx (certification testing functionality)
 */
export async function fetchCertificationData(certificationId: string): Promise<{
  certification: Certification | null;
  error?: string;
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    if (!baseUrl) {
      console.info('SERVER_API_URL not configured, using mock data');
      return {
        certification: getMockCertificationData(certificationId),
        error: undefined,
      };
    }

    // Try to fetch from public API using JWT authentication for server-to-server communication
    try {
      const token = await generatePublicJWTToken();

      if (token) {
        const response = await makePublicAPIRequest(`/certifications/${certificationId}`, token, {
          cache: 'force-cache',
          next: { revalidate: 3600 },
        });

        if (response.ok) {
          const result = await response.json();

          if (result.success && result.data) {
            // Transform API response to match expected format
            const apiData = result.data;
            const transformedCertification: Certification = {
              cert_id: apiData.cert_id,
              name: apiData.name,
              slug: apiData.slug,
              description: apiData.description,
              min_quiz_counts: apiData.min_quiz_counts,
              max_quiz_counts: apiData.max_quiz_counts,
              pass_score: apiData.pass_score,
              created_at: apiData.created_at,
              firm_id: apiData.firm?.id || 0,
              firm: apiData.firm
                ? {
                    firm_id: apiData.firm.id,
                    name: apiData.firm.name,
                    code: apiData.firm.code,
                    logo_url: apiData.firm.logo_url,
                  }
                : undefined,
            };
            return { certification: transformedCertification };
          } else if (result.data) {
            // Handle old API format for backward compatibility
            return { certification: result.data };
          }
        } else {
          console.warn(
            `Public API call failed for certification ${certificationId}:`,
            response.status,
          );
        }
      } else {
        console.warn(`Could not generate JWT token for certification ${certificationId}`);
      }
    } catch (apiError) {
      console.warn(
        `Public API call failed for certification ${certificationId}, falling back to mock data:`,
        apiError,
      );
    }

    // If API calls fail, use mock data
    console.info(`Using mock data for certification ${certificationId}`);
    return {
      certification: getMockCertificationData(certificationId),
      error: undefined,
    };
  } catch (error) {
    console.error(`Error fetching certification ${certificationId}:`, error);
    return {
      certification: getMockCertificationData(certificationId),
      error: undefined, // Use fallback data instead of showing error
    };
  }
}

/**
 * Fetch certification data by slug for SEO-friendly URLs
 *
 * Used by:
 * - SEO-friendly marketing pages: /app/certifications/[firmCode]/[slug]/page.tsx
 */
export async function fetchCertificationDataBySlug(slug: string): Promise<{
  certification: Certification | null;
  error?: string;
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    if (!baseUrl) {
      console.info('SERVER_API_URL not configured, using mock data');
      return {
        certification: getMockCertificationDataBySlug(slug),
        error: undefined,
      };
    }

    // Try to fetch from public API using JWT authentication for server-to-server communication
    try {
      const token = await generatePublicJWTToken();

      if (token) {
        const response = await makePublicAPIRequest(`/certifications/slug/${slug}`, token, {
          cache: 'force-cache',
          next: { revalidate: 3600 },
        });

        if (response.ok) {
          const result = await response.json();

          if (result.success && result.data) {
            // Transform API response to match expected format
            const apiData = result.data;
            const transformedCertification: Certification = {
              cert_id: apiData.cert_id,
              name: apiData.name,
              slug: apiData.slug,
              description: apiData.description,
              min_quiz_counts: apiData.min_quiz_counts,
              max_quiz_counts: apiData.max_quiz_counts,
              pass_score: apiData.pass_score,
              created_at: apiData.created_at,
              firm_id: apiData.firm?.id || 0,
              firm: apiData.firm
                ? {
                    firm_id: apiData.firm.id,
                    name: apiData.firm.name,
                    code: apiData.firm.code,
                    logo_url: apiData.firm.logo_url,
                  }
                : undefined,
            };

            return {
              certification: transformedCertification,
              error: undefined,
            };
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch from API:', error);
    }

    // Fallback to mock data if API fails
    return {
      certification: getMockCertificationDataBySlug(slug),
      error: undefined,
    };
  } catch (error) {
    console.error('Error in fetchCertificationDataBySlug:', error);
    return {
      certification: null,
      error: `Failed to fetch certification: ${error}`,
    };
  }
}

/**
 * Fetch certifications for a specific firm by firm ID
 *
 * Currently unused - no direct usages found in the codebase.
 * Available for future use when needed to fetch firm-specific certifications.
 */
export async function fetchCertificationsByFirmId(firmId: string | number): Promise<{
  certifications: Certification[];
  error?: string;
}> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

    if (!baseUrl) {
      console.info('SERVER_API_URL not configured, using mock data');
      const mockFirms = getMockFirmsData();
      const firm = mockFirms.find((f) => f.id === Number(firmId));
      return {
        certifications: firm ? firm.certifications : [],
        error: undefined,
      };
    }

    // Try to fetch from public API using JWT authentication
    try {
      const token = await generatePublicJWTToken();

      if (token) {
        const response = await makePublicAPIRequest(`/firms/${firmId}/certifications`, token, {
          cache: 'force-cache',
          next: { revalidate: 3600 },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            console.info(
              `Successfully loaded ${result.data.length} certifications for firm ${firmId}`,
            );
            return { certifications: result.data };
          }
        } else {
          console.warn(
            `Public API call failed for firm ${firmId} certifications:`,
            response.status,
          );
        }
      } else {
        console.warn(`Could not generate JWT token for firm ${firmId} certifications`);
      }
    } catch (apiError) {
      console.warn(
        `Public API call failed for firm ${firmId} certifications, falling back to mock data:`,
        apiError,
      );
    }

    // If API calls fail, use mock data
    console.info(`Using mock data for firm ${firmId} certifications`);
    const mockFirms = getMockFirmsData();
    const firm = mockFirms.find((f) => f.id === Number(firmId));
    return {
      certifications: firm ? firm.certifications : [],
      error: undefined,
    };
  } catch (error) {
    console.error(`Error fetching certifications for firm ${firmId}:`, error);
    return {
      certifications: [],
      error: undefined, // Use fallback data instead of showing error
    };
  }
}

/**
 * Get mock certification data for fallback when API is not accessible
 */
function getMockCertificationData(certificationId: string): Certification | null {
  const mockCertifications: Record<string, Certification> = {
    '1': {
      cert_id: 1,
      name: 'AWS Certified Solutions Architect - Associate',
      description:
        'Validates technical skills and experience designing distributed applications and systems on the AWS platform.',
      min_quiz_counts: 65,
      max_quiz_counts: 65,
      pass_score: 72,
      created_at: '2024-01-01T00:00:00.000Z',
      firm_id: 1,
    },
    '2': {
      cert_id: 2,
      name: 'AWS Certified Developer - Associate',
      description:
        'Validates technical expertise in developing, deploying, and debugging cloud-based applications using AWS.',
      min_quiz_counts: 65,
      max_quiz_counts: 65,
      pass_score: 72,
      created_at: '2024-01-01T00:00:00.000Z',
      firm_id: 1,
    },
    '3': {
      cert_id: 3,
      name: 'AWS Certified SysOps Administrator - Associate',
      description:
        'Validates technical expertise in deployment, management, and operations on the AWS platform.',
      min_quiz_counts: 65,
      max_quiz_counts: 65,
      pass_score: 72,
      created_at: '2024-01-01T00:00:00.000Z',
      firm_id: 1,
    },
    '4': {
      cert_id: 4,
      name: 'Microsoft Certified: Azure Fundamentals',
      description:
        'Validates foundational knowledge of cloud services and how those services are provided with Microsoft Azure.',
      min_quiz_counts: 40,
      max_quiz_counts: 60,
      pass_score: 70,
      created_at: '2024-01-01T00:00:00.000Z',
      firm_id: 2,
    },
    '5': {
      cert_id: 5,
      name: 'Microsoft Certified: Azure Administrator Associate',
      description:
        'Validates skills and knowledge to implement, manage, and monitor identity, governance, storage, compute, and virtual networks.',
      min_quiz_counts: 40,
      max_quiz_counts: 60,
      pass_score: 70,
      created_at: '2024-01-01T00:00:00.000Z',
      firm_id: 2,
    },
    '6': {
      cert_id: 6,
      name: 'Google Cloud Professional Cloud Architect',
      description:
        'Validates ability to design, develop, and manage robust, secure, scalable, highly available, and dynamic solutions.',
      min_quiz_counts: 50,
      max_quiz_counts: 60,
      pass_score: 80,
      created_at: '2024-01-01T00:00:00.000Z',
      firm_id: 3,
    },
    '7': {
      cert_id: 7,
      name: 'Google Cloud Professional Data Engineer',
      description:
        'Validates ability to design data processing systems, build and maintain data structures and databases.',
      min_quiz_counts: 50,
      max_quiz_counts: 60,
      pass_score: 80,
      created_at: '2024-01-01T00:00:00.000Z',
      firm_id: 3,
    },
  };

  return mockCertifications[certificationId] || null;
}

/**
 * Get mock certification data by slug for fallback when API is not accessible
 */
function getMockCertificationDataBySlug(slug: string): Certification | null {
  // For now, use a simple mapping from common slugs to IDs
  // In a real implementation, this would include slug fields in the mock data
  const slugToIdMap: Record<string, string> = {
    'aws-certified-solutions-architect': '1',
    'aws-certified-developer-associate': '2',
    'aws-certified-sysops-administrator': '3',
    'microsoft-certified-azure-fundamentals': '4',
    'microsoft-certified-azure-administrator-associate': '5',
    'google-cloud-digital-leader': '6',
    'associate-cloud-engineer': '7',
    'ccna-cisco-certified-network-associate': '8',
  };

  const certId = slugToIdMap[slug];
  if (certId) {
    const cert = getMockCertificationData(certId);
    if (cert) {
      // Add the slug to the mock data
      return {
        ...cert,
        slug: slug,
      };
    }
  }

  return null;
}

// Mock data for fallback when API is not accessible
function getMockFirmsData(): FirmWithCertifications[] {
  return [
    {
      id: 1,
      code: 'AWS',
      name: 'Amazon Web Services',
      description:
        'Leading cloud computing platform offering scalable infrastructure and services.',
      website_url: 'https://aws.amazon.com',
      logo_url: '/logos/aws.png',
      certification_count: 3,
      certifications: [
        {
          cert_id: 1,
          name: 'AWS Certified Solutions Architect - Associate',
          description:
            'Validates technical skills and experience designing distributed applications and systems on the AWS platform.',
          min_quiz_counts: 65,
          max_quiz_counts: 65,
          pass_score: 72,
          created_at: '2024-01-01T00:00:00.000Z',
          firm_id: 1,
        },
        {
          cert_id: 2,
          name: 'AWS Certified Developer - Associate',
          description:
            'Validates technical expertise in developing, deploying, and debugging cloud-based applications using AWS.',
          min_quiz_counts: 65,
          max_quiz_counts: 65,
          pass_score: 72,
          created_at: '2024-01-01T00:00:00.000Z',
          firm_id: 1,
        },
        {
          cert_id: 3,
          name: 'AWS Certified SysOps Administrator - Associate',
          description:
            'Validates technical expertise in deployment, management, and operations on the AWS platform.',
          min_quiz_counts: 65,
          max_quiz_counts: 65,
          pass_score: 72,
          created_at: '2024-01-01T00:00:00.000Z',
          firm_id: 1,
        },
      ],
    },
    {
      id: 2,
      code: 'MICROSOFT',
      name: 'Microsoft',
      description:
        'Technology company focused on productivity software, cloud computing, and enterprise solutions.',
      website_url: 'https://www.microsoft.com',
      logo_url: '/logos/microsoft.png',
      certification_count: 2,
      certifications: [
        {
          cert_id: 4,
          name: 'Microsoft Certified: Azure Fundamentals',
          description:
            'Validates foundational knowledge of cloud services and how those services are provided with Microsoft Azure.',
          min_quiz_counts: 40,
          max_quiz_counts: 60,
          pass_score: 70,
          created_at: '2024-01-01T00:00:00.000Z',
          firm_id: 2,
        },
        {
          cert_id: 5,
          name: 'Microsoft Certified: Azure Administrator Associate',
          description:
            'Validates skills and knowledge to implement, manage, and monitor identity, governance, storage, compute, and virtual networks.',
          min_quiz_counts: 40,
          max_quiz_counts: 60,
          pass_score: 70,
          created_at: '2024-01-01T00:00:00.000Z',
          firm_id: 2,
        },
      ],
    },
    {
      id: 3,
      code: 'GOOGLE',
      name: 'Google Cloud',
      description:
        'Cloud computing services that run on the same infrastructure that Google uses internally.',
      website_url: 'https://cloud.google.com',
      logo_url: '/logos/google-cloud.png',
      certification_count: 2,
      certifications: [
        {
          cert_id: 6,
          name: 'Google Cloud Digital Leader',
          description:
            'Validates ability to articulate the capabilities of Google Cloud core products and services.',
          min_quiz_counts: 50,
          max_quiz_counts: 60,
          pass_score: 80,
          created_at: '2024-01-01T00:00:00.000Z',
          firm_id: 3,
        },
        {
          cert_id: 7,
          name: 'Associate Cloud Engineer',
          description:
            'Validates ability to deploy applications, monitor operations, and maintain cloud projects on Google Cloud.',
          min_quiz_counts: 50,
          max_quiz_counts: 60,
          pass_score: 80,
          created_at: '2024-01-01T00:00:00.000Z',
          firm_id: 3,
        },
      ],
    },
    {
      id: 4,
      code: 'CISCO',
      name: 'Cisco',
      description:
        'Multinational technology company that develops, manufactures and sells networking hardware and software.',
      website_url: 'https://www.cisco.com',
      logo_url: '/logos/cisco.png',
      certification_count: 1,
      certifications: [
        {
          cert_id: 8,
          name: 'CCNA (Cisco Certified Network Associate)',
          description:
            'Validates ability to install, configure, operate, and troubleshoot medium-size routed and switched networks.',
          min_quiz_counts: 100,
          max_quiz_counts: 120,
          pass_score: 75,
          created_at: '2024-01-01T00:00:00.000Z',
          firm_id: 4,
        },
      ],
    },
  ];
}

/**
 * Validate firm data structure
 */
function validateFirmData(firm: any): firm is FirmWithCertifications {
  return (
    firm &&
    typeof firm.id === 'number' &&
    typeof firm.code === 'string' &&
    typeof firm.name === 'string' &&
    typeof firm.description === 'string' &&
    typeof firm.certification_count === 'number' &&
    Array.isArray(firm.certifications)
  );
}

/**
 * Validate and clean firm data
 */
function validateAndCleanFirmsData(firms: any[]): FirmWithCertifications[] {
  console.log(`validateAndCleanFirmsData called with ${firms.length} firms`);

  const validFirms = firms.filter(validateFirmData);

  if (validFirms.length !== firms.length) {
    console.warn(`Filtered out ${firms.length - validFirms.length} invalid firm records`);
  }

  const result = validFirms.map((firm) => {
    const validCertifications = firm.certifications.filter(
      (cert: any) =>
        cert &&
        typeof cert.cert_id === 'number' &&
        typeof cert.name === 'string' &&
        (cert.description || cert.exam_guide_url),
    );

    console.log(
      `Firm ${firm.name}: ${firm.certifications.length} -> ${validCertifications.length} valid certs`,
    );

    // Do not overwrite certification_count, keep the original value
    return {
      ...firm,
      certifications: validCertifications,
    };
  });

  console.log(`validateAndCleanFirmsData returning ${result.length} firms`);
  return result;
}
