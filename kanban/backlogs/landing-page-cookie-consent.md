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

### Phase 1: Setup & Banner Integration

**Goal**: Install `react-cookie-consent` and integrate banner into marketing layout.

**Tasks**:

- Install `react-cookie-consent` package.
- Create a wrapper component `ConsentBanner` (shadcn-styled, dark mode support).
- Add banner to marketing layout with simple messaging:
  - "We use Google Analytics to understand how you use our site."
  - Accept / Decline buttons.
  - Link to privacy policy.
- Export consent state helper (`getConsent()`).

**Deliverables**:

- `src/components/custom/ConsentBanner.tsx`
- Consent utility hook/fn for reading localStorage state.

**Est. Time**: 1–2 hours

**Exit criteria**:

- Banner renders on first visit, saves choice to localStorage, respects saved state on return.

---

### Phase 2: GA Script Gating

**Goal**: Prevent GA initialization until consent accepted.

**Tasks**:

- Remove GA script from global `_app.tsx` or layout.
- Create lazy GA initializer (`initializeGA()`) that checks consent before loading gtag.
- On `ConsentBanner` accept, call `initializeGA()`.
- Defer to marketing layout or parent context to invoke initializer.

**Deliverables**:

- GA initialization wrapped in consent check.
- No GA request fires before consent.

**Est. Time**: 30 min–1 hour

**Exit criteria**:

- Manual browser check: first visit shows no `_ga` cookies; after accept, GA loads and tracks.

---

### Phase 3: Policy & Preference Link

**Goal**: Add minimal policy callout and cookie settings access.

**Tasks**:

- Update existing privacy policy footnote to mention analytics consent.
- Add "Cookie Preferences" link in footer pointing to a simple modal/accordion that:
  - Shows current consent state.
  - Allows re-accept/re-decline.
  - Persists choice.
- Keep text minimal (2–3 sentences).

**Deliverables**:

- Updated privacy policy section.
- Simple cookie preferences UI (modal or dialog).

**Est. Time**: 1–2 hours

**Exit criteria**:

- Footer link visible and functional; users can toggle consent preference.

---

### Phase 4: QA & Production Rollout

**Goal**: Validate and ship to production.

**Tasks**:

- Test critical paths (fresh visit → accept/decline, return visit with saved state).
- Check mobile and two major browsers (Chrome, Safari).
- Verify: no GA before consent, GA fires after accept.
- Deploy to staging, then production (no feature flag required).

**Deliverables**:

- QA checklist (pass/fail matrix).
- Release notes.

**Est. Time**: 2–3 hours (including QA + deploy)

**Exit criteria**:

- All critical tests pass; production live.

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
