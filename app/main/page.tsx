'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppHeader from '@/components/custom/appheader';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';

const getAiData = async (data: { data: string }) => {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('JWT verification or fetch error:', error);
  }
};

const handleProtectedRequest =
  ({
    firebaseToken,
    setProtectedData,
  }: {
    firebaseToken: string | null;
    setProtectedData: React.Dispatch<React.SetStateAction<any>>;
  }) =>
  async () => {
    try {
      // Send a POST request to server API
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/protected-resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        console.error(`fetch error: ${JSON.stringify(res.status)}`);
        throw new Error(`Failed to fetch data: ${JSON.stringify(res.body)}`);
      }

      const data: any = await res.json();

      console.log(`protected-resources response: ${JSON.stringify(data)}`);

      setProtectedData(data);
    } catch (error) {
      console.error('Protected request failed:', error);
    }
  };

export default function Dashboard() {
  const { firebaseUser, firebaseToken } = useFirebaseAuth();
  const [apiData, setApiData] = useState<any>(null);
  const [protectedData, setProtectedData] = useState(null);
  const router = useRouter();
  const [showExamModal, setShowExamModal] = useState(false);
  const [examName, setExamName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/new-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: examName }),
      });
      if (res.ok) {
        setShowExamModal(false);
        router.push('/main/exams');
      } else {
        // handle error (optional)
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (firebaseUser) {
      // Send a POST request to backend API
      const aiData = getAiData({ data: 'example' });

      console.log(`main:
        | firebaseUserId: ${JSON.stringify(firebaseUser.uid, null, 2)}`);

      setApiData(aiData);
    }
  }, [firebaseUser, firebaseToken]);

  return (
    <div
      id="dashboard-container"
      className="flex flex-col min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8"
    >
      <AppHeader title="Dashboard" />
      <main
        id="dashboard-main-content"
        className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-3"
      >
        {/* Left Column (takes 2 cols on large screens) */}
        <div id="dashboard-left-column" className="lg:col-span-2 grid gap-4 md:gap-6">
          {/* Upcoming Sessions Card */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">
                Data from backend/api/ai: {JSON.stringify(apiData) || ''}
              </CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Data from server/api/protected-resources:{' '}
                {JSON.stringify(protectedData) || 'No upcoming sessions scheduled.'}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={handleProtectedRequest({ firebaseToken, setProtectedData })}
              >
                Schedule New
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column (takes 1 col on large screens) */}
        <div id="dashboard-right-column" className="grid gap-4 md:gap-6">
          {/* exams Card */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Exams</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Connect with friends.</p>
              <Button className="w-full" onClick={() => setShowExamModal(true)}>
                Add Exam
              </Button>
            </CardContent>
          </Card>

          {showExamModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-background rounded-lg shadow-lg p-6 w-full max-w-sm">
                <form onSubmit={handleExamSubmit}>
                  <h2 className="text-lg font-semibold mb-4">Add New Exam</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="exam-name">
                      Exam name
                    </label>
                    <input
                      id="exam-name"
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={examName}
                      onChange={(e: any) => setExamName(e.target?.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowExamModal(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !examName}>
                      New exam
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
