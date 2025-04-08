'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/firebaseWebConfig';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';

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

export default function Home() {
  const router = useRouter();
  const { firebaseUser, firebaseToken, setFirebaseUser, setFirebaseToken } = useFirebaseAuth();
  const [apiData, setApiData] = useState<any>(null);
  const [protectedData, setProtectedData] = useState(null);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth-cookie/clear', {
        method: 'POST',
      });

      await auth.signOut();

      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    if (firebaseUser) {
      // Send a POST request to backend API
      const aiData = getAiData({ data: 'example' });

      console.log(`main: firebaseUser: ${JSON.stringify(firebaseUser)}`);
      console.log(`main: firebaseToken: ${JSON.stringify(firebaseToken)}`);
      setApiData(aiData);
    }
  }, [firebaseUser, firebaseToken]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const firebaseToken = await authUser.getIdToken(true);

        setFirebaseUser(authUser);
        setFirebaseToken(firebaseToken);

        // // store token in cookie
        await fetch('/api/auth-cookie/set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firebaseToken }),
        });
      } else {
        setFirebaseUser(null);
        setFirebaseToken(null);
      }
    });

    return () => unsubscribe();
  });

  const handleProtectedRequest = async () => {
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

  return (
    <>
      <div className="container mx-auto mt-8 max-w-[560px]">
        <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
          <h1 className="text-3xl font-semibold">Private Page</h1>
        </div>

        <div>{apiData && <p>Data from backend/api/ai: {JSON.stringify(apiData)}</p>}</div>
        <div>
          {protectedData && (
            <p>Data from server/api/protected-resources: {JSON.stringify(protectedData)}</p>
          )}
        </div>

        <button onClick={handleProtectedRequest}>Get Protected Data</button>

        {firebaseUser ? (
          <div>
            <p>Hi, {firebaseUser?.email}</p>
            <button
              className="mt-4 bg-red-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
              type="button"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        ) : (
          <div>
            <Link href="/signin">
              <button
                className="mt-4 bg-blue-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
                type="button"
              >
                Signin
              </button>
            </Link>
            <Link href="/signup">
              <button
                className="mt-4 bg-red-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
                type="button"
              >
                Sign up
              </button>
            </Link>
          </div>
        )}
      </div>
      <Head>
        <title>Private Page</title>
      </Head>
    </>
  );
}
