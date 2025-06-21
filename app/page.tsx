'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import EmailVerification from '@/src/components/auth/EmailVerification';
import PasswordReset from '@/src/components/auth/PasswordReset';
import LandingPageContent from '@/src/components/landing/LandingPageContent';

// Main Page Component - checks for email verification, password reset, or shows landing page
function MainPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  // If mode is verifyEmail, show email verification component
  if (mode === 'verifyEmail') {
    return <EmailVerification />;
  }

  // If mode is resetPassword, show password reset component
  if (mode === 'resetPassword') {
    return <PasswordReset />;
  }

  // Otherwise show the landing page
  return <LandingPageContent />;
}

// Wrapper component with Suspense for useSearchParams
export default function LandingPage() {
  return (
    <Suspense
      fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}
    >
      <MainPage />
    </Suspense>
  );
}
