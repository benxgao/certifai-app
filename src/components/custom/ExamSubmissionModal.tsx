'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ExamSubmissionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmSubmit: () => void;
  isSubmittingExamFlag: boolean;
  submittedAt: string | null;
}

export const ExamSubmissionModal: React.FC<ExamSubmissionModalProps> = ({
  isOpen,
  onOpenChange,
  onConfirmSubmit,
  isSubmittingExamFlag,
  submittedAt,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Confirm Submission
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            Are you sure you want to submit your exam? You will not be able to change your
            answers after submission.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submittedAt !== null || isSubmittingExamFlag}
            className="border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirmSubmit}
            disabled={submittedAt !== null || isSubmittingExamFlag}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25"
          >
            {isSubmittingExamFlag ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Submitting...
              </>
            ) : (
              'Submit Exam'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
