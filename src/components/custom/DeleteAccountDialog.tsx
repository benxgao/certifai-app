'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useDeleteAccount } from '@/src/swr/deleteAccount';
import { toastHelpers } from '@/src/lib/toast';

interface DeleteAccountDialogProps {
  trigger: React.ReactNode;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({ trigger }) => {
  const { firebaseUser, apiUserId } = useFirebaseAuth();
  const { trigger: deleteAccount, isMutating } = useDeleteAccount(apiUserId);

  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [step, setStep] = useState<'warning' | 'confirmation'>('warning');

  const userEmail = firebaseUser?.email || '';
  const isConfirmationValid = confirmationText === 'DELETE MY ACCOUNT';

  const handleDelete = async () => {
    if (!isConfirmationValid) {
      toastHelpers.error.generic('Please type the confirmation text exactly as shown.');
      return;
    }

    try {
      await deleteAccount();

      // Success is handled in the hook's onSuccess callback
      toastHelpers.success.accountDeleted();

      // Close dialog
      setIsOpen(false);
    } catch (error: any) {
      toastHelpers.error.generic(error?.message || 'Failed to delete account. Please try again.');
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      setStep('warning');
      setConfirmationText('');
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {step === 'warning' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Delete Your Account
              </DialogTitle>
              <DialogDescription className="text-left">
                This action will permanently delete your account and cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <h4 className="font-semibold text-destructive mb-2">What will be deleted:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Your user profile and account information</li>
                  <li>• All exam attempts and progress</li>
                  <li>• All certification registrations</li>
                  <li>• All saved answers and results</li>
                  <li>• Your authentication credentials</li>
                </ul>
              </div>

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Before you continue:
                </h4>
                <ul className="text-sm space-y-1 text-yellow-700 dark:text-yellow-300">
                  <li>• Export any data you want to keep</li>
                  <li>• Cancel any active subscriptions</li>
                  <li>• This action cannot be reversed</li>
                </ul>
              </div>

              <div className="text-sm text-muted-foreground">
                <strong>Account:</strong> {userEmail}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setStep('confirmation')}>
                Continue
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'confirmation' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Final Confirmation
              </DialogTitle>
              <DialogDescription className="text-left">
                To confirm deletion, please type{' '}
                <code className="font-mono font-semibold bg-muted px-1 py-0.5 rounded">
                  DELETE MY ACCOUNT
                </code>{' '}
                in the field below.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="confirmation">Confirmation Text</Label>
                <Input
                  id="confirmation"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                  className={`mt-1 ${
                    confirmationText && !isConfirmationValid
                      ? 'border-destructive focus:ring-destructive'
                      : ''
                  }`}
                />
                {confirmationText && !isConfirmationValid && (
                  <p className="text-sm text-destructive mt-1">
                    Please type exactly: DELETE MY ACCOUNT
                  </p>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                <strong>Account to be deleted:</strong> {userEmail}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('warning')}>
                Back
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={!isConfirmationValid || isMutating}
              >
                {isMutating ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Deleting Account...
                  </div>
                ) : (
                  'Delete My Account'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
