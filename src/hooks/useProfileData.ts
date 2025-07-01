'use client';

import { useUserProfileContext } from '@/src/context/UserProfileContext';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';

export interface ProfileData {
  userId: string | null;
  profile: any;
  isLoading: boolean;
  isError: boolean;
  error: any;
  mutate: () => void;
  displayName: string;
  email: string | null;
  isAuthenticated: boolean;
}

/**
 * Custom hook that combines Firebase auth and profile data
 * Provides a unified interface for accessing user profile information
 */
export function useProfileData(): ProfileData {
  const { firebaseUser, apiUserId } = useFirebaseAuth();
  const { profile, isLoading, isError, error, mutate } = useUserProfileContext();

  return {
    userId: apiUserId,
    profile,
    isLoading,
    isError,
    error,
    mutate,
    displayName: firebaseUser?.displayName || 'User',
    email: firebaseUser?.email || null,
    isAuthenticated: !!firebaseUser,
  };
}
