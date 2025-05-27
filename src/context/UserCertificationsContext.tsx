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
  const { apiUserId } = useFirebaseAuth();
  const {
    userCertifications,
    isLoadingUserCertifications,
    isUserCertificationsError,
    mutateUserCertifications,
  } = useUserRegisteredCertifications(apiUserId);

  return (
    <UserCertificationsContext.Provider
      value={{
        userCertifications,
        isLoadingUserCertifications,
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
