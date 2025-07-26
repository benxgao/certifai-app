'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { Brain, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { getSubscriberIdFromClaims } from '@/src/lib/auth-claims-client';
import { saveSubscriberIdToClaims } from '@/src/lib/marketing-claims';

interface AdaptiveLearningInterestModalProps {
  trigger?: React.ReactNode;
}

const AdaptiveLearningInterestModal: React.FC<AdaptiveLearningInterestModalProps> = ({
  trigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { firebaseUser } = useFirebaseAuth();

  const handleSubmit = async () => {
    if (!firebaseUser) {
      setError('Please sign in to continue');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get Firebase ID token for authentication
      const idToken = await firebaseUser.getIdToken();

      // Get or create subscriber_id
      let subscriberId = await getSubscriberIdFromClaims();

      if (!subscriberId) {
        // Get user's display name for first/last name
        const displayName = firebaseUser.displayName || '';
        const [firstName, ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');

        // Call marketing subscribe API to create subscriber
        const subscribeResponse = await fetch('/api/marketing/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: firebaseUser.email,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            userAgent: navigator.userAgent,
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (!subscribeResponse.ok) {
          throw new Error('Failed to create subscriber');
        }

        const subscribeResult = await subscribeResponse.json();
        if (subscribeResult.success && subscribeResult.subscriberId) {
          subscriberId = subscribeResult.subscriberId;
          if (subscriberId) {
            await saveSubscriberIdToClaims(subscriberId, firebaseUser);
          }
        } else {
          throw new Error('Failed to create subscriber');
        }
      }

      if (!subscriberId) {
        throw new Error('Failed to obtain subscriber ID');
      }

      // Join the adaptive learning group
      const response = await fetch('/api/join-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          subscriberId: subscriberId,
          groupName: 'stay-tuned',
          feedback: feedback.trim() || undefined,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        throw new Error('Failed to join group');
      }

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        toast.success('Thank you! You will be notified when adaptive learning is ready.');

        setTimeout(() => {
          setIsOpen(false);
          resetForm();
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to join group');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to join group. Please try again.');
      toast.error('Failed to join group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFeedback('');
    setError(null);
    setSuccess(false);
  };

  const handleDialogClose = (open: boolean) => {
    if (!isSubmitting) {
      setIsOpen(open);
      if (!open) {
        resetForm();
      }
    }
  };

  const defaultTrigger = (
    <Button
      variant="default"
      size="default"
      className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
    >
      <Sparkles className="mr-2 h-4 w-4" />
      Notify Me of Progress
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-600" />
            Get Notified About Adaptive Learning
          </DialogTitle>
          <DialogDescription>
            Be the first to know when our adaptive learning engine launches.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    You are all set!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    We will notify you when adaptive learning is ready.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">
                Share any feedback or features you would like to see (optional):
              </p>
              <Textarea
                placeholder="What features would you like to see in adaptive learning?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {!success && (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Notify Me
                </div>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdaptiveLearningInterestModal;
