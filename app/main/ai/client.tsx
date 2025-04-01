'use client';

import React, { useEffect, useState } from 'react';

const AIClientPage: React.FC = () => {
  const [apiData, setApiData] = useState<any>(null);

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

    fetchData({ data: 'example' });
  }, []);

  return (
    <div>
      <h1>Client Component with JWT</h1>
      {apiData && <p>Data from Protected API: {JSON.stringify(apiData)}</p>}
    </div>
  );
};

export default AIClientPage;
