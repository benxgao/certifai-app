'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useSearchParams } from 'next/navigation';
import LandingHeader from '@/src/components/custom/LandingHeader';
import { auth } from '@/src/firebase/firebaseWebConfig';
import { AuthPageLayout, ForgotPasswordForm } from '@/src/components/custom/forms';
import type { ForgotPasswordFormData } from '@/src/components/custom/forms/ForgotPasswordForm';

function ForgotPasswordContent() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  // Handle URL params for redirected users
  useEffect(() => {
    const passwordResetParam = searchParams.get('passwordReset');

    if (passwordResetParam === 'expired') {
      setError('Your password reset link has expired. Please request a new one below.');
    } else if (passwordResetParam === 'success') {
      setSuccess('Password reset successful! You can now sign in with your new password.');
    }

    // Clean up URL
    if (passwordResetParam) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ForgotPasswordFormData) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email?.trim()) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setIsLoading(true);

      // Configure action code settings to use the new URL structure
      const actionCodeSettings = {
        url: `${window.location.origin}?mode=resetPassword`,
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, formData.email, actionCodeSettings);

      setSuccess(
        'Password reset email sent! Please check your inbox and follow the instructions to reset your password.',
      );

      // Clear form on success
      setFormData({ email: '' });
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later.');
          break;
        default:
          setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />

      <AuthPageLayout>
        <ForgotPasswordForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          success={success}
        />
      </AuthPageLayout>
    </div>
  );
}

// Wrapper component with Suspense for useSearchParams
export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-violet-600 mx-auto"></div>
            <p className="text-lg text-gray-600 dark:text-slate-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
