'use client';

import React from 'react';
import Link from 'next/link';
import { ActionButton } from './ActionButton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { Slider } from '@/src/components/ui/slider';
import { InfoTooltip } from '@/src/components/custom/InfoTooltip';
import RateLimitDisplay from '@/src/components/custom/RateLimitDisplay';
import { Lightbulb, BookOpen, Target, CreditCard, AlertTriangle } from 'lucide-react';
import { EnhancedModal } from './EnhancedModal';
import { isFeatureEnabled } from '@/src/config/featureFlags';

// Flexible certification type to handle different certification objects
type CertificationData = {
  cert_id?: number;
  name?: string;
  min_quiz_counts?: number;
  max_quiz_counts?: number;
  pass_score?: number;
  firm_id?: number;
  exam_guide_url?: string;
} | null;

interface CreateExamModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  displayCertification: CertificationData;
  numberOfQuestions: number;
  setNumberOfQuestions: (value: number) => void;
  customPromptText: string;
  setCustomPromptText: (value: string) => void;
  onCreateExam: () => Promise<void>;
  isCreatingExam: boolean;
  createExamError: any;
  hasActiveSubscription: boolean;
  isLoadingSubscription: boolean;
  children?: React.ReactNode;
}

export function CreateExamModal({
  isOpen,
  onOpenChange,
  displayCertification,
  numberOfQuestions,
  setNumberOfQuestions,
  customPromptText,
  setCustomPromptText,
  onCreateExam,
  isCreatingExam,
  createExamError,
  hasActiveSubscription,
  isLoadingSubscription,
  children,
}: CreateExamModalProps) {
  // Modal content
  const content = (
    <div className="space-y-6">
      {/* Subscription Warning Display - Only show if stripe integration is enabled */}
      {isFeatureEnabled('STRIPE_INTEGRATION') &&
        !isLoadingSubscription &&
        !hasActiveSubscription && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                  Active Subscription Required
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  You need an active subscription to create new exams. Visit the billing page to
                  upgrade your plan.
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Rate Limiting Error Display */}
      {createExamError?.status === 429 && createExamError.rateLimitInfo && (
        <div className="mb-6">
          <RateLimitDisplay rateLimitInfo={createExamError.rateLimitInfo} />
        </div>
      )}

      {/* General Error Display */}
      {createExamError && createExamError.status !== 429 && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-800 dark:text-red-200">
            {createExamError.message || 'Failed to create exam. Please try again.'}
          </p>
        </div>
      )}

      {/* Number of Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          <Label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Number of Questions
          </Label>
          <InfoTooltip
            content={`Choose how many questions you want in your exam. Our AI will create ${numberOfQuestions} tailored questions for your exam. Questions are
              generated in the background—track progress in your exams list.`}
            preventInitialFocus={true}
          />
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
          <div className="text-center mb-4">
            <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              {numberOfQuestions}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">questions</span>
          </div>

          <Slider
            id="number-of-questions"
            min={displayCertification?.min_quiz_counts || 1}
            max={displayCertification?.max_quiz_counts || 100}
            step={1}
            value={[numberOfQuestions]}
            onValueChange={(value) => setNumberOfQuestions(value[0])}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
            <span>{displayCertification?.min_quiz_counts || 1}</span>
            <span>{displayCertification?.max_quiz_counts || 100}</span>
          </div>
        </div>
      </div>

      {/* Custom Prompt Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          <Label
            htmlFor="custom-prompt"
            className="text-sm font-semibold text-slate-900 dark:text-slate-50"
          >
            Custom Instructions
          </Label>
          <InfoTooltip
            content="Add specific instructions to customize your exam. For example: 'Focus on practical scenarios' or 'Include more advanced topics'."
            preventInitialFocus={true}
          />
        </div>

        <Textarea
          id="custom-prompt"
          placeholder="Add specific instructions for your exam (optional)..."
          value={customPromptText}
          onChange={(e) => setCustomPromptText(e.target.value)}
          className="min-h-[80px] bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm resize-none focus:ring-violet-500 focus:border-violet-500"
          maxLength={100}
        />

        <div className="text-right">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {customPromptText.length}/100 characters
          </span>
        </div>
      </div>
    </div>
  );

  // Modal footer
  const footer = (
    <div className="flex items-center gap-3">
      {/* Billing Link - Only show when subscription is required and stripe integration is enabled */}
      {!isLoadingSubscription &&
        !hasActiveSubscription &&
        isFeatureEnabled('STRIPE_INTEGRATION') && (
          <div className="flex-1">
            <Link href="/main/billing" passHref>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </Link>
          </div>
        )}

      <div className="flex-1 sm:flex-none">
        <ActionButton
          onClick={onCreateExam}
          disabled={
            isCreatingExam ||
            !numberOfQuestions ||
            numberOfQuestions < 1 ||
            createExamError?.status === 429 ||
            // Only require subscription if STRIPE_INTEGRATION is enabled
            (isFeatureEnabled('STRIPE_INTEGRATION') &&
              !isLoadingSubscription &&
              !hasActiveSubscription)
          }
          variant="primary"
          size="lg"
          isLoading={isCreatingExam}
          loadingText="Creating Exam..."
          className="w-full"
        >
          {isLoadingSubscription ? 'Loading...' : 'Create Exam'}
        </ActionButton>
      </div>
    </div>
  );

  return (
    <EnhancedModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      icon={<BookOpen className="h-5 w-5" />}
      title="Generate New Exam"
      subtitle={displayCertification?.name || 'Certification Exam'}
      variant="default"
      content={content}
      footer={footer}
    >
      {children}
    </EnhancedModal>
  );
}
