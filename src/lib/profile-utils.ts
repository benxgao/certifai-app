/**
 * Profile utilities for managing user profile information
 */

import { updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { auth } from '@/src/firebase/firebaseWebConfig';

export interface UpdateDisplayNameData {
  displayName: string;
}

export interface UpdateProfileResult {
  success: boolean;
  error?: string;
}

/**
 * Update the user's display name in Firebase Auth
 */
export async function updateFirebaseDisplayName(
  displayName: string
): Promise<UpdateProfileResult> {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return {
        success: false,
        error: 'No authenticated user found'
      };
    }

    // Update the display name in Firebase Auth
    await firebaseUpdateProfile(currentUser, {
      displayName: displayName.trim()
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating Firebase display name:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update display name'
    };
  }
}

/**
 * Validate display name input
 */
export function validateDisplayName(displayName: string): { isValid: boolean; error?: string } {
  const trimmed = displayName.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Display name cannot be empty' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Display name must be at least 2 characters long' };
  }

  if (trimmed.length > 50) {
    return { isValid: false, error: 'Display name cannot exceed 50 characters' };
  }

  // Check for valid characters (letters, numbers, spaces, hyphens, apostrophes)
  const validNameRegex = /^[a-zA-Z0-9\s\-']+$/;
  if (!validNameRegex.test(trimmed)) {
    return { isValid: false, error: 'Display name can only contain letters, numbers, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true };
}
