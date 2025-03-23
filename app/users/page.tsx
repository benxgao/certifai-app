'use client';

import React from 'react';
import { auth } from '../../firebase/firebaseWebConfig';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <>
      <div className="container mx-auto mt-8 max-w-[560px]">
        <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
          <h1 className="text-3xl font-semibold">Private Page</h1>
        </div>
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
