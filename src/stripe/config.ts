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
const BASE_URL = process.env.NEXT_PUBLIC_HOST_URL;

export const STRIPE_URLS = {
  success: `https://uat--certifai-uat.us-central1.hosted.app/main/stripe/callback`,
  cancel: `https://uat--certifai-uat.us-central1.hosted.app/main/billing`,
  return: `https://uat--certifai-uat.us-central1.hosted.app/main/billing`,
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
