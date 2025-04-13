import { getAdminSDK } from './firebaseAdminConfig';

export async function verifyToken(token: string) {
  try {
    const admin = getAdminSDK();

    console.log(`verifyToken1: process.env.NODE_ENV: ${process.env.NODE_ENV}`);

    /**
     * UserRecord {
          uid: 'wrx5WLgjjEYJK347k0WParfJcWo1',
          email: 'xingbingao@gmail.com',
          emailVerified: false,
          displayName: undefined,
          photoURL: undefined,
          phoneNumber: undefined,
          disabled: false,
          metadata: UserMetadata {
            creationTime: 'Mon, 24 Mar 2025 05:24:17 GMT',
            lastSignInTime: 'Mon, 31 Mar 2025 03:51:57 GMT',
            lastRefreshTime: 'Mon, 31 Mar 2025 03:51:57 GMT'
          },
          providerData: [
            UserInfo {
              uid: 'xingbingao@gmail.com',
              displayName: undefined,
              email: 'xingbingao@gmail.com',
              photoURL: undefined,
              providerId: 'password',
              phoneNumber: undefined
            }
          ],
          passwordHash: undefined,
          passwordSalt: undefined,
          tokensValidAfterTime: 'Mon, 24 Mar 2025 05:24:17 GMT',
          tenantId: undefined
        }
     */
    // const user = await admin.auth.getUser('wrx5WLgjjEYJK347k0WParfJcWo1'); // Replace with a valid user UID
    // console.log('User data fetched successfully:', user);

    const decodedToken = await admin.auth.verifyIdToken(token, true);

    // console.log(`verifyToken2: decodedToken: ${JSON.stringify(decodedToken)}`);

    return {
      uid: decodedToken.uid,
      valid: true,
    };
  } catch (error: any) {
    console.error('Token verification error details:', {
      message: error.message,
      code: error.code,
      // stack: error.stack,
    });

    return { uid: null, valid: false };
  }
}
