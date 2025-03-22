'use client';

import React from 'react';

const AIPage = ({ data }) => {
  return (
    <div>
      <h1>AI Page</h1>
      <pre>{data ? JSON.stringify(data, null, 2) : 'No data available'}</pre>
    </div>
  );
};

export default AIPage;
