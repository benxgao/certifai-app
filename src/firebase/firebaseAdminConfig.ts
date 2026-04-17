import 'server-only';

import admin, { auth } from 'firebase-admin';
import { getApps, App } from 'firebase-admin/app';
import * as fs from 'fs';
import * as path from 'path';

const getFirebaseAdminApp = (): App => {
  try {
    let app;

    const credentialsString = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!credentialsString) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable not set.');
    }

    /**
     * Use JSON.parse if it is loaded in production, where the string is passed from secret manager
     * Handle both absolute paths and relative paths
     */
    let serviceAccount;

    if (credentialsString.startsWith('/')) {
      // Absolute path
      const fileContent = fs.readFileSync(credentialsString, 'utf-8');
      serviceAccount = JSON.parse(fileContent);
    } else if (credentialsString.startsWith('.') || !credentialsString.includes('{')) {
      // Relative path or potential file path without leading /
      const resolvedPath = path.resolve(process.cwd(), credentialsString);
      if (fs.existsSync(resolvedPath)) {
        const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
        serviceAccount = JSON.parse(fileContent);
      } else {
        // Try parsing as JSON string directly (for secret manager)
        serviceAccount = JSON.parse(credentialsString);
      }
    } else {
      // Assume it's a JSON string (from secret manager)
      serviceAccount = JSON.parse(credentialsString);
    }

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
    // Error initializing Firebase Admin
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
