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
      console.error('SERVER_API_URL environment variable is not set');
      return null;
    }

    const serviceSecret = process.env.SERVICE_SECRET;
    if (!serviceSecret) {
      console.error('SERVICE_SECRET environment variable is not set');
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
      console.error('Failed to generate JWT token:', response.status, response.statusText);
      return null;
    }

    const result: JWTTokenResponse = await response.json();

    if (!result.success || !result.data?.token) {
      console.error('JWT token generation failed:', result.error || result.message);
      return null;
    }

    return result.data.token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
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
