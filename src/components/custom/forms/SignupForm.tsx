'use client';

import React from 'react';
import Link from 'next/link';
import { FormField, FormButton, FormError, AuthForm } from '../forms';
import { Checkbox } from '@/components/ui/checkbox';

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface SignupFormProps {
  formData: SignupFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
  disabled?: boolean;
  showCertificationSelector?: boolean;
  certificationSelector?: React.ReactNode;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  formData,
  onInputChange,
  onCheckboxChange,
  onSubmit,
  isLoading,
  error,
  disabled = false,
  showCertificationSelector = false,
  certificationSelector,
}) => {
  return (
    <AuthForm onSubmit={onSubmit}>
      {error && <FormError message={error} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="firstName"
          name="firstName"
          type="text"
          label="First name"
          placeholder="John"
          value={formData.firstName}
          onChange={onInputChange}
          required
          autoComplete="given-name"
          disabled={disabled || isLoading}
        />

        <FormField
          id="lastName"
          name="lastName"
          type="text"
          label="Last name"
          placeholder="Doe"
          value={formData.lastName}
          onChange={onInputChange}
          required
          autoComplete="family-name"
          disabled={disabled || isLoading}
        />
      </div>

      <FormField
        id="email"
        name="email"
        type="email"
        label="Email address"
        placeholder="you@example.com"
        value={formData.email}
        onChange={onInputChange}
        required
        autoComplete="email"
        disabled={disabled || isLoading}
      />

      <FormField
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Create a strong password"
        value={formData.password}
        onChange={onInputChange}
        required
        minLength={6}
        autoComplete="new-password"
        disabled={disabled || isLoading}
        helperText="Password must be at least 6 characters long"
      />

      <FormField
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={onInputChange}
        required
        minLength={6}
        autoComplete="new-password"
        disabled={disabled || isLoading}
      />

      {/* Certification Selector */}
      {showCertificationSelector && certificationSelector && (
        <div className="space-y-2">{certificationSelector}</div>
      )}

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-3">
        <Checkbox
          id="acceptTerms"
          checked={formData.acceptTerms}
          onCheckedChange={onCheckboxChange}
          disabled={disabled || isLoading}
          className="mt-1"
        />
        <div className="text-sm leading-relaxed">
          <label
            htmlFor="acceptTerms"
            className="text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            I agree to the{' '}
            <Link
              href="/terms"
              className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline"
              target="_blank"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline"
              target="_blank"
            >
              Privacy Policy
            </Link>
          </label>
        </div>
      </div>

      <FormButton
        type="submit"
        loading={isLoading}
        loadingText="Creating account..."
        disabled={disabled || !formData.acceptTerms}
      >
        Create Account
      </FormButton>

      <div className="text-center text-sm">
        <span className="text-slate-600 dark:text-slate-300">Already have an account? </span>
        <Link
          href="/signin"
          className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline transition-colors duration-200"
        >
          Sign in
        </Link>
      </div>
    </AuthForm>
  );
};
