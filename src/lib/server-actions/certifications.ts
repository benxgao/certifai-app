import 'server-only';
import { generatePublicJWTToken, makePublicAPIRequest } from '@/src/lib/jwt-utils';

interface Certification {
  cert_id: number;
  name: string;
  description: string;
  min_quiz_counts: number;
  max_quiz_counts: number;
  pass_score: number;
  created_at: string;
  firm_id: number;
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
      return {
        firms: getMockFirmsData(),
        error: undefined,
      };
    }

    // Try to fetch from public API using JWT authentication for server-to-server communication
    try {
      const token = await generatePublicJWTToken();

      if (token) {
        const [firmsResponse, certsResponse] = await Promise.all([
          makePublicAPIRequest('/firms?pageSize=50', token, {
            cache: 'force-cache',
            next: { revalidate: 3600 },
          }),
          makePublicAPIRequest('/certifications?pageSize=100', token, {
            cache: 'force-cache',
            next: { revalidate: 3600 },
          }),
        ]);

        if (firmsResponse.ok && certsResponse.ok) {
          const firmsResult = await firmsResponse.json();
          const certsResult = await certsResponse.json();

          // console.log('API firmsResult:', JSON.stringify(firmsResult, null, 2));
          // console.log('API certsResult:', JSON.stringify(certsResult, null, 2));

          if (firmsResult.data && certsResult.data) {
            // Group certifications by firm
            const firmsWithCerts: FirmWithCertifications[] = firmsResult.data.map((firm: Firm) => {
              const firmCerts = certsResult.data.filter(
                (cert: Certification) => cert.firm_id === firm.firm_id,
              );
              // console.log(
              //   `Firm ${firm.name} (ID: ${firm.firm_id}) has ${firmCerts.length} certifications`,
              // );

              return {
                id: firm.firm_id,
                code: firm.code,
                name: firm.name,
                description: firm.description,
                website_url: firm.website_url,
                logo_url: firm.logo_url,
                certification_count: firm._count?.certifications || 0,
                certifications: firmCerts,
              };
            });

            // console.info(
            //   `Successfully loaded ${firmsWithCerts.length} firms with certifications from public API`,
            // );
            return { firms: firmsWithCerts };
          } else {
            console.warn('Public API returned incomplete data, using fallback data');
          }
        } else {
          console.warn('Public API responses failed, using fallback data');
        }
      } else {
        console.warn('Could not generate JWT token for firms data');
      }
    } catch (apiError) {
      console.warn('Public API call failed, falling back to mock data:', apiError);
    }

    // If API calls fail, use mock data
    console.info('API calls failed, using mock data for certifications');
    return {
      firms: getMockFirmsData(),
      error: undefined,
    };
  } catch (error) {
    console.error('Error fetching certifications data:', error);
    return {
      firms: getMockFirmsData(),
      error: undefined,
    };
  }
}

/**
 * Fetch individual certification data server-side with authentication
 * This allows public pages to display certification details without client-side auth
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
          if (result.data) {
            console.info(`Successfully loaded certification ${certificationId} from public API`);
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
      certification_count: 12,
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
      certification_count: 15,
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
      certification_count: 8,
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
      certification_count: 10,
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
