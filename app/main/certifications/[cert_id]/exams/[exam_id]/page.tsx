'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AppHeader from '@/components/custom/appheader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'; //  npx shadcn@latest add dialog
import { useExamQuestions, Question, useSubmitAnswer } from '@/swr/questions'; // Import useSubmitAnswer
import { useSubmitExam } from '@/swr/exams'; // Import useSubmitExam
import ErrorMessage from '@/components/custom/ErrorMessage'; // Import ErrorMessage
import PageLoader from '@/components/custom/PageLoader'; // Import PageLoader
import { Checkbox } from '@/components/ui/checkbox'; // Import Checkbox
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';

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

  useEffect(() => {
    if (apiUserId && certId !== null && examId) {
      setQuestionsApiUrl(
        `/api/users/${apiUserId}/certifications/${certId}/exams/${examId}/questions?page=${currentPage}&pageSize=${pageSize}`,
      );
    }
  }, [apiUserId, certId, examId, currentPage, pageSize]);

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
  const { submitExam, isSubmittingExam, submitExamError } = useSubmitExam(
    apiUserId,
    certId,
    examId,
  );

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
      // console.log(
      //   'Going to previous page. Current answers for page ',
      //   pagination.currentPage,
      //   ':',
      //   userAnswers, // userAnswers removed
      // );
      setCurrentPage(pagination.currentPage - 1);
      // setUserAnswers({}); // userAnswers removed
    }
  };

  const handleNextPageOrSubmit = async () => {
    // console.log('Current answers for page ', pagination?.currentPage, ':', userAnswers); // userAnswers removed

    if (pagination && pagination.currentPage < pagination.totalPages) {
      setCurrentPage(pagination.currentPage + 1);
      // setUserAnswers({}); // userAnswers removed
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

  useEffect(() => {
    if (questions) {
      console.log(`Questions for exam ${examId}:`, JSON.stringify(questions, null, 2));
    }
    if (isQuestionsError) {
      console.error('Error loading questions:', isQuestionsError);
    }
  }, [questions, examId, isQuestionsError]);

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
        <AppHeader title={`Loading Exam ${examId}...`} />
        <div className="space-y-4 mt-6">
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
    );
  }

  if (isQuestionsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AppHeader title={`Error Loading Exam ${examId}`} />
        <p className="text-red-500 mt-6">
          {isQuestionsError.message || 'Error loading questions for this exam.'}
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      <PageLoader isLoading={isSubmittingExam || isSubmittingExamFlag} text="Submitting Exam..." />
      <AppHeader title={`Exam ${examId} - Certification ${certId}`} />

      {/* Display general submission error messages */}
      <ErrorMessage error={submissionResult?.error} className="mt-4" />
      <ErrorMessage error={submitExamError} className="mt-4" />

      {questions && questions.length > 0 ? (
        <div className="space-y-6 mt-6">
          {questions.map((question: Question, index: number) => (
            <Card key={question.quiz_question_id} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <span>
                    Question {((pagination?.currentPage || 1) - 1) * pageSize + index + 1}:{' '}
                    {question.question_body}
                  </span>
                </CardTitle>
                {question.selected_option_id && (
                  <span className="w-18 inline-block rounded-md border border-green-500 px-2 py-1 text-xs font-medium text-green-500">
                    Answered
                  </span>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-4">
                  {question.answerOptions.map(({ option_id, option_text }) => (
                    <li key={option_id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${question.quiz_question_id}-${option_id}`}
                        checked={question.selected_option_id === option_id}
                        onCheckedChange={() =>
                          handleOptionChange(question.quiz_question_id, option_id)
                        }
                        disabled={isAnswering || isSubmittingExamFlag}
                      />
                      <label
                        htmlFor={`${question.quiz_question_id}-${option_id}`}
                        className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {option_text}
                      </label>
                    </li>
                  ))}
                </ul>
                {/* Display error for individual answer submission */}
                <ErrorMessage
                  error={
                    submitError && submitError.questionId === question.quiz_question_id
                      ? submitError
                      : null
                  }
                />
                {/* Add logic for displaying explanations or correct answers after submission */}
              </CardContent>
            </Card>
          ))}
          <div className="mt-8 flex justify-between items-center">
            <div>
              {pagination && (
                <span className="text-sm text-muted-foreground">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                size="lg"
                onClick={handlePreviousPage}
                disabled={
                  isLoadingQuestions || isAnswering || !pagination || pagination.currentPage <= 1
                }
              >
                Previous Page
              </Button>
              <Button
                size="lg"
                onClick={handleNextPageOrSubmit}
                disabled={isLoadingQuestions || isAnswering || !pagination}
              >
                {pagination && pagination.currentPage === pagination.totalPages
                  ? 'Submit Exam'
                  : 'Next Page'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 mt-6 bg-card rounded-lg shadow">
          <p className="text-lg text-muted-foreground">
            No questions are currently available for this exam.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This might be an issue with the exam setup or the API.
          </p>
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
                disabled={isSubmittingExamFlag}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmSubmit} disabled={isSubmittingExamFlag}>
                {isSubmittingExamFlag ? 'Submitting...' : 'Submit Exam'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
