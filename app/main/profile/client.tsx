'use client';

import React, { useState, useEffect } from 'react';
import { useProfileData } from '@/src/hooks/useProfileData'; // Updated import
import { useDisplayNameUpdate } from '@/src/hooks/useDisplayNameUpdate';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Checkbox } from '@/src/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import {
  CalendarIcon,
  UserIcon,
  Settings,
  Award,
  Shield,
  Bell,
  Edit3,
  Check,
  CreditCard,
} from 'lucide-react';
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';
import EmailUpdateDialog from '@/src/components/custom/EmailUpdateDialog';
import Breadcrumb from '@/components/custom/Breadcrumb';
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardContent,
} from '@/src/components/ui/dashboard-card';
import DeleteAccountDialog from '@/src/components/custom/DeleteAccountDialog';
import {
  PricingPlansGrid,
  SubscriptionManagementCard,
  SubscriptionStatusCard,
} from '@/src/stripe/client/components';
import { useUnifiedAccountData } from '@/src/stripe/client/swr';
import { isFeatureEnabled } from '@/src/config/featureFlags';

const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Profile Header Skeleton */}
    <div className="bg-gradient-to-r from-violet-50 to-violet-50 dark:from-violet-950/30 dark:to-violet-900/40 border border-violet-100 dark:border-violet-800/50 rounded-xl p-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-20" />
        </div>
      </div>
    </div>

    {/* Profile Content Skeleton */}
    <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-700/50 dark:to-slate-600/30">
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  </div>
);

const EditableDisplayName: React.FC<{
  currentDisplayName: string;
  onNameUpdate: () => void;
}> = ({ currentDisplayName, onNameUpdate }) => {
  const [newName, setNewName] = useState(currentDisplayName);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isUpdating, error, updateDisplayName, clearError } = useDisplayNameUpdate();

  const handleSave = async () => {
    const success = await updateDisplayName(newName);
    if (success) {
      setIsDialogOpen(false);
      onNameUpdate(); // Trigger a refresh of the profile data
    }
  };

  const handleCancel = () => {
    setNewName(currentDisplayName);
    setIsDialogOpen(false);
    clearError();
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      handleCancel();
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit3 className="w-4 h-4" />
          Edit Name
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Display Name</DialogTitle>
          <DialogDescription>
            Update your display name. This will be visible to other users.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter your display name"
              disabled={isUpdating}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUpdating || !newName.trim() || newName.trim() === currentDisplayName}
            className="flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <LoadingSpinner size="sm" />
                Updating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProfileClientPage: React.FC = () => {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Use useProfileData hook
  const {
    profile,
    isLoading,
    isError, // Renamed from error to isError to match useProfileData
    error, // Added error object from useProfileData
    displayName,
    email,
    mutate, // Add mutate function for refreshing profile data
  } = useProfileData();

  // Use subscription state for billing integration
  const {
    accountData,
    hasActiveSubscription,
    isTrialing,
    isCanceled,
    subscriptionStatus,
    isLoading: stripeLoading,
    error: stripeError,
  } = useUnifiedAccountData();

  // Handle name update with profile refresh
  const handleNameUpdate = () => {
    // Trigger a refresh of the profile data after name update
    if (mutate) {
      mutate();
    }
  };

  // Show spinner initially, then transition to skeleton after a delay
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowSkeleton(true);
      }, 800); // Show spinner for 800ms, then transition to skeleton

      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(false);
    }
  }, [isLoading]);

  // isLoading is now directly from useProfileData
  if (isLoading) {
    // Show centered spinner initially
    if (!showSkeleton) {
      return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="flex flex-col items-center space-y-6 text-center max-w-md mx-auto loading-fade-in">
              <div className="relative">
                <LoadingSpinner size="xl" variant="primary" className="loading-glow" />
                <div className="absolute -inset-4 bg-violet-500/10 rounded-full blur-xl animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-normal text-foreground">Loading Profile</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Please wait while we fetch your profile data and personalized information...
                </p>
                <div className="flex items-center justify-center space-x-1 mt-4">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Show skeleton loading after initial spinner
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/main' },
              { label: 'Profile', current: true },
            ]}
          />

          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  // isError and error are now from useProfileData
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
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
        </div>
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

  // Helper to derive subscription display properties
  const getSubscriptionDisplay = () => {
    if (!hasActiveSubscription) {
      return {
        planName: 'Free Tier',
        statusText: 'Inactive',
        variant: 'outline' as const,
      };
    }

    const planName = accountData?.stripe_plan_name || 'Premium';

    // These booleans should reflect cancel_at_period_end, etc.
    if (isCanceled) {
      return { planName, statusText: 'Canceling', variant: 'destructive' as const };
    }
    if (isTrialing) {
      return { planName, statusText: 'Trial', variant: 'secondary' as const };
    }

    // Use the more specific status from Stripe's subscription object
    switch (subscriptionStatus) {
      case 'active':
        return { planName, statusText: 'Active', variant: 'default' as const };
      case 'past_due':
        return { planName, statusText: 'Past Due', variant: 'destructive' as const };
      case 'unpaid':
        return { planName, statusText: 'Unpaid', variant: 'destructive' as const };
      default:
        // Fallback for any other status, ensures UI is stable
        return { planName, statusText: 'Active', variant: 'default' as const };
    }
  };

  const subscriptionDisplay = getSubscriptionDisplay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/main' },
            { label: 'Profile', current: true },
          ]}
        />

        {/* Welcome Section */}
        <DashboardCard>
          <DashboardCardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
              <div className="flex items-center space-x-3 md:space-x-4">
                <Avatar className="w-12 h-12 md:w-16 md:h-16 border-2 border-violet-200/60 dark:border-violet-700/60 shadow-sm">
                  <AvatarImage src={profile.avatar_url || undefined} alt={displayName || 'User'} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-600 to-blue-600 text-white font-normal text-base md:text-lg">
                    {displayName?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl md:text-2xl font-medium text-slate-900 dark:text-slate-100 mb-1 md:mb-2">
                    Welcome back, {displayName}!
                  </h1>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="block sm:inline">{email}</span>
                    <span className="hidden sm:inline"> • </span>
                    <span className="block sm:inline">{subscriptionDisplay.planName}</span>
                    {hasActiveSubscription && (
                      <>
                        <span className="hidden sm:inline"> • </span>
                        <span className="block sm:inline">{subscriptionDisplay.statusText}</span>
                      </>
                    )}
                    <span className="hidden sm:inline"> • </span>
                    <span className="block sm:inline">Member since {registrationDate}</span>
                  </p>
                </div>
              </div>
            </div>
          </DashboardCardHeader>
        </DashboardCard>

        {/* Profile Content */}
        <DashboardCard>
          <DashboardCardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-normal text-slate-900 dark:text-slate-50">
                  Account Settings
                </h2>
              </div>
            </div>
          </DashboardCardHeader>

          <DashboardCardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Improved TabsList */}
              <div className="relative mb-6">
                <TabsList className="w-full h-auto p-1 bg-slate-50 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-sm rounded-lg md:grid md:grid-cols-4 overflow-x-auto scrollbar-none">
                  <div className="flex md:contents min-w-max md:min-w-0">
                    <TabsTrigger
                      value="personal"
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-normal whitespace-nowrap transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-700/80 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-600 rounded-md"
                    >
                      <UserIcon className="w-4 h-4 shrink-0" />
                      <span>Personal</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="account"
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-normal whitespace-nowrap transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-700/80 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-600 rounded-md"
                    >
                      <Award className="w-4 h-4 shrink-0" />
                      <span>Account</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="billing"
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-normal whitespace-nowrap transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-700/80 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-600 rounded-md"
                    >
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span>Billing</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-normal whitespace-nowrap transition-all duration-200 hover:bg-white/80 dark:hover:bg-slate-700/80 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-600 rounded-md"
                    >
                      <Settings className="w-4 h-4 shrink-0" />
                      <span>Settings</span>
                    </TabsTrigger>
                  </div>
                </TabsList>
              </div>{' '}
              {/* Personal Information Tab */}
              <TabsContent value="personal">
                <Card className="border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-normal text-slate-900 dark:text-slate-100">
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                      <h3 className="text-base font-normal text-slate-900 dark:text-slate-100 mb-4">
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-normal text-slate-700 dark:text-slate-300">
                            Full Name
                          </label>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {displayName || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-normal text-slate-700 dark:text-slate-300">
                            Email
                          </label>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {email || 'Not provided'}
                            </p>
                            <EmailUpdateDialog
                              trigger={
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                  Update
                                </Button>
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-normal text-slate-700 dark:text-slate-300">
                            User Role
                          </label>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {profile.role || 'User'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-normal text-slate-700 dark:text-slate-300">
                            Registration Date
                          </label>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {registrationDate}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        <EditableDisplayName
                          currentDisplayName={displayName || 'User'}
                          onNameUpdate={handleNameUpdate}
                        />
                        <Button variant="outline" className="text-sm">
                          Edit Information
                        </Button>
                      </div>
                    </div>

                    {/* Profile Picture */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                      <h3 className="text-base font-normal text-slate-900 dark:text-slate-100 mb-4">
                        Profile Picture
                      </h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Avatar className="h-16 w-16 md:h-20 md:w-20 mx-auto sm:mx-0 border-2 border-primary/20 shadow-sm">
                          <AvatarImage
                            src={profile.avatar_url || undefined}
                            alt={displayName || 'User'}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-base md:text-lg">
                            {displayName?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 text-center sm:text-left flex-1">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Upload a new profile picture
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 w-full sm:w-auto"
                          >
                            Change Picture
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Subscription */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                      <h3 className="text-base font-normal text-slate-900 dark:text-slate-100 mb-4">
                        Subscription Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-normal text-slate-700 dark:text-slate-300">
                            Current Plan
                          </label>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {profile.subscription_plan || 'Free Tier'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Status
                          </label>
                          <div className="mt-1">
                            <Badge variant="secondary">Active</Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 w-full sm:w-auto"
                      >
                        Manage Subscription
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Account Tab */}
              <TabsContent value="account">
                <Card className="border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-normal text-slate-900 dark:text-slate-100">
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-6">
                    {/* Account Details */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                      <h3 className="text-base font-normal text-slate-900 dark:text-slate-100 mb-4">
                        Account Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="text-sm font-normal">User ID:</span>
                          <Badge variant="outline" className="font-mono text-xs w-fit">
                            {profile.user_id}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="text-sm font-normal">Account Type:</span>
                          <Badge variant="secondary" className="w-fit">
                            {profile.role || 'User'}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="text-sm font-normal">Registration Date:</span>
                          <span className="text-sm text-muted-foreground">{registrationDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Information */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                      <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-4">
                        Subscription Information
                      </h3>
                      <div className="space-y-3 mb-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="text-sm font-medium">Current Plan:</span>
                          <Badge variant="default" className="w-fit">
                            {subscriptionDisplay.planName}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <span className="text-sm font-medium">Plan Status:</span>
                          <Badge variant={subscriptionDisplay.variant} className="w-fit">
                            {subscriptionDisplay.statusText}
                          </Badge>
                        </div>
                        {hasActiveSubscription &&
                          accountData &&
                          accountData.stripe_current_period_end && (
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <span className="text-sm font-medium">Next Billing:</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(
                                  accountData.stripe_current_period_end * 1000,
                                ).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => setActiveTab('billing')}
                      >
                        {hasActiveSubscription ? 'Manage Billing' : 'Upgrade Plan'}
                      </Button>
                    </div>

                    {/* Account Activity */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                      <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-4">
                        Account Activity
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">Recent account activity</p>
                      <div className="border rounded-lg p-3 bg-white dark:bg-slate-800 shadow-sm">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-sm">Last login: Today</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Billing Tab */}
              <TabsContent value="billing">
                <div className="space-y-6">
                  {isFeatureEnabled('is_stripe_enabled') ? (
                    <>
                      {/* Subscription Status */}
                      <SubscriptionStatusCard />

                      {hasActiveSubscription && (
                        <>
                          <SubscriptionManagementCard />
                        </>
                      )}

                      <Card className="border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-lg font-normal text-slate-900 dark:text-slate-100">
                            {hasActiveSubscription ? 'Change Plan' : 'Choose Your Plan'}
                          </CardTitle>
                          {hasActiveSubscription && (
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Upgrade or downgrade your subscription plan
                            </p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <PricingPlansGrid />
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    // Feature Disabled Fallback
                    <Card className="border border-slate-100 dark:border-slate-700/50 shadow-sm">
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <CreditCard className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            Billing Management Unavailable
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card className="border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-6">
                    {/* Account Security */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                        <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
                          Account Security
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {[
                          {
                            title: 'Password',
                            description: 'Update your password',
                            button: 'Change Password',
                          },
                          {
                            title: 'Two-Factor Authentication',
                            description: 'Add an extra layer of security',
                            button: 'Enable 2FA',
                          },
                          {
                            title: 'Login Sessions',
                            description: 'Manage your active sessions',
                            button: 'View Sessions',
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              {item.button}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                            <Bell className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                              Notification Preferences
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Choose how you want to receive updates
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-6">
                        {[
                          {
                            name: 'Email Notifications',
                            description:
                              'Receive exam updates, certification progress, and course announcements',
                            enabled: true,
                            category: 'primary',
                          },
                          {
                            name: 'Browser Notifications',
                            description:
                              'Get real-time alerts in your browser for time-sensitive updates',
                            enabled: false,
                            category: 'secondary',
                          },
                          {
                            name: 'Security Alerts',
                            description:
                              'Important notifications about account security and login activity',
                            enabled: true,
                            category: 'security',
                          },
                        ].map((setting, index) => (
                          <div key={index} className="group">
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                              <div className="flex items-center pt-0.5">
                                <Checkbox
                                  id={`notification-${index}`}
                                  defaultChecked={setting.enabled}
                                  className="scale-110"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <label
                                    htmlFor={`notification-${index}`}
                                    className="text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer"
                                  >
                                    {setting.name}
                                  </label>
                                  {setting.category === 'security' && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                    >
                                      Required
                                    </Badge>
                                  )}
                                  {setting.category === 'primary' && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                    >
                                      Recommended
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                  {setting.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Changes are saved automatically
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                          >
                            Manage Email Preferences
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                      <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-4">
                        Privacy Settings
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            title: 'Profile Visibility',
                            description: 'Control who can see your profile',
                            button: 'Manage',
                            variant: 'outline' as const,
                          },
                          {
                            title: 'Data Export',
                            description: 'Download your account data',
                            button: 'Export',
                            variant: 'outline' as const,
                          },
                          {
                            title: 'Delete Account',
                            description: 'Permanently delete your account',
                            button: 'Delete',
                            variant: 'destructive' as const,
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                          >
                            <div className="flex-1">
                              <h4
                                className={`font-medium text-sm ${
                                  item.variant === 'destructive'
                                    ? 'text-destructive'
                                    : 'text-foreground'
                                }`}
                              >
                                {item.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            {item.title === 'Delete Account' ? (
                              <DeleteAccountDialog
                                trigger={
                                  <Button
                                    variant={item.variant}
                                    size="sm"
                                    className="w-full sm:w-auto"
                                  >
                                    {item.button}
                                  </Button>
                                }
                              />
                            ) : (
                              <Button variant={item.variant} size="sm" className="w-full sm:w-auto">
                                {item.button}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DashboardCardContent>
        </DashboardCard>
      </div>
    </div>
  );
};

export default ProfileClientPage;
