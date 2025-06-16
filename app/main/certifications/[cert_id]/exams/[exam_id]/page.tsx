'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FaCheck, FaEdit, FaLightbulb, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'; //  npx shadcn@latest add dialog
import { useExamQuestions, Question, useSubmitAnswer } from '@/swr/questions'; // Import useSubmitAnswer
import { useSubmitExam, useExamState } from '@/swr/exams'; // Import useSubmitExam and useExamState
import ErrorMessage from '@/components/custom/ErrorMessage'; // Import ErrorMessage
import PageLoader from '@/components/custom/PageLoader'; // Import PageLoader
import { Checkbox } from '@/components/ui/checkbox'; // Import Checkbox
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'; // Added
import Breadcrumb from '@/components/custom/Breadcrumb'; // Import Breadcrumb component

export default function ExamAttemptPage() {
  const params = useParams();
  const certId = params.cert_id ? parseInt(params.cert_id as string, 10) : null;
  const examId = params.exam_id as string | null;
  const { apiUserId } = useFirebaseAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [questionsApiUrl, setQuestionsApiUrl] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null); // To store submission result
  const [isSubmittingExamFlag, setIsSubmittingExamFlag] = useState(false); // To manage loading state for submission
  const [isNavigatingPage, setIsNavigatingPage] = useState(false);

  useEffect(() => {
    if (apiUserId && certId !== null && examId) {
      setQuestionsApiUrl(
        `/api/users/${apiUserId}/certifications/${certId}/exams/${examId}/questions?page=${currentPage}&pageSize=${pageSize}`,
      );
    }
  }, [apiUserId, certId, examId, currentPage, pageSize]);

  // Use the new SWR hook to get exam state
  const { examState, isLoadingExamState, isExamStateError, mutateExamState } = useExamState(
    apiUserId,
    certId,
    examId,
  );

  // Extract values from exam state for easier access
  const score = examState?.score ?? null;
  const submittedAt = examState?.submitted_at ?? null;

  const {
    questions,
    pagination,
    isLoadingQuestions,
    isQuestionsError,
    mutateQuestions, // Ensure mutateQuestions is destructured
  } = useExamQuestions(questionsApiUrl);

  // Use the new SWR Mutation hook for submitting answers
  const { submitAnswer, isAnswering, submitError } = useSubmitAnswer();

  // SWR hook for submitting the entire exam
  const { submitExam, isSubmittingExam, submitExamError } = useSubmitExam();

  const handleOptionChange = async (questionId: string, optionId: string) => {
    // Optimistically update UI for the questions list
    mutateQuestions(
      (currentData) => {
        if (!currentData || !currentData.data || !currentData.data.questions) {
          return currentData;
        }
        const updatedQuestions = currentData.data.questions.map((q) =>
          q.quiz_question_id === questionId ? { ...q, selected_option_id: optionId } : q,
        );
        return {
          ...currentData,
          data: {
            ...currentData.data,
            questions: updatedQuestions,
          },
        };
      },
      false, // optimistic update, don't revalidate the questions list yet
    );

    // Trigger the mutation to persist the answer
    if (apiUserId && certId !== null && examId) {
      try {
        await submitAnswer({
          apiUserId,
          certId,
          examId,
          questionId,
          optionId,
        });
        console.log('Answer saved successfully for question:', questionId);
        // After successful submission, you might want to revalidate the questions
        // if the backend response could affect the overall list or pagination.
        // mutateQuestions(undefined, true);
      } catch (error) {
        // Error is already handled by useSubmitAnswer hook, but you can log or act on submitError
        console.error(
          'Failed to save answer (from handleOptionChange catch):',
          (error as Error).message,
        );
        // Revert optimistic update on failure by revalidating the original questions data
        mutateQuestions(undefined, true);
      }
    }
  };

  // Effect to observe submission errors from the hook
  useEffect(() => {
    if (submitError) {
      console.error('Failed to save answer (from submitError effect):', submitError.message);
      // Optionally, show a toast notification or other UI feedback for the error
      // And ensure optimistic UI is reverted if not already handled by the catch block in handleOptionChange
      mutateQuestions(undefined, true);
    }
  }, [submitError, mutateQuestions]);

  // Effect to observe exam submission errors from the hook
  useEffect(() => {
    if (submitExamError) {
      console.error(
        'Failed to submit exam (from submitExamError effect):',
        submitExamError.message,
      );
      // The alert is now handled by the ErrorMessage component, but you can keep this for logging
      // alert(`Failed to submit exam: ${submitExamError.message}`);
      setSubmissionResult({ error: submitExamError.message });
    }
  }, [submitExamError]);

  const handlePreviousPage = async () => {
    if (pagination && pagination.currentPage > 1) {
      setIsNavigatingPage(true);
      // Immediate UI update for optimistic loading
      setCurrentPage(pagination.currentPage - 1);
      // Reset loading state after a brief moment
      setTimeout(() => setIsNavigatingPage(false), 300);
    }
  };

  const handleNextPageOrSubmit = async () => {
    if (pagination && pagination.currentPage < pagination.totalPages) {
      setIsNavigatingPage(true);
      // Immediate UI update for optimistic loading
      setCurrentPage(pagination.currentPage + 1);
      // Reset loading state after a brief moment
      setTimeout(() => setIsNavigatingPage(false), 300);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    if (!apiUserId || certId === null || !examId) {
      console.error('Missing user, certification, or exam ID for submission.');
      // alert('Could not submit exam. Missing necessary information.'); // Replaced by ErrorMessage
      setSubmissionResult({ error: 'Could not submit exam. Missing necessary information.' });
      return;
    }
    setIsSubmittingExamFlag(true);
    console.log('Submitting exam...');
    try {
      // The body for the submit request might be empty or could contain specific data
      // based on backend requirements. For now, sending an empty object.
      const result = await submitExam({ apiUserId, certId, examId, body: {} });
      console.log('Exam submitted successfully:', result);
      setSubmissionResult(result);
      alert('Exam submitted successfully!');
      // Revalidate exam state to get updated score and submission status
      mutateExamState();
      // Optionally, redirect the user or show a summary page
      // router.push(`/main/certifications/${certId}/exams/${examId}/results`);
    } catch (error: any) {
      console.error('Failed to submit exam:', error.message);
      // alert(`Failed to submit exam: ${error.message}`); // Replaced by ErrorMessage
      setSubmissionResult({ error: error.message });
    } finally {
      setIsSubmittingExamFlag(false);
    }
  };

  // Helper function to determine if an option is the correct answer
  const isCorrectOption = (question: Question, optionId: string): boolean => {
    // Method 1: Check if the option is explicitly marked as correct
    const option = question.answerOptions.find((opt) => opt.option_id === optionId);
    if (option?.is_correct) {
      return true;
    }

    // Method 2: Check if this option is marked as the correct option ID
    if (question.correct_option_id === optionId) {
      return true;
    }

    // Method 3: Temporary mock data for demonstration (remove this in production)
    // This simulates correct answers when the API doesn't provide them
    if (
      submittedAt !== null &&
      !question.correct_option_id &&
      !question.answerOptions.some((opt) => opt.is_correct)
    ) {
      // For demo purposes, we'll assume the second option (index 1) is correct
      // In real implementation, this should come from the API
      const correctIndex = 1; // This would come from the backend
      const correctOption = question.answerOptions[correctIndex];
      if (correctOption && correctOption.option_id === optionId) {
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    if (questions) {
      console.log(`Questions for exam ${examId}:`, JSON.stringify(questions, null, 2));
    }
    if (isQuestionsError) {
      console.error('Error loading questions:', isQuestionsError);
    }
  }, [questions, examId, isQuestionsError]);

  if (isLoadingQuestions || isLoadingExamState) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={`question-skeleton-${index}`} className="shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-10 w-1/4 mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isQuestionsError || isExamStateError) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Error Loading Exam {examId}</h1>
            <p className="text-muted-foreground max-w-md">
              {isQuestionsError?.message || isExamStateError?.message || 'Error loading exam data.'}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <PageLoader isLoading={isSubmittingExam || isSubmittingExamFlag} text="Submitting Exam..." />
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Certifications', href: '/main/certifications' },
            {
              label: examState?.certification?.name || `Certification ${certId}`,
              href: `/main/certifications/${certId}/exams`,
            },
            { label: `Exam ${examId}`, current: true },
          ]}
        />

        {/* Exam Status Card */}
        <div className="mb-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden">
          {/* Status Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  Exam Progress
                </h2>
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                {submittedAt !== null ? (
                  <span className="inline-flex items-center rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 shadow-sm">
                    <FaCheck className="w-4 h-4 mr-2" /> Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50 shadow-sm">
                    <FaEdit className="w-4 h-4 mr-2" /> In Progress
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="space-y-6">
              {/* Score Section - only show if exam is completed */}
              {score !== null && submittedAt !== null && (
                <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-700/50 shadow-sm">
                  <div className="text-center">
                    <p className="text-base font-normal text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-2">
                      Final Score
                    </p>
                    <p className="text-5xl font-bold text-emerald-700 dark:text-emerald-200 mb-2">
                      {score}%
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      {score >= 80
                        ? 'Excellent Performance!'
                        : score >= 60
                        ? 'Good Job!'
                        : 'Keep Learning!'}
                    </p>
                  </div>
                </div>
              )}

              {/* Exam Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Questions */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Questions
                      </p>
                    </div>
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                      {pagination?.totalItems || '...'}
                    </p>
                  </div>
                </div>

                {/* Started Date */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Started
                      </p>
                    </div>
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                      {examState?.started_at
                        ? new Date(examState.started_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '...'}
                    </p>
                  </div>
                </div>

                {/* Time Information */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Duration
                      </p>
                    </div>
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                      {submittedAt && examState?.started_at
                        ? (() => {
                            const start = new Date(examState.started_at);
                            const end = new Date(submittedAt);
                            const diffMs = end.getTime() - start.getTime();
                            const diffMins = Math.round(diffMs / (1000 * 60));
                            if (diffMins < 60) return `${diffMins}m`;
                            const hours = Math.floor(diffMins / 60);
                            const mins = diffMins % 60;
                            return `${hours}h ${mins}m`;
                          })()
                        : 'Active'}
                    </p>
                  </div>
                </div>

                {/* Progress or Submission Date */}
                {submittedAt !== null ? (
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-2">
                        <FaCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                          Submitted
                        </p>
                      </div>
                      <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                        {new Date(submittedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="w-4 h-4 text-blue-600 dark:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                          Progress
                        </p>
                      </div>
                      <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                        {pagination?.currentPage && pagination?.totalPages
                          ? `${pagination.currentPage}/${pagination.totalPages}`
                          : 'Active'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Helpful Tips (only during active exam) */}
              {submittedAt === null && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-700/50 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                      <FaLightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-blue-700 dark:text-blue-200 mb-1">
                        Pro Tip
                      </p>
                      <p className="text-base text-blue-600 dark:text-blue-300 leading-relaxed">
                        Your answers are automatically saved as you select them. Take your time to
                        review each question carefully.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Display general submission error messages */}
        <ErrorMessage error={submissionResult?.error} className="mt-4" />
        <ErrorMessage error={submitExamError} className="mt-4" />

        {questions && questions.length > 0 ? (
          <div className="space-y-8">
            {questions.map((question: Question, index: number) => (
              <Card
                key={question.quiz_question_id}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30 border-b border-slate-100 dark:border-slate-700/50 p-6">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-relaxed flex-1 mr-4">
                      <div className="space-y-3">
                        <div className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-normal border border-blue-100 dark:border-blue-800/50">
                          Question {((pagination?.currentPage || 1) - 1) * pageSize + index + 1}
                        </div>
                        <div className="text-slate-700 dark:text-slate-200 font-medium text-lg leading-relaxed">
                          {question.question_text}
                        </div>
                      </div>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-4 mb-6">
                    {question.answerOptions.map(({ option_id, option_text }, optionIndex) => {
                      const isSelected = question.selected_option_id === option_id;
                      const isCorrect = isCorrectOption(question, option_id);
                      const showCorrectAnswer = submittedAt !== null && isCorrect;
                      const showIncorrectSelection =
                        submittedAt !== null &&
                        isSelected &&
                        question.user_answer_is_correct === false;

                      return (
                        <div
                          key={option_id}
                          className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 cursor-pointer group relative border ${
                            // Show correct answer with green background after submission
                            showCorrectAnswer
                              ? 'bg-green-25 border-green-200 dark:bg-green-900/20 dark:border-green-600/50 shadow-sm'
                              : // Show selected wrong answer with red background
                              showIncorrectSelection
                              ? 'bg-gradient-to-r from-red-25 to-red-50/50 border-red-200/60 dark:bg-gradient-to-r dark:from-red-900/20 dark:to-red-800/15 dark:border-red-600/40 shadow-sm'
                              : // Show selected correct answer (already handled above, but for clarity)
                              isSelected &&
                                submittedAt !== null &&
                                question.user_answer_is_correct === true
                              ? 'bg-green-25 border-green-200 dark:bg-green-900/20 dark:border-green-600/50 shadow-sm'
                              : // Show regular selected state during exam
                              isSelected && submittedAt === null
                              ? 'bg-blue-25 border-blue-200 dark:bg-blue-900/20 dark:border-blue-600/50 shadow-sm'
                              : // Default state with hover
                                'bg-white border-gray-100 hover:bg-gray-25 hover:border-gray-200 dark:bg-slate-800 dark:border-slate-600/50 dark:hover:bg-slate-700 dark:hover:border-slate-500/50'
                          } ${
                            submittedAt !== null || isAnswering || isSubmittingExamFlag
                              ? 'cursor-not-allowed opacity-60'
                              : 'hover:shadow-sm'
                          }`}
                          onClick={() => {
                            if (submittedAt === null && !isAnswering && !isSubmittingExamFlag) {
                              handleOptionChange(question.quiz_question_id, option_id);
                            }
                          }}
                        >
                          <Checkbox
                            id={`${question.quiz_question_id}-${option_id}`}
                            checked={isSelected}
                            onCheckedChange={() =>
                              handleOptionChange(question.quiz_question_id, option_id)
                            }
                            disabled={submittedAt !== null || isAnswering || isSubmittingExamFlag}
                            className="flex-shrink-0"
                          />
                          <div
                            className={`w-8 h-8 flex items-center justify-center text-base font-bold flex-shrink-0 ${
                              showCorrectAnswer
                                ? 'text-green-800 dark:text-green-100'
                                : showIncorrectSelection
                                ? 'text-red-800 dark:text-red-100'
                                : isSelected
                                ? 'text-blue-800 dark:text-blue-100'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {String.fromCharCode(65 + optionIndex)}
                          </div>
                          <label
                            htmlFor={`${question.quiz_question_id}-${option_id}`}
                            className={`text-lg leading-relaxed cursor-pointer flex-1 select-none font-normal ${
                              showCorrectAnswer
                                ? 'text-green-900 dark:text-green-100'
                                : showIncorrectSelection
                                ? 'text-red-900 dark:text-red-100'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {option_text}
                          </label>
                          {/* Show indicators for correct/incorrect answers after submission */}
                          {submittedAt !== null && (
                            <div className="flex-shrink-0 flex items-center space-x-3">
                              {/* Show "CORRECT" label for the right answer */}
                              {isCorrect && (
                                <span className="text-sm font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-lg border border-green-200 dark:border-green-700/50">
                                  CORRECT
                                </span>
                              )}
                              {/* Show "Your answer" label for user's incorrect selection */}
                              {isSelected && question.user_answer_is_correct === false && (
                                <span className="text-sm font-medium text-red-700 dark:text-red-300 bg-gradient-to-r from-red-25 to-red-50/50 dark:bg-gradient-to-r dark:from-red-900/15 dark:to-red-800/10 px-3 py-1 rounded-lg border border-red-100/60 dark:border-red-800/40 shadow-sm">
                                  YOUR ANSWER
                                </span>
                              )}
                              {/* Show checkmark for correct answer */}
                              {isCorrect && (
                                <div className="w-6 h-6 rounded-lg bg-green-50 border border-green-300 flex items-center justify-center">
                                  <FaCheck className="text-green-600 text-sm" />
                                </div>
                              )}
                              {/* Show X for user's incorrect selection */}
                              {isSelected && question.user_answer_is_correct === false && (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 border border-red-200/50 dark:border-red-600/30 flex items-center justify-center shadow-sm">
                                  <FaTimes className="text-red-600 dark:text-red-400 text-sm" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Display error for individual answer submission */}
                  <ErrorMessage
                    error={
                      submitError && submitError.questionId === question.quiz_question_id
                        ? submitError
                        : null
                    }
                  />

                  {/* Add logic for displaying explanations or correct answers after submission */}
                  {submittedAt !== null && question.explanations && (
                    <div className="mt-6">
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full bg-gradient-to-r from-blue-25 to-indigo-25 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-800/50 rounded-xl overflow-hidden shadow-sm"
                      >
                        <AccordionItem value="item-1" className="border-none">
                          <AccordionTrigger className="px-6 py-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors group hover:no-underline cursor-pointer">
                            <div className="flex items-center space-x-3 w-full">
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-25 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-800/30 transition-colors">
                                <FaLightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1 text-left">
                                <span className="text-base font-medium text-blue-700 dark:text-blue-200">
                                  View Detailed Explanation
                                </span>
                                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                                  Click to see the reasoning behind the correct answer
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6 pt-0">
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-blue-100 dark:border-blue-700/50">
                              <div className="space-y-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                {question.explanations
                                  .split('\n')
                                  .filter((paragraph) => paragraph.trim() !== '')
                                  .map((paragraph, index) => (
                                    <p key={index} className="text-base leading-relaxed">
                                      {paragraph.trim()}
                                    </p>
                                  ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {/* Bottom Navigation Controls */}
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex justify-between items-center">
                {/* Left side - Pagination info */}
                <div className="flex items-center space-x-6">
                  {pagination && (
                    <div className="flex items-center space-x-2 text-base text-slate-500 dark:text-slate-400">
                      <span>Page</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {pagination.currentPage}
                      </span>
                      <span>of</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {pagination.totalPages}
                      </span>
                    </div>
                  )}
                  {pagination && (
                    <div className="text-base text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {pagination.totalItems}
                      </span>{' '}
                      total questions
                    </div>
                  )}
                </div>

                {/* Right side - Navigation buttons */}
                <div className="flex items-center space-x-4">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handlePreviousPage}
                    disabled={
                      isLoadingQuestions ||
                      isAnswering ||
                      isNavigatingPage ||
                      !pagination ||
                      pagination.currentPage <= 1
                    }
                    className="min-w-[140px] border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    {isNavigatingPage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <FaArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </>
                    )}
                  </Button>
                  {(() => {
                    if (!pagination) return null;

                    const isLastPage = pagination.currentPage === pagination.totalPages;

                    if (submittedAt === null) {
                      return (
                        <Button
                          size="lg"
                          onClick={handleNextPageOrSubmit}
                          disabled={
                            isLoadingQuestions || isAnswering || isNavigatingPage || !pagination
                          }
                          className={`min-w-[140px] ${
                            isLastPage
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          {isNavigatingPage ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                              {isLastPage ? 'Preparing...' : 'Loading...'}
                            </>
                          ) : isLastPage ? (
                            <>
                              <FaCheck className="w-4 h-4 mr-2" /> Submit Exam
                            </>
                          ) : (
                            <>
                              Next
                              <FaArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      );
                    } else {
                      if (!isLastPage) {
                        return (
                          <Button
                            size="lg"
                            onClick={() => {
                              if (pagination) {
                                setIsNavigatingPage(true);
                                setCurrentPage(pagination.currentPage + 1);
                                setTimeout(() => setIsNavigatingPage(false), 300);
                              }
                            }}
                            disabled={
                              isLoadingQuestions || isAnswering || isNavigatingPage || !pagination
                            }
                            className="min-w-[140px] bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            {isNavigatingPage ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                Loading...
                              </>
                            ) : (
                              <>
                                Next
                                <FaArrowRight className="w-4 h-4 ml-2" />
                              </>
                            )}
                          </Button>
                        );
                      }
                      return null;
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
              No questions are currently available for this exam.
            </p>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
              This might be an issue with the exam setup or the API.
            </p>
          </div>
        )}

        {/* Floating Action Button for Submit - only show on last page during active exam */}
        {submittedAt === null && pagination && pagination.currentPage === pagination.totalPages && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button
              size="lg"
              onClick={handleNextPageOrSubmit}
              disabled={isLoadingQuestions || isAnswering || isNavigatingPage}
              className="shadow-lg hover:shadow-xl transition-shadow bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 h-auto"
            >
              <span className="flex items-center space-x-2">
                {isNavigatingPage ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Preparing...</span>
                  </>
                ) : (
                  <>
                    <FaCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Submit Exam</span>
                  </>
                )}
              </span>
            </Button>
          </div>
        )}

        {showConfirmModal && (
          <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogDescription>
                  Are you sure you want to submit your exam? You will not be able to change your
                  answers after submission.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={submittedAt !== null || isSubmittingExamFlag}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmSubmit}
                  disabled={submittedAt !== null || isSubmittingExamFlag}
                >
                  {isSubmittingExamFlag ? 'Submitting...' : 'Submit Exam'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
