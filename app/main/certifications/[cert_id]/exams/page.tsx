// filepath: /Users/xingbingao/workplace/certifai-app/app/main/certifications/[cert_id]/exams/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Import useRouter
import { useExamsForCertification, ExamListItem } from '@/swr/exams';
import AppHeader from '@/components/custom/appheader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';

export default function CertificationExamsPage() {
  const params = useParams();
  const router = useRouter(); // Initialize useRouter
  const certId = params.cert_id ? parseInt(params.cert_id as string, 10) : null;
  const { apiUserId } = useFirebaseAuth();

  const { exams, isLoadingExams, isExamsError } = useExamsForCertification(apiUserId, certId);

  const handleStartExam = (examId: string) => {
    // Navigate to the exam attempt page (to be created)
    router.push(`/main/certifications/${certId}/exams/${examId}`);
    // console.log(`Attempting to start exam ${examId} for certification ${certId}`);
    // For now, you can add a toast or alert
    // alert(`Starting exam ${examId}. Navigation to actual exam page not yet implemented.`);
  };

  useEffect(() => {
    if (exams) {
      console.log(`exams: ${JSON.stringify(exams, null, 2)}`);
    }
  }, [exams]);

  if (isLoadingExams) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
        <AppHeader title="Certification Exams" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
    );
  }

  if (isExamsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AppHeader title="Certification Exams" />
        <p className="text-red-500 mt-6">
          {isExamsError.message || 'Error loading exams for this certification.'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      <AppHeader title={`Exams for Certification ID: ${certId}`} />

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
  );
}
