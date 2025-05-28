import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);

export const firebaseAi = getAI(app, {
  backend: new GoogleAIBackend(),
});

export const aiModel = (jsonSchema: any) =>
  getGenerativeModel(firebaseAi, {
    model: 'gemini-2.5-flash',
    generationConfig: jsonSchema
      ? {
          responseMimeType: 'application/json',
          responseSchema: jsonSchema,
        }
      : {},
  });

export default app;
