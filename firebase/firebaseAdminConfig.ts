import admin, { auth } from 'firebase-admin';
import { getApps, App } from 'firebase-admin/app';

const getFirebaseAdminApp = (): App => {
  try {
    let app;
    // const serviceAccount = require('../gcp_credentials.json');

    const credentialsString = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    // console.log(`DEBUG:0
    //   | credentialsString: ${credentialsString}`);

    if (!credentialsString) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable not set.');
    }

    const serviceAccount = credentialsString.startsWith('/')
      ? credentialsString
      : JSON.parse(credentialsString);

    // console.log(`DEBUG:1
    //   | typeof serviceAccount: ${typeof serviceAccount}
    //   | serviceAccount: ${JSON.stringify(serviceAccount)}`);

    const apps = getApps();

    if (!admin.apps.length) {
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      app = apps[0];
    }

    // console.log('DEBUG:2 Initialized:', app);

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
