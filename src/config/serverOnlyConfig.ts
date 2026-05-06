'server-only';
const appUrl = process.env.NEXT_PUBLIC_FIREBASE_BACKEND_URL ?? '';

export const allowedOrigins = [
  'https://certestic.com',
  'https://www.certestic.com',
  'https://uat--certifai-uat.us-central1.hosted.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(appUrl ? [appUrl.replace(/\/$/, '')] : []),
];
