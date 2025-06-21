'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/src/components/ui/badge';
import { sendEmailVerification } from 'firebase/auth';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useUserProfileContext } from '@/src/context/UserProfileContext';
import { useUpdateUserProfile } from '@/src/swr/profile';
import { Settings } from 'lucide-react';
import EmailUpdateDialog from './EmailUpdateDialog';

interface ProfileSettingsProps {
  className?: string;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ className }) => {
  const { firebaseUser } = useFirebaseAuth();
  const { profile, mutate } = useUserProfileContext();
  const userId = firebaseUser?.uid || null;

  const { trigger: updateProfile, isMutating } = useUpdateUserProfile(userId);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: firebaseUser?.displayName || '',
    email: firebaseUser?.email || '',
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const handleResendVerification = async () => {
    if (!firebaseUser) return;

    try {
      setVerificationLoading(true);
      // Configure action code settings to use the new URL structure
      const actionCodeSettings = {
        url: `${window.location.origin}?mode=verifyEmail`,
        handleCodeInApp: true,
      };
      await sendEmailVerification(firebaseUser, actionCodeSettings);
      setSuccess('Verification email sent! Please check your inbox.');
      setErrorMsg(null);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      setErrorMsg('Failed to send verification email. Please try again.');
      setSuccess(null);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleSave = async () => {
    setSuccess(null);
    setErrorMsg(null);
    try {
      // Call the update profile mutation (only displayName is editable here)
      await updateProfile({ displayName: formData.displayName });
      setSuccess('Profile updated successfully!');
      await mutate();
      setIsEditing(false);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: firebaseUser?.displayName || '',
      email: firebaseUser?.email || '',
    });
    setIsEditing(false);
  };

  const handleRefresh = async () => {
    await mutate();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Profile Settings
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isMutating}>
              Refresh
            </Button>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel} disabled={isMutating}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isMutating}>
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {success && <div className="text-green-600 dark:text-green-400 text-sm">{success}</div>}
        {errorMsg && <div className="text-red-600 dark:text-red-400 text-sm">{errorMsg}</div>}

        {/* Basic Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
              disabled={!isEditing}
              placeholder="Enter your display name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                value={formData.email}
                disabled={true}
                placeholder="Email address"
                className="flex-1"
              />
              <EmailUpdateDialog
                trigger={
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Click &quot;Update&quot; to change your email address. A verification email will be
              sent to the new address.
            </p>
          </div>
        </div>

        <Separator />

        {/* Account Status */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Account Status</h4>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="default"
              className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-100"
            >
              Active Account
            </Badge>
            {firebaseUser?.emailVerified ? (
              <Badge
                variant="default"
                className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100"
              >
                Email Verified
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-100"
              >
                Email Unverified
              </Badge>
            )}
            {profile && (
              <Badge variant="secondary">
                {profile.credit_tokens + profile.energy_tokens} Total Tokens
              </Badge>
            )}
          </div>

          {/* Email verification actions */}
          {!firebaseUser?.emailVerified && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800/50 shadow-sm">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-100 mb-1">
                    Email verification required
                  </h5>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200 mb-3">
                    Please verify your email address to secure your account and access all features.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleResendVerification}
                      disabled={verificationLoading}
                      size="sm"
                      variant="outline"
                      className="bg-white hover:bg-yellow-50 border-yellow-300 text-yellow-800 hover:text-yellow-900 transition-all duration-200 hover:shadow-md"
                    >
                      {verificationLoading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-3 w-3"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 1.26a2 2 0 001.78-1.89V4a2 2 0 011.78-1.89L22 3.74"
                            />
                          </svg>
                          Resend verification email
                        </div>
                      )}
                    </Button>
                    <div className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                      Check your spam folder if you don&apos;t see the email
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Account Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Account Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Account Provider</p>
              <p className="font-medium capitalize">
                {firebaseUser?.providerData?.[0]?.providerId?.replace('.com', '') || 'Email'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
