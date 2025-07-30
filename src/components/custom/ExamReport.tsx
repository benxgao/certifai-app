'use client';

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
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
    <div
      className={`mt-4 border-t border-slate-200/60 dark:border-slate-700/60 ${className || ''}`}
    >
      <div className="pt-4">
        {/* Simple Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            AI Performance Report
            {hasReport && (
              <span className="ml-2 text-xs px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full">
                Available
              </span>
            )}
          </h3>

          {hasReport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Loading State */}
          {isLoadingReport && (
            <div className="text-sm text-slate-600 dark:text-slate-400">Loading exam report...</div>
          )}

          {/* Auto-generation indicator */}
          {hasTriggeredGeneration && !hasReport && !isLoadingReport && (
            <div className="text-sm text-violet-600 dark:text-violet-400">
              Generating AI report automatically...
            </div>
          )}

          {/* Error State */}
          {reportError && !isLoadingReport && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 rounded-xl">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                Report Not Available
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                {reportError.message || 'Unable to load exam report.'}
              </p>
              {canGenerateReport && (
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  size="sm"
                  className="mt-3 bg-violet-600 hover:bg-violet-700 text-white"
                >
                  {isGenerating ? 'Generating...' : 'Generate Report'}
                </Button>
              )}
            </div>
          )}

          {/* Generate Report Button */}
          {canGenerateReport && !reportError && (
            <div className="p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 rounded-xl">
              <p className="text-sm font-medium text-violet-900 dark:text-violet-100 mb-2">
                Generate AI Performance Analysis
              </p>
              <p className="text-xs text-violet-700 dark:text-violet-300 mb-3">
                Get detailed insights on your performance with topic-specific recommendations
              </p>
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          )}

          {/* Report Content - Simplified */}
          {hasReport && isExpanded && (
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              {/* Key Metrics Only */}
              {examReport.structured_data && (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {examReport.structured_data.overall_score}%
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Score</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {examReport.structured_data.correct_answers}/
                      {examReport.structured_data.total_questions}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Correct</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {examReport.structured_data.topic_performance?.length || 0}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Topics</div>
                  </div>
                </div>
              )}

              {/* Simple Text Summary */}
              {examReport.structured_data && examReport.structured_data.text_summary && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                  <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {examReport.structured_data.text_summary}
                  </div>
                </div>
              )}

              {/* Fallback to Raw Report */}
              {!examReport.structured_data && examReport.report && (
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {examReport.report}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
