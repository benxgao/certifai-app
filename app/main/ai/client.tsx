'use client';

import React, { useEffect, useState } from 'react';
// import { jwtVerify } from 'jose';
// import { AuthContext } from '../../../src/components/context/AuthProvider';

// const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;

const AIClientPage: React.FC = () => {
  const [apiData, setApiData] = useState<any>(null);
  // const { token, setToken } = useContext(AuthContext);

  useEffect(() => {
    async function getJwt() {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: 'token123' }),
      });

      if (!res.ok) {
        console.error(`fetch error: ${JSON.stringify(res.status)}`);
        throw new Error(`Failed to fetch data: ${JSON.stringify(res.body)}`);
      }

      // const data = await res.json();
      // console.log(`token is fetched: ${data.token}`);

      // setToken(data.token);
    }

    // if (!token) {
    getJwt();
    // }
  }, []);

  useEffect(() => {
    async function fetchData(data: { data: string }) {
      // if (!token) return;

      try {
        // if (!secretKey) throw new Error('JWT secret not configured');

        // const { payload, protectedHeader } = await jwtVerify(
        //   token,
        //   new TextEncoder().encode(secretKey),
        // );

        // console.log(`fetchData: payload: ${JSON.stringify(payload)}`);
        // console.log(`fetchData: protectedHeader: ${JSON.stringify(protectedHeader)}`);

        const res = await fetch('/api/ai', {
          // headers: {
          //   'Content-Type': 'application/json',
          //   Authorization: `Bearer ${token}`,
          // },
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

    fetchData({ data: 'example' });
  }, []);

  return (
    <div>
      <h1>Client Component with JWT</h1>
      {apiData && <p>Data from Protected API: {JSON.stringify(apiData)}</p>}
      {/* {token && <p>JWT: {token}</p>} */}
    </div>
  );
};

export default AIClientPage;
