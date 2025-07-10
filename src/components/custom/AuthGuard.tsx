'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import PageLoader from './PageLoader';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard - Protects routes by checking user authentication and email verification
 * Only renders children if user is authenticated and verified, otherwise shows loading or redirects
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { firebaseUser, loading, apiUserId } = useFirebaseAuth();
  const [apiTimeout, setApiTimeout] = useState(false);
  const router = useRouter();

  // Set a 5-second timeout if API user ID doesn't load (increased from 3s for better stability)
  useEffect(() => {
    if (firebaseUser && !apiUserId && !apiTimeout) {
      const timer = setTimeout(() => {
        console.warn('API user ID not available after 5 seconds - proceeding without it');
        setApiTimeout(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [firebaseUser, apiUserId, apiTimeout]);

  // Reset API timeout when apiUserId becomes available
  useEffect(() => {
    if (apiUserId && apiTimeout) {
      setApiTimeout(false);
    }
  }, [apiUserId, apiTimeout]);

  // Check if user needs email verification
  useEffect(() => {
    if (firebaseUser && !firebaseUser.emailVerified) {
      console.log('User email not verified, redirecting to signin');
      router.push(
        '/signin?error=' +
          encodeURIComponent('Please verify your email address before accessing your account.'),
      );
    }
  }, [firebaseUser, router]);

  // Case 1: Still checking authentication - show loading
  if (loading) {
    return (
      <PageLoader
        isLoading={true}
        text="Verifying your authentication..."
        showSpinner={true}
        variant="auth"
        fullScreen={true}
        showBrand={true}
      />
    );
  }

  // Case 2: User authenticated but email not verified - show loading while redirect happens
  if (firebaseUser && !firebaseUser.emailVerified) {
    return (
      <PageLoader
        isLoading={true}
        text="Email verification required..."
        showSpinner={true}
        variant="auth"
        fullScreen={true}
        showBrand={true}
      />
    );
  }

  // Case 3: User authenticated but waiting for API setup - show loading (max 5 seconds)
  if (firebaseUser && !apiUserId && !apiTimeout) {
    return (
      <PageLoader
        isLoading={true}
        text="Setting up your account..."
        showSpinner={true}
        variant="default"
        fullScreen={true}
        showBrand={true}
      />
    );
  }

  // Case 4: User is authenticated and verified - render the protected content
  if (firebaseUser && firebaseUser.emailVerified) {
    return <>{children}</>;
  }

  // Case 5: User not authenticated - show loading while redirect happens
  return (
    <PageLoader
      isLoading={true}
      text="Redirecting to sign in..."
      showSpinner={true}
      variant="redirect"
      fullScreen={true}
      showBrand={true}
    />
  );
};

export default AuthGuard;
