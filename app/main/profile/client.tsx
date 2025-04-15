'use client';

import React, { useEffect } from 'react';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppHeader from '@/components/custom/appheader';

const AIClientPage: React.FC = () => {
  const { firebaseUser } = useFirebaseAuth();

  useEffect(() => {
    // This effect runs when the component mounts
    if (firebaseUser) {
      console.log('User is logged in:', firebaseUser);
    } else {
      console.log('No user is logged in');
    }
  }, [firebaseUser]);

  return (
    <div
      id="dashboard-container"
      className="flex flex-col min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8"
    >
      {/* Header */}
      <AppHeader title="Profile" />
      {/* Main Content Grid */}
      <main
        id="dashboard-main-content"
        className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-3"
      >
        <Card>
          <CardHeader>
            <CardTitle>Basic info</CardTitle>
          </CardHeader>
          <CardContent>
            {firebaseUser ? (
              <div>
                <p>
                  <strong>Name:</strong> {firebaseUser.displayName || 'N/A'}
                </p>
                <p>
                  <strong>Email:</strong> {firebaseUser.email || 'N/A'}
                </p>
              </div>
            ) : (
              <p>Loading user information...</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AIClientPage;
