// filepath: /Users/xingbingao/workplace/certifai-app/app/main/certifications/[cert_id]/exams/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useExamsContext, ExamsProvider } from '@/context/ExamsContext'; // Import the context
import { ExamListItem } from '@/swr/exams'; // Ensure ExamListItem is imported

// Renamed original component to CertificationExamsContent
function CertificationExamsContent() {
  const params = useParams();
  const router = useRouter();
  const certId = params.cert_id ? parseInt(params.cert_id as string, 10) : null;

  // Use the context for exams data
  const { exams, isLoadingExams, isExamsError } = useExamsContext();

  const handleStartExam = (examId: string) => {
    router.push(`/main/certifications/${certId}/exams/${examId}`);
  };

  useEffect(() => {
    if (exams) {
      // console.log(`exams from context: ${JSON.stringify(exams, null, 2)}`);
    }
  }, [exams]);

  if (isLoadingExams) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Certification Exams</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={`exam-skeleton-${index}`} className="shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <Skeleton className="h-10 w-1/3" />
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
      <div className="min-h-screen bg-background text-foreground pt-16">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Error Loading Exams</h1>
            <p className="text-muted-foreground max-w-md">
              {isExamsError.message || 'Error loading exams for this certification.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Exams for Certification ID: {certId}
          </h1>
        </div>

        {exams && exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {exams.map((exam: ExamListItem) => (
              <Card key={exam.exam_id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{exam.started_at}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{exam.status}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Number of Questions: {exams.length}
                  </p>
                  <Button onClick={() => handleStartExam(exam.exam_id)} className="w-full">
                    Start Exam
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 mt-6 bg-card rounded-lg shadow">
            <p className="text-lg text-muted-foreground">
              No exams are currently available for this certification.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Please check back later.</p>
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
