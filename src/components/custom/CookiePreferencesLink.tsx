'use client';

import { clearConsent } from '@/src/lib/consent';

export default function CookiePreferencesLink() {
  const handleClick = () => {
    clearConsent();
    window.dispatchEvent(new Event('certestic:consent-updated'));
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-slate-400 hover:text-white transition-colors duration-200 text-sm bg-transparent border-0 p-0 cursor-pointer"
    >
      Cookie Preferences
    </button>
  );
}