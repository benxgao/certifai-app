'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/src/lib/utils';

export interface FormFieldProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  error?: string;
  helperText?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  rightElement?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  autoComplete,
  minLength,
  maxLength,
  error,
  helperText,
  className,
  inputClassName,
  labelClassName,
  rightElement,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className={cn(
            'text-slate-700 dark:text-slate-200 font-medium text-sm sm:text-base',
            labelClassName,
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {rightElement}
      </div>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        className={cn(
          'text-sm sm:text-base rounded-xl border-slate-200/60 dark:border-slate-600/60 bg-white/80 dark:bg-slate-800/80 dark:text-slate-100 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-700 backdrop-blur-sm shadow-sm hover:shadow-md',
          error && 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20',
          inputClassName,
        )}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-start">
          <svg
            className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
