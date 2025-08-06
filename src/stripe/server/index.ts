/**
 * Server-side utilities for Stripe integration
 * Essential server functions for API routes
 */

import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

/**
 * Get the API base URL for server-side requests
 */
function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SERVER_API_URL ||
    'http://127.0.0.1:5001/certifai-uat/us-central1/endpoints'
  );
}

/**
 * Server-side fetch with authentication and proper error handling
 */
export async function serverFetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getFirebaseTokenFromCookie();
  const baseUrl = getApiBaseUrl();

  if (!token) {
    throw new Error('No authentication token available');
  }

  // Validate endpoint format
  if (!endpoint.startsWith('/')) {
    throw new Error('Endpoint must start with /');
  }

  const fullUrl = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 30 seconds');
      }
      throw new Error(`Network error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Helper function for API routes to handle authenticated requests
 */
export async function handleAuthenticatedRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<
  { success: true; response: Response } | { success: false; status: number; error: string }
> {
  try {
    const token = await getFirebaseTokenFromCookie();

    if (!token) {
      return {
        success: false,
        status: 401,
        error: 'Authentication required',
      };
    }

    const response = await serverFetchWithAuth(endpoint, options);
    return { success: true, response };
  } catch (error) {
    console.error('Authenticated request error:', error);

    if (error instanceof Error && error.message.includes('authentication')) {
      return {
        success: false,
        status: 401,
        error: 'Authentication required',
      };
    }

    return {
      success: false,
      status: 500,
      error: 'Internal server error',
    };
  }
}

/**
 * Server-side subscription status check
 */
export async function getServerSubscriptionStatus() {
  try {
    // Check if we have an auth token first
    const token = await getFirebaseTokenFromCookie();

    if (!token) {
      // Return a standardized "no subscription" response when not authenticated
      return {
        success: true,
        data: null,
        message: 'No authentication token available',
      };
    }

    const response = await serverFetchWithAuth('/stripe/subscription/status');

    if (!response.ok) {
      // If it's a 401/403, treat as no subscription rather than error
      if (response.status === 401 || response.status === 403) {
        return {
          success: true,
          data: null,
          message: 'No active subscription found',
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get subscription status on server:', error);
    // Return a standardized response instead of null to maintain consistency
    return {
      success: true,
      data: null,
      message: 'No subscription found',
    };
  }
}

/**
 * Server-side pricing plans fetch
 * Used by API routes to get pricing plans from backend
 */
export async function getServerPricingPlans() {
  try {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/stripe/pricing-plans`;

    // Pricing plans are public, no auth needed
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout for pricing plans too
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from pricing plans API');
    }

    return data;
  } catch (error) {
    console.error('Failed to get pricing plans on server:', error);

    // Return a structured error response instead of null
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch pricing plans',
      data: [],
    };
  }
}
