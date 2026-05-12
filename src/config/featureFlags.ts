/**
 * Feature flags configuration
 * This file contains flags to control the visibility of various features
 */

type DemoCredentialsSource = 'hardcoded' | 'api';

export const FeatureFlags = {
  STRIPE_INTEGRATION: false,
  DEMO_CREDENTIALS_CONSENT_ENABLED: true,
  DEMO_CREDENTIALS_SOURCE: 'hardcoded' as DemoCredentialsSource,
} as const;

// Type for feature flags
export type FeatureFlagKey = keyof typeof FeatureFlags;
export type BooleanFeatureFlagKey = {
  [K in FeatureFlagKey]: (typeof FeatureFlags)[K] extends boolean ? K : never;
}[FeatureFlagKey];

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(flag: BooleanFeatureFlagKey): boolean {
  return FeatureFlags[flag];
}

/**
 * Get all feature flags
 */
export function getAllFeatureFlags(): typeof FeatureFlags {
  return FeatureFlags;
}
