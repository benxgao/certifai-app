'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/src/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ResponsiveTooltip from '@/src/components/custom/ResponsiveTooltip';
import { ButtonLoadingText } from '@/src/components/ui/loading-spinner';
import RateLimitDisplay from '@/src/components/custom/RateLimitDisplay';
import { FaLightbulb } from 'react-icons/fa';

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
  children: React.ReactNode;
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
  children,
}: CreateExamModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Generate New Exam</DialogTitle>
            <ResponsiveTooltip
              content={
                <>
                  Generate a new exam for {displayCertification?.name || 'this certification'}.
                  Configure the number of questions and any specific requirements.
                </>
              }
            >
              <svg
                className="w-5 h-5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </ResponsiveTooltip>
          </div>
        </DialogHeader>

        {/* Rate Limiting Error Display */}
        {createExamError?.status === 429 && createExamError.rateLimitInfo && (
          <RateLimitDisplay rateLimitInfo={createExamError.rateLimitInfo} className="mb-4" />
        )}

        {/* General Error Display */}
        {createExamError && createExamError.status !== 429 && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              {createExamError.message || 'Failed to create exam. Please try again.'}
            </p>
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="number-of-questions">Number of Questions: {numberOfQuestions}</Label>
              <ResponsiveTooltip content="Choose how many questions you want in your exam. Each question costs 2 tokens. Recommended: 20-50.">
                <FaLightbulb className="w-5 h-5 sm:w-4 sm:h-4" />
              </ResponsiveTooltip>
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
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Min: {displayCertification?.min_quiz_counts || 1}</span>
              <span>Max: {displayCertification?.max_quiz_counts || 100}</span>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="custom-prompt">Focus on Specific Topics (Optional)</Label>
              <ResponsiveTooltip
                content={
                  <>
                    Enter keywords or topics to focus your exam (e.g., &quot;security best
                    practices, network architecture&quot;). Our AI will generate specialized topics
                    based on your input.
                  </>
                }
              >
                <FaLightbulb className="w-5 h-5 sm:w-4 sm:h-4" />
              </ResponsiveTooltip>
            </div>
            <Textarea
              id="custom-prompt"
              placeholder="Enter keywords, topics, or concepts to focus your exam (e.g., 'security best practices', 'network architecture', 'cost optimization')"
              value={customPromptText}
              onChange={(e) => setCustomPromptText(e.target.value)}
              rows={3}
            />
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <FaLightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                AI Topic Generation
              </span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              Our AI will generate {numberOfQuestions} specialized topics tailored to the{' '}
              {displayCertification?.name} certification. Questions are created in the background -
              you can monitor progress in your exams list.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreatingExam}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onCreateExam}
            disabled={
              isCreatingExam ||
              !numberOfQuestions ||
              numberOfQuestions < 1 ||
              createExamError?.status === 429 // Disable if rate limited
            }
          >
            {isCreatingExam ? (
              <ButtonLoadingText
                isLoading={true}
                loadingText="Creating..."
                defaultText="Creating..."
                showSpinner={true}
                spinnerSize="sm"
              />
            ) : (
              'Create Exam'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
