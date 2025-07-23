// Re-export client-side functions
export {
  getApiUserIdFromClaims,
  getInitCertIdFromClaims,
  getSubscriberIdFromClaims,
} from './auth-claims-client';

// Note: Server-side functions are in auth-claims-server.ts
// Import them directly from there in server-side code:
// import { getApiUserIdFromToken, ... } from '@/src/lib/auth-claims-server';
