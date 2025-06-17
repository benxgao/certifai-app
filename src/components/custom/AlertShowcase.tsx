import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Info, AlertCircle, XCircle } from 'lucide-react';

interface AlertShowcaseProps {
  className?: string;
}

/**
 * AlertShowcase component demonstrating all available alert variants
 * with the new color system (success, warning, info, error, default)
 */
const AlertShowcase: React.FC<AlertShowcaseProps> = ({ className }) => {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Success Alert */}
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your profile has been updated successfully. All changes have been saved.
        </AlertDescription>
      </Alert>

      {/* Warning Alert */}
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Your exam session will expire in 5 minutes. Please submit your answers soon.
        </AlertDescription>
      </Alert>

      {/* Info Alert */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          New practice questions are available for this certification. Check them out to improve
          your score.
        </AlertDescription>
      </Alert>

      {/* Error/Destructive Alert */}
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load exam data. Please check your connection and try again.
        </AlertDescription>
      </Alert>

      {/* Default Alert */}
      <Alert variant="default">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Notice</AlertTitle>
        <AlertDescription>This is a general notification with default styling.</AlertDescription>
      </Alert>
    </div>
  );
};

export default AlertShowcase;
