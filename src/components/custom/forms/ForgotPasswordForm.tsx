'use client';

import React from 'react';
import Link from 'next/link';
import { FormField, FormButton, FormError, FormSuccess, AuthForm } from '../forms';

export interface ForgotPasswordFormData {
  email: string;
}

export interface ForgotPasswordFormProps {
  formData: ForgotPasswordFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
  success: string;
  disabled?: boolean;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  error,
  success,
  disabled = false,
}) => {
  return (
    <AuthForm onSubmit={onSubmit} autoComplete="off">
      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}

      <FormField
        id="email"
        name="email"
        type="email"
        label="Email address"
        placeholder="you@example.com"
        value={formData.email}
        onChange={onInputChange}
        required
        autoComplete="off"
        disabled={disabled || isLoading}
        helperText="Enter the email address associated with your account"
      />

      <FormButton
        type="submit"
        loading={isLoading}
        loadingText="Sending reset link..."
        disabled={disabled}
      >
        Send Reset Link
      </FormButton>

      <div className="text-center text-sm space-y-2">
        <div>
          <span className="text-slate-600 dark:text-slate-300">Remember your password? </span>
          <Link
            href="/signin"
            className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline transition-colors duration-200"
          >
            Sign in
          </Link>
        </div>
        <div>
          <span className="text-slate-600 dark:text-slate-300">Don&apos;t have an account? </span>
          <Link
            href="/signup"
            className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline transition-colors duration-200"
          >
            Sign up
          </Link>
        </div>
      </div>
    </AuthForm>
  );
};
