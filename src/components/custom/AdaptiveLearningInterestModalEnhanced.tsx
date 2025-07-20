'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Brain, AlertCircle, CheckCircle, Sparkles, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';

interface AdaptiveLearningInterestModalProps {
  trigger?: React.ReactNode;
}

// Popular certification categories - you can expand this based on your data
const CERTIFICATION_CATEGORIES = [
  { value: 'cloud', label: 'Cloud Computing (AWS, Azure, GCP)', icon: '☁️' },
  { value: 'security', label: 'Cybersecurity', icon: '🔒' },
  { value: 'data', label: 'Data Science & Analytics', icon: '📊' },
  { value: 'programming', label: 'Programming & Development', icon: '💻' },
  { value: 'networking', label: 'Networking', icon: '🌐' },
  { value: 'project-management', label: 'Project Management', icon: '📋' },
  { value: 'business-analysis', label: 'Business Analysis', icon: '📈' },
  { value: 'quality-assurance', label: 'Quality Assurance', icon: '✅' },
  { value: 'devops', label: 'DevOps & Infrastructure', icon: '⚙️' },
  { value: 'finance', label: 'Finance & Accounting', icon: '💰' },
  { value: 'other', label: 'Other', icon: '🎯' },
];

const AdaptiveLearningInterestModal: React.FC<AdaptiveLearningInterestModalProps> = ({
  trigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { firebaseUser } = useFirebaseAuth();

  const handleCertificationToggle = (value: string) => {
    setSelectedCertifications((prev) =>
      prev.includes(value) ? prev.filter((cert) => cert !== value) : [...prev, value],
    );
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (selectedCertifications.length === 0) {
      setError('Please select at least one certification area of interest');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const selectedCertificationLabels = selectedCertifications.map(
        (value) => CERTIFICATION_CATEGORIES.find((cat) => cat.value === value)?.label || value,
      );

      const interestsText = [
        `Certification areas: ${selectedCertificationLabels.join(', ')}`,
        customInterests ? `Additional interests: ${customInterests}` : '',
      ]
        .filter(Boolean)
        .join('\n');

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
            certification_interests: selectedCertificationLabels.join(', '),
            additional_interests: customInterests.trim(),
            interests: interestsText,
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
    setSelectedCertifications([]);
    setCustomInterests('');
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

  // Pre-fill email if user is authenticated
  useEffect(() => {
    if (firebaseUser?.email && !email) {
      setEmail(firebaseUser.email);
    }
  }, [firebaseUser, email]);

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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-600" />
            Get Notified About Adaptive Learning
          </DialogTitle>
          <DialogDescription>
            Be the first to know when our revolutionary adaptive learning engine launches. Select
            your certification interests to receive personalized updates.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    You&apos;re all set!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    We&apos;ll notify you about adaptive learning features for your selected
                    certification areas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 py-4">
            {/* Name Fields */}
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

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className={error && !email.trim() ? 'border-destructive' : ''}
              />
            </div>

            {/* Certification Interests */}
            <div className="grid gap-3">
              <Label className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Certification Areas of Interest *
              </Label>
              <p className="text-sm text-muted-foreground">
                Select all certification areas you&apos;d like adaptive learning for:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-lg p-3 bg-slate-50/50 dark:bg-slate-800/50">
                {CERTIFICATION_CATEGORIES.map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cert-${category.value}`}
                      checked={selectedCertifications.includes(category.value)}
                      onCheckedChange={() => handleCertificationToggle(category.value)}
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor={`cert-${category.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </label>
                  </div>
                ))}
              </div>

              {selectedCertifications.length > 0 && (
                <div className="text-sm text-violet-600 dark:text-violet-400">
                  {selectedCertifications.length} certification area
                  {selectedCertifications.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>

            {/* Additional Interests */}
            <div className="grid gap-2">
              <Label htmlFor="customInterests">Additional Interests (Optional)</Label>
              <Textarea
                id="customInterests"
                placeholder="Any specific features or aspects of adaptive learning you're most excited about..."
                value={customInterests}
                onChange={(e) => setCustomInterests(e.target.value)}
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
              disabled={isSubmitting || !email.trim() || selectedCertifications.length === 0}
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
                  Notify Me of Progress
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
