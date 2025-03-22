import React from 'react';

const fetchData = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai`, {
      cache: 'no-store', // Ensure fresh data on every request
    });

    console.log(`process.env.NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const result = await response.json();

    console.log(`layout result: ${JSON.stringify(result)}`);

    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const data = await fetchData();

  return (
    <div>
      <h1>AI Layout</h1>
      <pre>{data ? JSON.stringify(data, null, 2) : 'No data available'}</pre>
      <div>{children}</div>
    </div>
  );
};

export default Layout;
