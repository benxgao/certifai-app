import React from 'react';

const fetchData = async (data) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai`, {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log(`process.env.NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`);

    if (!response.ok) {
      // const error = await response.json();
      console.error(`fetch error: ${JSON.stringify(response.status)}`);
      throw new Error(`Failed to fetch data: ${JSON.stringify(response.body)}`);
    }

    const result = await response.json();
    console.log(`fetch result: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const AIPage = async ({}) => {
  const data = await fetchData({ message: 'Hello, AI!' });

  return (
    <div>
      <h1>AI Page</h1>
      <pre>{data ? JSON.stringify(data, null, 2) : 'No data available'}</pre>
    </div>
  );
};

export default AIPage;
