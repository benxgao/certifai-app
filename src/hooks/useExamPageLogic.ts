'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import {
  useExamQuestions,
  Question,
  useSubmitAnswer,
  extractTopicsFromQuestions,
} from '@/swr/questions';
import { useSubmitExam } from '@/swr/exams';
import { useExamGenerationMonitor } from '@/src/hooks/useExamGenerationMonitor';
import { useExamStatusNotifications } from '@/src/hooks/useExamStatusNotifications';
import { toastHelpers } from '@/src/lib/toast';

export const useExamPageLogic = () => {
  const params = useParams();
  const certId = params.cert_id ? parseInt(params.cert_id as string, 10) : null;
  const examId = params.exam_id as string | null;
  const { apiUserId } = useFirebaseAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [questionsApiUrl, setQuestionsApiUrl] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [isSubmittingExamFlag, setIsSubmittingExamFlag] = useState(false);
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

  // Get exam questions
  const { questions, pagination, isLoadingQuestions, isQuestionsError, mutateQuestions } =
    useExamQuestions(questionsApiUrl);

  // Use the SWR hook to get exam topics from questions
  const topicData = React.useMemo(() => {
    return extractTopicsFromQuestions(questions || []);
  }, [questions]);

  const { topics, totalTopics, totalQuestions } = topicData;

  // Extract values from exam state for easier access
  const score = examState?.score ?? null;
  const submittedAt = examState?.submitted_at ?? null;

  // Use the SWR Mutation hooks
  const { submitAnswer, isAnswering, submitError } = useSubmitAnswer();
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
      } catch (error) {
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
      const result = await submitExam({ apiUserId, certId, examId, body: {} });
      setSubmissionResult(result);

      // Show success toast notification
      toastHelpers.success.examSubmitted();

      // Revalidate exam state to get updated score and submission status
      forceStatusCheck();
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
    if (
      submittedAt !== null &&
      !question.correct_option_id &&
      !question.answerOptions.some((opt) => opt.is_correct)
    ) {
      // For demo purposes, we'll assume the second option (index 1) is correct
      const correctIndex = 1;
      const correctOption = question.answerOptions[correctIndex];
      if (correctOption && correctOption.option_id === optionId) {
        return true;
      }
    }

    return false;
  };

  return {
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
  };
};
