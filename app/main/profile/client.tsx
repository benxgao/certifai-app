'use client';

import React from 'react';
import { useProfileData } from '@/src/hooks/useProfileData'; // Updated import
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CoinsIcon, ZapIcon, CalendarIcon, UserIcon } from 'lucide-react';

const ProfileSkeleton: React.FC = () => (
  <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-3">
    <div className="lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="lg:col-span-2 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Account Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

const TokenCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}> = ({ title, value, icon, color, description }) => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </CardContent>
  </Card>
);

const ProfileClientPage: React.FC = () => {
  // Use useProfileData hook
  const {
    profile,
    isLoading,
    isError, // Renamed from error to isError to match useProfileData
    error, // Added error object from useProfileData
    displayName,
    email,
  } = useProfileData();

  // isLoading is now directly from useProfileData
  if (isLoading) {
    return (
      <div
        id="profile-container"
        className="flex flex-col min-h-screen bg-background text-foreground pt-16"
      >
        <main id="profile-main-content" className="container mx-auto px-4 py-6 md:px-6 md:py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>
          <ProfileSkeleton />
        </main>
      </div>
    );
  }

  // isError and error are now from useProfileData
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was an error loading your profile. Please try again later.</p>
            {error && <p className="text-sm text-muted-foreground">{error.message}</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  // profile is now directly from useProfileData
  if (!profile) {
    return null;
  }

  const registrationDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div
      id="profile-container"
      className="flex flex-col min-h-screen bg-background text-foreground pt-16"
    >
      <main id="profile-main-content" className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        </div>

        <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={profile.avatar_url || undefined}
                      alt={displayName || 'User'}
                    />
                    <AvatarFallback>{displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{displayName}</h2>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>{profile.role || 'User'}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Joined on {registrationDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TokenCard
                    title="Credit Tokens"
                    value={profile.credit_tokens || 0}
                    icon={<CoinsIcon className="h-6 w-6 text-yellow-500" />}
                    color="bg-yellow-100 dark:bg-yellow-900"
                    description="Tokens for generating certifications"
                  />
                  <TokenCard
                    title="Energy Tokens"
                    value={profile.energy_tokens || 0}
                    icon={<ZapIcon className="h-6 w-6 text-blue-500" />}
                    color="bg-blue-100 dark:bg-blue-900"
                    description="Tokens for AI interactions"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <Badge variant="outline">{profile.user_id}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subscription Plan:</span>
                  <Badge variant="secondary">{profile.subscription_plan || 'Free Tier'}</Badge>
                </div>
                {/* Add more account details as needed */}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileClientPage;
