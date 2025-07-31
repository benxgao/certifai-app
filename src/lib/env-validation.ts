/**
 * Environment variable validation for security
 * Validates required environment variables and their formats
 */

interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const REQUIRED_ENV_VARS = [
  'JOSE_JWT_SECRET',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
] as const;

const REQUIRED_SERVER_ENV_VARS = ['GOOGLE_APPLICATION_CREDENTIALS'] as const;

/**
 * Validate environment variables for security compliance
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required client-side environment variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }

  // Check server-side environment variables (only on server)
  if (typeof window === 'undefined') {
    for (const envVar of REQUIRED_SERVER_ENV_VARS) {
      if (!process.env[envVar]) {
        errors.push(`Missing required server environment variable: ${envVar}`);
      }
    }
  }

  // Validate JWT secret strength
  const jwtSecret = process.env.JOSE_JWT_SECRET;
  if (jwtSecret) {
    if (jwtSecret.length < 32) {
      errors.push('JOSE_JWT_SECRET must be at least 32 characters long for security');
    }
    if (jwtSecret === 'your-secret-key-here' || jwtSecret === 'development') {
      errors.push(
        'JOSE_JWT_SECRET appears to be a default/weak value - use a strong random secret',
      );
    }
  }

  // Validate service secret
  const serviceSecret = process.env.SERVICE_SECRET;
  if (serviceSecret) {
    if (serviceSecret.length < 32) {
      warnings.push('SERVICE_SECRET should be at least 32 characters long for better security');
    }
  }

  // Check for development values in production
  if (process.env.NODE_ENV === 'production') {
    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (firebaseApiKey && firebaseApiKey.includes('localhost')) {
      errors.push('Firebase API configuration appears to be set to localhost in production');
    }

    const backendUrl = process.env.NEXT_PUBLIC_FIREBASE_BACKEND_URL;
    if (backendUrl && backendUrl.includes('localhost')) {
      warnings.push('Backend URL appears to be set to localhost in production');
    }
  }

  // Validate Firebase configuration format
  const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (firebaseProjectId && !/^[a-z0-9-]+$/.test(firebaseProjectId)) {
    warnings.push('Firebase Project ID contains unexpected characters');
  }

  const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  if (firebaseAuthDomain && !firebaseAuthDomain.endsWith('.firebaseapp.com')) {
    warnings.push('Firebase Auth Domain should end with .firebaseapp.com');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Log environment validation results
 */
export function logEnvironmentValidation(): void {
  const validation = validateEnvironmentVariables();

  if (!validation.isValid) {
  } else {
  }

  if (validation.warnings.length > 0) {
  }
}

/**
 * Runtime check for critical environment variables in development
 */
export function validateEnvironmentOnStartup(): void {
  if (process.env.NODE_ENV === 'development') {
    logEnvironmentValidation();
  }
}
