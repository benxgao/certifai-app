import type { Page } from '@playwright/test';

/**
 * Wait until React has hydrated the page (i.e. the DOM is interactive).
 *
 * Why this is needed:
 *   `next dev` compiles a route on first request. Playwright's
 *   `waitUntil: 'domcontentloaded'` resolves as soon as the server-rendered
 *   HTML is parsed, which can be seconds before React attaches its handlers.
 *   Typing into an input in that window updates the DOM only — React never sees
 *   the `onChange`, so controlled inputs keep an empty state. React 19 does not
 *   patch input values during hydration either, so the typed text stays visible
 *   while `useState` is still `''`. The symptom is misleading: the form looks
 *   filled but the submit button stays disabled (or a click does nothing).
 *
 * How it detects hydration:
 *   React attaches a `__reactFiber$<id>` expando to every DOM node it manages
 *   during the client render. Server-rendered markup has no such key, so its
 *   presence on a real element is a precise hydration signal (unlike a fixed
 *   timeout or `networkidle`, which never settles with SWR polling).
 */
export async function waitForHydration(
  page: Page,
  selector = 'body > div',
  timeout = 30_000,
): Promise<void> {
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      return Object.keys(el).some((key) => key.startsWith('__reactFiber$'));
    },
    selector,
    { timeout },
  );
}
