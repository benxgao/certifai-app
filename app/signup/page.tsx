'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { auth } from '@/firebase/firebaseWebConfig';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      setError('');
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      router.replace('/signin');
    } catch (error: any) {
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign up to <span className="text-purple-400">App</span>
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="email-address" className="sr-only">
                Email address
              </Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={onChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Email address"
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={onChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <Button
              type="button"
              className={cn(
                'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
                isLoading ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-700',
                'transition-colors duration-300',
              )}
              disabled={isLoading}
              onClick={handleSignup}
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </div>

          {error && <div className="text-center text-sm text-red-500">{error}</div>}

          <div className="text-center text-sm text-gray-300 mt-4">
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-purple-400 hover:text-purple-300">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
