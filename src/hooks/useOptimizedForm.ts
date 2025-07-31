import { useState, useCallback, useMemo } from 'react';

export interface FormValidation {
  [key: string]: boolean;
}

export interface UseOptimizedFormOptions<T> {
  initialValues: T;
  validators?: {
    [K in keyof T]?: (value: T[K]) => boolean;
  };
  onSubmit?: (values: T) => Promise<void> | void;
}

export function useOptimizedForm<T extends Record<string, any>>({
  initialValues,
  validators = {},
  onSubmit,
}: UseOptimizedFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Memoized validation results
  const validation = useMemo(() => {
    const result: FormValidation = {};
    let isFormValid = true;

    Object.keys(values).forEach((key) => {
      const validator = validators[key];
      if (validator) {
        result[key] = validator(values[key]);
        if (!result[key]) {
          isFormValid = false;
        }
      } else {
        result[key] = true;
      }
    });

    return { ...result, isFormValid };
  }, [values, validators]);

  // Optimized onChange handler
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;

      setValues((prev) => ({ ...prev, [name]: newValue }));
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors],
  );

  // Optimized blur handler for validation feedback
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  // Submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validation.isFormValid || !onSubmit) {
        return;
      }

      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } catch (error) {
      } finally {
        setIsSubmitting(false);
      }
    },
    [validation.isFormValid, onSubmit, values],
  );

  return {
    values,
    errors,
    touched,
    validation,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
  };
}
