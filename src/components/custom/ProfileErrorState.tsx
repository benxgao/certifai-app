'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, User } from 'lucide-react';
import { useProfileData } from '@/src/hooks/useProfileData';

interface ProfileErrorStateProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  className?: string;
}

export const ProfileErrorState: React.FC<ProfileErrorStateProps> = ({
  title = 'Profile Loading Failed',
  message = 'We encountered an issue loading your profile information. Some features may be limited.',
  showRetry = true,
  className = '',
}) => {
  const { mutate } = useProfileData();

  return (
    <Card className={`border-orange-200 dark:border-orange-800 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
          <AlertTriangle className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-orange-700 dark:text-orange-300">{message}</p>

        {showRetry && (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => mutate()}
              className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              Retry Loading
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.reload()}
              className="text-orange-700 hover:bg-orange-50"
            >
              Refresh Page
            </Button>
          </div>
        )}

        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-start space-x-2">
            <User className="h-4 w-4 text-orange-600 mt-0.5" />
            <div className="text-xs text-orange-800 dark:text-orange-200">
              <p className="font-medium mb-1">Available functionality:</p>
              <ul className="space-y-1 text-orange-700 dark:text-orange-300">
                <li>• View and manage certifications</li>
                <li>• Access exam materials</li>
                <li>• Browse available courses</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileErrorState;
