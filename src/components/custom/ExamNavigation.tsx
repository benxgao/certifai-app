'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';

interface ExamNavigationProps {
  pagination: any;
  submittedAt: string | null;
  isLoadingQuestions: boolean;
  isAnswering: boolean;
  isNavigatingPage: boolean;
  onPreviousPage: () => void;
  onNextPageOrSubmit: () => void;
}

export const ExamNavigation: React.FC<ExamNavigationProps> = ({
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
    <div className="pt-8 border-t border-slate-100 dark:border-slate-700/50">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 lg:p-6 shadow-lg">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
          {/* Pagination info - centered on mobile, left on desktop */}
          <div className="flex flex-col items-center space-y-2 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6">
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
            <div className="text-sm lg:text-base text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-600 dark:text-slate-300">
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
                isLoadingQuestions ||
                isAnswering ||
                isNavigatingPage ||
                pagination.currentPage <= 1
              }
              className="flex-1 lg:flex-none lg:min-w-[140px] border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-sm"
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
                disabled={
                  isLoadingQuestions || isAnswering || isNavigatingPage
                }
                className={`flex-1 lg:flex-none lg:min-w-[140px] shadow-lg ${
                  isLastPage
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-violet-500/25'
                } backdrop-blur-sm transition-all duration-200`}
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
                  disabled={
                    isLoadingQuestions || isAnswering || isNavigatingPage
                  }
                  className="flex-1 lg:flex-none lg:min-w-[140px] bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg shadow-violet-500/25 backdrop-blur-sm transition-all duration-200"
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
