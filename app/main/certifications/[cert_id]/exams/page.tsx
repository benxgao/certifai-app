// filepath: /Users/xingbingao/workplace/certifai-app/app/main/certifications/[cert_id]/exams/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useExamsContext, ExamsProvider } from '@/context/ExamsContext'; // Import the context
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { ExamListItem } from '@/swr/exams'; // Ensure ExamListItem is imported
import Breadcrumb from '@/components/custom/Breadcrumb'; // Import Breadcrumb component
import BreadcrumbSkeleton from '@/components/custom/BreadcrumbSkeleton'; // Import BreadcrumbSkeleton component
import {
  FaPlay,
  FaCheck,
  FaClock,
  FaClipboardList,
  FaChartLine,
  FaArrowRight,
  FaPause,
  FaTrophy,
  FaPlus,
} from 'react-icons/fa';

// Renamed original component to CertificationExamsContent
function CertificationExamsContent() {
  const params = useParams();
  const router = useRouter();
  const certId = params.cert_id ? parseInt(params.cert_id as string, 10) : null;
  const { apiUserId } = useFirebaseAuth();

  // Use the context for exams data
  const { exams, isLoadingExams, isExamsError, mutateExams } = useExamsContext();

  // State for create exam modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [navigatingExamId, setNavigatingExamId] = useState<string | null>(null);

  const handleStartExam = (examId: string) => {
    setNavigatingExamId(examId);
    // Immediate redirect with optimistic loading
    router.push(`/main/certifications/${certId}/exams/${examId}`);
  };

  const handleCreateExam = async () => {
    if (!examTitle.trim() || !apiUserId || !certId) return;

    setIsCreating(true);
    try {
      const response = await fetch(`/api/users/${apiUserId}/certifications/${certId}/exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: examTitle.trim(),
          description: examDescription.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create exam');
      }

      // Refresh the exams list
      await mutateExams();

      // Reset form and close modal
      setExamTitle('');
      setExamDescription('');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating exam:', error);
      // You could add a toast notification here
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (exams) {
      // console.log(`exams from context: ${JSON.stringify(exams, null, 2)}`);
    }
  }, [exams]);

  if (isLoadingExams) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
          {/* Breadcrumb Navigation Skeleton */}
          <BreadcrumbSkeleton />

          {/* Header Section */}
          <div className="mb-8 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-96" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>

          {/* Skeleton Cards */}
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={`exam-skeleton-${index}`}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm rounded-xl overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-r from-slate-25 to-slate-50/50 dark:from-slate-800 dark:to-slate-700/30 border-b border-slate-100 dark:border-slate-700/50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-full rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isExamsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Error Loading Exams</h1>
            <p className="text-muted-foreground max-w-md">
              {isExamsError.message || 'Error loading exams for this certification.'}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
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
              label:
                exams && exams.length > 0 && exams[0].certification?.name
                  ? exams[0].certification.name
                  : `Certification ${certId}`,
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
                  {exams && exams.length > 0 && exams[0].certification?.name
                    ? exams[0].certification.name
                    : 'Certification Overview'}
                </h2>
              </div>

              <div className="flex items-center space-x-3">
                {/* Create Exam Button */}
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-700 text-white border-violet-600 hover:border-violet-700 shadow-sm"
                    >
                      <FaPlus className="w-4 h-4 mr-2" />
                      Create Exam
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Exam</DialogTitle>
                      <DialogDescription>
                        Create a new exam for this certification. Fill in the details below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="exam-title">Exam Title</Label>
                        <Input
                          id="exam-title"
                          placeholder="Enter exam title..."
                          value={examTitle}
                          onChange={(e) => setExamTitle(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="exam-description">Description (Optional)</Label>
                        <Textarea
                          id="exam-description"
                          placeholder="Enter exam description..."
                          value={examDescription}
                          onChange={(e) => setExamDescription(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateModalOpen(false)}
                        disabled={isCreating}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCreateExam}
                        disabled={isCreating || !examTitle.trim()}
                      >
                        {isCreating ? 'Creating...' : 'Create Exam'}
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
                      {exams && exams.length > 0 && exams[0].certification?.max_quiz_counts
                        ? exams[0].certification.max_quiz_counts
                        : '25'}
                    </p>
                  </div>
                </div>

                {/* Pass Score */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <FaTrophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <p className="text-sm font-normal text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Target Score
                      </p>
                    </div>
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-100 text-center">
                      {exams && exams.length > 0 && exams[0].certification?.pass_score
                        ? `${exams[0].certification.pass_score}%`
                        : '80%'}
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
              // Enhanced status detection
              const isCompleted = exam.submitted_at !== null;
              const hasStarted = exam.started_at !== null;
              const hasScore = exam.score !== null && exam.score !== undefined;
              const meetsRequirement =
                hasScore && exam.score! >= (exam.certification?.pass_score || 80);
              const needsImprovement =
                hasScore && exam.score! < (exam.certification?.pass_score || 80);

              // Determine exam status
              let examStatus = 'not_started';
              if (isCompleted && meetsRequirement) {
                examStatus = 'completed_successful';
              } else if (isCompleted && needsImprovement) {
                examStatus = 'completed_review';
              } else if (isCompleted) {
                examStatus = 'completed';
              } else if (hasStarted) {
                examStatus = 'in_progress';
              }

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
                      {(hasScore || examStatus === 'in_progress') && (
                        <div className="flex-shrink-0 text-right">
                          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600 shadow-sm">
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                              Score
                            </p>
                            <p
                              className={`text-2xl font-bold ${
                                hasScore
                                  ? meetsRequirement
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-orange-600 dark:text-orange-400'
                                  : 'text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              {hasScore ? `${exam.score}%` : '—'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Target: {exam.certification?.pass_score || 80}%
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Exam Statistics */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                            Questions
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {exam.certification?.max_quiz_counts || '25'}
                        </p>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600/50">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaClock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                            Duration
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          60 min
                        </p>
                      </div>

                      {/* Show score in statistics only if not already shown in header */}
                      {!hasScore && examStatus !== 'in_progress' && (
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600/50">
                          <div className="flex items-center space-x-2 mb-2">
                            <FaChartLine className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                              Target Score
                            </span>
                          </div>
                          <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            {exam.certification?.pass_score || 80}%
                          </p>
                        </div>
                      )}

                      {/* Show pass rate or attempts info */}
                      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600/50 col-span-2 lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FaTrophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                            Status
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {examStatus === 'completed_successful'
                            ? 'Passed'
                            : examStatus === 'completed_review'
                            ? 'Review'
                            : examStatus === 'completed'
                            ? 'Submitted'
                            : examStatus === 'in_progress'
                            ? 'In Progress'
                            : 'Not Started'}
                        </p>
                      </div>
                    </div>

                    {/* Status Information - Simplified */}
                    <div className="mb-6">
                      <div
                        className={`p-4 rounded-xl border ${
                          examStatus === 'completed_successful'
                            ? 'bg-emerald-25 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30'
                            : examStatus === 'completed_review'
                            ? 'bg-blue-25 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30'
                            : examStatus === 'in_progress'
                            ? 'bg-orange-25 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30'
                            : 'bg-blue-25 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              examStatus === 'completed_successful'
                                ? 'bg-emerald-50 dark:bg-emerald-900/30'
                                : examStatus === 'completed_review'
                                ? 'bg-blue-50 dark:bg-blue-900/30'
                                : examStatus === 'in_progress'
                                ? 'bg-orange-50 dark:bg-orange-900/30'
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
                              <FaPause className="w-5 h-5 text-orange-600 dark:text-orange-400" />
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
                                  ? 'text-orange-600 dark:text-orange-300'
                                  : 'text-blue-600 dark:text-blue-300'
                              }`}
                            >
                              {examStatus === 'completed_successful' &&
                                'Congratulations! Certification Earned'}
                              {examStatus === 'completed_review' &&
                                'Review Available with Explanations'}
                              {examStatus === 'completed' &&
                                !hasScore &&
                                'Exam Submitted Successfully'}
                              {examStatus === 'in_progress' && 'Resume Your Exam'}
                              {examStatus === 'not_started' && 'Begin Your Assessment'}
                            </p>
                            <p
                              className={`text-sm ${
                                examStatus === 'completed_successful'
                                  ? 'text-emerald-500 dark:text-emerald-400'
                                  : examStatus === 'completed_review'
                                  ? 'text-blue-500 dark:text-blue-400'
                                  : examStatus === 'in_progress'
                                  ? 'text-orange-500 dark:text-orange-400'
                                  : 'text-blue-500 dark:text-blue-400'
                              }`}
                            >
                              {examStatus === 'completed_successful' &&
                                `You've achieved the required score with ${exam.score}%`}
                              {examStatus === 'completed_review' &&
                                `Score: ${exam.score}% - View detailed explanations and learning resources`}
                              {examStatus === 'completed' &&
                                !hasScore &&
                                'Your responses are being evaluated'}
                              {examStatus === 'in_progress' && 'Continue from where you left off'}
                              {examStatus === 'not_started' &&
                                'Demonstrate your knowledge and earn your certification'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleStartExam(exam.exam_id)}
                      disabled={navigatingExamId === exam.exam_id}
                      variant="outline"
                      className={`w-full h-12 text-base font-medium rounded-xl transition-all duration-200 group ${
                        examStatus === 'completed_successful'
                          ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-800 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/30 dark:hover:border-emerald-700 dark:hover:text-emerald-300'
                          : examStatus === 'completed_review'
                          ? 'border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:border-blue-700 dark:hover:text-blue-300'
                          : examStatus === 'in_progress'
                          ? 'border-orange-200 text-orange-700 hover:bg-orange-100 hover:border-orange-300 hover:text-orange-800 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/30 dark:hover:border-orange-700 dark:hover:text-orange-300'
                          : 'border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:border-blue-700 dark:hover:text-blue-300'
                      }`}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        {navigatingExamId === exam.exam_id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                            <span>Loading Exam...</span>
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
                            <FaArrowRight className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 group-hover:translate-x-1 transition-all duration-200" />
                            <span>Resume Exam</span>
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
  const params = useParams();
  const certId = params.cert_id ? parseInt(params.cert_id as string, 10) : null;

  return (
    <ExamsProvider certId={certId}>
      <CertificationExamsContent />
    </ExamsProvider>
  );
}
