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
  // Debug log for explanations
  React.useEffect(() => {
    if (submittedAt !== null) {
      console.log('QuestionCard Debug:', {
        questionId: question.quiz_question_id,
        submittedAt,
        explanations: question.explanations,
        explanationsType: typeof question.explanations,
        explanationsLength: question.explanations?.length,
        hasExplanations: !!question.explanations,
      });
    }
  }, [question, submittedAt]);

  return (
    <DashboardCard className="hover:shadow-2xl hover:shadow-violet-500/20 dark:hover:shadow-violet-400/10 transition-all duration-500 hover:scale-[1.01] hover:-translate-y-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60">
      <DashboardCardHeader className="bg-gradient-to-r from-slate-50/90 via-white/80 to-violet-50/40 dark:from-slate-800/60 dark:via-slate-700/40 dark:to-violet-950/30 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="text-base sm:text-lg leading-relaxed flex-1 mr-3 sm:mr-5 text-slate-900 dark:text-slate-100">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <div className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-violet-100/80 via-violet-50/70 to-blue-100/60 dark:from-violet-900/40 dark:via-violet-800/30 dark:to-blue-900/40 text-violet-700 dark:text-violet-300 text-sm sm:text-base font-semibold border border-violet-200/80 dark:border-violet-600/60 shadow-lg backdrop-blur-sm hover:shadow-violet-200/60 dark:hover:shadow-violet-500/20 transition-all duration-300">
                  Q{((pagination?.currentPage || 1) - 1) * pageSize + index + 1}
                </div>
                {question.exam_topic && (
                  <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-slate-100/90 via-slate-50/80 to-slate-100/70 dark:from-slate-800/80 dark:via-slate-700/70 dark:to-slate-800/60 text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium border border-slate-300/70 dark:border-slate-600/60 shadow-md backdrop-blur-sm hover:shadow-slate-200/60 dark:hover:shadow-slate-500/20 transition-all duration-300">
                    <svg
                      className="w-4 h-4 mr-2 sm:mr-2.5 text-slate-600 dark:text-slate-400"
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
              <div className="text-slate-800 dark:text-slate-100 font-semibold text-lg sm:text-xl leading-relaxed mt-4 sm:mt-5">
                {question.question_text}
              </div>
            </div>
          </div>
        </div>
      </DashboardCardHeader>
      <DashboardCardContent className="pt-6 bg-gradient-to-b from-transparent via-slate-50/30 to-slate-100/20 dark:via-slate-800/30 dark:to-slate-900/20">
        <div className="space-y-5 mb-8">
          {question.answerOptions.map(({ option_id, option_text }, optionIndex) => {
            const isSelected = question.selected_option_id === option_id;
            const isCorrect = isCorrectOption(question, option_id);
            const showCorrectAnswer = submittedAt !== null && isCorrect;
            const showIncorrectSelection =
              submittedAt !== null && isSelected && question.user_answer_is_correct === false;

            return (
              <div
                key={option_id}
                className={`flex items-center space-x-4 p-5 sm:p-6 rounded-2xl transition-all duration-300 cursor-pointer group relative border-2 backdrop-blur-sm ${
                  // Show correct answer with green background after submission
                  showCorrectAnswer
                    ? 'bg-gradient-to-r from-green-50/90 via-green-25/80 to-emerald-50/70 border-green-300/80 dark:bg-gradient-to-r dark:from-green-900/40 dark:via-green-800/30 dark:to-emerald-900/30 dark:border-green-500/60 shadow-xl shadow-green-200/30 dark:shadow-green-500/10'
                    : // Show selected wrong answer with red background
                    showIncorrectSelection
                    ? 'bg-gradient-to-r from-red-50/90 via-red-25/80 to-rose-50/70 border-red-300/80 dark:bg-gradient-to-r dark:from-red-900/40 dark:via-red-800/30 dark:to-rose-900/30 dark:border-red-500/60 shadow-xl shadow-red-200/30 dark:shadow-red-500/10'
                    : // Show selected correct answer (already handled above, but for clarity)
                    isSelected && submittedAt !== null && question.user_answer_is_correct === true
                    ? 'bg-gradient-to-r from-green-50/90 via-green-25/80 to-emerald-50/70 border-green-300/80 dark:bg-gradient-to-r dark:from-green-900/40 dark:via-green-800/30 dark:to-emerald-900/30 dark:border-green-500/60 shadow-xl shadow-green-200/30 dark:shadow-green-500/10'
                    : // Show regular selected state during exam
                    isSelected && submittedAt === null && question.user_answer_is_correct !== true
                    ? 'bg-gradient-to-r from-blue-50/90 via-blue-25/80 to-indigo-50/70 border-blue-300/80 dark:bg-gradient-to-r dark:from-blue-900/40 dark:via-blue-800/30 dark:to-indigo-900/30 dark:border-blue-500/60 shadow-xl shadow-blue-200/30 dark:shadow-blue-500/10'
                    : // Default state with hover
                      'bg-white/90 border-slate-200/80 hover:bg-gradient-to-r hover:from-slate-50/90 hover:via-white/80 hover:to-violet-50/40 hover:border-violet-200/60 dark:bg-slate-800/90 dark:border-slate-600/70 dark:hover:bg-gradient-to-r dark:hover:from-slate-700/80 dark:hover:via-slate-800/70 dark:hover:to-violet-900/30 dark:hover:border-violet-500/50'
                } ${
                  submittedAt !== null || isAnswering || isSubmittingExamFlag
                    ? 'cursor-not-allowed opacity-70'
                    : 'hover:shadow-xl hover:shadow-violet-200/40 dark:hover:shadow-violet-500/20 hover:scale-[1.02] hover:-translate-y-1'
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
                  className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0 rounded-xl shadow-md ${
                    showCorrectAnswer
                      ? 'text-green-900 dark:text-green-100 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 dark:from-green-800/40 dark:via-green-700/30 dark:to-emerald-800/40 border border-green-300/60 dark:border-green-500/40'
                      : showIncorrectSelection
                      ? 'text-red-900 dark:text-red-100 bg-gradient-to-br from-red-100 via-red-50 to-rose-100 dark:from-red-800/40 dark:via-red-700/30 dark:to-rose-800/40 border border-red-300/60 dark:border-red-500/40'
                      : isSelected
                      ? 'text-blue-900 dark:text-blue-100 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 dark:from-blue-800/40 dark:via-blue-700/30 dark:to-indigo-800/40 border border-blue-300/60 dark:border-blue-500/40'
                      : 'text-slate-700 dark:text-slate-200 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-700/60 dark:via-slate-600/50 dark:to-slate-700/60 border border-slate-300/60 dark:border-slate-500/40'
                  }`}
                >
                  {String.fromCharCode(65 + optionIndex)}
                </div>
                <label
                  htmlFor={`${question.quiz_question_id}-${option_id}`}
                  className={`text-lg sm:text-xl leading-relaxed cursor-pointer flex-1 select-none font-medium ${
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
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 border-2 border-green-400/80 dark:bg-gradient-to-br dark:from-green-900/50 dark:via-green-800/40 dark:to-emerald-900/50 dark:border-green-500/70 flex items-center justify-center shadow-lg shadow-green-200/40 dark:shadow-green-500/20">
                        <FaCheck className="text-green-700 dark:text-green-300 text-base" />
                      </div>
                    )}
                    {/* Show X for user's incorrect selection */}
                    {isSelected && question.user_answer_is_correct === false && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-100 via-red-50 to-rose-100 border-2 border-red-400/80 dark:bg-gradient-to-br dark:from-red-900/50 dark:via-red-800/40 dark:to-rose-900/50 dark:border-red-500/70 flex items-center justify-center shadow-lg shadow-red-200/40 dark:shadow-red-500/20">
                        <FaTimes className="text-red-700 dark:text-red-300 text-base" />
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
        {submittedAt !== null &&
          question.explanations !== null &&
          question.explanations !== undefined &&
          question.explanations.trim() !== '' && (
            <div className="mt-8">
              <Accordion
                type="single"
                collapsible
                className="w-full bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-blue-50/80 dark:from-blue-900/20 dark:via-indigo-900/15 dark:to-blue-900/20 border-2 border-blue-200/80 dark:border-blue-700/60 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm"
              >
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="px-7 py-5 hover:bg-gradient-to-r hover:from-blue-100/60 hover:via-indigo-100/40 hover:to-blue-100/60 dark:hover:from-blue-800/30 dark:hover:via-indigo-800/20 dark:hover:to-blue-800/30 transition-all duration-300 group hover:no-underline cursor-pointer">
                    <div className="flex items-center space-x-4 w-full">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 dark:from-blue-800/40 dark:via-blue-700/30 dark:to-indigo-800/40 rounded-xl group-hover:shadow-lg group-hover:shadow-blue-200/40 dark:group-hover:shadow-blue-500/20 transition-all duration-300 border border-blue-300/60 dark:border-blue-600/50">
                        <FaLightbulb className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                          View Detailed Explanation
                        </span>
                        <p className="text-base text-blue-700 dark:text-blue-300 mt-1.5">
                          Click to see the reasoning behind the correct answer
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-7 pb-7 pt-0">
                    <div className="bg-white/95 dark:bg-slate-800/95 rounded-xl p-6 border-2 border-blue-200/70 dark:border-blue-600/50 shadow-lg backdrop-blur-sm">
                      <div className="space-y-5 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                        {question.explanations
                          .split('\n')
                          .filter((paragraph) => paragraph.trim() !== '')
                          .map((paragraph, index) => (
                            <p key={index} className="text-lg leading-relaxed">
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
