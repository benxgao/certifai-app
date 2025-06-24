import 'server-only';

const SERVER_API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

interface JWTTokenResponse {
  success: boolean;
  data?: {
    token: string;
    type: string;
    expiresIn: string;
    scope: string;
  };
  error?: string;
  message?: string;
}

/**
 * Generate a JWT token for public API access
 * This is used for server-side operations like fetching public certification data
 *
 * Requires:
 * - NEXT_PUBLIC_SERVER_API_URL: API base URL
 * - SERVICE_SECRET: Secret key that matches the API's SERVICE_SECRET environment variable
 */
export async function generatePublicJWTToken(): Promise<string | null> {
  try {
    if (!SERVER_API_URL) {
      console.warn('SERVER_API_URL environment variable is not set, using fallback data');
      return null;
    }

    const serviceSecret = process.env.SERVICE_SECRET;
    if (!serviceSecret) {
      console.warn('SERVICE_SECRET environment variable is not set, using fallback data');
      return null;
    }

    const generateTokenUrl = `${SERVER_API_URL}/api/auth/generate-service-token`;

    const response = await fetch(generateTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-secret': serviceSecret,
      },
      body: JSON.stringify({
        clientId: 'marketing-service',
        scope: 'public:read',
        expiresIn: '24h',
      }),
    });

    if (!response.ok) {
      // Check if it's a 404 (endpoint doesn't exist) vs other errors
      if (response.status === 404) {
        console.info(
          'JWT token generation endpoint not available on API server, using fallback data',
        );
      } else {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.warn(`Backend API returned ${response.status}, using fallback data:`, errorText);
      }
      return null;
    }

    const result: JWTTokenResponse = await response.json();

    if (!result.success || !result.data?.token) {
      console.warn(
        'JWT token generation failed, using fallback data:',
        result.error || result.message,
      );
      return null;
    }

    return result.data.token;
  } catch {
    console.info('Backend API connection failed, using fallback data');
    return null;
  }
}

/**
 * Make authenticated request to public API with JWT token
 */
export async function makePublicAPIRequest(
  endpoint: string,
  token: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = `${SERVER_API_URL}/api/public${endpoint}`;

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}
