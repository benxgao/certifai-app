'use client';

import React from 'react';
import Link from 'next/link';
import { FormField, FormButton, FormError, AuthForm } from '../forms';

export interface SigninFormData {
  email: string;
  password: string;
}

export interface SigninFormProps {
  formData: SigninFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
  disabled?: boolean;
}

export const SigninForm: React.FC<SigninFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  error,
  disabled = false,
}) => {
  return (
    <AuthForm onSubmit={onSubmit}>
      {error && <FormError message={error} />}

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
        placeholder="Enter your password"
        value={formData.password}
        onChange={onInputChange}
        required
        autoComplete="current-password"
        disabled={disabled || isLoading}
        rightElement={
          <Link
            href="/forgot-password"
            className="text-xs sm:text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline transition-colors duration-200"
          >
            Forgot password?
          </Link>
        }
      />

      <FormButton type="submit" loading={isLoading} loadingText="Signing in..." disabled={disabled}>
        Sign In
      </FormButton>

      <div className="text-center text-sm">
        <span className="text-slate-600 dark:text-slate-300">Don&apos;t have an account? </span>
        <Link
          href="/signup"
          className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 hover:underline transition-colors duration-200"
        >
          Sign up
        </Link>
      </div>
    </AuthForm>
  );
};
