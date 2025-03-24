import * as admin from 'firebase-admin';
import { getApps, initializeApp, App } from 'firebase-admin/app';

const getFirebaseAdminApp = (): App => {
  try {
    const serviceAccount = require('../service-account.json');

    if (!serviceAccount) {
      throw new Error('Service account file not found');
    }

    if (!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
      throw new Error('Firebase Database URL is not set in environment variables');
    }

    const apps = getApps();

    if (!apps.length) {
      return initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
    }

    return apps[0];
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
};

// Initialize the app
const app = getFirebaseAdminApp();

// Export the admin services
export const adminAuth = admin.auth(app);
export const adminFirestore = admin.firestore(app);

// Helper function for server components to ensure admin is initialized
export const getAdminSDK = () => {
  return {
    auth: adminAuth,
    firestore: adminFirestore,
    app,
  };
};
