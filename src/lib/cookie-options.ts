/**
 * Centralized cookie options configuration
 * Ensures consistent cookie settings across all auth endpoints
 * Key: secure flag is enabled for both production and UAT environments
 */

import { COOKIE_AUTH_NAME } from '@/src/config/constants';

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
  console.log(`[COOKIE-${operation}] Name: ${COOKIE_AUTH_NAME}, Options: {
    secure: ${options.secure},
    httpOnly: ${options.httpOnly},
    sameSite: ${options.sameSite},
    path: ${options.path},
    maxAge: ${options.maxAge},
    domain: ${options.domain || 'undefined'},
    NODE_ENV: ${process.env.NODE_ENV}
  }`);
}
