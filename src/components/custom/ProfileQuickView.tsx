'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProfileData } from '@/src/hooks/useProfileData';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileQuickViewProps {
  className?: string;
  showActions?: boolean;
  compact?: boolean;
}

export const ProfileQuickView: React.FC<ProfileQuickViewProps> = ({
  className = '',
  showActions = true,
  compact = false,
}) => {
  const { profile, isLoading, isError, mutate, displayName, email } = useProfileData();
  const router = useRouter();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !profile) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">Unable to load profile information</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => mutate()}
              className="flex items-center gap-2"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{displayName}</span>
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Overview
          </div>
          {showActions && (
            <Button variant="ghost" size="sm" onClick={() => router.push('/main/profile')}>
              View Full Profile
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-500 flex items-center justify-center text-white font-medium">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-sm">{displayName}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            Active Account
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileQuickView;
