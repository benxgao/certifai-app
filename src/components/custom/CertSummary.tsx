'use client';

import React, { useState } from 'react';
import { useCertSummary, useGenerateCertSummary } from '@/src/swr/certSummary';
import { useFirebaseAuth } from '@/src/context/FirebaseAuthContext';
import { LoadingComponents } from '@/components/custom';
import { ActionButton } from '@/src/components/custom/ActionButton';
import { FaRedo, FaPlay } from 'react-icons/fa';

interface CertSummaryProps {
  userId: string;
  certId: string;
  examCount?: number; // Number of exams taken, used to determine if summary can be generated
  className?: string;
}

export function CertSummary({ userId, certId, examCount = 0, className = '' }: CertSummaryProps) {
  const { apiUserId } = useFirebaseAuth();
  const { certSummary, isLoading, error, hasSummary, mutate } = useCertSummary(userId, certId);
  const { generateCertSummary } = useGenerateCertSummary();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSummary = async () => {
    if (!userId || !certId) return;

    setIsGenerating(true);
    try {
      // Clear any stale cached data first to ensure fresh generation
      mutate(undefined, false);

      await generateCertSummary(userId, certId);
      // Refresh the data after successful generation
      await mutate();
    } catch (error) {
      console.error('Failed to generate cert summary:', error);
      // Show error toast or handle error
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <LoadingComponents.CardSkeleton />
      </div>
    );
  }

  if (error && (error as any).status !== 404) {
    return (
      <div
        className={`p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20 ${className}`}
      >
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">
            Failed to load certification summary
          </p>
        </div>
        <p className="text-xs text-red-600 dark:text-red-400 mb-4">{(error as Error).message}</p>

        {/* Show regenerate button only if user has enough exams */}
        {examCount >= 2 && (
          <ActionButton
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            isLoading={isGenerating}
            variant="secondary"
            size="sm"
            icon={<FaPlay className="w-4 h-4" />}
            className="mx-auto"
          >
            {isGenerating ? 'Generating...' : 'Generate New Summary'}
          </ActionButton>
        )}
      </div>
    );
  }

  // Show message if user hasn't completed enough exams to generate summary
  if (examCount < 2) {
    return (
      <div className={`p-6 text-center space-y-4 ${className}`}>
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            AI Summary Requires More Practice
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Complete{' '}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {2 - examCount} more practice exam{2 - examCount > 1 ? 's' : ''}
            </span>{' '}
            and generate exam reports to unlock your personalized AI learning journey analysis.
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 dark:text-slate-500">
            <div className="flex space-x-1">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < examCount ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <span>{examCount}/2 exams completed</span>
          </div>
        </div>
      </div>
    );
  }

  if (!hasSummary) {
    return (
      <div className={`p-6 text-center space-y-4 ${className}`}>
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Ready for AI Analysis
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            You&apos;ve completed enough practice exams! Generate your personalized learning journey
            summary to see detailed insights, topic mastery analysis, and improvement
            recommendations.
          </p>
          {/* Only show generate button if user has enough exams */}
          {examCount >= 2 && (
            <ActionButton
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              isLoading={isGenerating}
              variant="primary"
              size="sm"
              icon={<FaPlay className="w-4 h-4" />}
              className="mx-auto"
            >
              Generate AI Summary
            </ActionButton>
          )}
        </div>
      </div>
    );
  }

  const summary = certSummary!;

  // Helper function to get mastery level color
  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'advanced':
        return 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'proficient':
        return 'text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30';
      case 'developing':
        return 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
      case 'novice':
        return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/30';
    }
  };

  // Helper function to get trend color and icon
  const getTrendInfo = (trend: string) => {
    switch (trend) {
      case 'improving':
        return {
          color: 'text-green-700 dark:text-green-400',
          icon: '📈',
          bg: 'bg-green-100 dark:bg-green-900/30',
        };
      case 'declining':
        return {
          color: 'text-red-700 dark:text-red-400',
          icon: '📉',
          bg: 'bg-red-100 dark:bg-red-900/30',
        };
      case 'stable':
        return {
          color: 'text-blue-700 dark:text-blue-400',
          icon: '➡️',
          bg: 'bg-blue-100 dark:bg-blue-900/30',
        };
      default:
        return {
          color: 'text-slate-700 dark:text-slate-400',
          icon: '➡️',
          bg: 'bg-slate-100 dark:bg-slate-900/30',
        };
    }
  };

  const trendInfo = getTrendInfo(summary.structured_data.performance_trend);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Summary Section */}
      <div className="p-6 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 rounded-xl border border-violet-200/50 dark:border-violet-700/50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-violet-700 dark:text-violet-300">
            AI Learning Journey Summary
          </h3>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {summary.structured_data.ai_summary}
        </p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {summary.structured_data.total_exams_taken}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Total Exams</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {summary.structured_data.average_score}%
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Average Score</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {summary.structured_data.best_score}%
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Best Score</div>
        </div>

        <div
          className={`p-4 rounded-lg border shadow-sm ${trendInfo.bg} border-slate-200 dark:border-slate-700`}
        >
          <div className={`text-2xl font-bold ${trendInfo.color} flex items-center space-x-1`}>
            <span>{trendInfo.icon}</span>
            <span className="text-sm font-medium capitalize">
              {summary.structured_data.performance_trend}
            </span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Performance Trend</div>
        </div>
      </div>

      {/* Topic Mastery Section */}
      {summary.structured_data.topic_mastery.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Topic Mastery ({summary.structured_data.topic_mastery.length} topics)</span>
          </h4>

          <div className="space-y-3">
            {summary.structured_data.topic_mastery.slice(0, 8).map((topic, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-slate-700 dark:text-slate-300 truncate">
                    {topic.topic}
                  </h5>
                  <div className="flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-400">
                    <span>
                      {topic.total_correct}/{topic.total_questions} correct
                    </span>
                    <span>•</span>
                    <span>{Math.round(topic.average_accuracy * 100)}% accuracy</span>
                  </div>
                </div>
                <div className="ml-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getMasteryColor(
                      topic.mastery_level,
                    )}`}
                  >
                    {topic.mastery_level}
                  </span>
                </div>
              </div>
            ))}

            {summary.structured_data.topic_mastery.length > 8 && (
              <div className="text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  +{summary.structured_data.topic_mastery.length - 8} more topics analyzed
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Strengths and Areas for Improvement */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        {summary.structured_data.strengths.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-green-700 dark:text-green-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Your Strengths ({summary.structured_data.strengths.length})</span>
            </h4>
            <div className="space-y-2">
              {summary.structured_data.strengths.slice(0, 5).map((strength, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {strength}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Areas for Improvement */}
        {summary.structured_data.areas_for_improvement.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-amber-700 dark:text-amber-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Focus Areas ({summary.structured_data.areas_for_improvement.length})</span>
            </h4>
            <div className="space-y-2">
              {summary.structured_data.areas_for_improvement.slice(0, 5).map((area, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    {area}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generated timestamp and refresh button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Summary generated on {new Date(summary.generated_at).toLocaleString()}
        </p>
        {/* Only show refresh button if user has enough exams */}
        {examCount >= 2 && (
          <ActionButton
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            isLoading={isGenerating}
            variant="secondary"
            size="sm"
            icon={<FaRedo className="w-3 h-3" />}
            className="text-xs"
          >
            Refresh
          </ActionButton>
        )}
      </div>
    </div>
  );
}
