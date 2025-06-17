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

/**
 * Hook to get formatted token information
 */
export function useTokenInfo() {
  const { profile, isLoading } = useProfileData();

  const formatTokens = (amount: number = 0) => {
    return amount.toLocaleString();
  };

  return {
    creditTokens: profile?.credit_tokens || 0,
    energyTokens: profile?.energy_tokens || 0,
    totalTokens: (profile?.credit_tokens || 0) + (profile?.energy_tokens || 0),
    formattedCreditTokens: formatTokens(profile?.credit_tokens),
    formattedEnergyTokens: formatTokens(profile?.energy_tokens),
    isLoading,
  };
}
