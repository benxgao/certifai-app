import 'server-only';

import { getAdminSDK } from '@/src/firebase/firebaseAdminConfig';

/**
 * Server-side utility to get api_user_id from Firebase Auth custom claims
 * Use this in API routes and server components
 */
export async function getApiUserIdFromToken(firebaseToken: string): Promise<string | null> {
  try {
    const { auth } = getAdminSDK();
    const decodedToken = await auth.verifyIdToken(firebaseToken);

    return (decodedToken.api_user_id as string) || null;
  } catch (error) {
    console.error('Error verifying token and getting api_user_id:', error);
    return null;
  }
}

/**
 * Server-side utility to get init_cert_id from Firebase Auth custom claims
 * Use this in API routes and server components
 */
export async function getInitCertIdFromToken(firebaseToken: string): Promise<number | null> {
  try {
    const { auth } = getAdminSDK();
    const decodedToken = await auth.verifyIdToken(firebaseToken);

    return (decodedToken.init_cert_id as number) || null;
  } catch (error) {
    console.error('Error verifying token and getting init_cert_id:', error);
    return null;
  }
}

/**
 * Server-side utility to get subscriber_id from Firebase Auth custom claims
 * Use this in API routes and server components
 */
export async function getSubscriberIdFromToken(firebaseToken: string): Promise<string | null> {
  try {
    const { auth } = getAdminSDK();
    const decodedToken = await auth.verifyIdToken(firebaseToken);

    return (decodedToken.subscriber_id as string) || null;
  } catch (error) {
    console.error('Error verifying token and getting subscriber_id:', error);
    return null;
  }
}

/**
 * Server-side utility to get api_user_id by Firebase UID
 * Use this when you have the UID but not the token
 */
export async function getApiUserIdByUid(uid: string): Promise<string | null> {
  try {
    const { auth } = getAdminSDK();
    const userRecord = await auth.getUser(uid);

    return userRecord.customClaims?.api_user_id || null;
  } catch (error) {
    console.error('Error getting api_user_id by UID:', error);
    return null;
  }
}
