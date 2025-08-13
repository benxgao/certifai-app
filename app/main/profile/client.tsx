'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion';
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

          {/* Profile Loading Skeleton */}
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
            <Accordion type="multiple" defaultValue={['personal']} className="w-full space-y-4">
              {/* Personal Information Section */}
              <AccordionItem
                value="personal"
                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-slate-200/60 [&[data-state=open]]:dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                        Personal Information
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Manage your basic profile details and information
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Full Name
                      </label>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {displayName || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email
                      </label>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {email || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <EditableDisplayName
                      currentDisplayName={displayName || 'User'}
                      onNameUpdate={handleNameUpdate}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Account Information Section */}
              <AccordionItem
                value="account"
                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-slate-200/60 [&[data-state=open]]:dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                        Account Information
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        View account details, billing, and activity
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        User ID:
                      </span>
                      <Badge variant="outline" className="font-mono text-xs w-fit">
                        {profile.user_id}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Registration Date:
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {registrationDate}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <h4 className="text-base font-medium text-slate-900 dark:text-slate-100">
                          Billing & Subscription
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Manage your subscription and view payment history
                        </p>
                      </div>
                      <Link href="/main/billing">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Manage Billing
                        </Button>
                      </Link>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Settings Section */}
              <AccordionItem
                value="settings"
                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-slate-200/60 [&[data-state=open]]:dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                        Account Settings
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Security, notifications, and privacy preferences
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 space-y-6">
                  {/* Account Security */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-3 border-b border-slate-200/60 dark:border-slate-700/60">
                    <div>
                      <h5 className="font-medium text-sm text-slate-900 dark:text-slate-100">
                        Password
                      </h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Update your password
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Change Password
                    </Button>
                  </div>

                  {/* Privacy Settings */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-3">
                    <div>
                      <h5 className="font-medium text-sm text-destructive">Delete Account</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Permanently delete your account
                      </p>
                    </div>
                    <DeleteAccountDialog
                      trigger={
                        <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                          Delete
                        </Button>
                      }
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DashboardCardContent>
        </DashboardCard>
      </div>
    </div>
  );
};

export default ProfileClientPage;
