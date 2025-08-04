/**
 * Stripe configuration for Certifai frontend
 * Stripe API version: 2025-07-30.basil
 */

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required');
}

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  apiVersion: '2025-07-30.basil' as const,
} as const;

// Stripe redirect URLs
const BASE_URL =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const STRIPE_URLS = {
  success: `${BASE_URL}/main/stripe/callback?session_id={CHECKOUT_SESSION_ID}`,
  cancel: `${BASE_URL}/main/billing`,
  return: `${BASE_URL}/main/billing`,
} as const;

// Common Stripe options
export const STRIPE_OPTIONS = {
  locale: 'en' as const,
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#6366f1', // primary color from Tailwind
      colorBackground: '#ffffff',
      colorText: '#1e293b',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  },
} as const;
