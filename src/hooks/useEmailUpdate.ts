/**
 * Custom hook for managing email updates via Firebase Auth
 */

import { useState } from 'react';
import {
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

export interface UseEmailUpdateResult {
  isUpdating: boolean;
  error: string | null;
  success: string | null;
  updateEmail: (newEmail: string, currentPassword?: string) => Promise<boolean>;
  clearMessages: () => void;
}

export function useEmailUpdate(): UseEmailUpdateResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { firebaseUser } = useFirebaseAuth();

  const updateEmail = async (newEmail: string, currentPassword?: string): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate the email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        setError('Please enter a valid email address');
        return false;
      }

      // Check if user is authenticated
      if (!firebaseUser) {
        setError('You must be logged in to update your email');
        return false;
      }

      // Check if the email is actually different
      if (firebaseUser.email === newEmail.trim()) {
        setError('The new email address is the same as your current email');
        return false;
      }

      // If current password is provided, reauthenticate the user first
      if (currentPassword) {
        const credential = EmailAuthProvider.credential(firebaseUser.email!, currentPassword);
        await reauthenticateWithCredential(firebaseUser, credential);
      }

      // Configure action code settings for email verification
      const actionCodeSettings = {
        url: `${window.location.origin}/main/profile`,
        handleCodeInApp: true,
      };

      // Send verification email before updating
      await verifyBeforeUpdateEmail(firebaseUser, newEmail.trim(), actionCodeSettings);

      setSuccess(
        `Verification email sent to ${newEmail}. Please check your inbox and click the verification link to complete the email update.`,
      );

      return true;
    } catch (error: any) {
      console.error('Error updating email:', error);

      // Handle specific error codes
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email address is already in use by another account');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address');
          break;
        case 'auth/requires-recent-login':
          setError(
            'For security reasons, please sign out and sign back in before changing your email',
          );
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection and try again');
          break;
        default:
          setError(error.message || 'Failed to send email verification. Please try again');
      }
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    isUpdating,
    error,
    success,
    updateEmail,
    clearMessages,
  };
}
