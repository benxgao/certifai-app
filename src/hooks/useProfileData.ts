'use client';

import { useUserProfileContext } from '@/src/context/UserProfileContext';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { UserProfile } from '@/src/swr/profile';
import { ApiError } from '@/src/types/api';

export interface ProfileData {
  userId: string | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | undefined;
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
