'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { ExamListItem } from '@/swr/exams';
import { getDerivedExamStatus } from '@/src/types/exam-status';

interface DeleteExamModalProps {
  exam: ExamListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (examId: string) => Promise<void>;
  isDeleting: boolean;
}

export function DeleteExamModal({
  exam,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteExamModalProps) {
  if (!exam) return null;

  const examStatus = getDerivedExamStatus(exam);
  const hasScore = exam.score !== null && exam.score !== undefined;
  const hasStarted = exam.started_at !== null;
  const isCompleted = exam.submitted_at !== null;

  // Determine warning message based on exam status
  const getWarningMessage = () => {
    if (isCompleted) {
      return 'This exam has been completed. Deleting it will permanently remove your results and score.';
    } else if (hasStarted) {
      return 'This exam has been started. Deleting it will permanently remove any progress you have made.';
    } else if (examStatus === 'ready') {
      return 'This exam is ready to be taken. Deleting it will remove the generated questions.';
    } else if (examStatus === 'generating') {
      return 'This exam is currently generating questions. Deleting it will stop the generation process.';
    } else if (examStatus === 'generation_failed') {
      return 'This exam failed to generate questions. Deleting it will clean up the failed attempt.';
    }
    return 'This exam will be permanently deleted and cannot be recovered.';
  };

  const handleConfirm = async () => {
    await onConfirm(exam.exam_id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Delete Exam
            </DialogTitle>
          </div>
          <DialogDescription className="text-left space-y-3">
            <p className="text-slate-700 dark:text-slate-300">
              Are you sure you want to delete this exam?
            </p>
            
            {/* Exam details */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-600 dark:text-slate-400">Exam ID:</span>
                <span className="text-slate-900 dark:text-slate-100 font-mono">
                  #{exam.exam_id.substring(0, 8)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-600 dark:text-slate-400">Status:</span>
                <span className="text-slate-900 dark:text-slate-100 capitalize">
                  {examStatus.replace('_', ' ')}
                </span>
              </div>
              {hasScore && (
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-600 dark:text-slate-400">Score:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-semibold">
                    {exam.score}%
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-600 dark:text-slate-400">Questions:</span>
                <span className="text-slate-900 dark:text-slate-100">
                  {exam.total_questions || 'N/A'}
                </span>
              </div>
            </div>

            {/* Warning message */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 rounded-lg p-3">
              <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                ⚠️ Warning
              </p>
              <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                {getWarningMessage()}
              </p>
            </div>

            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
              This action cannot be undone.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 sm:flex-none"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="w-4 h-4 mr-2" />
                Delete Exam
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
