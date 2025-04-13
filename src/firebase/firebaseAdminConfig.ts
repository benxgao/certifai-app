import 'server-only';

import admin, { auth } from 'firebase-admin';
import { getApps, App } from 'firebase-admin/app';

const getFirebaseAdminApp = (): App => {
  try {
    let app;

    const credentialsString = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!credentialsString) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable not set.');
    }

    /**
     * Use JSON.parse if it is loaded in production, where the string is passed from secret manager
     */
    const serviceAccount = credentialsString.startsWith('/')
      ? credentialsString
      : JSON.parse(credentialsString);

    const apps = getApps();

    if (!admin.apps.length) {
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      app = apps[0];
    }

    return app;
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
};

const app = getFirebaseAdminApp();

const adminAuth = auth();
const adminFirestore = admin.firestore();

export const getAdminSDK = () => {
  return {
    auth: adminAuth,
    firestore: adminFirestore,
    app,
  };
};
