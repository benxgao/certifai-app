'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface AdaptiveLearningInterestModalProps {
  trigger?: React.ReactNode;
}

const AdaptiveLearningInterestModal: React.FC<AdaptiveLearningInterestModalProps> = ({
  trigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { firebaseUser } = useFirebaseAuth();

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/marketing/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          userAgent: navigator.userAgent,
          fields: {
            source: 'adaptive-learning-interest',
            interests: interests.trim() || 'General interest in adaptive learning features',
            signup_date: new Date().toISOString().split('T')[0],
            user_id: firebaseUser?.uid || 'anonymous',
          },
          groups: ['stay-tuned', 'adaptive-learning-beta'],
          status: 'active',
        }),
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        toast.success(
          'Thank you for your interest! We&apos;ll keep you updated on our adaptive learning features.',
        );

        // Close dialog after short delay
        setTimeout(() => {
          setIsOpen(false);
          resetForm();
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to submit interest');
      }
    } catch (err: any) {
      console.error('Failed to submit adaptive learning interest:', err);
      setError(err.message || 'Failed to submit your interest. Please try again.');
      toast.error('Failed to submit your interest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setInterests('');
    setError(null);
    setSuccess(false);
  };

  const handleDialogClose = () => {
    if (!isSubmitting) {
      setIsOpen(false);
      resetForm();
    }
  };

  // Pre-fill email if user is authenticated
  React.useEffect(() => {
    if (firebaseUser?.email && !email) {
      setEmail(firebaseUser.email);
    }
  }, [firebaseUser, email]);

  const defaultTrigger = (
    <Button
      variant="default"
      size="sm"
      className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <Sparkles className="mr-2 h-4 w-4" />
      Stay Updated
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-600" />
            Get Notified About Adaptive Learning
          </DialogTitle>
          <DialogDescription>
            Be the first to know when our revolutionary adaptive learning engine launches.
            We&apos;ll send you updates on development progress and early access opportunities.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    Thank you for your interest!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    We&apos;ll keep you updated on our adaptive learning progress.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="interests">Specific Interests (Optional)</Label>
              <Textarea
                id="interests"
                placeholder="What aspects of adaptive learning are you most excited about? (e.g., personalized study paths, smart question selection, performance analytics)"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
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
              onClick={handleDialogClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !email.trim()}
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
                  Stay Updated
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
