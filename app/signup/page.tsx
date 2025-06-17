'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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
import { auth } from '@/firebase/firebaseWebConfig';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);

      await createUserWithEmailAndPassword(auth, form.email, form.password).then(
        async (userCredential) => {
          // Signed in
          const user = userCredential.user;

          console.log(`User created:0
            | user: ${JSON.stringify(user)}`);

          if (user) {
            await updateProfile(user!, {
              displayName: `${form.firstName} ${form.lastName}`.trim(),
            })
              .then((user) => {
                console.log(`User updated:1
                  | user: ${JSON.stringify(user)}`);
              })
              .catch((error) => {
                console.error('Error updating user profile:', error);
                setError('Failed to update user profile. Please try again.');
              });
          }
        },
      );

      router.replace('/signin');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
      console.error('Signup Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-gray-950">
      {/* Left Column - Image/Description */}
      <div className="hidden lg:flex lg:items-center lg:justify-center bg-gradient-to-br from-primary-900 via-gray-900 to-black p-8">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-gray-300">
            Connect, collaborate, and achieve your fitness goals together.
          </p>
        </div>
      </div>

      {/* Right Column - Signup Form */}
      <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
        {/* Centered the logo horizontally */}
        <div
          id="logo"
          className="flex items-center justify-center mb-6 space-x-3 absolute top-24 left-24"
        >
          <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            C
          </div>
          <span className="text-2xl font-bold text-white">certifai.online</span>
        </div>

        <Card className="w-full max-w-md bg-transparent border-0 text-white mt-24">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-3xl font-extrabold">Create your account</CardTitle>
            <CardDescription className="text-gray-400 pt-1">
              Enter your details below to get started.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              {/* First Name and Last Name Row */}
              <div className="flex space-x-4">
                <div className="w-1/2 space-y-2">
                  <Label htmlFor="first-name" className="text-gray-300">
                    First Name
                  </Label>
                  <Input
                    id="first-name"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={form.firstName}
                    onChange={onChange}
                    className="bg-gray-800 border-gray-700 placeholder-gray-500 focus:ring-violet-500 focus:border-violet-500 text-white"
                    placeholder="John"
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/2 space-y-2">
                  <Label htmlFor="last-name" className="text-gray-300">
                    Last Name
                  </Label>
                  <Input
                    id="last-name"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={form.lastName}
                    onChange={onChange}
                    className="bg-gray-800 border-gray-700 placeholder-gray-500 focus:ring-violet-500 focus:border-violet-500 text-white"
                    placeholder="Doe"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label htmlFor="email-address" className="text-gray-300">
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
                  className="bg-gray-800 border-gray-700 placeholder-gray-500 focus:ring-violet-500 focus:border-violet-500 text-white"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={onChange}
                  className="bg-gray-800 border-gray-700 placeholder-gray-500 focus:ring-violet-500 focus:border-violet-500 text-white"
                  placeholder="•••••••• (min. 6 characters)"
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-center text-sm text-red-500 pt-1">{error}</p>}
              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-gray-400 pt-4">
              Already have an account?&nbsp;
              <Link
                href="/signin"
                className="font-medium text-violet-400 hover:text-violet-300 hover:underline"
              >
                Sign in
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
