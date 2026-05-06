'server-only';
const appUrl = process.env.NEXT_PUBLIC_FIREBASE_BACKEND_URL ?? '';

/**
 * CSRF origin allowlist — used by assertAllowedOrigin() in cookie-options.ts.
 *
 * ⚠️  DO NOT remove entries without testing UAT and production sign-in.
 * - 'https://certestic.com' and 'https://www.certestic.com' are required for production.
 * - 'https://uat--certifai-uat.us-central1.hosted.app' is the Firebase App Hosting UAT origin.
 * - localhost entries are needed for local development (secure: false cookies).
 * - NEXT_PUBLIC_FIREBASE_BACKEND_URL is injected at build time to support preview deployments.
 *
 * Requests with an Origin header not in this list are rejected with 403.
 * Requests without an Origin header (server-to-server) are always allowed.
 */
export const allowedOrigins = [
  'https://certestic.com',
  'https://www.certestic.com',
  'https://uat--certifai-uat.us-central1.hosted.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(appUrl ? [appUrl.replace(/\/$/, '')] : []),
];
