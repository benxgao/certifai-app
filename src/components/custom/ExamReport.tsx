'use client';

import React, { useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaFileAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaExclamationCircle,
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

// Component to render a circular progress indicator for overall score
function ScoreCircle({ score }: { score: number }) {
  const strokeDasharray = `${score * 2.51} 251`; // 251 is the circumference of the circle
  const getScoreColor = () => {
    if (score >= 80) return 'stroke-emerald-500 dark:stroke-emerald-400';
    if (score >= 60) return 'stroke-amber-500 dark:stroke-amber-400';
    return 'stroke-red-500 dark:stroke-red-400';
  };

  return (
    <div className="relative w-20 h-20">
      <svg className="transform -rotate-90 w-20 h-20" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className={cn('transition-all duration-1000', getScoreColor())}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{score}%</span>
      </div>
    </div>
  );
}

// Component to render topic performance visualization
function TopicPerformanceChart({
  topicPerformance,
}: {
  topicPerformance:
    | Array<{
        topic: string;
        correct_answers: number;
        total_attempts: number;
        accuracy_rate: number;
        difficulty_level: string;
        performance_category: string;
      }>
    | undefined;
}) {
  if (!topicPerformance || topicPerformance.length === 0) return null;

  const getPerformanceColor = (category: string) => {
    switch (category) {
      case 'strong':
        return 'bg-emerald-500 dark:bg-emerald-400';
      case 'average':
        return 'bg-amber-500 dark:bg-amber-400';
      case 'weak':
        return 'bg-red-500 dark:bg-red-400';
      default:
        return 'bg-slate-500 dark:bg-slate-400';
    }
  };

  const getPerformanceIcon = (category: string) => {
    switch (category) {
      case 'strong':
        return <FaCheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'average':
        return <FaExclamationCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'weak':
        return <FaTimesCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <FaTrophy className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        Topic Performance Breakdown
      </h4>
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
        {topicPerformance.map((topic: any, index: number) => (
          <div
            key={index}
            className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getPerformanceIcon(topic.performance_category)}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                  {topic.topic}
                </span>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {Math.round(topic.accuracy_rate * 100)}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 block">
                  {topic.correct_answers}/{topic.total_attempts}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-3">
              <div
                className={cn(
                  'h-2.5 rounded-full transition-all duration-500',
                  getPerformanceColor(topic.performance_category),
                )}
                style={{ width: `${Math.round(topic.accuracy_rate * 100)}%` }}
              />
            </div>

            {/* Difficulty level and performance badges */}
            <div className="flex items-center justify-between">
              <span className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full font-medium">
                {topic.difficulty_level} level
              </span>
              <span
                className={cn(
                  'text-xs px-2.5 py-1 rounded-full font-medium',
                  topic.performance_category === 'strong'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    : topic.performance_category === 'average'
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
                )}
              >
                {topic.performance_category === 'strong'
                  ? 'Strong'
                  : topic.performance_category === 'average'
                  ? 'Average'
                  : 'Needs Focus'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
    <div className={cn('mt-4 border-t border-slate-200/60 dark:border-slate-700/60', className)}>
      <div className="pt-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FaFileAlt className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              AI Performance Report
            </h3>
            {hasReport && (
              <span className="text-xs px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full">
                Available
              </span>
            )}
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
                  Hide Details
                </>
              ) : (
                <>
                  <FaChevronDown className="w-3 h-3 mr-1" />
                  Show Details
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
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 rounded-xl">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                    {reportError.message === 'Exam report not found'
                      ? 'Report Not Available'
                      : reportError.message.includes('Authentication') ||
                        reportError.message.includes('Invalid authentication')
                      ? 'Authentication Required'
                      : reportError.message.includes('Access denied') ||
                        reportError.message.includes('Forbidden')
                      ? 'Access Denied'
                      : 'Unable to Load Report'}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    {reportError.message === 'Exam report not found'
                      ? 'No performance report has been generated for this exam yet.'
                      : reportError.message.includes('Authentication') ||
                        reportError.message.includes('Invalid authentication')
                      ? 'Please sign in again to access your exam report.'
                      : reportError.message.includes('Access denied') ||
                        reportError.message.includes('Forbidden')
                      ? 'You do not have permission to access this exam report. Please make sure you are viewing your own exam.'
                      : `There was an issue loading your exam report: ${reportError.message}`}
                  </p>

                  {canGenerateReport &&
                    !reportError.message.includes('Authentication') &&
                    !reportError.message.includes('Access denied') &&
                    !reportError.message.includes('Forbidden') && (
                      <Button
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        size="sm"
                        className="mt-3 bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
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
            <div className="p-4 bg-gradient-to-r from-violet-50/80 to-blue-50/80 dark:from-violet-950/30 dark:to-blue-950/30 border border-violet-200/60 dark:border-violet-700/60 rounded-xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-violet-900 dark:text-violet-100 mb-1">
                    Generate AI Performance Analysis
                  </p>
                  <p className="text-xs text-violet-700 dark:text-violet-300">
                    Get detailed insights on your performance with topic-specific recommendations
                  </p>
                </div>
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-700 text-white shrink-0 ml-4 shadow-md hover:shadow-lg transition-all duration-200"
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
            <div className="space-y-4">
              {/* Enhanced Performance Summary with Visual Elements */}
              {examReport.performance_summary && (
                <div className="p-5 bg-gradient-to-r from-slate-50 to-violet-50/30 dark:from-slate-800/50 dark:to-violet-950/30 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                    <FaTrophy className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    Performance Overview
                  </h4>
                  <div className="flex items-center gap-6">
                    {/* Circular Score Display */}
                    <div className="flex-shrink-0">
                      <ScoreCircle score={examReport.performance_summary.overall_score} />
                    </div>

                    {/* Stats Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {examReport.performance_summary.correct_answers}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          Correct Answers
                        </p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-lg font-bold text-slate-600 dark:text-slate-400">
                          {examReport.performance_summary.total_questions}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          Total Questions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Topic Performance Visualization */}
              {examReport.structured_data?.topic_performance && (
                <TopicPerformanceChart
                  topicPerformance={examReport.structured_data.topic_performance}
                />
              )}

              {/* AI Text Summary */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FaFileAlt className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  AI Analysis & Recommendations
                </h4>

                {/* Collapsible Report Content */}
                {isExpanded ? (
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
                ) : (
                  <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                      {examReport.report.substring(0, 200)}
                      {examReport.report.length > 200 && '...'}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(true)}
                      className="mt-2 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 p-0 h-auto"
                    >
                      Read full analysis →
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
