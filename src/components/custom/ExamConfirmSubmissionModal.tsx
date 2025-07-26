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

interface ExamConfirmSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  submittedAt: number | null;
}

export const ExamConfirmSubmissionModal: React.FC<ExamConfirmSubmissionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  submittedAt,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Confirm Submission
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Are you sure you want to submit your exam? You will not be able to change your answers
            after submission.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submittedAt !== null || isSubmitting}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50/90 dark:hover:bg-slate-700/90 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={submittedAt !== null || isSubmitting}
            className="bg-emerald-500/90 hover:bg-emerald-600/90 text-white border border-emerald-400/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isSubmitting ? (
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
