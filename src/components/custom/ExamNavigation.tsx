'use client';

import React, { memo, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface ExamNavigationProps {
  pagination: PaginationInfo | null;
  submittedAt: string | null;
  isLoadingQuestions: boolean;
  isAnswering: boolean;
  isNavigatingPage: boolean;
  onPreviousPage: () => void;
  onNextPageOrSubmit: () => void;
  className?: string;
}

/**
 * Optimized ExamNavigation component with memoization and performance improvements
 * Features:
 * - React.memo for preventing unnecessary re-renders
 * - Memoized derived state calculations
 * - Optimized button states
 * - Better loading indicators
 */
export const ExamNavigation = memo<ExamNavigationProps>(
  ({
    pagination,
    submittedAt,
    isLoadingQuestions,
    isAnswering,
    isNavigatingPage,
    onPreviousPage,
    onNextPageOrSubmit,
    className = '',
  }) => {
    // Memoize derived states to prevent recalculation on every render
    const derivedState = useMemo(() => {
      if (!pagination) {
        return {
          isLastPage: false,
          isFirstPage: false,
          canNavigatePrevious: false,
          isSubmitted: Boolean(submittedAt),
        };
      }
      return {
        isLastPage: pagination.currentPage === pagination.totalPages,
        isFirstPage: pagination.currentPage === 1,
        canNavigatePrevious: pagination.currentPage > 1,
        isSubmitted: Boolean(submittedAt),
      };
    }, [pagination, submittedAt]);

    // Memoize button disabled states
    const buttonStates = useMemo(
      () => ({
        previousDisabled:
          isLoadingQuestions || isAnswering || isNavigatingPage || derivedState.isFirstPage,
        nextDisabled: isLoadingQuestions || isAnswering || isNavigatingPage,
      }),
      [isLoadingQuestions, isAnswering, isNavigatingPage, derivedState.isFirstPage],
    );

    // Memoize pagination display text
    const paginationText = useMemo(() => {
      if (!pagination) {
        return {
          current: '0',
          total: '0',
          items: '0',
        };
      }
      return {
        current: pagination.currentPage.toString(),
        total: pagination.totalPages.toString(),
        items: pagination.totalItems.toString(),
      };
    }, [pagination]);

    // Memoize navigation button content
    const navigationContent = useMemo(() => {
      if (isNavigatingPage) {
        return {
          previous: (
            <>
              <LoadingSpinner size="sm" variant="muted" />
              <span className="hidden sm:inline">Loading...</span>
              <span className="sm:hidden">...</span>
            </>
          ),
          next: (
            <>
              <LoadingSpinner size="sm" variant="white" />
              <span className="hidden sm:inline">Loading...</span>
              <span className="sm:hidden">...</span>
            </>
          ),
        };
      }

      return {
        previous: (
          <>
            <FaArrowLeft className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </>
        ),
        next: derivedState.isLastPage ? (
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
        ),
      };
    }, [isNavigatingPage, derivedState.isLastPage]);

    // Memoized click handlers
    const handlePreviousClick = useCallback(() => {
      if (!buttonStates.previousDisabled) {
        onPreviousPage();
      }
    }, [buttonStates.previousDisabled, onPreviousPage]);

    const handleNextClick = useCallback(() => {
      if (!buttonStates.nextDisabled) {
        onNextPageOrSubmit();
      }
    }, [buttonStates.nextDisabled, onNextPageOrSubmit]);

    // Early return if no pagination data - after all hooks are called
    if (!pagination) return null;

    return (
      <div className={`pt-8 border-t border-slate-100 dark:border-slate-700/50 ${className}`}>
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 lg:p-6 shadow-lg">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center">
            {/* Pagination info - optimized display */}
            <div className="flex flex-col items-center space-y-2 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6">
              <div className="flex items-center space-x-2 text-sm lg:text-base text-slate-500 dark:text-slate-400">
                <span>Page</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 px-2 py-1 bg-slate-100/80 dark:bg-slate-700/80 rounded-lg">
                  {paginationText.current}
                </span>
                <span>of</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {paginationText.total}
                </span>
              </div>
              <div className="text-sm lg:text-base text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {paginationText.items}
                </span>{' '}
                total questions
              </div>
            </div>

            {/* Navigation buttons - optimized for performance */}
            <div className="flex items-center space-x-3 w-full lg:w-auto justify-center lg:justify-end">
              <Button
                size="lg"
                variant="outline"
                onClick={handlePreviousClick}
                disabled={buttonStates.previousDisabled}
                className="flex-1 lg:flex-none lg:min-w-[140px] border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-sm interactive-optimized"
              >
                {navigationContent.previous}
              </Button>

              {!derivedState.isSubmitted && (
                <Button
                  size="lg"
                  onClick={handleNextClick}
                  disabled={buttonStates.nextDisabled}
                  className={`flex-1 lg:flex-none lg:min-w-[140px] shadow-md interactive-optimized ${
                    derivedState.isLastPage
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-0'
                      : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0'
                  }`}
                >
                  {navigationContent.next}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ExamNavigation.displayName = 'ExamNavigation';
