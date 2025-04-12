'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Assuming you have shadcn/ui
import { Input } from '@/components/ui/input'; // Assuming you have shadcn/ui
import { Label } from '@/components/ui/label'; // Assuming you have shadcn/ui
import { cn } from '@/lib/utils'; // Assuming you have a utility for combining class names

import { auth } from '@/firebase/firebaseWebConfig';

const LoginPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();

  const onChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignin = async () => {
    try {
      setError('');
      setIsLoading(true); // Set loading to true when starting the request

      const signedIn = await signInWithEmailAndPassword(auth, form.email, form.password);
      console.log(`signin init: ${JSON.stringify(signedIn.user.uid)}`);

      const firebaseToken = await signedIn.user.getIdToken(true);
      // console.log('signin token:', token);

      // store token in cookie
      await fetch('/api/auth-cookie/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseToken }),
      }).then(() => {
        router.replace('/main');
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false when the request finishes, regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Welcome back to <span className="text-purple-400">App</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Login to your account to continue
          </p>
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
                value={form?.email}
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
                value={form?.password}
                onChange={onChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-purple-400 hover:text-purple-300">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="button"
              className={cn(
                'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
                isLoading
                  ? 'bg-purple-700' // Keep the button purple when loading
                  : 'bg-purple-600 hover:bg-purple-700', // Change color on hover only when not loading
                'transition-colors duration-300', // Add smooth transition
              )}
              disabled={isLoading} // Disable the button while loading
              onClick={handleSignin}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-purple-300 group-hover:text-purple-200"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2h2V7a7 7 0 00-14 0v2h2zm7 5a2 2 0 01-2-2 2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>

          {error && <div className="text-center text-sm text-red-500">{error}</div>}

          <div className="text-center text-sm text-gray-300 mt-4">
            Do not have an account?{' '}
            <a href="#" className="font-medium text-purple-400 hover:text-purple-300">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
