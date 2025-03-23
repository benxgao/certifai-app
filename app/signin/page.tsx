/**
 * https://dev.to/dindustack/firebase-authentication-with-next-4ckp
 * https://blog.stackademic.com/securing-your-next-js-authentication-with-firebase-51e609e281bb
 */

'use client';

import React, { useState } from 'react';
import { auth } from '../../firebase/firebaseWebConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

export default function signin() {
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
      await signInWithEmailAndPassword(auth, form.email, form.password);
      router.replace('/users');
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
}

// import React from 'react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { firebaseAuth } from '../../firebase/firebaseWebConfig';
// import { signInWithPopup } from 'firebase/auth';

// export default function GoogleSignIn() {
//   const handleSignin = async () => {
//     await signInWithPopup(firebaseAuth, googleProvider);
//   };

//   const [user, loading] = useAuthState(firebaseAuth);

//   return (
//     <>
//       {loading ? (
//         <>loading...</>
//       ) : (
//         <>
//           {user ? (
//             <img src={user?.photoURL ?? undefined} alt={user?.displayName ?? undefined} />
//           ) : (
//             <button onClick={handleSignin}>Signin</button>
//           )}
//         </>
//       )}
//     </>
//   );
// }
