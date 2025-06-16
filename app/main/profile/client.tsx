'use client';

import React, { useEffect } from 'react';
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      className="flex flex-col min-h-screen bg-background text-foreground pt-16"
    >
      <main id="dashboard-main-content" className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-3">
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
        </div>
      </main>
    </div>
  );
};

export default AIClientPage;
