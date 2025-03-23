import { getAuth } from '@firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseApp = initializeApp();

// export const googleProvider = new GoogleAuthProvider();

export const firebaseAuth = getAuth(firebaseApp);
