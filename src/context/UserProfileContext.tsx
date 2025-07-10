'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useFirebaseAuth } from './FirebaseAuthContext';
import { useUserProfile, UserProfile } from '@/src/swr/profile';

interface UserProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  isError: boolean;
  error: any;
  mutate: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | null>(null);

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
  const { apiUserId, loading: authLoading } = useFirebaseAuth();

  // Only start fetching when apiUserId is available and auth is not loading
  // This prevents unnecessary requests during the initial auth setup
  const shouldFetch = !authLoading && apiUserId;

  const {
    data: profileResponse,
    error,
    isLoading,
    mutate,
  } = useUserProfile(shouldFetch ? apiUserId : null);

  const profile = profileResponse?.data || null;

  const value: UserProfileContextType = {
    profile,
    // Show loading only when we should be fetching and are actually loading
    // Don't show loading if auth is still loading (prevents flash of loading state)
    isLoading: shouldFetch ? isLoading : authLoading,
    isError: !!error,
    error,
    mutate,
  };

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
};

export const useUserProfileContext = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfileContext must be used within a UserProfileProvider');
  }
  return context;
};
