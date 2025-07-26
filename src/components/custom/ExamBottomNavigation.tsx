'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';

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
            <Button
              size="lg"
              variant="outline"
              onClick={onPreviousPage}
              disabled={
                isLoadingQuestions || isAnswering || isNavigatingPage || pagination.currentPage <= 1
              }
              className="flex-1 lg:flex-none lg:min-w-[140px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50/90 dark:hover:bg-slate-700/90 shadow-lg hover:shadow-xl transition-all duration-300"
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

            {submittedAt === null ? (
              <Button
                size="lg"
                onClick={onNextPageOrSubmit}
                disabled={isLoadingQuestions || isAnswering || isNavigatingPage}
                className={`flex-1 lg:flex-none lg:min-w-[140px] backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isLastPage
                    ? 'bg-emerald-500/90 hover:bg-emerald-600/90 text-white border border-emerald-400/50'
                    : 'bg-violet-500/90 hover:bg-violet-600/90 text-white border border-violet-400/50'
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
            ) : (
              !isLastPage && (
                <Button
                  size="lg"
                  onClick={onNextPageOrSubmit}
                  disabled={isLoadingQuestions || isAnswering || isNavigatingPage}
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
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
