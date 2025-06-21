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

  // Start fetching immediately when apiUserId is available, don't wait for auth loading to complete
  const { data: profileResponse, error, isLoading, mutate } = useUserProfile(apiUserId);

  const profile = profileResponse?.data || null;

  const value: UserProfileContextType = {
    profile,
    isLoading: authLoading || isLoading,
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
