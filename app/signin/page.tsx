/**
 * https://dev.to/dindustack/firebase-authentication-with-next-4ckp
 * https://blog.stackademic.com/securing-your-next-js-authentication-with-firebase-51e609e281bb
 */

'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../firebase/firebaseWebConfig';

const SignIn = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const onChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignin = async () => {
    try {
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
    }
  };
  return (
    <>
      <div className="container mx-auto mt-8 max-w-[560px]">
        <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
          <h1 className="text-3xl font-semibold">Sign in</h1>
        </div>
        <form>
          <div className="mb-4">
            <label>Email</label>
            <input
              className="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
              type="email"
              name="email"
              value={form?.email}
              onChange={onChange}
            />
          </div>
          <div className="mb-4">
            <label>Password</label>
            <input
              className="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
              type="password"
              name="password"
              value={form?.password}
              onChange={onChange}
            />
          </div>

          <button
            className="bg-blue-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
            type="button"
            onClick={handleSignin}
          >
            Sign in
          </button>
        </form>
      </div>
      <Head>
        <title>Sign in</title>
      </Head>
    </>
  );
};

export default SignIn;
