'use client';

import { usePathname } from 'next/navigation';
import { FirebaseAuthProvider } from '@/src/context/FirebaseAuthContext';

interface ConditionalFirebaseAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Conditionally wraps children with FirebaseAuthProvider only for pages that require authentication.
 * This prevents unnecessary Firebase Auth initialization on public marketing pages,
 * which eliminates calls to https://securetoken.googleapis.com/v1/token?key= on those pages.
 *
 * Enhanced with lazy loading to further reduce client-side Firebase calls.
 */
export default function ConditionalFirebaseAuthProvider({
  children,
}: ConditionalFirebaseAuthProviderProps) {
  const pathname = usePathname();

  // Define paths that require Firebase authentication (client-side)
  // Server-side auth checking is preferred where possible
  const authRequiredPaths = ['/main', '/signin', '/signup', '/forgot-password'];

  // Check if the current path requires authentication
  const requiresAuth = authRequiredPaths.some((path) => {
    if (path === '/' && pathname === '/') return false; // Landing page doesn't need auth
    return pathname.startsWith(path);
  });

  // For pages that require auth, wrap with FirebaseAuthProvider
  // Note: Removed Suspense as it can cause issues with Firebase Auth initialization
  if (requiresAuth) {
    return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
  }

  // For public pages, render children directly without Firebase Auth
  // This completely eliminates securetoken.googleapis.com calls on marketing pages
  return <>{children}</>;
}
