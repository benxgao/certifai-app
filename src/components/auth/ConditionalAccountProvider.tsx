'use client';

import { usePathname } from 'next/navigation';
import { AccountProvider } from '@/src/context/AccountContext';

interface ConditionalAccountProviderProps {
  children: React.ReactNode;
}

/**
 * Conditionally wraps children with AccountProvider only for pages that require authentication.
 * This prevents AccountProvider (which depends on Firebase Auth) from running during
 * static generation of public pages like documentation.
 */
export default function ConditionalAccountProvider({ children }: ConditionalAccountProviderProps) {
  const pathname = usePathname();

  // Define paths that require account context (same as auth required paths)
  const accountRequiredPaths = ['/main'];

  // Check if the current path requires account context
  const requiresAccount = accountRequiredPaths.some((path) => {
    if (path === '/' && pathname === '/') return false; // Landing page doesn't need account context
    return pathname.startsWith(path);
  });

  // For pages that require account context, wrap with AccountProvider
  if (requiresAccount) {
    return <AccountProvider>{children}</AccountProvider>;
  }

  // For public pages, render children directly without AccountProvider
  return <>{children}</>;
}
