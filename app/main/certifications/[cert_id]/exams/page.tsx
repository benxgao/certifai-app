'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoadingComponents } from '@/components/custom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/src/components/ui/slider';
import { toastHelpers } from '@/src/lib/toast';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ResponsiveTooltip from '@/src/components/custom/ResponsiveTooltip';
import { ButtonLoadingText } from '@/src/components/ui/loading-spinner';

import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { ExamListItem, useExamsForCertification, useDeleteExam } from '@/swr/exams'; // Import SWR hook
import { useCreateExam } from '@/src/swr/createExam'; // Import create exam hook
import { useAuthenticatedCertificationDetail } from '@/src/swr/certifications'; // Import certification SWR hook
import { useRateLimitFromExams } from '@/src/hooks/useRateLimitFromExams'; // Import optimized rate limit hook
import RateLimitDisplay from '@/src/components/custom/RateLimitDisplay'; // Import rate limit display
import Breadcrumb from '@/components/custom/Breadcrumb'; // Import Breadcrumb component
import { getDerivedExamStatus, getExamStatusInfo } from '@/src/types/exam-status';
import {
  FaPlay,
  FaRegFileAlt,
  FaClipboardList,
  FaChartLine,
  FaTrophy,
  FaLightbulb,
  FaRedo, // Changed from FaArrowRight to FaRedo for Resume action
  FaTrash, // Added delete icon
} from 'react-icons/fa';
import { ExamGenerationProgressBar } from '@/src/components/custom/ExamGenerationProgressBar';
import { estimateExamGenerationProgress } from '@/src/lib/examGenerationUtils';
import { useExamListGenerationMonitor } from '@/src/hooks/useExamListGenerationMonitor';

// Renamed original component to CertificationExamsContent
function CertificationExamsContent() {
  const params = useParams();
  const router = useRouter();
  const certId = params.cert_id ? parseInt(params.cert_id as string, 10) : null;
  const { apiUserId } = useFirebaseAuth();

  // Use SWR hook for certification data instead of manual fetch
  const { certification, isLoadingCertification, isCertificationError } =
    useAuthenticatedCertificationDetail(certId?.toString() || null);

  // Use SWR hook for exams data
  const { exams, rateLimit, isLoadingExams, mutateExams } = useExamsForCertification(
    apiUserId,
    certId,
  );

  // Monitor exam generation progress and enable smart polling
  const { generatingCount } = useExamListGenerationMonitor(exams, mutateExams, isLoadingExams);

  // Derived certification data with fallback from exams
  const displayCertification =
    certification ||
    (exams && exams.length > 0 && exams[0].certification ? exams[0].certification : null);

  // Update numberOfQuestions when certification data changes
  useEffect(() => {
    if (displayCertification?.min_quiz_counts) {
      setNumberOfQuestions(displayCertification.min_quiz_counts);
    }
  }, [displayCertification?.min_quiz_counts]);

  // State for create exam modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(
    displayCertification?.min_quiz_counts || 1,
  );
  const [customPromptText, setCustomPromptText] = useState('');
  const [navigatingExamId, setNavigatingExamId] = useState<string | null>(null);

  // Use the create exam hook
  const { createExam, isCreatingExam, createExamError } = useCreateExam();

  // Use the delete exam hook
  const { deleteExam, isDeletingExam, deleteExamError } = useDeleteExam();

  // Use the rate limit info hook that extracts data from exam responses
  const { rateLimitInfo, isLoadingRateLimit, mutateRateLimit } = useRateLimitFromExams(
    rateLimit,
    exams,
    isLoadingExams,
    mutateExams,
  );

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
      setNumberOfQuestions(displayCertification?.min_quiz_counts || 1);
      setCustomPromptText('');
      setIsCreateModalOpen(false);

      if (result.data?.status === 'QUESTIONS_GENERATING') {
        const topicsCount = result.data.topics_generated || result.data.total_questions;
        const successMessage = result.data.topics_generated
          ? `Exam created successfully! ${topicsCount} AI-generated topics created. Questions are being generated in the background.`
          : 'Exam created successfully. Questions are being generated in the background.';

        console.log(successMessage);

        // Show toast notification for exam creation success
        if (result.data.topics_generated) {
          toastHelpers.success.examCreated(result.data.exam_id);
        } else {
          toastHelpers.success.examCreated(result.data.exam_id);
        }

        // Check if user is approaching rate limit after successful creation
        // Wait a moment for rate limit info to refresh, then check
        setTimeout(() => {
          if (
            rateLimitInfo &&
            rateLimitInfo.remainingCount <= 1 &&
            rateLimitInfo.maxExamsAllowed > 1
          ) {
            toastHelpers.warning.examLimitWarning(
              rateLimitInfo.remainingCount,
              rateLimitInfo.maxExamsAllowed,
            );
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error creating exam:', error);

      const createExamError = error as any; // Type as any to access custom properties

      // Check if this is a rate limit error (429)
      if (createExamError.status === 429 && createExamError.rateLimitInfo) {
        const { maxExamsAllowed, currentCount, resetTime } = createExamError.rateLimitInfo;

        // Show specific rate limit toast notification with enhanced details
        toastHelpers.error.examRateLimitExceeded(maxExamsAllowed, resetTime);

        console.log('Rate limit exceeded:', {
          maxAllowed: maxExamsAllowed,
          current: currentCount,
          resetTime: resetTime,
        });
      } else {
        // Show generic error toast notification for other types of failures
        toastHelpers.error.examCreationFailed(createExamError.message);
      }

      // Also refresh rate limit info in case of rate limit error
      await mutateRateLimit();
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!apiUserId || !certId) return;

    try {
      await deleteExam({
        apiUserId,
        examId,
      });

      await mutateExams(); // Refresh the exams list
      console.log('Exam deleted successfully');

      // Show success toast notification for exam deletion
      toastHelpers.success.examDeleted();
    } catch (error) {
      console.error('Error deleting exam:', error);

      // Show error toast notification for exam deletion failure
      toastHelpers.error.examDeletionFailed((error as Error).message);
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
          <div className="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-700/50 dark:to-slate-600/30">
            {/* Mobile-friendly layout */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                <h2 className="text-lg font-medium text-slate-900 dark:text-slate-50">
                  {displayCertification?.name || 'Certification Overview'}
                </h2>
              </div>

              {/* Action Buttons - full width on mobile, auto on desktop */}
              <div className="hidden sm:flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="exam-action-button w-full sm:w-auto font-medium px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-base bg-slate-500 hover:bg-slate-600 focus:bg-slate-600 active:bg-slate-300 text-white dark:bg-slate-700 dark:hover:bg-slate-600 dark:focus:bg-slate-600 dark:active:bg-slate-500 dark:text-slate-100 shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={
                        createExamError?.status === 429 || // Disable if rate limited
                        (rateLimitInfo ? !rateLimitInfo.canCreateExam : false) // Disable if at limit
                      }
                    >
                      <FaRegFileAlt className="w-4 h-4 mr-2" />
                      New Exam
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                    <DialogHeader>
                      <div className="flex items-center gap-2">
                        <DialogTitle>Generate New Exam</DialogTitle>
                        <ResponsiveTooltip
                          content={
                            <>
                              Generate a new exam for{' '}
                              {displayCertification?.name || 'this certification'}. Configure the
                              number of questions and any specific requirements.
                            </>
                          }
                        >
                          <svg
                            className="w-5 h-5 sm:w-4 sm:h-4"
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
                        </ResponsiveTooltip>
                      </div>
                    </DialogHeader>

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
                        <div className="flex items-center gap-1">
                          <Label htmlFor="number-of-questions">
                            Number of Questions: {numberOfQuestions}
                          </Label>
                          <ResponsiveTooltip content="Choose how many questions you want in your exam. Each question costs 2 tokens. Recommended: 20-50.">
                            <FaLightbulb className="w-5 h-5 sm:w-4 sm:h-4" />
                          </ResponsiveTooltip>
                        </div>
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
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center gap-1">
                          <Label htmlFor="custom-prompt">Focus on Specific Topics (Optional)</Label>
                          <ResponsiveTooltip
                            content={
                              <>
                                Enter keywords or topics to focus your exam (e.g., &quot;security
                                best practices, network architecture&quot;). Our AI will generate
                                specialized topics based on your input.
                              </>
                            }
                          >
                            <FaLightbulb className="w-5 h-5 sm:w-4 sm:h-4" />
                          </ResponsiveTooltip>
                        </div>
                        <Textarea
                          id="custom-prompt"
                          placeholder="Enter keywords, topics, or concepts to focus your exam (e.g., 'security best practices', 'network architecture', 'cost optimization')"
                          value={customPromptText}
                          onChange={(e) => setCustomPromptText(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3 mt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <FaLightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            AI Topic Generation
                          </span>
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                          Our AI will generate {numberOfQuestions} specialized topics tailored to
                          the {displayCertification?.name} certification. Questions are created in
                          the background - you can monitor progress in your exams list.
                        </p>
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
                        {isCreatingExam ? (
                          <ButtonLoadingText
                            isLoading={true}
                            loadingText="Creating..."
                            defaultText="Creating..."
                            showSpinner={true}
                            spinnerSize="sm"
                          />
                        ) : (
                          'Create Exam'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Rate Limit Summary - separate section */}
          {rateLimitInfo && !isLoadingRateLimit && (
            <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30 border-b border-blue-200 dark:border-blue-800/50">
              <div className="flex items-center justify-center space-x-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-white dark:bg-blue-900/50 rounded-full flex items-center justify-center shadow-sm">
                    <svg
                      className="w-4 h-4 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Exam Creation Limit
                      </span>
                      <ResponsiveTooltip
                        content="You can create at most 3 exams every 24 hours to ensure fair usage and optimal system performance."
                        className="max-w-[280px]"
                      >
                        <svg
                          className="w-5 h-5 sm:w-4 sm:h-4"
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
                      </ResponsiveTooltip>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                      <span className="text-xl font-bold text-blue-900 dark:text-blue-100">
                        {rateLimitInfo.currentCount}/3
                      </span>
                      <span className="text-sm text-blue-700 dark:text-blue-300">exams used</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    <div className="flex items-center justify-center space-x-2 mb-2">
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

              {/* Mobile New Exam Button */}
              <div className="sm:hidden mt-6">
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="exam-action-button w-full font-medium px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-base bg-slate-100 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:focus:bg-slate-600 dark:active:bg-slate-500 dark:text-slate-100 shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={
                        createExamError?.status === 429 || // Disable if rate limited
                        (rateLimitInfo ? !rateLimitInfo.canCreateExam : false) // Disable if at limit
                      }
                    >
                      <FaRegFileAlt className="w-4 h-4 mr-2" />
                      New Exam
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                    <DialogHeader>
                      <div className="flex items-center gap-2">
                        <DialogTitle>Generate New Exam</DialogTitle>
                        <ResponsiveTooltip
                          content={
                            <>
                              Generate a new exam for{' '}
                              {displayCertification?.name || 'this certification'}. Configure the
                              number of questions and any specific requirements.
                            </>
                          }
                        >
                          <svg
                            className="w-5 h-5 sm:w-4 sm:h-4"
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
                        </ResponsiveTooltip>
                      </div>
                    </DialogHeader>

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
                        <div className="flex items-center gap-1">
                          <Label htmlFor="number-of-questions">
                            Number of Questions: {numberOfQuestions}
                          </Label>
                          <ResponsiveTooltip content="Choose how many questions you want in your exam. Each question costs 2 tokens. Recommended: 20-50.">
                            <FaLightbulb className="w-5 h-5 sm:w-4 sm:h-4" />
                          </ResponsiveTooltip>
                        </div>
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
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center gap-1">
                          <Label htmlFor="custom-prompt">Focus on Specific Topics (Optional)</Label>
                          <ResponsiveTooltip
                            content={
                              <>
                                Enter keywords or topics to focus your exam (e.g., &quot;security
                                best practices, network architecture&quot;). Our AI will generate
                                specialized topics based on your input.
                              </>
                            }
                          >
                            <FaLightbulb className="w-5 h-5 sm:w-4 sm:h-4" />
                          </ResponsiveTooltip>
                        </div>
                        <Textarea
                          id="custom-prompt"
                          placeholder="Enter keywords, topics, or concepts to focus your exam (e.g., 'security best practices', 'network architecture', 'cost optimization')"
                          value={customPromptText}
                          onChange={(e) => setCustomPromptText(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3 mt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <FaLightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            AI Topic Generation
                          </span>
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                          Our AI will generate {numberOfQuestions} specialized topics tailored to
                          the {displayCertification?.name} certification. Questions are created in
                          the background - you can monitor progress in your exams list.
                        </p>
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
                        {isCreatingExam ? (
                          <ButtonLoadingText
                            isLoading={true}
                            loadingText="Creating..."
                            defaultText="Creating..."
                            showSpinner={true}
                            spinnerSize="sm"
                          />
                        ) : (
                          'Create Exam'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {exams && exams.length > 0 ? (
          <div className="space-y-4">
            {exams.map((exam: ExamListItem) => {
              // Get typed exam status and info
              const examStatus = getDerivedExamStatus(exam);
              const statusInfo = getExamStatusInfo(examStatus);
              const isCompleted = exam.submitted_at !== null;
              const hasStarted = exam.started_at !== null;
              const hasScore = exam.score !== null && exam.score !== undefined;

              // Calculate generation progress for generating exams
              const generationEstimate =
                examStatus === 'generating' && exam.started_at
                  ? estimateExamGenerationProgress(exam.started_at, {
                      totalBatches: Math.ceil((exam.total_questions || 25) / 5), // Estimate 5 questions per batch
                      estimatedCompletionTime: Math.max(
                        120000,
                        (exam.total_questions || 25) * 5000,
                      ), // 5 seconds per question minimum, 2 minutes minimum
                      averageBatchTime: 45000, // 45 seconds per batch
                      questionsGenerated: 0, // We don't have this data in the list view
                      totalQuestions: exam.total_questions || 25,
                    })
                  : null;

              return (
                <Card
                  key={exam.exam_id}
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden group"
                >
                  <CardHeader className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-700/50 dark:to-slate-600/30 border-b border-slate-100 dark:border-slate-700/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left section: Title and metadata */}
                      <div className="flex-1 min-w-0">
                        {/* Exam ID indicator */}
                        <div className="mb-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-600">
                            Exam #{exam.exam_id.toString().substring(0, 8)}
                          </span>
                        </div>

                        {/* Timing information */}
                        <div className="text-sm text-slate-500 dark:text-slate-300 space-y-1">
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
                          <div className="bg-white dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-600 shadow-sm">
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                              Score
                            </p>
                            <p
                              className={`text-xl font-bold ${
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
                  <CardContent className="p-4">
                    {/* Exam Statistics */}
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-100 dark:border-slate-600/50">
                        <div className="flex items-center space-x-2 mb-1">
                          <FaClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                            Questions
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {exam.total_questions || displayCertification?.max_quiz_counts || '25'}
                        </p>
                      </div>

                      {/* Show pass rate or attempts info */}
                      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-100 dark:border-slate-600/50">
                        <div className="flex items-center space-x-2 mb-1">
                          <FaTrophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                            Status
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {statusInfo.label}
                        </p>
                      </div>
                    </div>

                    {/* Generation Progress Bar - only show for generating exams */}
                    {examStatus === 'generating' && generationEstimate && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-violet-50/80 to-blue-50/80 dark:from-violet-950/30 dark:to-blue-950/30 rounded-lg border border-violet-200/60 dark:border-violet-700/60">
                        <ExamGenerationProgressBar
                          progress={generationEstimate.completionPercentage}
                          estimatedTimeRemaining={generationEstimate.estimatedTimeRemaining}
                          className="w-full"
                          showPercentage={true}
                          showTimeRemaining={true}
                          isAnimated={true}
                        />
                      </div>
                    )}

                    {/* Action Buttons Section */}
                    <div className="space-y-2">
                      <div className="space-y-2">
                        {/* Delete button for failed exams */}
                        {examStatus === 'generation_failed' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleDeleteExam(exam.exam_id)}
                              disabled={isDeletingExam}
                              variant="outline"
                              size="sm"
                              className="flex-1 h-9 text-sm font-medium rounded-lg border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:text-red-800 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-300"
                            >
                              <span className="flex items-center justify-center space-x-2">
                                {isDeletingExam ? (
                                  <ButtonLoadingText
                                    isLoading={true}
                                    loadingText="Deleting..."
                                    defaultText="Deleting..."
                                    showSpinner={true}
                                    spinnerSize="xs"
                                  />
                                ) : (
                                  <>
                                    <FaTrash className="w-3 h-3" />
                                    <span>Delete Exam</span>
                                  </>
                                )}
                              </span>
                            </Button>
                          </div>
                        )}

                        {/* Error display for delete operation */}
                        {deleteExamError && (
                          <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-200">
                              {deleteExamError.message ||
                                'Failed to delete exam. Please try again.'}
                            </p>
                          </div>
                        )}

                        {/* Main Action Button */}
                        <div className="flex justify-end pt-1">
                          <Button
                            onClick={() => handleStartExam(exam.exam_id)}
                            disabled={
                              navigatingExamId === exam.exam_id ||
                              examStatus === 'generating' ||
                              examStatus === 'generation_failed'
                            }
                            size="lg"
                            className={`exam-action-button w-full sm:w-auto font-medium px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 ${
                              examStatus === 'completed_successful'
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : examStatus === 'completed_review'
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : examStatus === 'in_progress'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : examStatus === 'generating'
                                ? 'bg-yellow-100 text-yellow-600 cursor-not-allowed opacity-60 dark:bg-yellow-900/20 dark:text-yellow-400'
                                : examStatus === 'generation_failed'
                                ? 'bg-red-100 text-red-600 cursor-not-allowed opacity-60 dark:bg-red-900/20 dark:text-red-400'
                                : examStatus === 'ready'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {navigatingExamId === exam.exam_id ? (
                              <ButtonLoadingText
                                isLoading={true}
                                loadingText="Loading Exam..."
                                defaultText="Loading Exam..."
                                showSpinner={true}
                                spinnerSize="sm"
                              />
                            ) : examStatus === 'generating' ? (
                              <ButtonLoadingText
                                isLoading={true}
                                loadingText="Generating Questions..."
                                defaultText="Generating Questions..."
                                showSpinner={true}
                                spinnerSize="sm"
                              />
                            ) : examStatus === 'generation_failed' ? (
                              <>
                                <svg
                                  className="w-4 h-4"
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
                                <span className="ml-2">Generation Failed</span>
                              </>
                            ) : examStatus === 'completed_successful' ? (
                              <>
                                <FaTrophy className="w-4 h-4" />
                                <span className="ml-2">View Certificate</span>
                              </>
                            ) : examStatus === 'completed_review' ? (
                              <>
                                <FaChartLine className="w-4 h-4" />
                                <span className="ml-2">View Results & Explanations</span>
                              </>
                            ) : examStatus === 'completed' ? (
                              <>
                                <FaChartLine className="w-4 h-4" />
                                <span className="ml-2">View Results</span>
                              </>
                            ) : examStatus === 'in_progress' ? (
                              <>
                                <FaRedo className="w-4 h-4" />
                                <span className="ml-2">Resume Exam</span>
                              </>
                            ) : examStatus === 'ready' ? (
                              <>
                                <FaPlay className="w-4 h-4" />
                                <span className="ml-2">Begin Exam</span>
                              </>
                            ) : (
                              <>
                                <FaPlay className="w-4 h-4" />
                                <span className="ml-2">Begin Exam</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
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
