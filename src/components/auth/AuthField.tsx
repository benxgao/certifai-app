'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';

import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { cn } from '@/src/lib/utils';
import { authField } from '@/src/config/auth-theme';

export interface AuthFieldProps extends React.ComponentProps<typeof Input> {
  /** Field id — binds the label and is forwarded to the control. */
  id: string;
  label: string;
  /** Leading icon rendered inside the control. Purely decorative. */
  icon?: LucideIcon;
  /** Marks the field as required in the label (the `required` attribute stays opt-in). */
  requiredMark?: boolean;
  /** Right-aligned control in the label row, e.g. a "Forgot password?" link. */
  labelAction?: React.ReactNode;
  /** Node rendered inside the control's right edge, e.g. a reveal toggle. */
  trailing?: React.ReactNode;
  /** Helper copy shown under the control. */
  hint?: React.ReactNode;
}

/**
 * Label + input + optional icon / trailing control / hint.
 *
 * Every native prop is forwarded to the underlying `<input>`, so ids, names,
 * autocomplete hints, `required`/`minLength` and the event handlers stay exactly
 * as each page declares them — this component only owns presentation.
 */
export const AuthField = ({
  id,
  label,
  icon: Icon,
  requiredMark = false,
  labelAction,
  trailing,
  hint,
  className,
  ...inputProps
}: AuthFieldProps) => {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className={cn(authField.group, className)}>
      <div className={authField.labelRow}>
        <Label htmlFor={id} className={authField.label}>
          {label}
          {requiredMark && (
            <span className={authField.requiredMark} aria-hidden="true">
              *
            </span>
          )}
        </Label>
        {labelAction}
      </div>

      <div className={authField.wrapper}>
        <Input
          id={id}
          aria-describedby={hintId}
          className={cn(
            'peer',
            authField.input,
            Icon && authField.inputWithIcon,
            trailing && authField.inputWithTrailing,
          )}
          {...inputProps}
        />
        {Icon && <Icon className={cn(authField.icon, authField.iconActive)} aria-hidden="true" />}
        {trailing && <div className={authField.trailing}>{trailing}</div>}
      </div>

      {hint && (
        <p id={hintId} className={authField.hint}>
          {hint}
        </p>
      )}
    </div>
  );
};

AuthField.displayName = 'AuthField';

export default AuthField;
