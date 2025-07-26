'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaArrowLeft } from 'react-icons/fa';
import Breadcrumb from '@/components/custom/Breadcrumb';

interface ExamErrorStateProps {
  certId: number | null;
  examId: string | null;
  error: any;
}

export const ExamErrorState: React.FC<ExamErrorStateProps> = ({ certId, examId, error }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-violet-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/30 pt-16">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-200/20 dark:bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-200/20 dark:bg-orange-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/main' },
            { label: 'Certifications', href: '/main/certifications' },
            {
              label: `Certification ${certId}`,
              href: `/main/certifications/${certId}/exams`,
            },
            { label: 'Error Loading Exam', current: true },
          ]}
        />

        {/* Error Card */}
        <div className="mt-8">
          <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-red-200/60 dark:border-red-700/60 shadow-2xl rounded-2xl overflow-hidden">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-red-200/20 dark:bg-red-600/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-orange-200/20 dark:bg-orange-600/10 rounded-full blur-3xl"></div>

            <CardContent className="relative z-10 p-8">
              <div className="text-center space-y-6">
                {/* Error Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-red-50/80 dark:bg-red-900/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-200/60 dark:border-red-700/60 shadow-lg">
                    <svg
                      className="w-10 h-10 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Error Title */}
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 tracking-tight">
                    Error Loading Exam {examId?.substring(0, 8)}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    {error?.message || 'Error loading exam data.'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="min-w-[140px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50/90 dark:hover:bg-slate-700/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => window.history.back()}
                    className="min-w-[140px] bg-violet-500/90 hover:bg-violet-600/90 text-white border border-violet-400/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FaArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
