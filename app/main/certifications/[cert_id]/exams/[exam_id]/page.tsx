'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FaCheck, FaEdit, FaLightbulb, FaTimes, FaArrowLeft, FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import { toastHelpers } from '@/src/lib/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'; //  npx shadcn@latest add dialog
import {
  useExamQuestions,
  Question,
  useSubmitAnswer,
  extractTopicsFromQuestions,
} from '@/swr/questions'; // Import useSubmitAnswer and extractTopicsFromQuestions
import { useSubmitExam, useExamState } from '@/swr/exams'; // Import useSubmitExam and useExamState
import { useExamGenerationMonitor } from '@/src/hooks/useExamGenerationMonitor'; // Import generation monitor
import { useExamStatusNotifications } from '@/src/hooks/useExamStatusNotifications'; // Import status notifications
import ErrorMessage from '@/components/custom/ErrorMessage'; // Import ErrorMessage
import PageLoader from '@/components/custom/PageLoader'; // Import PageLoader
import ExamTopicsDisplay from '@/components/custom/ExamTopicsDisplay'; // Import ExamTopicsDisplay
import { ExamGenerationProgressBar } from '@/src/components/custom/ExamGenerationProgressBar'; // Import ExamGenerationProgressBar
import { Checkbox } from '@/components/ui/checkbox'; // Import Checkbox
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'; // Added
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip'; // Added for tooltip functionality
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

  // Use ref to track previous URL to prevent unnecessary API calls
  const previousUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (apiUserId && certId !== null && examId) {
      const newUrl = `/api/users/${apiUserId}/certifications/${certId}/exams/${examId}/questions?page=${currentPage}&pageSize=${pageSize}`;

      // Only update if URL has actually changed
      if (previousUrlRef.current !== newUrl) {
        setQuestionsApiUrl(newUrl);
        previousUrlRef.current = newUrl;
      }
    }
  }, [apiUserId, certId, examId, currentPage, pageSize]);

  // Use the enhanced monitoring hook for better generation status tracking
  // Only use the monitor when we actually need it (for generating exams)
  const {
    examState,
    isValidatingExamState,
    forceStatusCheck,
    generationProgress,
    shouldShowCheckButton,
  } = useExamGenerationMonitor(apiUserId, certId, examId);
  const isLoadingExamState = !examState && !isValidatingExamState;

  // Add status change notifications only when exam state exists
  useExamStatusNotifications(examState);

  // Get exam questions first
  const {
    questions,
    pagination,
    isLoadingQuestions,
    isQuestionsError,
    mutateQuestions, // Ensure mutateQuestions is destructured
  } = useExamQuestions(questionsApiUrl);

  // Use the SWR hook to get exam topics from questions
  const topicData = React.useMemo(() => {
    return extractTopicsFromQuestions(questions || []);
  }, [questions]);

  const { topics, totalTopics, totalQuestions } = topicData;

  // Extract values from exam state for easier access
  const score = examState?.score ?? null;
  const submittedAt = examState?.submitted_at ?? null;

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

        // Show subtle success toast notification for answer submission
        toastHelpers.success.answerSaved();

        // After successful submission, you might want to revalidate the questions
        // if the backend response could affect the overall list or pagination.
        // mutateQuestions(undefined, true);
      } catch (error) {
        // Error is already handled by useSubmitAnswer hook, but you can log or act on submitError

        // Show error toast notification for answer submission failure
        toastHelpers.error.answerSaveFailed((error as Error).message);

        // Revert optimistic update on failure by revalidating the original questions data
        mutateQuestions(undefined, true);
      }
    }
  };

  // Effect to observe submission errors from the hook
  useEffect(() => {
    if (submitError) {
      // Show error toast notification for persistent submission errors
      toastHelpers.error.answerSaveFailed(submitError.message);

      // And ensure optimistic UI is reverted if not already handled by the catch block in handleOptionChange
      mutateQuestions(undefined, true);
    }
  }, [submitError, mutateQuestions]);

  // Effect to observe exam submission errors from the hook
  useEffect(() => {
    if (submitExamError) {
      // The alert is now handled by the ErrorMessage component, but you can keep this for logging
      // alert(`Failed to submit exam: ${submitExamError.message}`);
      setSubmissionResult({ error: submitExamError.message });
    }
  }, [submitExamError]);

  const handlePreviousPage = async () => {
    if (pagination && pagination.currentPage > 1 && !isNavigatingPage) {
      setIsNavigatingPage(true);
      // Immediate UI update for optimistic loading
      setCurrentPage(pagination.currentPage - 1);
      // Scroll to top of the page smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset loading state after a brief moment
      setTimeout(() => setIsNavigatingPage(false), 400);
    }
  };

  const handleNextPageOrSubmit = async () => {
    if (pagination && pagination.currentPage < pagination.totalPages && !isNavigatingPage) {
      setIsNavigatingPage(true);
      // Immediate UI update for optimistic loading
      setCurrentPage(pagination.currentPage + 1);
      // Scroll to top of the page smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset loading state after a brief moment
      setTimeout(() => setIsNavigatingPage(false), 400);
    } else if (pagination && pagination.currentPage === pagination.totalPages) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    if (!apiUserId || certId === null || !examId) {
      // Show error toast notification
      toastHelpers.error.missingInformation();

      setSubmissionResult({ error: 'Could not submit exam. Missing necessary information.' });
      return;
    }
    setIsSubmittingExamFlag(true);
    try {
      // The body for the submit request might be empty or could contain specific data
      // based on backend requirements. For now, sending an empty object.
      const result = await submitExam({ apiUserId, certId, examId, body: {} });
      setSubmissionResult(result);

      // Show success toast notification
      toastHelpers.success.examSubmitted();

      // Revalidate exam state to get updated score and submission status
      forceStatusCheck();
      // Optionally, redirect the user or show a summary page
      // router.push(`/main/certifications/${certId}/exams/${examId}/results`);
    } catch (error: any) {
      // Show error toast notification
      toastHelpers.error.examSubmissionFailed(error.message);

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

  // Check if this is a 404 error (exam not found) and redirect to not-found page
  const is404Error = (isQuestionsError as any)?.status === 404;

  if (is404Error) {
    notFound(); // Redirect to the global not-found page
  }

  // Handle other types of errors (network errors, server errors, etc.)
  if (isQuestionsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: 'Certifications', href: '/main/certifications' },
              {
                label: `Certification ${certId}`,
                href: `/main/certifications/${certId}/exams`,
              },
              { label: 'Error Loading Exam', current: true },
            ]}
          />

          {/* Error Card */}
          <div className="mt-8">
            <Card className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 shadow-lg rounded-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Error Icon */}
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Error Title */}
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
                      Error Loading Exam {examId?.substring(0, 8)}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                      {isQuestionsError?.message || 'Error loading exam data.'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="min-w-[120px]"
                    >
                      Try Again
                    </Button>
                    <Button onClick={() => window.history.back()} className="min-w-[120px]">
                      <FaArrowLeft className="w-4 h-4 mr-2" />
                      Go Back
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <PageLoader isLoading={isSubmittingExam || isSubmittingExamFlag} text="Submitting Exam..." />
      <div className="max-w-4xl mx-auto px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Certifications', href: '/main/certifications' },
            {
              label: examState?.certification?.name || `Certification ${certId}`,
              href: `/main/certifications/${certId}/exams`,
            },
            { label: `Exam ${examId?.substring(0, 8)}`, current: true },
          ]}
        />

        {/* Exam Status Card */}
        <div className="mb-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-lg rounded-xl overflow-hidden">
          {/* Status Header */}
          <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-violet-50/50 via-blue-50/30 to-purple-50/50 dark:from-violet-900/20 dark:via-blue-900/15 dark:to-purple-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <span>Exam Progress</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FaInfoCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-sm">
                        Your answers are automatically saved as you select them. Take your time to
                        review each question carefully.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </h2>
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                {submittedAt !== null ? (
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 border border-emerald-200/50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700/30">
                    <FaCheck className="w-3 h-3 mr-1.5" />
                    {examState?.status === 'PASSED'
                      ? 'Completed'
                      : examState?.status === 'FAILED'
                      ? 'Completed'
                      : 'Completed'}
                  </span>
                ) : examState?.exam_status === 'QUESTIONS_GENERATING' ? (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 border border-blue-200/50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700/30">
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-700 border-t-transparent mr-1.5"></div>
                    Generating Questions
                  </span>
                ) : examState?.exam_status === 'QUESTION_GENERATION_FAILED' ? (
                  <span className="inline-flex items-center rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 border border-red-200/50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30">
                    <FaTimes className="w-3 h-3 mr-1.5" /> Generation Failed
                  </span>
                ) : examState?.exam_status === 'READY' ? (
                  <span className="inline-flex items-center rounded-md bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 border border-green-200/50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/30">
                    <FaCheck className="w-3 h-3 mr-1.5" /> Ready
                  </span>
                ) : examState?.exam_status === 'PENDING_QUESTIONS' ? (
                  <span className="inline-flex items-center rounded-md bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700 border border-yellow-200/50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700/30">
                    <FaEdit className="w-3 h-3 mr-1.5" /> Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 border border-violet-200/50 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-700/30">
                    <FaEdit className="w-3 h-3 mr-1.5" /> In Progress
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-3 py-4 sm:px-6 sm:py-6">
            <div className="space-y-6">
              {/* Score Section - only show if exam is completed */}
              {score !== null && submittedAt !== null && (
                <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <div className="text-center">
                    <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                      Final Score
                    </p>
                    <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      {score}%
                    </p>
                  </div>
                </div>
              )}

              {/* Exam Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Total Questions */}
                <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-sm p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/50 dark:to-indigo-800/50 rounded-lg flex items-center justify-center shadow-sm">
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
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Questions
                      </p>
                    </div>
                    <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-center">
                      {pagination?.totalItems || examState?.total_questions || '...'}
                    </p>
                  </div>
                </div>

                {/* Started Date */}
                <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-sm p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-800/50 dark:to-green-800/50 rounded-lg flex items-center justify-center shadow-sm">
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
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Started
                      </p>
                    </div>
                    <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-center">
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

                {/* Progress or Submission Date */}
                {submittedAt !== null ? (
                  <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-sm p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-800/50 dark:to-green-800/50 rounded-lg flex items-center justify-center shadow-sm">
                          <FaCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                          Submitted
                        </p>
                      </div>
                      <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-center">
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
                  <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-sm p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-800/50 dark:to-purple-800/50 rounded-lg flex items-center justify-center shadow-sm">
                          <svg
                            className="w-4 h-4 text-violet-600 dark:text-violet-400"
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
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                          Progress
                        </p>
                      </div>
                      <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-center">
                        {pagination?.currentPage && pagination?.totalPages
                          ? `${pagination.currentPage}/${pagination.totalPages}`
                          : 'Active'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Prompt Display */}
              {examState?.custom_prompt_text && (
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/25 dark:via-indigo-900/25 dark:to-purple-900/25 p-5 sm:p-6 rounded-xl border border-blue-200 dark:border-blue-700/50 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/50 dark:to-indigo-800/50 rounded-lg flex items-center justify-center shadow-sm">
                        <FaLightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                        Custom Focus Area
                      </h4>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 border border-blue-100 dark:border-blue-700/30">
                      <blockquote className="text-base sm:text-lg font-medium text-blue-900 dark:text-blue-100 leading-relaxed italic">
                        &ldquo;{examState.custom_prompt_text}&rdquo;
                      </blockquote>
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
          <div className="space-y-6 sm:space-y-8">
            {questions.map((question: Question, index: number) => (
              <Card
                key={question.quiz_question_id}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30 border-b border-slate-100 dark:border-slate-700/50 p-3 sm:p-6">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base sm:text-lg leading-relaxed flex-1 mr-2 sm:mr-4">
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-normal border border-blue-100 dark:border-blue-800/50">
                            Q{((pagination?.currentPage || 1) - 1) * pageSize + index + 1}
                          </div>
                          {question.exam_topic && (
                            <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/25 dark:to-purple-900/25 text-violet-700 dark:text-violet-300 text-xs sm:text-sm font-medium border border-violet-200 dark:border-violet-700/50 shadow-sm">
                              <svg
                                className="w-3 h-3 mr-1 sm:mr-1.5 text-violet-600 dark:text-violet-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                                <path
                                  fillRule="evenodd"
                                  d="M13.828 7.172a1 1 0 011.414 0A5.983 5.983 0 0117 12a5.983 5.983 0 01-1.758 4.828 1 1 0 01-1.414-1.414A3.987 3.987 0 0015 12a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {question.exam_topic}
                            </div>
                          )}
                        </div>
                        <div className="text-slate-700 dark:text-slate-200 font-medium text-base sm:text-lg leading-relaxed mt-3">
                          {question.question_text}
                        </div>
                      </div>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="space-y-3 mb-6">
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
                          className={`flex items-center space-x-3 p-3 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer group relative border ${
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
                              isSelected &&
                                submittedAt === null &&
                                question.user_answer_is_correct !== true
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
                            className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base font-bold flex-shrink-0 rounded-lg ${
                              showCorrectAnswer
                                ? 'text-green-800 dark:text-green-100 bg-green-100 dark:bg-green-800/30'
                                : showIncorrectSelection
                                ? 'text-red-800 dark:text-red-100 bg-red-100 dark:bg-red-800/30'
                                : isSelected
                                ? 'text-blue-800 dark:text-blue-100 bg-blue-100 dark:bg-blue-800/30'
                                : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700'
                            }`}
                          >
                            {String.fromCharCode(65 + optionIndex)}
                          </div>
                          <label
                            htmlFor={`${question.quiz_question_id}-${option_id}`}
                            className={`text-base sm:text-lg leading-relaxed cursor-pointer flex-1 select-none font-normal ${
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
                            <div className="flex-shrink-0 flex items-center space-x-2">
                              {/* Show checkmark for correct answer */}
                              {isCorrect && (
                                <div className="w-7 h-7 rounded-lg bg-green-50 border-2 border-green-300 dark:bg-green-900/30 dark:border-green-600/60 flex items-center justify-center shadow-sm">
                                  <FaCheck className="text-green-600 dark:text-green-400 text-sm" />
                                </div>
                              )}
                              {/* Show X for user's incorrect selection */}
                              {isSelected && question.user_answer_is_correct === false && (
                                <div className="w-7 h-7 rounded-lg bg-red-50 border-2 border-red-300 dark:bg-red-900/30 dark:border-red-600/60 flex items-center justify-center shadow-sm">
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

                  {/* Add logic for displaying explanations only after submission */}
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
            {/* Bottom Navigation Controls - At end of question list */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-700/50">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 lg:p-6 shadow-sm">
                <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
                  {/* Pagination info - centered on mobile, left on desktop */}
                  <div className="flex flex-col items-center space-y-2 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6">
                    {pagination && (
                      <div className="flex items-center space-x-2 text-sm lg:text-base text-slate-500 dark:text-slate-400">
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
                      <div className="text-sm lg:text-base text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                          {pagination.totalItems}
                        </span>{' '}
                        total questions
                      </div>
                    )}
                  </div>

                  {/* Navigation buttons - full width on mobile, auto width on desktop */}
                  <div className="flex items-center space-x-3 w-full lg:w-auto justify-center lg:justify-end">
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
                      className="flex-1 lg:flex-none lg:min-w-[140px] border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      {isNavigatingPage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                          <span className="hidden sm:inline">Loading...</span>
                          <span className="sm:hidden">...</span>
                        </>
                      ) : (
                        <>
                          <FaArrowLeft className="w-4 h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Previous</span>
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
                            className={`flex-1 lg:flex-none lg:min-w-[140px] ${
                              isLastPage
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-violet-600 hover:bg-violet-700 text-white'
                            }`}
                          >
                            {isNavigatingPage ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                <span className="hidden sm:inline">
                                  {isLastPage ? 'Preparing...' : 'Loading...'}
                                </span>
                                <span className="sm:hidden">...</span>
                              </>
                            ) : isLastPage ? (
                              <>
                                <FaCheck className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Submit Exam</span>
                                <span className="sm:hidden">Submit</span>
                              </>
                            ) : (
                              <>
                                <span className="hidden sm:inline">Next</span>
                                <FaArrowRight className="w-4 h-4 sm:ml-2" />
                              </>
                            )}
                          </Button>
                        );
                      } else {
                        if (!isLastPage) {
                          return (
                            <Button
                              size="lg"
                              onClick={handleNextPageOrSubmit}
                              disabled={
                                isLoadingQuestions || isAnswering || isNavigatingPage || !pagination
                              }
                              className="flex-1 lg:flex-none lg:min-w-[140px] bg-violet-600 hover:bg-violet-700 text-white"
                            >
                              {isNavigatingPage ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                  <span className="hidden sm:inline">Loading...</span>
                                  <span className="sm:hidden">...</span>
                                </>
                              ) : (
                                <>
                                  <span className="hidden sm:inline">Next</span>
                                  <FaArrowRight className="w-4 h-4 sm:ml-2" />
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
          </div>
        ) : (
          <div className="text-center py-12 mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            {examState?.exam_status === 'QUESTIONS_GENERATING' ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                  Questions are being generated for this exam.
                </p>
                <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
                  Please wait while we prepare your exam questions. This may take a few minutes.
                </p>

                {/* Enhanced progress display */}
                {generationProgress && (
                  <div className="mt-6 mb-6 max-w-md mx-auto">
                    <ExamGenerationProgressBar
                      progress={generationProgress.completionPercentage}
                      estimatedTimeRemaining={generationProgress.estimatedTimeRemaining}
                      className="w-full"
                      showPercentage={true}
                      showTimeRemaining={true}
                      isAnimated={true}
                      realProgress={generationProgress.realProgress}
                    />
                  </div>
                )}

                {/* Smart check status button - only show when likely complete */}
                {shouldShowCheckButton && (
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={forceStatusCheck}
                      disabled={isValidatingExamState}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/20"
                    >
                      {isValidatingExamState ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent mr-2"></div>
                          Checking...
                        </>
                      ) : (
                        'Check Status'
                      )}
                    </Button>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      Generation should be complete - click to check
                    </p>
                  </div>
                )}
              </>
            ) : examState?.exam_status === 'QUESTION_GENERATION_FAILED' ? (
              <>
                <FaTimes className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                  Question generation failed for this exam.
                </p>
                <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
                  Please try refreshing the page or contact support if the issue persists.
                </p>
              </>
            ) : examState?.exam_status === 'PENDING_QUESTIONS' ? (
              <>
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaEdit className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                  This exam is pending question setup.
                </p>
                <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
                  Please wait while the exam is being prepared.
                </p>
              </>
            ) : (
              <>
                <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                  No questions are currently available for this exam.
                </p>
                <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
                  This might be an issue with the exam setup or the API.
                </p>
              </>
            )}
          </div>
        )}
        {/* Floating Action Button removed since navigation is now at bottom of content */}

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
