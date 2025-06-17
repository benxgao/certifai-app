'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/src/components/ui/badge';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useUserProfileContext } from '@/src/context/UserProfileContext';
import { useUpdateUserProfile } from '@/src/swr/profile';
import { Settings, Save, RefreshCw } from 'lucide-react';

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
              <RefreshCw className="h-4 w-4" />
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
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {success && <div className="text-green-600 text-sm">{success}</div>}
        {errorMsg && <div className="text-destructive text-sm">{errorMsg}</div>}

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
            <Input id="email" value={formData.email} disabled={true} placeholder="Email address" />
            <p className="text-xs text-muted-foreground">
              Email address cannot be changed here. Please use Firebase Authentication settings.
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
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
            >
              Active Account
            </Badge>
            {firebaseUser?.emailVerified && (
              <Badge
                variant="default"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              >
                Email Verified
              </Badge>
            )}
            {profile && (
              <Badge variant="secondary">
                {profile.credit_tokens + profile.energy_tokens} Total Tokens
              </Badge>
            )}
          </div>
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
