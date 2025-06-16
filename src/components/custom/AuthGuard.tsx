'use client';

import React from 'react';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import PageLoader from './PageLoader';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { firebaseUser, loading, apiUserId } = useFirebaseAuth();

  // Show loading while authentication is being verified
  if (loading) {
    return (
      <PageLoader isLoading={true} text="Verifying your authentication..." showSpinner={true} />
    );
  }

  // Show loading if user is authenticated but API user ID is not yet available
  if (firebaseUser && !apiUserId) {
    return <PageLoader isLoading={true} text="Setting up your account..." showSpinner={true} />;
  }

  // If user is authenticated and API user ID is available, render children
  if (firebaseUser && apiUserId) {
    return <>{children}</>;
  }

  // If not authenticated, the FirebaseAuthContext will handle the redirect
  // Show loading until the redirect happens
  return <PageLoader isLoading={true} text="Redirecting to sign in..." showSpinner={true} />;
};

export default AuthGuard;
