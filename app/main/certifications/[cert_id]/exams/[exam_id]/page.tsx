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
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useExamQuestions, Question, useSubmitAnswer } from '@/swr/questions'; // Import useSubmitAnswer

export default function ExamAttemptPage() {
  const params = useParams();
  const certId = params.cert_id ? parseInt(params.cert_id as string, 10) : null;
  const examId = params.exam_id as string | null;
  const { apiUserId } = useFirebaseAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [questionsApiUrl, setQuestionsApiUrl] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
  const { submitAnswer, isSubmitting, submitError } = useSubmitAnswer();

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
    console.log('Submitting exam...');
    alert('Exam submitted! (Not really, implement submission logic here)');
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
      <AppHeader title={`Exam ${examId} - Certification ${certId}`} />

      {questions && questions.length > 0 ? (
        <div className="space-y-6 mt-6">
          {questions.map((question: Question, index: number) => (
            <Card key={question.quiz_question_id} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">
                  Question {((pagination?.currentPage || 1) - 1) * pageSize + index + 1}:{' '}
                  {question.question_body}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {question.answerOptions.map(({ option_id, option_text }) => (
                    <li key={option_id} className="flex items-center">
                      {/* Use option_id for key if unique */}
                      <input
                        type="radio"
                        name={`question-${question.quiz_question_id}`}
                        id={`question-${question.quiz_question_id}-option-${option_id}`}
                        value={option_id} // Store the actual option_id
                        className="mr-2"
                        onChange={() => handleOptionChange(question.quiz_question_id, option_id)}
                        checked={question.selected_option_id === option_id} // Use question.selected_option_id
                      />
                      <label htmlFor={`question-${question.quiz_question_id}-option-${option_id}`}>
                        {option_text}
                      </label>
                    </li>
                  ))}
                </ul>
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
                  isLoadingQuestions || isSubmitting || !pagination || pagination.currentPage <= 1
                }
              >
                Previous Page
              </Button>
              <Button
                size="lg"
                onClick={handleNextPageOrSubmit}
                disabled={isLoadingQuestions || isSubmitting || !pagination}
              >
                {isSubmitting
                  ? 'Saving...'
                  : isLoadingQuestions
                  ? 'Loading...'
                  : pagination && pagination.currentPage < pagination.totalPages
                  ? 'Next Page'
                  : 'Submit Exam'}
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
              <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSubmit}>Submit Exam</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
