/**
 * Environment Detection Utilities
 *
 * These functions provide reliable environment detection based on the
 * NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable.
 *
 * Usage:
 * - Production: "certifai-prod" → isProdEnv() returns true
 * - UAT: "certifai-uat" → isUATEnv() returns true
 * - Development: "certifai-dev" or other → isDevEnv() returns true
 */

/**
 * Check if running in production environment
 * @returns true if NEXT_PUBLIC_FIREBASE_PROJECT_ID contains "prod"
 */
export function isProdEnv(): boolean {
  if (typeof process === 'undefined') return false;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
  return projectId.toLowerCase().includes('prod');
}

/**
 * Check if running in UAT environment
 * @returns true if NEXT_PUBLIC_FIREBASE_PROJECT_ID contains "uat"
 */
export function isUATEnv(): boolean {
  if (typeof process === 'undefined') return false;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
  return projectId.toLowerCase().includes('uat');
}

/**
 * Check if running in development environment
 * @returns true if NEXT_PUBLIC_FIREBASE_PROJECT_ID contains "dev" or doesn't contain "prod"/"uat"
 */
export function isDevEnv(): boolean {
  if (typeof process === 'undefined') return false;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
  const projectIdLower = projectId.toLowerCase();

  // Return true if explicitly marked as dev, or if not prod/uat (default safe assumption)
  return (
    projectIdLower.includes('dev') ||
    (!projectIdLower.includes('prod') && !projectIdLower.includes('uat'))
  );
}
