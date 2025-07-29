'use client';

import React, { useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaFileAlt,
  FaSpinner,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import {
  useExamReport,
  useGenerateExamReport,
  useAutoGenerateExamReport,
  ExamReportData,
} from '@/src/swr/examReport';

interface ExamReportProps {
  examId: string;
  isCompleted: boolean;
  className?: string;
}

export function ExamReport({ examId, isCompleted, className }: ExamReportProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { examReport, isLoadingReport, reportError, mutateReport } = useExamReport(
    examId,
    isCompleted,
  );

  const { generateReport } = useGenerateExamReport();

  // Auto-generate report for completed exams without reports
  const hasReport = examReport && !reportError;
  const { hasTriggeredGeneration } = useAutoGenerateExamReport(examId, isCompleted, !!hasReport);

  const handleGenerateReport = async () => {
    if (!isCompleted) return;

    setIsGenerating(true);
    try {
      const newReport = await generateReport(examId);
      // Update the SWR cache with the new report
      mutateReport(newReport, false);
    } catch (error) {
      console.error('Failed to generate exam report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerateReport = isCompleted && !hasReport && !isLoadingReport;

  // Don't render anything if exam is not completed
  if (!isCompleted) {
    return null;
  }

  return (
    <div className={cn('mt-4 border-t border-slate-200 dark:border-slate-700', className)}>
      <div className="pt-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaFileAlt className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              AI Exam Report
            </h3>
          </div>

          {hasReport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              {isExpanded ? (
                <>
                  <FaChevronUp className="w-3 h-3 mr-1" />
                  Collapse
                </>
              ) : (
                <>
                  <FaChevronDown className="w-3 h-3 mr-1" />
                  Expand
                </>
              )}
            </Button>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-3">
          {/* Auto-generation in progress indicator */}
          {hasTriggeredGeneration && !hasReport && !isLoadingReport && (
            <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400">
              <FaSpinner className="w-4 h-4 animate-spin" />
              Generating AI report automatically...
            </div>
          )}

          {/* Loading State */}
          {isLoadingReport && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <FaSpinner className="w-4 h-4 animate-spin" />
              Loading exam report...
            </div>
          )}

          {/* Error State */}
          {reportError && !isLoadingReport && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 rounded-lg">
              <div className="flex items-start gap-2">
                <FaExclamationTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {reportError.message === 'Exam report not found'
                      ? 'No report available yet'
                      : 'Failed to load exam report'}
                  </p>
                  {canGenerateReport && (
                    <Button
                      onClick={handleGenerateReport}
                      disabled={isGenerating}
                      size="sm"
                      className="mt-2 bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <FaSpinner className="w-3 h-3 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FaFileAlt className="w-3 h-3 mr-2" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Generate Report Button (when no report exists) */}
          {canGenerateReport && !reportError && (
            <div className="p-3 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 border border-violet-200 dark:border-violet-700/60 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-violet-900 dark:text-violet-100">
                    Get AI-powered insights on your performance
                  </p>
                  <p className="text-xs text-violet-700 dark:text-violet-300 mt-1">
                    Detailed analysis of your answers and recommendations for improvement
                  </p>
                </div>
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-700 text-white shrink-0 ml-3"
                >
                  {isGenerating ? (
                    <>
                      <FaSpinner className="w-3 h-3 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaFileAlt className="w-3 h-3 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Report Content */}
          {hasReport && (
            <div className="space-y-3">
              {/* Performance Summary */}
              {examReport.performance_summary && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Performance Summary
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
                        {examReport.performance_summary.overall_score}%
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Overall Score</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {examReport.performance_summary.correct_answers}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Correct</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-600 dark:text-slate-400">
                        {examReport.performance_summary.total_questions}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Total</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Collapsible Report Content */}
              {isExpanded && (
                <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {examReport.report}
                    </div>
                  </div>

                  {examReport.generated_at && (
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Generated on{' '}
                        {new Date(examReport.generated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Collapse/Expand Preview */}
              {!isExpanded && examReport.report && (
                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {examReport.report.substring(0, 150)}
                    {examReport.report.length > 150 && '...'}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(true)}
                    className="mt-2 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 p-0 h-auto"
                  >
                    Read full report
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
