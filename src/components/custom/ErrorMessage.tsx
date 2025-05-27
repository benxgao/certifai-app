import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react'; // Using AlertTriangle icon

interface ErrorMessageProps {
  error: Error | string | null | undefined;
  className?: string;
  title?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className, title = 'Error' }) => {
  if (!error) {
    return null;
  }

  const message = typeof error === 'string' ? error : error.message;

  if (!message) {
    return null;
  }

  return (
    <Alert variant="destructive" className={`my-2 ${className || ''}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ErrorMessage;
