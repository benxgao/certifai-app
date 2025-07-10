'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUserRegisteredCertifications, UserRegisteredCertification } from '@/swr/certifications';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';

interface UserCertificationsContextType {
  userCertifications: UserRegisteredCertification[] | undefined;
  isLoadingUserCertifications: boolean;
  isUserCertificationsError: any;
  mutateUserCertifications: any;
}

const UserCertificationsContext = createContext<UserCertificationsContextType | undefined>(
  undefined,
);

export const UserCertificationsProvider = ({ children }: { children: ReactNode }) => {
  const { apiUserId, loading: authLoading } = useFirebaseAuth();

  // Only start fetching when apiUserId is available and auth is not loading
  // This prevents unnecessary requests during the initial auth setup
  const shouldFetch = !authLoading && apiUserId;

  const {
    userCertifications,
    isLoadingUserCertifications,
    isUserCertificationsError,
    mutateUserCertifications,
  } = useUserRegisteredCertifications(shouldFetch ? apiUserId : null);

  return (
    <UserCertificationsContext.Provider
      value={{
        userCertifications,
        // Show loading only when we should be fetching and are actually loading
        isLoadingUserCertifications: shouldFetch ? isLoadingUserCertifications : authLoading,
        isUserCertificationsError,
        mutateUserCertifications,
      }}
    >
      {children}
    </UserCertificationsContext.Provider>
  );
};

export const useUserCertifications = (): UserCertificationsContextType => {
  const context = useContext(UserCertificationsContext);
  if (context === undefined) {
    throw new Error('useUserCertifications must be used within a UserCertificationsProvider');
  }
  return context;
};
