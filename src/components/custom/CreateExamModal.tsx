'use client';

import React from 'react';
import { ActionButton } from './ActionButton';
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
import { InfoTooltip } from '@/src/components/custom/InfoTooltip';
import RateLimitDisplay from '@/src/components/custom/RateLimitDisplay';
import { Lightbulb, BookOpen, Target } from 'lucide-react';

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
  children,
}: CreateExamModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                Generate New Exam
              </DialogTitle>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {displayCertification?.name || 'Certification Exam'}
              </p>
            </div>
          </div>
        </DialogHeader>

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

        <div className="space-y-6 py-2">
          {/* Number of Questions Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Number of Questions
              </Label>
              <InfoTooltip content="Choose how many questions you want in your exam. Each question costs 2 tokens. Recommended: 20-50 questions." />
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
                <span>Min: {displayCertification?.min_quiz_counts || 1}</span>
                <span>Max: {displayCertification?.max_quiz_counts || 100}</span>
              </div>
            </div>
          </div>

          {/* Custom Prompt Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <Label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Focus Areas (Optional)
              </Label>
              <InfoTooltip content="Enter specific topics or keywords to focus your exam on particular areas of the certification." />
            </div>

            <Textarea
              id="custom-prompt"
              placeholder="e.g., security best practices, network architecture, cost optimization..."
              value={customPromptText}
              onChange={(e) => setCustomPromptText(e.target.value)}
              rows={3}
              className="text-sm rounded-xl border-slate-200/60 dark:border-slate-600/60 bg-white/80 dark:bg-slate-800/80 dark:text-slate-100 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-700 backdrop-blur-sm shadow-sm hover:shadow-md resize-none"
            />
          </div>
        </div>
        <DialogFooter className="gap-3 pt-6">
          <ActionButton
            onClick={() => onOpenChange(false)}
            disabled={isCreatingExam}
            variant="outline"
            size="lg"
            className="flex-1 sm:flex-none"
          >
            Cancel
          </ActionButton>
          <ResponsiveTooltip
            content={
              <div className="text-slate-600 dark:text-slate-300">
                <div className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                  AI-Powered Generation
                </div>
                <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Our AI will create {numberOfQuestions} tailored questions for your exam. Questions
                  are generated in the background—track progress in your exams list.
                </div>
              </div>
            }
          >
            <div className="flex-1 sm:flex-none">
              <ActionButton
                onClick={onCreateExam}
                disabled={
                  isCreatingExam ||
                  !numberOfQuestions ||
                  numberOfQuestions < 1 ||
                  createExamError?.status === 429
                }
                variant="primary"
                size="lg"
                isLoading={isCreatingExam}
                loadingText="Creating Exam..."
                className="w-full"
              >
                Create Exam
              </ActionButton>
            </div>
          </ResponsiveTooltip>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
