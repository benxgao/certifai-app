'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { useExamPageLogic } from '@/src/hooks/useExamPageLogic';
import ErrorMessage from '@/components/custom/ErrorMessage';
import PageLoader from '@/components/custom/PageLoader';
import ExamTopicsDisplay from '@/components/custom/ExamTopicsDisplay';
import Breadcrumb from '@/components/custom/Breadcrumb';
import { ExamStatusCard } from '@/src/components/custom/ExamStatusCard';
import { ExamEmptyState } from '@/src/components/custom/ExamEmptyState';
import { ExamLoadingState } from '@/src/components/custom/ExamLoadingState';
import { ExamErrorState } from '@/src/components/custom/ExamErrorState';
import { ExamQuestionsContainer } from '@/src/components/custom/ExamQuestionsContainer';
import { ExamConfirmSubmissionModal } from '@/src/components/custom/ExamConfirmSubmissionModal';

export default function ExamAttemptPage() {
  const {
    // State
    certId,
    examId,
    showConfirmModal,
    setShowConfirmModal,
    submissionResult,
    isSubmittingExamFlag,
    isNavigatingPage,

    // Exam State
    examState,
    isValidatingExamState,
    forceStatusCheck,
    generationProgress,
    shouldShowCheckButton,
    isLoadingExamState,

    // Questions
    questions,
    pagination,
    isLoadingQuestions,
    isQuestionsError,

    // Topics
    topics,
    totalTopics,
    totalQuestions,

    // Exam data
    score,
    submittedAt,

    // Loading states
    isAnswering,
    submitError,
    isSubmittingExam,
    submitExamError,

    // Handlers
    handleOptionChange,
    handlePreviousPage,
    handleNextPageOrSubmit,
    handleConfirmSubmit,
    isCorrectOption,
  } = useExamPageLogic();

  if (isLoadingQuestions || isLoadingExamState) {
    return <ExamLoadingState />;
  }

  // Check if this is a 404 error (exam not found) and redirect to not-found page
  const is404Error = (isQuestionsError as any)?.status === 404;

  if (is404Error) {
    notFound(); // Redirect to the global not-found page
  }

  // Handle other types of errors (network errors, server errors, etc.)
  if (isQuestionsError) {
    return <ExamErrorState certId={certId} examId={examId} error={isQuestionsError} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20 pt-16">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-200/20 dark:bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-200/15 dark:bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>

      <PageLoader isLoading={isSubmittingExam || isSubmittingExamFlag} text="Submitting Exam..." />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/main' },
            { label: 'Certifications', href: '/main/certifications' },
            {
              label: examState?.certification?.name || `Certification ${certId}`,
              href: `/main/certifications/${certId}/exams`,
            },
            { label: `Exam ${examId?.substring(0, 8)}`, current: true },
          ]}
        />

        {/* Exam Status Card */}
        <ExamStatusCard
          examState={examState}
          submittedAt={submittedAt}
          score={score}
          pagination={pagination}
        />

        {/* Display general submission error messages */}
        <ErrorMessage error={submissionResult?.error} className="mt-4" />
        <ErrorMessage error={submitExamError} className="mt-4" />

        {/* Display AI-Generated Topics */}
        {topics && topics.length > 0 && (
          <ExamTopicsDisplay
            topics={topics}
            totalTopics={totalTopics}
            totalQuestions={totalQuestions}
            isLoading={isLoadingQuestions}
            className="mb-6"
          />
        )}

        {questions && questions.length > 0 ? (
          <ExamQuestionsContainer
            questions={questions}
            pagination={pagination}
            pageSize={10}
            submittedAt={submittedAt}
            isAnswering={isAnswering}
            isSubmittingExamFlag={isSubmittingExamFlag}
            isNavigatingPage={isNavigatingPage}
            isLoadingQuestions={isLoadingQuestions}
            submitError={submitError}
            onOptionChange={handleOptionChange}
            isCorrectOption={isCorrectOption}
            onPreviousPage={handlePreviousPage}
            onNextPageOrSubmit={handleNextPageOrSubmit}
          />
        ) : (
          <ExamEmptyState
            examState={examState}
            generationProgress={generationProgress}
            shouldShowCheckButton={shouldShowCheckButton}
            isValidatingExamState={isValidatingExamState}
            onForceStatusCheck={forceStatusCheck}
          />
        )}

        {/* Submission Modal */}
        <ExamConfirmSubmissionModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSubmit}
          isSubmitting={isSubmittingExamFlag}
          submittedAt={submittedAt}
        />
      </div>
    </div>
  );
}
