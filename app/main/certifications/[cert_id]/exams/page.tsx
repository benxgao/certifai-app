'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoadingComponents } from '@/components/custom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/src/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { ExamListItem, useExamsForCertification } from '@/swr/exams'; // Import SWR hook
import { useCreateExam } from '@/src/swr/createExam'; // Import create exam hook
import { useRateLimitInfo } from '@/src/swr/rateLimitInfo'; // Import rate limit hook
import RateLimitDisplay from '@/src/components/custom/RateLimitDisplay'; // Import rate limit display
import RateLimitSummary from '@/src/components/custom/RateLimitSummary'; // Import rate limit summary
import Breadcrumb from '@/components/custom/Breadcrumb'; // Import Breadcrumb component
import { getDerivedExamStatus, getExamStatusInfo } from '@/src/types/exam-status';
import {
  FaPlay,
  FaCheck,
  FaClipboardList,
  FaChartLine,
  FaArrowRight,
  FaPause,
  FaTrophy,
  FaPlus,
  FaLightbulb,
} from 'react-icons/fa';

// Renamed original component to CertificationExamsContent
function CertificationExamsContent() {
  const params = useParams();
  const router = useRouter();
  const certId = params.cert_id ? parseInt(params.cert_id as string, 10) : null;
  const { apiUserId } = useFirebaseAuth();

  // Separate state for certification data to ensure we always have certification info
  const [certification, setCertification] = useState<{
    cert_id: number;
    name: string;
    description?: string;
    min_quiz_counts: number;
    max_quiz_counts: number;
    pass_score: number;
    firm?: {
      firm_id: number;
      name: string;
      code: string;
    };
  } | null>(null);
  const [isLoadingCertification, setIsLoadingCertification] = useState(true);

  // Use SWR hook for exams data
  const { exams, isLoadingExams, mutateExams } = useExamsForCertification(apiUserId, certId);

  // Fetch certification details separately to ensure we always have certification info
  const fetchCertification = async () => {
    if (!certId) return;
    setIsLoadingCertification(true);
    try {
      const response = await fetch(`/api/public/certifications/${certId}`);
      if (!response.ok) throw new Error('Failed to fetch certification');
      const result = await response.json();
      setCertification(result.data || null);
    } catch (error) {
      console.error('Error fetching certification:', error);
      setCertification(null);
    } finally {
      setIsLoadingCertification(false);
    }
  };

  useEffect(() => {
    fetchCertification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certId]); // Removed apiUserId dependency as SWR handles it

  // Update certification fallback when exams data loads
  useEffect(() => {
    // Fallback: If we don't have certification data yet and exams have certification info, use it
    if (!certification && exams && exams.length > 0 && exams[0].certification) {
      setCertification(exams[0].certification);
    }
  }, [exams, certification]);

  // Derived certification data with fallback
  const displayCertification =
    certification ||
    (exams && exams.length > 0 && exams[0].certification ? exams[0].certification : null);

  // Update numberOfQuestions when certification data changes
  useEffect(() => {
    if (displayCertification?.max_quiz_counts) {
      setNumberOfQuestions(displayCertification.max_quiz_counts);
    }
  }, [displayCertification?.max_quiz_counts]);

  // State for create exam modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(
    displayCertification?.max_quiz_counts || 20,
  );
  const [customPromptText, setCustomPromptText] = useState('');
  const [navigatingExamId, setNavigatingExamId] = useState<string | null>(null);

  // Use the create exam hook
  const { createExam, isCreatingExam, createExamError } = useCreateExam();

  // Use the rate limit info hook
  const { rateLimitInfo, isLoadingRateLimit, mutateRateLimit } = useRateLimitInfo(apiUserId);

  const handleStartExam = (examId: string) => {
    setNavigatingExamId(examId);
    // Immediate redirect with optimistic loading
    router.push(`/main/certifications/${certId}/exams/${examId}`);
  };

  const handleCreateExam = async () => {
    if (!numberOfQuestions || numberOfQuestions < 1 || !apiUserId || !certId) return;

    try {
      const result = await createExam({
        apiUserId,
        certId,
        body: {
          numberOfQuestions: numberOfQuestions,
          customPromptText: customPromptText.trim(),
        },
      });

      await mutateExams(); // Refresh the exams list
      await mutateRateLimit(); // Refresh rate limit info
      setNumberOfQuestions(displayCertification?.max_quiz_counts || 20);
      setCustomPromptText('');
      setIsCreateModalOpen(false);

      if (result.data?.status === 'QUESTIONS_GENERATING') {
        console.log('Exam created successfully. Questions are being generated in the background.');
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      // Error is handled by the hook and component will show rate limit info if needed
      // Also refresh rate limit info in case of rate limit error
      await mutateRateLimit();
    }
  };

  // Removed context debug useEffects

  if (isLoadingExams || isLoadingCertification) {
    // Use the reusable skeleton component instead of hardcoding
    return (
      <LoadingComponents.PageSkeleton
        title="Loading exams..."
        cardCount={3}
        showBreadcrumb={true}
        showHeader={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Certifications', href: '/main/certifications' },
            {
              label: displayCertification?.name || `Certification ${certId}`,
              href: `/main/certifications/${certId}/exams`,
            },
            { label: 'Exams', current: true },
          ]}
        />

        {/* Certification Status Card */}
        <div className="mb-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden">
          {/* Status Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  {displayCertification?.name || 'Certification Overview'}
                </h2>
                {/* Rate Limit Summary */}
                {rateLimitInfo && !isLoadingRateLimit && (
                  <RateLimitSummary rateLimitInfo={rateLimitInfo} />
                )}
              </div>

              <div className="flex items-center space-x-3">
                {/* Create Exam Button */}
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-700 text-white border-violet-600 hover:border-violet-700 shadow-sm"
                      disabled={
                        createExamError?.status === 429 || // Disable if rate limited
                        (rateLimitInfo && !rateLimitInfo.canCreateExam) // Disable if at limit
                      }
                    >
                      <FaPlus className="w-4 h-4 mr-2" />
                      Create Exam
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Exam</DialogTitle>
                      <DialogDescription>
                        Create a new exam for {displayCertification?.name || 'this certification'}.
                        Configure the number of questions and any specific requirements.
                      </DialogDescription>
                    </DialogHeader>

                    {/* Rate Limit Information Display */}
                    {rateLimitInfo && !isLoadingRateLimit && (
                      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center mt-0.5">
                            <FaClipboardList className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-slate-800 dark:text-slate-200 mb-1">
                              Exam Creation Limit
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 mb-2">
                              You can create at most <strong>3 exams every 24 hours</strong>.
                            </p>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-slate-600 dark:text-slate-400">
                                  Current usage:
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {rateLimitInfo.currentCount}/3 used
                                </Badge>
                              </div>
                              {rateLimitInfo.remainingCount > 0 ? (
                                <div className="text-xs text-green-600 dark:text-green-400">
                                  {rateLimitInfo.remainingCount} remaining
                                </div>
                              ) : (
                                <div className="text-xs text-red-600 dark:text-red-400">
                                  Limit reached
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rate Limiting Error Display */}
                    {createExamError?.status === 429 && createExamError.rateLimitInfo && (
                      <RateLimitDisplay
                        rateLimitInfo={createExamError.rateLimitInfo}
                        className="mb-4"
                      />
                    )}

                    {/* General Error Display */}
                    {createExamError && createExamError.status !== 429 && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          {createExamError.message || 'Failed to create exam. Please try again.'}
                        </p>
                      </div>
                    )}

                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="number-of-questions">
                          Number of Questions: {numberOfQuestions}
                        </Label>
                        <Slider
                          id="number-of-questions"
                          min={displayCertification?.min_quiz_counts || 1}
                          max={displayCertification?.max_quiz_counts || 100}
                          step={1}
                          value={[numberOfQuestions]}
                          onValueChange={(value) => setNumberOfQuestions(value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Min: {displayCertification?.min_quiz_counts || 1}</span>
                          <span>Max: {displayCertification?.max_quiz_counts || 100}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Recommended: 20-50 questions (each question costs 2 tokens)
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="custom-prompt">Focus on Specific Topics (Optional)</Label>
                        <Textarea
                          id="custom-prompt"
                          placeholder="Keywords like a concept, a topic, etc"
                          value={customPromptText}
                          onChange={(e) => setCustomPromptText(e.target.value)}
                          rows={3}
                        />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          AI will generate exam questions focused on your specified topics and
                          concepts
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center mt-0.5">
                            <FaLightbulb className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                              Async Generation
                            </p>
                            <p className="text-blue-700 dark:text-blue-300">
                              Questions will be generated in the background. You can monitor the
                              progress in your exams list.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateModalOpen(false)}
                        disabled={isCreatingExam}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCreateExam}
                        disabled={
                          isCreatingExam ||
                          !numberOfQuestions ||
                          numberOfQuestions < 1 ||
                          createExamError?.status === 429 // Disable if rate limited
                        }
                      >
                        {isCreatingExam ? 'Creating...' : 'Create Exam'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="space-y-6">
              {/* Certification Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Exams */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <FaClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Exams
                      </p>
                    </div>
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                      {exams ? exams.length : '...'}
                    </p>
                  </div>
                </div>

                {/* Questions per Exam */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Questions
                      </p>
                    </div>
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                      {displayCertification?.max_quiz_counts || '25'}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <FaChartLine className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Progress
                      </p>
                    </div>
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                      {exams && exams.length > 0
                        ? `${exams.filter((exam) => exam.submitted_at !== null).length}/${
                            exams.length
                          }`
                        : '0/0'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-blue-25 dark:bg-blue-950/20 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-500 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-medium text-blue-600 dark:text-blue-300 mb-1">
                      Certification Journey
                    </p>
                    <p className="text-base text-blue-500 dark:text-blue-400 leading-relaxed">
                      Complete these comprehensive exams to demonstrate your knowledge and earn your
                      certification. Each exam is designed to test your understanding of key
                      concepts and practical applications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {exams && exams.length > 0 ? (
          <div className="space-y-6">
            {exams.map((exam: ExamListItem) => {
              // Get typed exam status and info
              const examStatus = getDerivedExamStatus(exam);
              const statusInfo = getExamStatusInfo(examStatus);
              const isCompleted = exam.submitted_at !== null;
              const hasStarted = exam.started_at !== null;
              const hasScore = exam.score !== null && exam.score !== undefined;

              return (
                <Card
                  key={exam.exam_id}
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group"
                >
                  <CardHeader className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30 border-b border-slate-100 dark:border-slate-700/50 p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left section: Title and metadata */}
                      <div className="flex-1 min-w-0">
                        {/* Exam ID indicator */}
                        <div className="mb-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-600">
                            Exam #{exam.exam_id.toString().substring(0, 7)}
                          </span>
                        </div>

                        {/* Timing information */}
                        <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                          {isCompleted && exam.submitted_at ? (
                            <>
                              {/* Show started date for completed exams */}
                              {hasStarted && exam.started_at && (
                                <p>
                                  Started:{' '}
                                  {new Date(exam.started_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              )}
                              <p>
                                Completed:{' '}
                                {new Date(exam.submitted_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                              {/* Show duration if both dates are available */}
                              {hasStarted &&
                                exam.started_at &&
                                (() => {
                                  const startTime = new Date(exam.started_at).getTime();
                                  const endTime = new Date(exam.submitted_at).getTime();
                                  const durationMs = endTime - startTime;
                                  const durationMinutes = Math.round(durationMs / (1000 * 60));
                                  const hours = Math.floor(durationMinutes / 60);
                                  const minutes = durationMinutes % 60;

                                  return (
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                      Duration: {hours > 0 ? `${hours}h ` : ''}
                                      {minutes}m
                                    </p>
                                  );
                                })()}
                            </>
                          ) : hasStarted && exam.started_at ? (
                            <p>
                              Started:{' '}
                              {new Date(exam.started_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          ) : (
                            <p>Not yet attempted</p>
                          )}
                        </div>
                      </div>

                      {/* Right section: Score display (if available) or progress for in-progress exams */}
                      {hasScore || examStatus === 'in_progress' ? (
                        <div className="flex-shrink-0 text-right">
                          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600 shadow-sm">
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                              Score
                            </p>
                            <p
                              className={`text-2xl font-bold ${
                                hasScore
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              {hasScore ? `${exam.score}%` : '—'}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Exam Statistics */}
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                            Questions
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {exam.total_questions || displayCertification?.max_quiz_counts || '25'}
                        </p>
                      </div>

                      {/* Show pass rate or attempts info */}
                      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaTrophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                            Status
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {statusInfo.label}
                        </p>
                      </div>
                    </div>

                    {/* Custom Prompt Display */}
                    {exam.custom_prompt_text && (
                      <div className="mb-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700/50">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center mt-0.5">
                              <FaLightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                Custom Focus Area
                              </h4>
                              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                                {exam.custom_prompt_text}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status Information - Simplified */}
                    <div className="mb-6">
                      <div
                        className={`p-4 rounded-xl border ${statusInfo.bgColor} ${statusInfo.borderColor}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              examStatus === 'completed_successful'
                                ? 'bg-emerald-50 dark:bg-emerald-900/30'
                                : examStatus === 'completed_review'
                                ? 'bg-blue-50 dark:bg-blue-900/30'
                                : examStatus === 'in_progress'
                                ? 'bg-green-50 dark:bg-green-900/30'
                                : examStatus === 'generating'
                                ? 'bg-yellow-50 dark:bg-yellow-900/30'
                                : examStatus === 'generation_failed'
                                ? 'bg-red-50 dark:bg-red-900/30'
                                : examStatus === 'ready'
                                ? 'bg-green-50 dark:bg-green-900/30'
                                : 'bg-blue-50 dark:bg-blue-900/30'
                            }`}
                          >
                            {examStatus === 'completed_successful' ? (
                              <FaTrophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : examStatus === 'completed_review' ? (
                              <FaChartLine className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            ) : examStatus === 'completed' ? (
                              <FaCheck className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            ) : examStatus === 'in_progress' ? (
                              <FaPause className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : examStatus === 'generating' ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-600 dark:border-yellow-400 border-t-transparent"></div>
                            ) : examStatus === 'generation_failed' ? (
                              <svg
                                className="w-5 h-5 text-red-600 dark:text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            ) : examStatus === 'ready' ? (
                              <FaLightbulb className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <FaPlay className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-medium mb-1 ${
                                examStatus === 'completed_successful'
                                  ? 'text-emerald-600 dark:text-emerald-300'
                                  : examStatus === 'completed_review'
                                  ? 'text-blue-600 dark:text-blue-300'
                                  : examStatus === 'in_progress'
                                  ? 'text-green-600 dark:text-green-300'
                                  : examStatus === 'generating'
                                  ? 'text-yellow-600 dark:text-yellow-300'
                                  : examStatus === 'generation_failed'
                                  ? 'text-red-600 dark:text-red-300'
                                  : examStatus === 'ready'
                                  ? 'text-green-600 dark:text-green-300'
                                  : 'text-blue-600 dark:text-blue-300'
                              }`}
                            >
                              {examStatus === 'completed_successful' &&
                                'Congratulations! Certification Earned'}
                              {examStatus === 'completed_review' &&
                                'Review Available with Explanations'}
                              {examStatus === 'completed' &&
                                !exam.score &&
                                'Exam Submitted Successfully'}
                              {examStatus === 'in_progress' && 'Resume Your Exam'}
                              {examStatus === 'generating' && 'Questions Being Generated'}
                              {examStatus === 'generation_failed' && 'Question Generation Failed'}
                              {examStatus === 'ready' && 'Ready to Begin Assessment'}
                              {(examStatus === 'not_started' ||
                                (!examStatus && !exam.started_at)) &&
                                'Begin Your Assessment'}
                            </p>
                            <p
                              className={`text-sm ${
                                examStatus === 'completed_successful'
                                  ? 'text-emerald-500 dark:text-emerald-400'
                                  : examStatus === 'completed_review'
                                  ? 'text-blue-500 dark:text-blue-400'
                                  : examStatus === 'in_progress'
                                  ? 'text-green-500 dark:text-green-400'
                                  : examStatus === 'generating'
                                  ? 'text-yellow-500 dark:text-yellow-400'
                                  : examStatus === 'generation_failed'
                                  ? 'text-red-500 dark:text-red-400'
                                  : examStatus === 'ready'
                                  ? 'text-green-500 dark:text-green-400'
                                  : 'text-blue-500 dark:text-blue-400'
                              }`}
                            >
                              {examStatus === 'completed_successful' &&
                                `You've achieved the required score with ${exam.score}%`}
                              {examStatus === 'completed_review' &&
                                `Score: ${exam.score}% - View detailed explanations and learning resources`}
                              {examStatus === 'completed' &&
                                !exam.score &&
                                'Your responses are being evaluated'}
                              {examStatus === 'in_progress' && 'Continue from where you left off'}
                              {examStatus === 'generating' &&
                                'Please wait while we prepare your personalized questions'}
                              {examStatus === 'generation_failed' &&
                                'Please contact support or try creating a new exam'}
                              {examStatus === 'ready' &&
                                'Your personalized exam questions are ready'}
                              {(examStatus === 'not_started' ||
                                (!examStatus && !exam.started_at)) &&
                                'Demonstrate your knowledge and earn your certification'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleStartExam(exam.exam_id)}
                      disabled={
                        navigatingExamId === exam.exam_id ||
                        examStatus === 'generating' ||
                        examStatus === 'generation_failed'
                      }
                      variant="outline"
                      className={`w-full h-12 text-base font-medium rounded-xl transition-all duration-200 group ${
                        examStatus === 'completed_successful'
                          ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-800 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/30 dark:hover:border-emerald-700 dark:hover:text-emerald-300'
                          : examStatus === 'completed_review'
                          ? 'border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:border-blue-700 dark:hover:text-blue-300'
                          : examStatus === 'in_progress'
                          ? 'border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30 dark:hover:border-green-700 dark:hover:text-green-300'
                          : examStatus === 'generating'
                          ? 'border-yellow-200 text-yellow-600 bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400 dark:bg-yellow-900/20 cursor-not-allowed opacity-60'
                          : examStatus === 'generation_failed'
                          ? 'border-red-200 text-red-600 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-900/20 cursor-not-allowed opacity-60'
                          : examStatus === 'ready'
                          ? 'border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30 dark:hover:border-green-700 dark:hover:text-green-300'
                          : 'border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:border-blue-700 dark:hover:text-blue-300'
                      }`}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        {navigatingExamId === exam.exam_id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                            <span>Loading Exam...</span>
                          </>
                        ) : examStatus === 'generating' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                            <span>Generating Questions...</span>
                          </>
                        ) : examStatus === 'generation_failed' ? (
                          <>
                            <svg
                              className="w-4 h-4 text-red-600 dark:text-red-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span>Generation Failed</span>
                          </>
                        ) : examStatus === 'completed_successful' ? (
                          <>
                            <FaTrophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-200" />
                            <span>View Certificate</span>
                          </>
                        ) : examStatus === 'completed_review' ? (
                          <>
                            <FaChartLine className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200" />
                            <span>View Results & Explanations</span>
                          </>
                        ) : examStatus === 'completed' ? (
                          <>
                            <FaChartLine className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-200" />
                            <span>View Results</span>
                          </>
                        ) : examStatus === 'in_progress' ? (
                          <>
                            <FaArrowRight className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 group-hover:translate-x-1 transition-all duration-200" />
                            <span>Resume Exam</span>
                          </>
                        ) : examStatus === 'ready' ? (
                          <>
                            <FaPlay className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-200" />
                            <span>Begin Exam</span>
                          </>
                        ) : (
                          <>
                            <FaPlay className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200" />
                            <span>Begin Exam</span>
                          </>
                        )}
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto">
                <FaClipboardList className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100">
                No Exams Available
              </h3>
              <p className="text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                No exams are currently available for this certification. Please check back later or
                contact support.
              </p>
              <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                Refresh Page
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CertificationExamsPage() {
  return <CertificationExamsContent />;
}
