import React from 'react';
import { AuthProvider } from '../../src/components/context/AuthProvider';

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
