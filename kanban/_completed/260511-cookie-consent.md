# Rollout: Landing Page Cookie Consent for Google Analytics

## Summary

Marketing pages currently load Google Analytics before explicit visitor consent, which can violate privacy expectations and regional consent requirements (e.g., GDPR/ePrivacy style opt-in regions). This rollout introduces a consent-first model using `react-cookie-consent`, ensuring analytics and related cookies are only activated after user approval, with clear UX, consent state tracking, and revocation support.

## Objectives

- Prevent non-essential analytics cookies/scripts from loading before consent.
- Provide clear opt-in/opt-out controls with user-friendly language.
- Support region-aware behavior (opt-in where required, configurable elsewhere).
- Enable consent withdrawal and preference updates at any time.
- Preserve useful analytics quality while meeting privacy expectations.

## Scope

- Estimated files to modify: 5–7
- Estimated files to create: 1–2
- Risk level: **Low** (simple GA gating, no complex logic)

In scope:

- Add `react-cookie-consent` banner to marketing layout.
- Gate GA script initialization on banner acceptance.
- Minimal policy callout and cookie preferences link.

Out of scope (defer to v2):

- CMP vendor migration beyond `react-cookie-consent`.
- Geo-detection or region-specific logic.
- Google Consent Mode configuration.
- Post-launch monitoring dashboard.
- Broader data-retention redesign in GA property.

## Current-State Risks

- GA cookies are set before user consent (primary compliance issue).
- No visible user control or transparency.

## Target Behavior Contract

1. **First visit (no consent yet)**
   - Banner visible with Accept / Decline buttons.
   - GA script remains inactive (not loaded).

2. **Accept**
   - Consent saved to localStorage (simple text flag).
   - GA script loads immediately.

3. **Decline**
   - Consent saved; GA stays blocked.
   - User can retry by clearing cookies or visiting again.

4. **Return visit**
   - If prior consent exists, respect it (no banner shown).
   - GA loads if previously accepted.

## Phased Plan (Fast-Track for Production)

### Phase 1: Setup & Banner Integration ✅ COMPLETED

**Goal**: Install `react-cookie-consent` and integrate banner into app layout.

**Tasks**:

- [x] Install `react-cookie-consent` package.
- [x] Create consent utility `src/lib/consent.ts` — `getConsent()`, `setConsent()`, `CONSENT_KEY`.
- [x] Create `ConsentBanner` component (`src/components/custom/ConsentBanner.tsx`) — shadcn-styled, dark mode support, Accept / Decline buttons, privacy policy link.
- [x] Add `<ConsentBanner />` to `app/layout.tsx`.

**Deliverables**:

- `src/lib/consent.ts` — consent read/write helpers
- `src/components/custom/ConsentBanner.tsx` — standalone banner component

**Independent Test Checklist**:

1. **Banner visibility** — Clear localStorage, visit any page → banner should appear at the bottom.
2. **Accept flow** — Click "Accept" → banner disappears; `localStorage.getItem('certestic_cookie_consent')` returns `'accepted'`.
3. **Decline flow** — Clear localStorage, visit page, click "Decline" → banner disappears; localStorage value is `'declined'`.
4. **Return visit (accepted)** — With `'accepted'` in localStorage, refresh page → banner must NOT appear.
5. **Return visit (declined)** — With `'declined'` in localStorage, refresh page → banner must NOT appear.
6. **Privacy link** — "Privacy Policy" link in banner navigates to `/privacy`.
7. **Dark mode** — Toggle dark mode; verify banner background and text contrast are correct.
8. **Mobile** — On viewport < 640px, banner layout should be readable and buttons accessible.

> **Note**: GA gating is NOT part of this phase. GA may still load regardless of consent state — that is addressed in Phase 2.

---

### Phase 2: GA Script Gating ✅ COMPLETED

**Goal**: Prevent GA initialization until consent accepted.

**Tasks**:

- [x] Remove GA `<script>` tags from `<head>` in `app/layout.tsx`.
- [x] Gate Google Analytics rendering behind consent state.
- [x] Dispatch a consent-updated event from `ConsentBanner` when users accept or decline.
- [x] Ensure `PageViewTracker` remains harmless until GA exists.

**Deliverables**:

- `app/layout.tsx` — raw GA scripts removed from `<head>` and consent-aware wrapper mounted in `<body>`.
- `src/components/analytics/ConsentAwareAnalytics.tsx` — listens for consent changes and renders GA only after approval.
- `src/components/custom/ConsentBanner.tsx` — emits a consent-updated event after persistence.

**Independent Test Checklist**:

1. [x] **No GA on first visit** — Clear localStorage, open DevTools → Network tab, visit page → confirm no request to `googletagmanager.com`.
2. [x] **No `_ga` cookie before consent** — Clear cookies/localStorage, visit page → Application tab shows no `_ga` cookie.
3. [x] **GA loads on accept** — Click "Accept" in banner → Network tab shows gtag.js request fires immediately.
4. [x] **`_ga` cookie set after accept** — After accepting, Application tab shows `_ga` cookie created.
5. [x] **Return visit (accepted)** — With stored `'accepted'`, reload → GA loads without banner.
6. [x] **Return visit (declined)** — With stored `'declined'`, reload → no gtag.js request fires.
7. [x] **PageViewTracker no-op before consent** — Verify no `gtag('event')` calls appear in console before accept.

---

### Phase 3: Policy & Preference Link ✅ COMPLETED

**Goal**: Add minimal policy callout and cookie settings access.

**Tasks**:

- [x] Update existing privacy policy page to mention analytics consent and the consent banner.
- [x] Add "Cookie Preferences" link in `MarketingFooter`.
- [x] Clicking "Cookie Preferences" clears consent from localStorage and reloads the page to re-show the banner.
- [x] Keep text minimal (2–3 sentences).

**Deliverables**:

- `src/components/custom/MarketingFooter.tsx` — "Cookie Preferences" link added.
- `app/privacy/page.tsx` — analytics consent section updated.

**Independent Test Checklist**:

1. [x] **Footer link visible** — On any marketing page, footer includes "Cookie Preferences" text link.
2. [x] **Re-show banner** — With `'accepted'` in localStorage, click "Cookie Preferences" → banner reappears.
3. [x] **Can change from accept to decline** — After banner reappears, click "Decline" → GA no longer loads on next navigation.
4. [x] **Privacy page updated** — `/privacy` mentions cookie consent and GA usage clearly.
5. [x] **No broken links** — Privacy link from banner and footer "Privacy Policy" link both resolve correctly.

---

### Phase 4: QA & Production Rollout

**Goal**: Validate full flow end-to-end and ship to production.

**Tasks**:

- Run full QA matrix below across Chrome + Safari, desktop + mobile.
- Deploy to staging, validate, then production.

**Deliverables**:

- QA checklist (pass/fail matrix).
- Release notes.

**Est. Time**: 2–3 hours (including QA + deploy)

**Independent Test Checklist (Full Matrix)**:

| #   | Scenario                        | Expected                                | Pass? |
| --- | ------------------------------- | --------------------------------------- | ----- |
| 1   | Fresh visit, no consent         | Banner shown, no GA request             |       |
| 2   | Click Accept                    | Banner gone, GA loads, `_ga` cookie set |       |
| 3   | Click Decline                   | Banner gone, no GA, no cookie           |       |
| 4   | Return with `accepted`          | No banner, GA loads                     |       |
| 5   | Return with `declined`          | No banner, no GA                        |       |
| 6   | Cookie Preferences → re-accept  | GA re-activates                         |       |
| 7   | Cookie Preferences → re-decline | GA stays blocked                        |       |
| 8   | Mobile Chrome (375px)           | Banner readable, buttons tappable       |       |
| 9   | Mobile Safari (375px)           | Same as above                           |       |
| 10  | Dark mode                       | Banner contrast correct                 |       |
| 11  | Privacy link                    | Navigates to `/privacy`                 |       |

**Exit criteria**:

- All 11 scenarios pass on Chrome + Safari (desktop + mobile).

## Recommended Timeline

- **Day 1 (4–5 hours)**: Phases 1–3 (banner + GA gating + policy)
- **Day 2 (2–3 hours)**: Phase 4 (QA + production deploy)

## Key Risks & Mitigations

| Risk                               | Mitigation                                                  |
| ---------------------------------- | ----------------------------------------------------------- |
| GA volume drops post-launch        | Expected & acceptable; alert stakeholders beforehand.       |
| Hidden GA loader still fires       | Keep audit tight to layout + Next.js config only.           |
| Banner UX confusion                | Use clear language, honor browser preferences if available. |
| Consent state lost on hard refresh | localStorage is standard; edge case acceptable.             |

## Rollback Plan

If issues arise post-deploy:

1. Revert banner component + GA gating code.
2. Restore GA to original initialization (1 commit).
3. Assess user impact and re-evaluate.

## Simplifications Made

- **No geo-detection**: Global opt-in for all visitors (simple & compliant).
- **Analytics-only**: Not planning Marketing or other cookie categories yet.
- **No Consent Mode**: Full script blocking is easier and sufficient for v1.
- **No preference center modal**: Simple footer link + re-accept in banner (low friction).
- **No monitoring dashboard**: Ship with QA checklist, add observability later if needed.

## Future Enhancements (v2+)

- Geo-aware opt-in/opt-out by region (if legal mandates it).
- Category-based consent (Marketing cookies, Functional, etc.).
- Google Consent Mode integration for nuanced signal handling.
- Consent analytics dashboard (acceptance rates, UX tuning).
- Expiration prompt (6–12 month re-consent).
