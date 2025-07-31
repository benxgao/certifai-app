'use client';

import React, { useState } from 'react';
import { FormField, FormButton, FormError, AuthForm } from './forms';

interface PasswordResetFormProps {
  email: string;
  onSubmit: (newPassword: string, confirmPassword: string) => Promise<void>;
  isResetting: boolean;
  errorMessage: string;
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  email,
  onSubmit,
  isResetting,
  errorMessage,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newPassword, confirmPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  return (
    <AuthForm onSubmit={handleSubmit}>
      {errorMessage && <FormError message={errorMessage} />}

      <div className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Resetting password for: <strong>{email}</strong>
      </div>

      <FormField
        id="newPassword"
        name="newPassword"
        type="password"
        label="New Password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={handleInputChange}
        required
        minLength={6}
        disabled={isResetting}
        helperText="Password must be at least 6 characters long"
      />

      <FormField
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={handleInputChange}
        required
        minLength={6}
        disabled={isResetting}
      />

      <FormButton
        type="submit"
        loading={isResetting}
        loadingText="Resetting..."
        disabled={!newPassword || !confirmPassword}
      >
        Reset Password
      </FormButton>
    </AuthForm>
  );
};
