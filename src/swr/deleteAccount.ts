'use client';

import { useCallback } from 'react';
import { useAuthMutation } from './useAuthMutation';
import {
  DeleteAccountResponse,
  SwrDataDeleteAccountResponse,
} from '@/src/types/swr-data/deleteAccount';

// Re-export types for backward compatibility
export type {
  DeleteAccountResponse,
} from '@/src/types/swr-data/deleteAccount';

/**
 * Hook to delete user account
 * After successful deletion (HTTP 200), redirects to /signin page
 * Uses hard page navigation for reliable test detection and clean state reset
 */
export function useDeleteAccount(apiUserId: string | null) {
  const url = apiUserId ? `/api/users/${apiUserId}` : null;

  // Use useCallback to ensure the onSuccess callback doesn't cause unnecessary mutation recreation
  const handleDeleteSuccess = useCallback(() => {
    // Redirect to signin page after account deletion.
    // Users must create a new account or use a different existing account to continue.
    // This endpoint receives HTTP 200 response and all user data is purged from the system.

    // Use hard page reload for reliable navigation that Playwright tests can detect
    // This ensures all client state is cleared and the browser performs a full page navigation
    if (typeof window !== 'undefined') {
      window.location.href = '/signin';
    }
  }, []);

  return useAuthMutation<DeleteAccountResponse, void>(url, 'DELETE', {
    // SwrDataDeleteAccountResponse
    onSuccess: handleDeleteSuccess,
  });
}
