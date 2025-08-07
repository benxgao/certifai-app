/**
 * Feature flags configuration
 * This file contains flags to control the visibility of various features
 */

export const FeatureFlags = {
  // Subscription related flags
  SHOW_SUBSCRIPTION_FEATURES: true, // Show subscription features
  SHOW_PAYMENT_OPTIONS: true, // Show payment options

  // Stripe integration flags
  is_stripe_enabled: true, // Enable Stripe checkout in billing tab
} as const;

// Type for feature flags
export type FeatureFlagKey = keyof typeof FeatureFlags;

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  return FeatureFlags[flag];
}

/**
 * Get all feature flags
 */
export function getAllFeatureFlags(): typeof FeatureFlags {
  return FeatureFlags;
}
