'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast, Toaster } from 'sonner'; // Using sonner for toast notifications
import {
  useCertifications,
  useRegisterCertification,
  CertificationListItem,
  CertificationInput,
} from '@/swr/certifications';
import AppHeader from '@/components/custom/appheader';

export default function CertificationsPage() {
  const { certifications, isLoadingCertifications, isCertificationsError, mutateCertifications } =
    useCertifications();
  const { registerCertification, isCreating, creationError } = useRegisterCertification();
  const [newCertificationName, setNewCertificationName] = useState('');

  const handleRegisterCertification = async () => {
    if (!newCertificationName.trim()) {
      toast.error('Certification name cannot be empty.');
      return;
    }
    try {
      const input: CertificationInput = { name: newCertificationName };
      await registerCertification(input);
      toast.success(`Successfully registered for "${newCertificationName}"!`);
      setNewCertificationName('');
      mutateCertifications(); // Re-fetch the list of certifications
    } catch (err: any) {
      console.error('Failed to register certification:', err);
      toast.error(err.message || 'Failed to register certification. Please try again.');
    }
  };

  if (isCertificationsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AppHeader title="Certifications" />
        <p className="text-red-500">
          Error loading certifications: {isCertificationsError.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      <AppHeader title="Available Certifications" />
      <Toaster richColors />

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Register for a New Certification</CardTitle>
          <CardDescription>
            Enter the name of the certification you want to register for.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="certificationName" className="text-sm font-medium">
              Certification Name
            </Label>
            <Input
              id="certificationName"
              type="text"
              value={newCertificationName}
              onChange={(e) => setNewCertificationName(e.target.value)}
              placeholder="e.g., AWS Certified Cloud Practitioner"
              className="mt-1"
              disabled={isCreating}
            />
          </div>
          {creationError && <p className="text-sm text-red-600">Error: {creationError.message}</p>}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleRegisterCertification}
            disabled={isCreating || !newCertificationName.trim()}
          >
            {isCreating ? 'Registering...' : 'Register Certification'}
          </Button>
        </CardFooter>
      </Card>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Your Registered Certifications</h2>
        {isLoadingCertifications ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : certifications && certifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert: CertificationListItem) => (
              <Card
                key={cert.id}
                className="shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{cert.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">ID: {cert.id}</p>
                  {/* You can add more details here if your CertificationListItem has them */}
                </CardContent>
                {/* Example: Add a button or link for more actions if needed */}
                {/* <CardFooter>
                  <Button variant="outline" size="sm">View Details</Button>
                </CardFooter> */}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-muted-foreground">
              You haven&apos;t registered for any certifications yet.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Use the form above to add your first one!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
