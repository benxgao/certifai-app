import 'client-only';
import { User } from 'firebase/auth';

/**
 * Client-side utility to save subscriberId to Firebase Auth custom claims
 * This function preserves existing custom claims while adding the subscriber_id
 *
 * @param subscriberId - The MailerLite subscriber ID to save
 * @param firebaseUser - The authenticated Firebase user
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export async function saveSubscriberIdToClaims(
  subscriberId: string,
  firebaseUser: User,
): Promise<boolean> {
  try {

    // Get the user's current ID token
    const idToken = await firebaseUser.getIdToken();

    // Get current custom claims to preserve existing data
    const idTokenResult = await firebaseUser.getIdTokenResult(true);
    const currentClaims = idTokenResult.claims;

    // Call the set-claims API to update custom claims with subscriberId
    const claimsResponse = await fetch('/api/auth/set-claims', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        api_user_id: currentClaims.api_user_id, // Preserve existing api_user_id
        init_cert_id: currentClaims.init_cert_id, // Preserve existing init_cert_id
        subscriber_id: subscriberId, // Add new subscriberId
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (claimsResponse.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
