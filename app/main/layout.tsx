import React from 'react';
import { AuthProvider } from '../../src/components/context/AuthProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
