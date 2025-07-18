'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { toastHelpers } from '@/src/lib/toast';
import { useEmailUpdate } from '@/src/hooks/useEmailUpdate';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

interface EmailUpdateDialogProps {
  trigger?: React.ReactNode;
  className?: string;
}

const EmailUpdateDialog: React.FC<EmailUpdateDialogProps> = ({ trigger, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);

  const { firebaseUser } = useFirebaseAuth();
  const { isUpdating, error, success, updateEmail, clearMessages } = useEmailUpdate();

  const handleEmailUpdate = async () => {
    if (!newEmail.trim()) return;

    // First try without password
    const result = await updateEmail(newEmail, requiresPassword ? currentPassword : undefined);

    if (result) {
      // Show success toast notification
      toastHelpers.success.emailVerificationSent();

      // Success - close dialog and reset form
      setIsOpen(false);
      setNewEmail('');
      setCurrentPassword('');
      setRequiresPassword(false);
    } else if (error?.includes('requires-recent-login') && !requiresPassword) {
      // Show info toast for reauthentication requirement
      toastHelpers.info.passwordRequired();

      // Need to reauthenticate
      setRequiresPassword(true);
      clearMessages();
    } else if (error && !error.includes('requires-recent-login')) {
      // Show error toast for other types of errors
      toastHelpers.error.generic(error || 'Email update failed. Please try again.');
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setNewEmail('');
    setCurrentPassword('');
    setRequiresPassword(false);
    clearMessages();
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className={className}>
      <Mail className="h-4 w-4 mr-2" />
      Update Email
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Update Email Address
          </DialogTitle>
          <DialogDescription>
            We&apos;ll send a verification email to your new address. You&apos;ll need to verify it
            before the change takes effect.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Email Info */}
          <Card className="bg-slate-50 dark:bg-slate-900/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Email</p>
                  <p className="text-sm text-muted-foreground">{firebaseUser?.email}</p>
                </div>
                <div className="flex items-center gap-1">
                  {firebaseUser?.emailVerified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600">Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <span className="text-xs text-amber-600">Unverified</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Email Input */}
          <div className="space-y-2">
            <Label htmlFor="newEmail">New Email Address</Label>
            <Input
              id="newEmail"
              type="email"
              placeholder="Enter new email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={isUpdating}
            />
          </div>

          {/* Password Input (conditional) */}
          {requiresPassword && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isUpdating}
              />
              <p className="text-sm text-muted-foreground">
                For security reasons, please enter your current password to continue.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-100">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Security Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Security Notice</p>
                <p>
                  You&apos;ll receive a verification email at your new address. Your email
                  won&apos;t change until you click the verification link.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleDialogClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button
            onClick={handleEmailUpdate}
            disabled={
              !newEmail.trim() || isUpdating || (requiresPassword && !currentPassword.trim())
            }
          >
            {isUpdating ? 'Sending...' : 'Send Verification Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailUpdateDialog;
