/**
 * Server-side utilities for Stripe integration
 * Backend API helpers and server components
 */

import { cookies } from 'next/headers';

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
 * Get Firebase auth token from cookies (server-side)
 */
export async function getAuthTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('__session');
    return authCookie?.value || null;
  } catch (error) {
    console.error('Failed to get auth token from cookies:', error);
    return null;
  }
}

/**
 * Server-side fetch with authentication
 */
export async function serverFetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getAuthTokenFromCookies();
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
 * Server-side subscription status check
 */
export async function getServerSubscriptionStatus() {
  try {
    const response = await serverFetchWithAuth('/stripe/subscription/status');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get subscription status on server:', error);
    return null;
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
