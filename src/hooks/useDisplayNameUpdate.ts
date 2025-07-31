/**
 * Custom hook for managing display name updates
 */

import { useState } from 'react';
import { updateFirebaseDisplayName, validateDisplayName } from '@/src/lib/profile-utils';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { auth } from '@/src/firebase/firebaseWebConfig';

export interface UseDisplayNameUpdateResult {
  isUpdating: boolean;
  error: string | null;
  updateDisplayName: (newDisplayName: string) => Promise<boolean>;
  clearError: () => void;
}

export function useDisplayNameUpdate(): UseDisplayNameUpdateResult {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { firebaseUser, setFirebaseUser } = useFirebaseAuth();

  const updateDisplayName = async (newDisplayName: string): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);

    try {
      // Validate the display name
      const validation = validateDisplayName(newDisplayName);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid display name');
        return false;
      }

      // Check if user is authenticated
      if (!firebaseUser) {
        setError('You must be logged in to update your display name');
        return false;
      }

      // Check if the name is actually different
      if (firebaseUser.displayName === newDisplayName.trim()) {
        setError('The new display name is the same as your current name');
        return false;
      }

      // Update the display name
      const result = await updateFirebaseDisplayName(newDisplayName);

      if (!result.success) {
        setError(result.error || 'Failed to update display name');
        return false;
      }

      // Force refresh the Firebase Auth user to get the updated display name
      await auth.currentUser?.reload();
      if (auth.currentUser) {
        setFirebaseUser(auth.currentUser);
      }

      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isUpdating,
    error,
    updateDisplayName,
    clearError,
  };
}
