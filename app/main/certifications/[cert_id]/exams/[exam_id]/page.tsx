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

  if (isQuestionsError || isExamStateError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AppHeader title={`Error Loading Exam ${examId}`} />
        <p className="text-red-500 mt-6">
          {isQuestionsError?.message || isExamStateError?.message || 'Error loading exam data.'}
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
      {score !== null && (
        <div className="text-center my-4">
          <p className="text-2xl font-bold">Your Score: {score}%</p>
        </div>
      )}

      {/* Display general submission error messages */}
      <ErrorMessage error={submissionResult?.error} className="mt-4" />
      <ErrorMessage error={submitExamError} className="mt-4" />

      {questions && questions.length > 0 ? (
        <div className="space-y-6 mt-6">
          {questions.map((question: Question, index: number) => (
            <Card key={question.quiz_question_id} className="shadow-md">
              <CardHeader className="pb-2">
                {' '}
                {/* Removed relative positioning and top padding, added bottom padding */}
                <CardTitle className="text-lg">
                  {' '}
                  {/* Removed margin-right */}
                  <span className="text-gray-600 dark:text-gray-400">
                    Question {((pagination?.currentPage || 1) - 1) * pageSize + index + 1}:{' '}
                    {question.question_text}
                  </span>
                </CardTitle>
                {/* Container for status labels - moved under CardTitle */}
                <div className="flex items-center space-x-2 mt-2">
                  {' '}
                  {/* Added margin-top */}
                  {question.selected_option_id && submittedAt === null && (
                    <span className="inline-block rounded-md border border-green-500 px-2 py-1 text-xs font-medium text-green-500">
                      Answered
                    </span>
                  )}
                  {submittedAt !== null && question.user_answer_is_correct === true && (
                    <span className="inline-block rounded-md border border-green-500 bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      Correct
                    </span>
                  )}
                  {submittedAt !== null && question.user_answer_is_correct === false && (
                    <span className="inline-block rounded-md border border-red-500 bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                      Incorrect
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-4 list-none">
                  {question.answerOptions.map(({ option_id, option_text }) => (
                    <li key={option_id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${question.quiz_question_id}-${option_id}`}
                        checked={question.selected_option_id === option_id}
                        onCheckedChange={() =>
                          handleOptionChange(question.quiz_question_id, option_id)
                        }
                        disabled={submittedAt !== null || isAnswering || isSubmittingExamFlag}
                      />
                      <label
                        htmlFor={`${question.quiz_question_id}-${option_id}`}
                        className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-800 dark:text-gray-300"
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
                {submittedAt !== null && question.explanations && (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full mt-8 pt-0 border-t border-gray-200"
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-muted-foreground">
                        View Explanation
                      </AccordionTrigger>
                      <AccordionContent>{question.explanations}</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
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
              {(() => {
                if (!pagination) return null; // Should not happen if questions are loaded

                const isLastPage = pagination.currentPage === pagination.totalPages;

                if (submittedAt === null) {
                  // Exam not submitted yet
                  return (
                    <Button
                      size="lg"
                      onClick={handleNextPageOrSubmit} // This function handles both next and submit
                      disabled={isLoadingQuestions || isAnswering || !pagination}
                    >
                      {isLastPage ? 'Submit Exam' : 'Next Page'}
                    </Button>
                  );
                } else {
                  // Exam has been submitted
                  // Only show "Next Page" if not on the last page. "Submit Exam" is hidden.
                  if (!isLastPage) {
                    return (
                      <Button
                        size="lg"
                        onClick={() => {
                          if (pagination) {
                            // Ensure pagination is defined
                            setCurrentPage(pagination.currentPage + 1);
                          }
                        }}
                        disabled={isLoadingQuestions || isAnswering || !pagination}
                      >
                        Next Page
                      </Button>
                    );
                  }
                  return null; // No "Next Page" or "Submit Exam" button if submitted and on last page
                }
              })()}
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
  );
}
