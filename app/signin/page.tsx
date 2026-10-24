'use client';

import React, { useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LandingHeader from '@/src/components/custom/LandingHeader';
import AuthLeftSection from '@/src/components/auth/AuthLeftSection';
import AuthPageShell from '@/src/components/auth/AuthPageShell';
import AuthCard, { AuthCardHeader } from '@/src/components/auth/AuthCard';
import AuthField from '@/src/components/auth/AuthField';
import PasswordField from '@/src/components/auth/PasswordField';
import EnhancedNotificationBar from '@/src/components/custom/NotificationBar';
import { AlertMessage } from '@/src/components/custom/AlertMessage';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { ButtonLoadingText } from '@/src/components/ui/loading-spinner';
import PageLoader from '@/src/components/custom/PageLoader';
import { FeatureFlags } from '@/src/config/featureFlags';
import { useDemoCredentialsReveal } from '@/src/hooks/useDemoCredentialsReveal';
import { authButton, authCard, authLink, authNote } from '@/src/config/auth-theme';
import { cn } from '@/src/lib/utils';
import {
  DEFAULT_DEMO_CREDENTIALS_DISPLAY,
  formatDemoCredentialsForDisplay,
} from '@/src/lib/demoCredentialsProvider';
import {
  performSignin,
  resendVerificationEmail,
  isAuthenticationError,
  type SigninFormData,
} from '@/src/lib/signin-helpers';
import { useAuthRedirect, useSigninInitialization } from '@/src/hooks/useSigninHooks';

const LoginPage = () => {
  const [form, setForm] = useState<SigninFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const { firebaseUser, loading, apiUserId } = useFirebaseAuth();
  const {
    isRevealed: isDemoCredentialsRevealed,
    isLoading: isDemoCredentialsLoading,
    error: demoCredentialsError,
    credentials: demoCredentials,
    revealCredentials,
  } = useDemoCredentialsReveal();

  // Initialize signin page - handle URL params and display messages
  useSigninInitialization(setError);

  // Simple redirect logic - redirect when user is fully authenticated
  useAuthRedirect(loading, firebaseUser, apiUserId, isRedirecting, error, setIsRedirecting);

  // Function to resend verification email
  const handleResendVerificationEmail = async () => {
    try {
      setVerificationLoading(true);
      const message = await resendVerificationEmail();
      setError(message);
    } finally {
      setVerificationLoading(false);
    }
  };

  const onChange = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      setForm((prevForm) => {
        // Ensure we don't accidentally clear the form
        const newForm = { ...prevForm, [name]: value };
        return newForm;
      });
    },
    [],
  );

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent form submission if already processing or redirecting
    if (isLoading || isRedirecting) {
      return;
    }

    try {
      setError('');

      // Force immediate synchronous state update to show spinner instantly
      flushSync(() => {
        setIsLoading(true);
      });

      const result = await performSignin(form);

      if (result.success) {
        // Clear any previous error messages and verification prompts
        setError('');
        setShowVerificationPrompt(false);
        // Don't redirect here - let the useAuthRedirect hook handle it
      } else if (result.error) {
        setError(result.error.message);
        if (result.error.showVerificationPrompt) {
          setShowVerificationPrompt(true);
        }
        setIsLoading(false);
        return;
      }
    } catch (error: any) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Don't show signin form if user is already authenticated and will be redirected
  const isAuthError = isAuthenticationError(error);
  const isDemoConsentEnabled = FeatureFlags.DEMO_CREDENTIALS_CONSENT_ENABLED;
  const shouldRequireDemoConsent = isDemoConsentEnabled && !isDemoCredentialsRevealed;
  const demoCredentialsDisplay = demoCredentials
    ? formatDemoCredentialsForDisplay(demoCredentials)
    : DEFAULT_DEMO_CREDENTIALS_DISPLAY;
  const demoMessage = shouldRequireDemoConsent
    ? 'Try our platform instantly with demo account credentials'
    : `Try our platform instantly with demo account - username/password: ${demoCredentialsDisplay}`;

  if (!loading && firebaseUser && apiUserId && !isAuthError) {
    return (
      <PageLoader
        isLoading={true}
        text="Already signed in. Redirecting..."
        variant="redirect"
        fullScreen={true}
        showBrand={true}
      />
    );
  }

  const isBusy = isLoading || isRedirecting;
  const canSubmit = !!form.email.trim() && !!form.password.trim() && !isBusy;

  return (
    <AuthPageShell
      header={<LandingHeader />}
      // banner={
      //   <EnhancedNotificationBar
      //     message={demoMessage}
      //     ctaText=""
      //     ctaLink="/signin"
      //     variant="promo"
      //     showIcon={true}
      //     requireConsent={shouldRequireDemoConsent}
      //     consentButtonText="Show demo login details"
      //     onConsentAccept={revealCredentials}
      //     privacyLink="/privacy"
      //     termsLink="/terms"
      //     isConsentLoading={isDemoCredentialsLoading}
      //     consentError={demoCredentialsError}
      //   />
      // }
      aside={<AuthLeftSection mode="signin" />}
    >
      <AuthCard>
        <AuthCardHeader
          eyebrow="Account access"
          title="Sign In"
          subtitle="Enter your credentials to access your account."
        />

        <form onSubmit={handleSignin} autoComplete="on">
          <div className={cn(authCard.body, 'space-y-5')}>
            <AuthField
              id="email"
              name="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={onChange}
              disabled={isBusy}
              autoComplete="on"
              icon={Mail}
            />

            <PasswordField
              id="password"
              name="password"
              label="Password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={onChange}
              disabled={isBusy}
              autoComplete="on"
              labelAction={
                <Link href="/forgot-password" className={authLink.inline}>
                  Forgot password?
                </Link>
              }
            />

            {error && (
              <AlertMessage message={error} className="text-sm">
                {showVerificationPrompt && (
                  <div className="mt-3 rounded-lg border border-slate-200/80 bg-slate-50 p-3 dark:border-slate-700/60 dark:bg-slate-800/50">
                    <p className="mb-2.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                      Didn&apos;t receive the email? Check your spam folder or resend it.
                    </p>
                    <Button
                      onClick={handleResendVerificationEmail}
                      disabled={verificationLoading}
                      variant="outline"
                      size="sm"
                      className="text-xs font-medium"
                    >
                      {verificationLoading ? 'Sending...' : 'Resend verification email'}
                    </Button>
                  </div>
                )}
              </AlertMessage>
            )}

            <Button
              type="submit"
              size="lg"
              className={authButton.primary}
              disabled={!canSubmit}
            >
              <ButtonLoadingText
                isLoading={isBusy}
                loadingText={isRedirecting ? 'Redirecting...' : 'Signing In...'}
                defaultText="Sign In"
                showSpinner={true}
                spinnerSize="sm"
              />
            </Button>

            <p className={authNote.secure}>
              <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
              Encrypted in transit
            </p>
          </div>

          <div className={authCard.footer}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className={authLink.footer}>
              Sign up
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthPageShell>
  );
};

export default LoginPage;
