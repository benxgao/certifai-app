'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { User } from 'firebase/auth';

import { auth } from '../../firebase/firebaseWebConfig';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [storedToken, setStoredToken] = useState<string | null>(null);

  const [apiData, setApiData] = useState<any>(null);

  const [protectedData, setProtectedData] = useState(null);

  const handleLogout = () => {
    auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const token = await authUser.getIdToken();

        console.log(`authUser token: ${token}`);
        // console.log(`authUser: ${JSON.stringify(authUser)}`);

        // store token in cookie so that it can be used in next.js backend
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          console.error(`fetch api/auth from main: ${JSON.stringify(res.status)}`);
          throw new Error(`Failed to fetch api/auth from main: ${JSON.stringify(res.body)}`);
        }

        setUser(authUser);
        setStoredToken(token);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchData(data: { data: string }) {
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          console.error(`fetch error: ${JSON.stringify(res.status)}`);
          throw new Error(`Failed to fetch data: ${JSON.stringify(res.body)}`);
        }

        setApiData(await res.json());
      } catch (error) {
        console.error('JWT verification or fetch error:', error);
      }
    }

    if (user) {
      fetchData({ data: 'example' });
    }
  }, [user]);

  const handleProtectedRequest = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/protected-resources`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        },
      );

      setProtectedData(response.data);
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

        <div>{apiData && <p>Data from /api/ai: {JSON.stringify(apiData)}</p>}</div>

        <button onClick={handleProtectedRequest}>Get Protected Data</button>

        {protectedData && <pre>{JSON.stringify(protectedData, null, 2)}</pre>}

        {user ? (
          <div>
            <p>Hi, {user?.email}</p>
            <button
              className="mt-4 bg-red-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
              type="button"
              onClick={handleLogout}
            >
              Logout
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
