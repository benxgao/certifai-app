'use client';

import React from 'react';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import { ActionButton } from './ActionButton';

interface ExamBottomNavigationProps {
  pagination: any;
  submittedAt: number | null;
  isLoadingQuestions: boolean;
  isAnswering: boolean;
  isNavigatingPage: boolean;
  onPreviousPage: () => void;
  onNextPageOrSubmit: () => void;
}

export const ExamBottomNavigation: React.FC<ExamBottomNavigationProps> = ({
  pagination,
  submittedAt,
  isLoadingQuestions,
  isAnswering,
  isNavigatingPage,
  onPreviousPage,
  onNextPageOrSubmit,
}) => {
  if (!pagination) return null;

  const isLastPage = pagination.currentPage === pagination.totalPages;

  return (
    <div className="pt-8 border-t border-slate-100/60 dark:border-slate-700/50">
      <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-xl">
        {/* Decorative gradient orb */}
        <div className="absolute -top-3 -right-3 w-20 h-20 bg-blue-100/30 dark:bg-blue-600/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
          {/* Pagination info - centered on mobile, left on desktop */}
          <div className="flex flex-col items-center space-y-2 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6">
            <div className="flex items-center space-x-2 text-sm lg:text-base text-slate-600 dark:text-slate-400">
              <span>Page</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 px-2 py-1 bg-slate-100/80 dark:bg-slate-700/80 rounded-lg">
                {pagination.currentPage}
              </span>
              <span>of</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 px-2 py-1 bg-slate-100/80 dark:bg-slate-700/80 rounded-lg">
                {pagination.totalPages}
              </span>
            </div>
            <div className="text-sm lg:text-base text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {pagination.totalItems}
              </span>{' '}
              total questions
            </div>
          </div>

          {/* Navigation buttons - full width on mobile, auto width on desktop */}
          <div className="flex items-center space-x-3 w-full lg:w-auto justify-center lg:justify-end">
            <ActionButton
              onClick={onPreviousPage}
              disabled={
                isLoadingQuestions || isAnswering || isNavigatingPage || pagination.currentPage <= 1
              }
              isLoading={isNavigatingPage}
              loadingText="Loading..."
              variant="outline"
              size="lg"
              icon={!isNavigatingPage ? <FaArrowLeft className="w-4 h-4" /> : undefined}
              className="flex-1 lg:flex-none lg:min-w-[140px]"
            >
              <span className="hidden sm:inline">Previous</span>
            </ActionButton>

            {submittedAt === null ? (
              <ActionButton
                onClick={onNextPageOrSubmit}
                disabled={isLoadingQuestions || isAnswering || isNavigatingPage}
                isLoading={isNavigatingPage}
                loadingText={isLastPage ? 'Preparing...' : 'Loading...'}
                variant={isLastPage ? 'success' : 'primary'}
                size="lg"
                icon={
                  !isNavigatingPage && isLastPage ? (
                    <FaCheck className="w-4 h-4" />
                  ) : !isNavigatingPage && !isLastPage ? (
                    <FaArrowRight className="w-4 h-4" />
                  ) : undefined
                }
                className="flex-1 lg:flex-none lg:min-w-[140px]"
              >
                {isLastPage ? (
                  <>
                    <span className="hidden sm:inline">Submit Exam</span>
                    <span className="sm:hidden">Submit</span>
                  </>
                ) : (
                  <span className="hidden sm:inline">Next</span>
                )}
              </ActionButton>
            ) : (
              !isLastPage && (
                <ActionButton
                  onClick={onNextPageOrSubmit}
                  disabled={isLoadingQuestions || isAnswering || isNavigatingPage}
                  isLoading={isNavigatingPage}
                  loadingText="Loading..."
                  variant="primary"
                  size="lg"
                  icon={!isNavigatingPage ? <FaArrowRight className="w-4 h-4" /> : undefined}
                  className="flex-1 lg:flex-none lg:min-w-[140px]"
                >
                  <span className="hidden sm:inline">Next</span>
                </ActionButton>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
