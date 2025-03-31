import admin, { auth } from 'firebase-admin';
import { getApps, App } from 'firebase-admin/app';

const getFirebaseAdminApp = (): App => {
  try {
    let app;
    const serviceAccount = require('../gcp_credentials.json');

    if (!serviceAccount) {
      throw new Error('Service account file not found');
    }

    const apps = getApps();

    if (!admin.apps.length) {
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      app = apps[0];
    }

    // console.log('Initialized app:', app);

    return app;
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
};

const app = getFirebaseAdminApp();

const adminAuth = auth();
const adminFirestore = admin.firestore();

// Helper function for server components to ensure admin is initialized
export const getAdminSDK = () => {
  return {
    auth: adminAuth,
    firestore: adminFirestore,
    app,
  };
};
