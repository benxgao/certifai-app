'use client';

import React from 'react';
import { Question } from '@/swr/questions';
import { QuestionCard } from './QuestionCard';
import { ExamBottomNavigation } from './ExamBottomNavigation';

interface ExamQuestionsContainerProps {
  questions: Question[];
  pagination: any;
  pageSize: number;
  submittedAt: number | null;
  isAnswering: boolean;
  isSubmittingExamFlag: boolean;
  isNavigatingPage: boolean;
  isLoadingQuestions: boolean;
  submitError: any;
  onOptionChange: (questionId: string, optionId: string) => void;
  isCorrectOption: (question: Question, optionId: string) => boolean;
  onPreviousPage: () => void;
  onNextPageOrSubmit: () => void;
}

export const ExamQuestionsContainer: React.FC<ExamQuestionsContainerProps> = ({
  questions,
  pagination,
  pageSize,
  submittedAt,
  isAnswering,
  isSubmittingExamFlag,
  isNavigatingPage,
  isLoadingQuestions,
  submitError,
  onOptionChange,
  isCorrectOption,
  onPreviousPage,
  onNextPageOrSubmit,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {questions.map((question: Question, index: number) => (
        <QuestionCard
          key={question.quiz_question_id}
          question={question}
          index={index}
          pagination={pagination}
          pageSize={pageSize}
          submittedAt={submittedAt}
          isAnswering={isAnswering}
          isSubmittingExamFlag={isSubmittingExamFlag}
          submitError={submitError}
          onOptionChange={onOptionChange}
          isCorrectOption={isCorrectOption}
        />
      ))}

      {/* Bottom Navigation Controls */}
      <ExamBottomNavigation
        pagination={pagination}
        submittedAt={submittedAt}
        isLoadingQuestions={isLoadingQuestions}
        isAnswering={isAnswering}
        isNavigatingPage={isNavigatingPage}
        onPreviousPage={onPreviousPage}
        onNextPageOrSubmit={onNextPageOrSubmit}
      />
    </div>
  );
};
