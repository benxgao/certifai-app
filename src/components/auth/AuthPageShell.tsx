'use client';

import * as React from 'react';

import { authPage } from '@/src/config/auth-theme';

export interface AuthPageShellProps {
  /** Site header (usually `LandingHeader`). */
  header?: React.ReactNode;
  /** Optional banner rendered between header and content (demo credentials strip). */
  banner?: React.ReactNode;
  /** Left-hand marketing column. Hidden below `lg` by the aside itself. */
  aside?: React.ReactNode;
  /** The form card. */
  children: React.ReactNode;
}

/**
 * Shared chrome for the auth routes: ambient background, header slot, banner
 * slot and the two-column grid that keeps signin and signup perfectly aligned.
 *
 * The aside is wrapped in a full-height track so it can stick under the site
 * header while the (much taller) signup form scrolls — the copy follows the
 * user down the page instead of leaving a hole beside the card.
 */
export const AuthPageShell = ({ header, banner, aside, children }: AuthPageShellProps) => (
  <div className={authPage.shell}>
    <div className={authPage.backdrop} aria-hidden="true">
      <div className={authPage.gridOverlay} />
      <div className={authPage.orbViolet} />
      <div className={authPage.orbIndigo} />
    </div>

    {header}
    {banner}

    <div className={authPage.container}>
      <div className={authPage.grid}>
        {aside && (
          <div className={authPage.asideColumn}>
            <div className={authPage.asideSticky}>{aside}</div>
          </div>
        )}
        <div className={authPage.column}>{children}</div>
      </div>
    </div>
  </div>
);

AuthPageShell.displayName = 'AuthPageShell';

export default AuthPageShell;
