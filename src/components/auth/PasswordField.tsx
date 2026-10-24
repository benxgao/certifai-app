'use client';

import * as React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

import { AuthField, type AuthFieldProps } from '@/src/components/auth/AuthField';
import { authField } from '@/src/config/auth-theme';

export type PasswordFieldProps = Omit<AuthFieldProps, 'type' | 'icon' | 'trailing'>;

/**
 * Password input with a reveal toggle.
 *
 * The control still starts as `type="password"` and every native prop
 * (`autoComplete`, `minLength`, `required`, `value`, `onChange`, `disabled`) is
 * forwarded untouched — the toggle is a view-only affordance and never submits
 * the form (`type="button"`).
 */
export const PasswordField = ({ disabled, ...props }: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <AuthField
      {...props}
      type={isVisible ? 'text' : 'password'}
      icon={Lock}
      disabled={disabled}
      trailing={
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          disabled={disabled}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          className={authField.trailingButton}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      }
    />
  );
};

PasswordField.displayName = 'PasswordField';

export default PasswordField;
