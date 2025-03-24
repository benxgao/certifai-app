import { getAdminSDK } from './firebaseAdminConfig';

export async function verifyToken(token: string) {
  try {
    const admin = getAdminSDK();
    console.log(`verifyToken1: token to be verified: ${token}
        | process.env.NODE_ENV: ${process.env.NODE_ENV}`);

    const user = await admin.auth.getUser('wrx5WLgjjEYJK347k0WParfJcWo1'); // Replace with a valid user UID
    console.log('User data fetched successfully:', user);

    let decodedToken;

    if (process.env.NODE_ENV === 'development') {
      // Development environment (emulator)
      decodedToken = await admin.auth.verifyIdToken(token, true);
    } else {
      // Production environment
      decodedToken = await admin.auth.verifyIdToken(token);
    }

    console.log(`verifyToken2: decodedToken: ${JSON.stringify(decodedToken)}`);

    return { uid: decodedToken.uid, valid: true };
  } catch (error) {
    console.error('Token verification error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    return { uid: null, valid: false };
  }
}
