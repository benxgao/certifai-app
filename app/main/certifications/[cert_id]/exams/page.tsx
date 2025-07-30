'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LoadingComponents } from '@/components/custom';
import { toastHelpers } from '@/src/lib/toast';
import { DashboardCard, DashboardCardContent } from '@/src/components/ui/dashboard-card';

import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import {
  ExamListItem,
  useExamsForCertification,
  useDeleteExam,
  useAllUserExams,
} from '@/swr/exams';
import { useCreateExam } from '@/src/swr/createExam';
import { useAuthenticatedCertificationDetail } from '@/src/swr/certifications';
import { useRateLimitFromExams } from '@/src/hooks/useRateLimitFromExams';
import Breadcrumb from '@/components/custom/Breadcrumb';
import { useExamListGenerationMonitor } from '@/src/hooks/useExamListGenerationMonitor';

// Extracted components
import { CertificationStatusCard } from '@/src/components/custom/CertificationStatusCard';
import { CreateExamModal } from '@/src/components/custom/CreateExamModal';
import { ExamCard } from '@/src/components/custom/ExamCard';
import { EmptyExamsState } from '@/src/components/custom/EmptyExamsState';

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

  // Hook for invalidating dashboard stats when exams are created/deleted
  const { mutateAllExams } = useAllUserExams(apiUserId);

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
      await mutateAllExams(); // Refresh dashboard stats
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
      await mutateAllExams(); // Refresh dashboard stats
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/20 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 space-y-10">
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

        {/* Enhanced Certification Status Card */}
        <CertificationStatusCard
          displayCertification={displayCertification}
          exams={exams || null}
          rateLimitInfo={rateLimitInfo}
          isLoadingRateLimit={isLoadingRateLimit}
          onCreateExamClick={() => setIsCreateModalOpen(true)}
          canCreateExam={
            createExamError?.status !== 429 && (rateLimitInfo ? rateLimitInfo.canCreateExam : true)
          }
        />

        {/* Create Exam Modal */}
        <CreateExamModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          displayCertification={displayCertification}
          numberOfQuestions={numberOfQuestions}
          setNumberOfQuestions={setNumberOfQuestions}
          customPromptText={customPromptText}
          setCustomPromptText={setCustomPromptText}
          onCreateExam={handleCreateExam}
          isCreatingExam={isCreatingExam}
          createExamError={createExamError}
        />

        {/* Enhanced Exams List Section */}
        {exams && exams.length > 0 ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Your Practice Exams
              </h2>
              <span className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                {exams.length} exam{exams.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-6">
              {exams.map((exam: ExamListItem) => (
                <ExamCard
                  key={exam.exam_id}
                  exam={exam}
                  displayCertification={displayCertification}
                  onStartExam={handleStartExam}
                  onDeleteExam={handleDeleteExam}
                  navigatingExamId={navigatingExamId}
                  isDeletingExam={isDeletingExam}
                  deleteExamError={deleteExamError}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Your Practice Exams
              </h2>
            </div>

            <DashboardCard>
              <DashboardCardContent>
                <EmptyExamsState />
              </DashboardCardContent>
            </DashboardCard>
          </section>
        )}
      </div>
    </div>
  );
}

export default function CertificationExamsPage() {
  return <CertificationExamsContent />;
}
