/**
 * Firebase Realtime Database service for Stripe checkout session caching
 * Allows storing checkout session IDs before user authentication
 */

import { getDatabase, ref, set, get, remove } from 'firebase/database';
import app from '@/src/firebase/firebaseWebConfig';

const db = getDatabase(app);

export interface CheckoutSessionCache {
  session_id: string;
  price_id: string;
  success_url?: string;
  cancel_url?: string;
  trial_days?: number;
  created_at: number;
  expires_at: number;
}

/**
 * Cache a checkout session ID in Firebase RTDB
 * @param sessionKey - Unique key to identify the session (can be browser fingerprint or UUID)
 * @param sessionData - Checkout session data to cache
 */
export async function cacheCheckoutSession(
  sessionKey: string,
  sessionData: Omit<CheckoutSessionCache, 'created_at' | 'expires_at'>,
): Promise<void> {
  const now = Date.now();
  const expiresAt = now + 30 * 60 * 1000; // 30 minutes expiry

  const cacheData: CheckoutSessionCache = {
    ...sessionData,
    created_at: now,
    expires_at: expiresAt,
  };

  const sessionRef = ref(db, `stripe_checkout_init_sessions/${sessionKey}`);
  await set(sessionRef, cacheData);
}

/**
 * Retrieve a cached checkout session from Firebase RTDB
 * @param sessionKey - Unique key to identify the session
 * @returns Cached session data or null if not found/expired
 */
export async function getCachedCheckoutSession(
  sessionKey: string,
): Promise<CheckoutSessionCache | null> {
  const sessionRef = ref(db, `stripe_checkout_init_sessions/${sessionKey}`);
  const snapshot = await get(sessionRef);

  if (!snapshot.exists()) {
    return null;
  }

  const sessionData = snapshot.val() as CheckoutSessionCache;

  // Check if session has expired
  if (Date.now() > sessionData.expires_at) {
    // Clean up expired session
    await remove(sessionRef);
    return null;
  }

  return sessionData;
}

/**
 * Remove a cached checkout session from Firebase RTDB
 * @param sessionKey - Unique key to identify the session
 */
export async function removeCachedCheckoutSession(sessionKey: string): Promise<void> {
  const sessionRef = ref(db, `stripe_checkout_init_sessions/${sessionKey}`);
  await remove(sessionRef);
}

/**
 * Clean up expired checkout sessions (should be called periodically)
 */
export async function cleanupExpiredSessions(): Promise<void> {
  const sessionsRef = ref(db, 'stripe_checkout_init_sessions');
  const snapshot = await get(sessionsRef);

  if (!snapshot.exists()) {
    return;
  }

  const sessions = snapshot.val();
  const now = Date.now();

  for (const [sessionKey, sessionData] of Object.entries(sessions)) {
    const data = sessionData as CheckoutSessionCache;
    if (now > data.expires_at) {
      await removeCachedCheckoutSession(sessionKey);
    }
  }
}

/**
 * Generate a browser fingerprint for session caching
 * This creates a semi-unique identifier for the user's browser
 */
export function generateBrowserFingerprint(): string {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Browser fingerprint', 2, 2);

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ].join('|');

  // Create a simple hash of the fingerprint
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return `fp-${Math.abs(hash).toString(36)}`;
}
