'use client';

import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

import { auth } from '@/src/firebase/firebaseWebConfig';

const LoginPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  // Clear any error messages from URL params (in case user was redirected back with error)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const onChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);

      // Start the authentication process
      const signInPromise = signInWithEmailAndPassword(auth, form.email, form.password);

      // Immediately set redirecting state and navigate to main page for better UX
      setIsRedirecting(true);
      router.replace('/main');

      // Continue authentication in the background
      const signedIn = await signInPromise;

      console.log(`signin initialized
        | uid: ${JSON.stringify(signedIn.user.uid)}`);

      const firebaseToken = await signedIn.user.getIdToken(true);

      // Set the authentication cookie
      const cookieRes = await fetch('/api/auth-cookie/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseToken }),
      });

      if (!cookieRes.ok) {
        const cookieError: any = await cookieRes.json();
        console.error('Failed to set authentication cookie:', cookieError.message);
        // If cookie setting fails, redirect back to signin with error
        const errorMessage = encodeURIComponent(
          cookieError.message || 'Failed to set authentication cookie.',
        );
        router.replace(`/signin?error=${errorMessage}`);
      }
    } catch (error: any) {
      console.error(error);

      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = 'Invalid email or password.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
        }
      }

      // If authentication fails, redirect back to signin with error
      const encodedError = encodeURIComponent(errorMessage);
      router.replace(`/signin?error=${encodedError}`);
    } finally {
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Enter your email and password to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={form.email}
                onChange={onChange}
                disabled={isLoading || isRedirecting}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={onChange}
                disabled={isLoading || isRedirecting}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" disabled={isLoading || isRedirecting} />
              <Label
                htmlFor="remember-me"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </Label>
            </div>
            {error && <p className="text-sm text-center font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading || isRedirecting}>
              {(isLoading || isRedirecting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isRedirecting ? 'Redirecting...' : isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm">
          <p className="text-muted-foreground">
            Do not have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
