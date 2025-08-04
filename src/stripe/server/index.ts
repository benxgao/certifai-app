/**
 * Server-side utilities for Stripe integration
 * Backend API helpers and server components
 */

import { getFirebaseTokenFromCookie } from '@/src/lib/service-only';

/**
 * Get the API base URL for server-side requests
 */
export function getApiBaseUrl(): string {
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

  return fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
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
 */
export async function getServerPricingPlans() {
  try {
    const baseUrl = getApiBaseUrl();
    // Pricing plans are public, no auth needed
    const response = await fetch(`${baseUrl}/stripe/pricing-plans`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get pricing plans on server:', error);
    return null;
  }
}

/**
 * Validate Stripe webhook signature (if needed for custom webhooks)
 */
export function validateStripeWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  // Implementation would depend on Stripe webhook validation
  // This is a placeholder for webhook signature validation
  return true;
}

/**
 * Server-side environment check
 */
export function isStripeConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && process.env.STRIPE_SECRET_KEY);
}

/**
 * Get Stripe configuration for server-side usage
 */
export function getStripeServerConfig() {
  return {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    isConfigured: isStripeConfigured(),
  };
}
