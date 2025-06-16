'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { useUserCertifications } from '@/context/UserCertificationsContext';
import { UserRegisteredCertification } from '@/swr/certifications';
import SkeletonCard from '@/components/custom/SkeletonCard';

const MainPage = () => {
  const { firebaseUser } = useFirebaseAuth();
  const router = useRouter();

  const { userCertifications, isLoadingUserCertifications, isUserCertificationsError } =
    useUserCertifications();

  useEffect(() => {
    if (firebaseUser) {
      console.log(`Firebase user ID: ${JSON.stringify(firebaseUser.uid, null, 2)}`);
    }
  }, [firebaseUser]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pt-16">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>

        {/* User's Registered Certifications Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Your Registered Certifications</h2>
          {isLoadingUserCertifications ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={`user-skeleton-${index}`} />
              ))}
            </div>
          ) : userCertifications && userCertifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCertifications.map((cert: UserRegisteredCertification) => (
                <Card
                  key={`user-${cert.cert_id}`}
                  className="shadow-md min-w-l hover:shadow-lg transition-shadow duration-200 py-0 cursor-pointer"
                  onClick={() => router.push(`/main/certifications/${cert.cert_id}/exams`)}
                >
                  <CardHeader className="bg-primary rounded-t-lg p-6 ">
                    <CardTitle className="text-lg text-white">{cert.certification.name}</CardTitle>{' '}
                  </CardHeader>
                  <CardContent className="p-6">
                    {' '}
                    {/* Added padding-top to space content from header */}
                    <p className="text-sm text-muted-foreground">ID: {cert.cert_id}</p>
                    <p className="text-sm text-muted-foreground">Status: {cert.status}</p>
                    <p className="text-sm text-muted-foreground">
                      Started since: {cert.assigned_at}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-card rounded-lg shadow">
              <p className="text-lg text-muted-foreground">
                You haven&apos;t registered for any certifications yet.
              </p>
              <Button className="mt-4" onClick={() => router.push('/main/certifications')}>
                Explore Certifications
              </Button>
            </div>
          )}
          {isUserCertificationsError && (
            <p className="text-red-500 mt-4">Error loading your registered certifications.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default MainPage;
