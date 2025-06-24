import { redirect } from 'next/navigation';
import { getServerAuthState, getServerAuthStateWithRefresh } from '@/src/lib/server-auth-strategy';

interface ServerAuthWrapperProps {
  children: React.ReactNode;
  fallbackUrl?: string;
  requireAuth?: boolean;
}

/**
 * Server component that handles authentication checks without client-side Firebase calls
 * This can be used to wrap pages that need authentication verification
 */
export default async function ServerAuthWrapper({
  children,
  fallbackUrl = '/signin',
  requireAuth = true,
}: ServerAuthWrapperProps) {
  if (!requireAuth) {
    return <>{children}</>;
  }

  const authState = await getServerAuthStateWithRefresh();

  if (!authState.isAuthenticated) {
    let errorMessage = 'Please sign in to access this page.';

    if (authState.needsRefresh) {
      errorMessage = authState.needsClientRefresh
        ? 'Session expired. Please sign in again.'
        : 'Session needs refresh. Please try again.';
    }

    redirect(`${fallbackUrl}?error=${encodeURIComponent(errorMessage)}`);
  }

  return <>{children}</>;
}

/**
 * Server-side hook equivalent for getting auth state in server components
 */
export async function getServerAuth() {
  return await getServerAuthState();
}

/**
 * Enhanced server-side hook that includes refresh information
 */
export async function getServerAuthWithRefresh() {
  return await getServerAuthStateWithRefresh();
}
