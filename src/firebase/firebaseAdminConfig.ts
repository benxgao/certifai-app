import 'server-only';

import admin, { auth } from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin/app';
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
     * Credential loading strategy (checked in order):
     * 1. Absolute file path (starts with '/')
     * 2. Relative file path that resolves to an existing file
     * 3. JSON string (from Secret Manager / GitHub Secrets)
     *
     * Each path has its own try/catch so we get a clear, specific error
     * instead of a confusing SyntaxError from trying to JSON.parse a path string.
     */
    let serviceAccount: ServiceAccount;

    const tryReadFile = (filePath: string): ServiceAccount => {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    };

    const tryParseJson = (str: string): ServiceAccount => {
      return JSON.parse(str);
    };

    if (credentialsString.startsWith('/')) {
      // Absolute path — must exist
      serviceAccount = tryReadFile(credentialsString);
    } else if (credentialsString.startsWith('.')) {
      // Relative path — resolve and check existence before reading
      const resolvedPath = path.resolve(process.cwd(), credentialsString);
      if (fs.existsSync(resolvedPath)) {
        serviceAccount = tryReadFile(resolvedPath);
      } else {
        throw new Error(
          `GOOGLE_APPLICATION_CREDENTIALS is set to "${credentialsString}" ` +
          `but the file does not exist at ${resolvedPath}. ` +
          `Either create the file or set the env var to a valid JSON string.`
        );
      }
    } else if (credentialsString.includes('{')) {
      // Looks like a JSON string (from Secret Manager or GitHub Secrets)
      serviceAccount = tryParseJson(credentialsString);
    } else {
      // Could be a bare filename or something else — try as file, then as JSON
      const resolvedPath = path.resolve(process.cwd(), credentialsString);
      try {
        serviceAccount = tryReadFile(resolvedPath);
      } catch {
        try {
          serviceAccount = tryParseJson(credentialsString);
        } catch {
          throw new Error(
            `GOOGLE_APPLICATION_CREDENTIALS is set to "${credentialsString}" ` +
            `which is neither a valid file path nor a valid JSON string.`
          );
        }
      }
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
