'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { auth } from '../../firebase/firebaseWebConfig';
import { useFirebaseAuth } from '../../context/FirebaseAuthContext';

export default function Home() {
  const { user, firebaseToken } = useFirebaseAuth();
  const [apiData, setApiData] = useState<any>(null);
  const [protectedData, setProtectedData] = useState(null);

  const handleLogout = () => {
    auth.signOut();
  };

  useEffect(() => {
    async function fetchData(data: { data: string }) {
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status}`);
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
            Authorization: `Bearer ${firebaseToken}`,
          },
        },
      );

      console.log(`protected-resources response: ${JSON.stringify(response.data)}`);

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

        <div>{apiData && <p>Data from backend/api/ai: {JSON.stringify(apiData)}</p>}</div>
        <div>
          {protectedData && (
            <p>Data from server/api/protected-resources: {JSON.stringify(protectedData)}</p>
          )}
        </div>

        <button onClick={handleProtectedRequest}>Get Protected Data</button>

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
