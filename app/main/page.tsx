'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Users, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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

  useEffect(() => {
    if (firebaseUser) {
      // Send a POST request to backend API
      const aiData = getAiData({ data: 'example' });

      console.log(`main: firebaseUser: ${JSON.stringify(firebaseUser)}`);
      console.log(`main: firebaseToken: ${JSON.stringify(firebaseToken)}`);
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

          {/* Today's Plan Card */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Today&apos;s Plan</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg">
                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                  <Play className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Full Body Workout</p>
                  <p className="text-sm text-muted-foreground">60 mins | Intermediate</p>
                </div>
                <Button size="sm">Start</Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Activity</CardTitle>
              <CardDescription>Recent workouts and achievements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">You completed &apos;Morning Run&apos;.</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/friend-avatar.jpg" alt="Friend" />
                  <AvatarFallback>F</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Alex G. shared a new workout.</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (takes 1 col on large screens) */}
        <div id="dashboard-right-column" className="grid gap-4 md:gap-6">
          {/* Progress Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Progress</CardTitle>
              <CardDescription>Your weekly goal progress.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Workouts</span>
                  <span>3 / 5</span>
                </div>
                <Progress value={60} aria-label="60% workout progress" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Active Minutes</span>
                  <span>180 / 240</span>
                </div>
                <Progress value={75} aria-label="75% active minutes progress" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" size="sm" className="p-0 h-auto">
                View Detailed Stats
              </Button>
            </CardFooter>
          </Card>

          {/* Community Card */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Community</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Connect with friends.</p>
              <Button className="w-full">Find Friends</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
