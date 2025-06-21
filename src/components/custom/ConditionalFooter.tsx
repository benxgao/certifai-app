'use client';

import { usePathname } from 'next/navigation';
import MarketingFooter from './MarketingFooter';

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Don't show marketing footer on /main routes
  if (pathname.startsWith('/main')) {
    return null;
  }

  return <MarketingFooter />;
}
