'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FaCheck, FaTimes, FaLightbulb } from 'react-icons/fa';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ErrorMessage from '@/components/custom/ErrorMessage';
import { Question } from '@/swr/questions';
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardContent,
} from '@/src/components/ui/dashboard-card';

interface QuestionCardProps {
  question: Question;
  index: number;
  pagination: any;
  pageSize: number;
  submittedAt: number | null;
  isAnswering: boolean;
  isSubmittingExamFlag: boolean;
  submitError: any;
  onOptionChange: (questionId: string, optionId: string) => void;
  isCorrectOption: (question: Question, optionId: string) => boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  pagination,
  pageSize,
  submittedAt,
  isAnswering,
  isSubmittingExamFlag,
  submitError,
  onOptionChange,
  isCorrectOption,
}) => {
  return (
    <DashboardCard className="hover:shadow-2xl transition-all duration-300">
      <DashboardCardHeader>
        <div className="flex items-start justify-between">
          <div className="text-base sm:text-lg leading-relaxed flex-1 mr-2 sm:mr-4 text-slate-900 dark:text-slate-100">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/30 dark:to-blue-900/30 text-violet-600 dark:text-violet-400 text-xs sm:text-sm font-normal border border-violet-200/60 dark:border-violet-700/50 shadow-sm backdrop-blur-sm">
                  Q{((pagination?.currentPage || 1) - 1) * pageSize + index + 1}
                </div>
                {question.exam_topic && (
                  <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/60 dark:to-slate-700/60 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-normal border border-slate-200 dark:border-slate-600/50 shadow-sm">
                    <svg
                      className="w-3 h-3 mr-1 sm:mr-1.5 text-slate-600 dark:text-slate-400"
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
          </div>
        </div>
      </DashboardCardHeader>
      <DashboardCardContent className="pt-4">
        <div className="space-y-4 mb-6">
          {question.answerOptions.map(({ option_id, option_text }, optionIndex) => {
            const isSelected = question.selected_option_id === option_id;
            const isCorrect = isCorrectOption(question, option_id);
            const showCorrectAnswer = submittedAt !== null && isCorrect;
            const showIncorrectSelection =
              submittedAt !== null && isSelected && question.user_answer_is_correct === false;

            return (
              <div
                key={option_id}
                className={`flex items-center space-x-3 p-4 sm:p-5 rounded-xl transition-all duration-300 cursor-pointer group relative border backdrop-blur-sm ${
                  // Show correct answer with green background after submission
                  showCorrectAnswer
                    ? 'bg-green-50/80 border-green-200/60 dark:bg-green-900/30 dark:border-green-600/50 shadow-lg'
                    : // Show selected wrong answer with red background
                    showIncorrectSelection
                    ? 'bg-gradient-to-r from-red-50/90 to-red-100/60 border-red-200/70 dark:bg-gradient-to-r dark:from-red-900/30 dark:to-red-800/20 dark:border-red-600/50 shadow-lg'
                    : // Show selected correct answer (already handled above, but for clarity)
                    isSelected && submittedAt !== null && question.user_answer_is_correct === true
                    ? 'bg-green-50/80 border-green-200/60 dark:bg-green-900/30 dark:border-green-600/50 shadow-lg'
                    : // Show regular selected state during exam
                    isSelected && submittedAt === null && question.user_answer_is_correct !== true
                    ? 'bg-blue-50/80 border-blue-200/60 dark:bg-blue-900/30 dark:border-blue-600/50 shadow-lg'
                    : // Default state with hover
                      'bg-white/80 border-slate-200/60 hover:bg-slate-50/80 hover:border-slate-300/60 dark:bg-slate-800/80 dark:border-slate-600/50 dark:hover:bg-slate-700/80 dark:hover:border-slate-500/60'
                } ${
                  submittedAt !== null || isAnswering || isSubmittingExamFlag
                    ? 'cursor-not-allowed opacity-60'
                    : 'hover:shadow-lg hover:scale-[1.01]'
                }`}
                onClick={() => {
                  if (submittedAt === null && !isAnswering && !isSubmittingExamFlag) {
                    onOptionChange(question.quiz_question_id, option_id);
                  }
                }}
              >
                <Checkbox
                  id={`${question.quiz_question_id}-${option_id}`}
                  checked={isSelected}
                  onCheckedChange={() => onOptionChange(question.quiz_question_id, option_id)}
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
            submitError && submitError.questionId === question.quiz_question_id ? submitError : null
          }
        />

        {/* Add logic for displaying explanations only after submission */}
        {submittedAt && question.explanations && question.explanations.trim().length > 0 && (
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
      </DashboardCardContent>
    </DashboardCard>
  );
};
