export const CONSENT_KEY = 'certestic_cookie_consent';

export type ConsentValue = 'accepted' | 'declined';

/**
 * Returns the current consent value, or null if no choice has been made.
 * Safe to call server-side (returns null when window is undefined).
 */
export function getConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === 'accepted' || value === 'declined') return value;
  return null;
}

/**
 * Persists a consent choice to localStorage.
 */
export function setConsent(value: ConsentValue): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, value);
}

/**
 * Returns true when the user has explicitly accepted analytics cookies.
 */
export function hasAnalyticsConsent(): boolean {
  return getConsent() === 'accepted';
}

/**
 * Clears any saved consent so the banner is shown again on next visit.
 */
export function clearConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_KEY);
}
