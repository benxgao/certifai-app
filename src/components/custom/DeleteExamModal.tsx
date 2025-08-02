'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import { ActionButton } from './ActionButton';
import { FaTrash } from 'react-icons/fa';
import { AlertTriangle } from 'lucide-react';
import { ExamListItem } from '@/swr/exams';
import { getDerivedExamStatus } from '@/src/types/exam-status';
import { EnhancedModal } from './EnhancedModal';
import { AlertMessage } from './AlertMessage';

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
    // Close modal immediately after starting the action
    onClose();
    // Then execute the delete action
    await onConfirm(exam.exam_id);
  };

  // Decorative elements for enhanced visual appeal
  const decorativeElements = (
    <>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-200/20 dark:bg-red-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-orange-200/20 dark:bg-orange-600/10 rounded-full blur-3xl"></div>
    </>
  );

  // Modal content
  const content = (
    <div className="text-left space-y-3">
      <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
        Are you sure you want to delete this exam? All associated data will be permanently removed.
      </p>

      {/* Enhanced exam details card */}
      <div className="bg-gradient-to-r from-slate-50/90 via-white/80 to-violet-50/40 dark:from-slate-800/60 dark:via-slate-700/40 dark:to-violet-950/30 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-4 space-y-2 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 dark:bg-violet-500"></div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Exam Details
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="space-y-1">
            <span className="font-medium text-slate-600 dark:text-slate-400 block">Status</span>
            <span className="text-slate-900 dark:text-slate-100 capitalize font-medium">
              {examStatus.replace('_', ' ')}
            </span>
          </div>
          <div className="space-y-1">
            <span className="font-medium text-slate-600 dark:text-slate-400 block">Questions</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              {exam.total_questions || 'N/A'}
            </span>
          </div>
          {hasScore && (
            <div className="space-y-1 col-span-2">
              <span className="font-medium text-slate-600 dark:text-slate-400 block">Score</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">{exam.score}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Warning message using AlertMessage component */}
      <AlertMessage
        variant="warning"
        message={`${getWarningMessage()} This action cannot be undone.`}
        className="backdrop-blur-sm"
      />
    </div>
  );

  // Modal footer
  const footer = (
    <>
      <ActionButton
        variant="outline"
        onClick={onClose}
        disabled={isDeleting}
        className="flex-1 sm:flex-none"
      >
        Cancel
      </ActionButton>
      <Button
        variant="destructive"
        onClick={handleConfirm}
        disabled={isDeleting}
        className="flex-1 sm:flex-none bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 backdrop-blur-sm border-0"
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
    </>
  );

  return (
    <EnhancedModal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      icon={<AlertTriangle className="h-5 w-5" />}
      title="Delete Exam"
      subtitle={`ID: ${exam.exam_id.substring(0, 8)} • This action cannot be undone`}
      variant="destructive"
      content={content}
      footer={footer}
      decorativeElements={decorativeElements}
    />
  );
}
