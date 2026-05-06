/**
 * Centralized cookie options configuration
 * Ensures consistent cookie settings across all auth endpoints
 * Key: secure flag is enabled for both production and UAT environments
 */

import { COOKIE_AUTH_NAME } from '@/src/config/constants';
import { allowedOrigins } from '@/src/config/serverOnlyConfig';

/**
 * Get cookie options for setting auth cookies
 * secure: true for production and UAT (both HTTPS environments)
 * domain: undefined for both UAT and dev (no domain restrictions)
 * domain: .certestic.com only for production
 */
export function getAuthCookieOptions() {
  const nodeEnv = (process.env.NODE_ENV || '') as string;
  const isSecureEnv = nodeEnv === 'production' || nodeEnv === 'uat';
  const isProduction = nodeEnv === 'production';

  return {
    httpOnly: true,
    secure: isSecureEnv,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 60 * 60, // 1 hour
    ...(isProduction && {
      domain: '.certestic.com',
    }),
  };
}

/**
 * Get cookie options for clearing auth cookies
 * Uses strict sameSite for security
 */
export function getClearCookieOptions() {
  const nodeEnv = (process.env.NODE_ENV || '') as string;
  const isSecureEnv = nodeEnv === 'production' || nodeEnv === 'uat';
  const isProduction = nodeEnv === 'production';

  return {
    httpOnly: true,
    secure: isSecureEnv,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 0, // Expire immediately
    ...(isProduction && {
      domain: '.certestic.com',
    }),
  };
}

/**
 * Get cookie options for logout clearing
 * Uses lax sameSite to allow logout from cross-origin links
 */
export function getLogoutClearCookieOptions() {
  const nodeEnv = (process.env.NODE_ENV || '') as string;
  const isSecureEnv = nodeEnv === 'production' || nodeEnv === 'uat';
  const isProduction = nodeEnv === 'production';

  return {
    httpOnly: true,
    secure: isSecureEnv,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0, // Expire immediately
    ...(isProduction && {
      domain: '.certestic.com',
    }),
  };
}

/**
 * Log cookie options for debugging
 */
export function logCookieOptions(operation: 'SET' | 'CLEAR' | 'LOGOUT', options: any) {
  const nodeEnv = process.env.NODE_ENV as string;
  const warnings: string[] = [];

  // [DEBUG] Detect common misconfiguration that causes cookies to be silently dropped
  if (options.secure && nodeEnv !== 'production' && nodeEnv !== 'uat') {
    warnings.push('WARN: secure=true in non-HTTPS env – cookie will be dropped by the browser');
  }
  if (options.sameSite === 'strict') {
    warnings.push('NOTE: sameSite=strict – cookie will NOT be sent on cross-origin redirects (e.g. OAuth flows)');
  }
  if (options.domain && !options.domain.startsWith('.')) {
    warnings.push(`WARN: domain "${options.domain}" does not start with "." – subdomains may not receive the cookie`);
  }

  console.log(`[COOKIE-${operation}][DEBUG] Name: ${COOKIE_AUTH_NAME}, Options: {
    secure: ${options.secure},
    httpOnly: ${options.httpOnly},
    sameSite: ${options.sameSite},
    path: ${options.path},
    maxAge: ${options.maxAge},
    domain: ${options.domain || 'undefined'},
    NODE_ENV: ${nodeEnv}${warnings.length ? '\n    ' + warnings.join('\n    ') : ''}
  }`);
}

/**
 * Validate that a request's Origin header is from an allowed source.
 *
 * Rules:
 * - If Origin is absent the request is server-to-server (e.g. SSR, curl) → allowed.
 * - If Origin is present it must match the configured NEXT_PUBLIC_FIREBASE_BACKEND_URL
 *   or one of the hardcoded production/UAT origins.
 * - Returns a 403 Response when the check fails, otherwise null.
 */
export function assertAllowedOrigin(request: Request): Response | null {
  const origin = request.headers.get('origin');

  // No Origin header → server-to-server call, allow
  if (!origin) return null;

  const allowed = new Set(allowedOrigins);

  if (!allowed.has(origin)) {
    console.warn(`[CSRF] Blocked request from disallowed origin: ${origin}`);
    return new Response('Forbidden', { status: 403 });
  }

  return null;
}
