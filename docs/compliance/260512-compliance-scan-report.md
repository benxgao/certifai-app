# Certestic Compliance & Legal Scan Report

**Date:** May 12, 2026
**Scope:** Next.js SaaS App (certifai-app) + Backend APIs (certifai-api)
**Prepared by:** Internal Compliance Scan

---

## Executive Summary

**Overall Compliance Level: MODERATE** ⚠️

The app has solid foundational compliance with privacy/terms documentation, security headers, and consent mechanisms. However, it is missing key features that are legal requirements under GDPR/CCPA and startup best practices. The most pressing remaining gaps are data portability, email preference controls, and vendor transparency.

---

## I. What Is Already Implemented ✅

### Privacy & Legal Documentation

| Item                  | Status        | Location                                                           | Details                                                 |
| --------------------- | ------------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| Privacy Policy        | ✅ Current    | [app/privacy/page.tsx](../../../certifai-app/app/privacy/page.tsx) | Last updated May 11, 2026 — comprehensive, 70+ sections |
| Terms of Service      | ✅ Current    | [app/terms/page.tsx](../../../certifai-app/app/terms/page.tsx)     | Last updated May 11, 2026 — aligned with Privacy Policy |
| Contact Page          | ✅ Present    | [app/contact/page.tsx](../../../certifai-app/app/contact/page.tsx) | Email: info@certestic.com                               |
| Privacy Officer Email | ✅ Documented | Privacy Policy                                                     | privacy@certestic.com with clear request procedure      |

### Data Protection & User Rights

| Feature               | Status                | Location                                                                                                                 | Details                                                                                                            |
| --------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Right to Access       | ✅ Documented         | Privacy Policy                                                                                                           | 20 working-day response time, free for 1st request/year                                                            |
| Right to Deletion     | ✅ Documented + Coded | [functions/src/endpoints/api/users/deleteUser.ts](../../../certifai-api/functions/src/endpoints/api/users/deleteUser.ts) | Full account deletion with cascading RTDB/Firestore/Prisma cleanup                                                 |
| Right to Correction   | ✅ Documented         | Privacy Policy                                                                                                           | 20 working-day timeline for corrections                                                                            |
| Account Deletion UI   | ✅ Built              | [src/components/custom/DeleteAccountDialog.tsx](../../src/components/custom/DeleteAccountDialog.tsx)                     | Two-step confirmation (warning + "DELETE MY ACCOUNT" text entry)                                                   |
| Data Retention Policy | ✅ Documented         | Privacy Policy                                                                                                           | 12 months post-deletion, 7 years for financial records (NZ law compliant)                                          |
| Breach Notification   | ✅ Documented         | Privacy Policy                                                                                                           | Explicit timelines: GDPR 72h, CCPA 30d, NZ Privacy Act 2020 as soon as practicable; notification content specified |

### Cookie Consent & Analytics

| Item                    | Status         | Location                                                                                                       | Details                                                                   |
| ----------------------- | -------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Cookie Consent Banner   | ✅ Present     | [src/components/custom/ConsentBanner.tsx](../../src/components/custom/ConsentBanner.tsx)                       | Explicit accept/decline; stored in localStorage                           |
| Cookie Preferences Link | ✅ Present     | [src/components/custom/CookiePreferencesLink.tsx](../../src/components/custom/CookiePreferencesLink.tsx)       | Footer link clears localStorage and reloads page                          |
| Consent-Aware Analytics | ✅ Implemented | [src/components/analytics/ConsentAwareAnalytics.tsx](../../src/components/analytics/ConsentAwareAnalytics.tsx) | Google Analytics only loads if `hasAnalyticsConsent() === true`           |
| Consent API             | ✅ Present     | [src/lib/consent.ts](../../src/lib/consent.ts)                                                                 | `getConsent()`, `setConsent()`, `hasAnalyticsConsent()`, `clearConsent()` |

### Security Headers

[next.config.ts](../../next.config.ts) implements comprehensive headers:

```
✅ Content-Security-Policy (CSP) — whitelist gtag, Firebase auth, analytics
✅ X-Content-Type-Options: nosniff
✅ X-Frame-Options: DENY (clickjacking protection)
✅ X-XSS-Protection: 1; mode=block
✅ Referrer-Policy: strict-origin-when-cross-origin
✅ Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
✅ Strict-Transport-Security: max-age=31536000 (1yr + subdomains + preload)
```

> Note: CSP currently allows `'unsafe-eval'` and `'unsafe-inline'` for scripts — consider tightening via nonce-based approach.

### SEO & Discoverability

| Item            | Status       | Location                               | Details                                                                |
| --------------- | ------------ | -------------------------------------- | ---------------------------------------------------------------------- |
| Sitemap         | ✅ Dynamic   | [app/sitemap.ts](../../app/sitemap.ts) | Auto-generated; includes certifications, pricing, policies             |
| Robots.txt      | ✅ Present   | [app/robots.ts](../../app/robots.ts)   | Allows `/`, disallows `/main/`, `/api/`, `/auth-cookie/`               |
| Structured Data | ✅ Extensive | [app/page.tsx](../../app/page.tsx)     | Schema.org: Organization, SoftwareApplication, WebPage, SearchAction   |
| Meta Tags       | ✅ Present   | [app/layout.tsx](../../app/layout.tsx) | OpenGraph, Twitter Card, Google/Yandex/Yahoo verification placeholders |

### Rate Limiting

| Feature                  | Status         | Location                                                                                                                     | Details                                              |
| ------------------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Exam Creation Rate Limit | ✅ Implemented | [functions/src/endpoints/api/users/getRateLimit.ts](../../../certifai-api/functions/src/endpoints/api/users/getRateLimit.ts) | Prevents abuse; returns `isAllowed` + `currentCount` |

### Authentication & Security

| Item                      | Status         | Details                                            |
| ------------------------- | -------------- | -------------------------------------------------- |
| Firebase Auth Integration | ✅ Used        | Email/password, sendEmailVerification()            |
| JWT Middleware            | ✅ Implemented | Validates JWT token for `/main/*` protected routes |
| Public API Authentication | ✅ Protected   | All public endpoints require `verifyJWTToken`      |
| HTTPS                     | ✅ Enforced    | HSTS with 1-year max-age                           |

### Demo Account Handling

| Item                     | Status             | Details                                               |
| ------------------------ | ------------------ | ----------------------------------------------------- |
| Demo Credentials Consent | ✅ Feature-flagged | Gated behind `DEMO_CREDENTIALS_CONSENT_ENABLED` flag  |
| Demo Account Protection  | ✅ Implemented     | Demo credentials shown only with explicit user action |

---

## II. Critical Gaps 🚨

### 1. No Data Export / Portability Endpoint (HIGH RISK — GDPR Art. 20 / CCPA)

**Issue:** Privacy Policy promises "Right to Data Portability" but no API endpoint exists to export user data in machine-readable format.

**Current state:**

- `deleteUser.ts` cascades deletions across Prisma + Firestore + RTDB ✅
- No `exportUserData.ts` endpoint ❌
- No "Download My Data" UI button ❌

**Recommendations:**

- [ ] Create `functions/src/endpoints/api/users/exportUserData.ts` returning JSON containing profile, certifications, exams, exam answers, and generation timestamp
- [ ] Add "Download My Data" button in profile settings alongside "Delete Account"
- [ ] Set SLA: export must complete or be delivered within 30 days (GDPR standard)

---

### 2. No Email Preference UI in Account Settings (MEDIUM-HIGH RISK)

**Issue:** Privacy Policy (in multiple places) states users can "update communication preferences in account settings" — but no such UI exists.

**Recommendations:**

- [ ] Create email preferences component in profile/settings
- [ ] Allow toggle of: marketing/promotional (opt-in by default), product updates (opt-out available)
- [ ] Mark transactional/essential emails as non-optional (clearly labeled)
- [ ] Log preference changes for audit trail

---

### 3. Missing Vendor Transparency / Sub-Processor List (MEDIUM RISK — GDPR Art. 28)

**Issue:** Privacy Policy vaguely references "MailerLite or similar" and mentions Pusher in CSP but not in the Privacy Policy.

**Recommendations:**

- [ ] Create and maintain a public sub-processor list (CSV or dedicated page)
- [ ] Cover: Google Cloud, Firebase, Stripe, MailerLite, Pusher — with purpose, data processed, DPA signed, certification (e.g., PCI-DSS, GDPR)
- [ ] Add Privacy Policy section: "We notify users of new sub-processors 30 days in advance. Users may object within 15 days."
- [ ] Ensure each vendor has signed DPA or Standard Contractual Clauses (SCCs) for EU→non-EU transfers

---

### 4. ~~No Explicit GDPR / CCPA Jurisdiction Coverage~~ ✅ Resolved

Added to Privacy Policy:

- **EU/GDPR:** Explicit legal bases for processing (contract, legitimate interests, consent, legal obligation); right to lodge complaints with local DPA; Standard Contractual Clauses (SCCs) documented for EU→non-EU data transfers
- **US/CCPA:** Clear statement that we do NOT sell personal information; full enumeration of CCPA rights including right to limit sensitive data use; 45-day response SLA per CCPA requirement

---

### 5. No Security Vulnerability Disclosure Policy / security.txt (MEDIUM RISK)

**Issue:** No `.well-known/security.txt` and no published vulnerability disclosure policy.

**Recommendations:**

- [ ] Create `public/.well-known/security.txt` with: contact email, expiry date, canonical URL, policy link
- [ ] Create `app/security-policy/page.tsx` covering: scope, safe harbor statement, how to report, response SLA (5-day acknowledgment, 30-day fix target)

---

### 6. Rate Limit Transparency Missing to Users (MEDIUM RISK)

**Issue:** Rate limiting is implemented in the backend but not surfaced in the UI — users get confused when suddenly unable to create exams.

**Recommendations:**

- [ ] Show remaining exam generation credits in dashboard (e.g., "5/10 exams this month — resets June 1")
- [ ] Show warning when approaching limit (e.g., "2 exams remaining")
- [ ] Provide "Request Increase" or upgrade CTA when limit is hit
- [ ] Document rate limits in public-facing documentation

---

### 7. No Accessibility Statement / WCAG Audit (MEDIUM RISK)

**Issue:** Minimal ARIA labels found; no documented WCAG target or audit results.

**Current state:**

- `aria-label="Cookie consent"` on ConsentBanner ✅
- `role="main"` and `role="banner"` on some pages ✅
- No ARIA on most buttons/inputs ❌
- No heading hierarchy documentation ❌
- No color contrast audit ❌
- No keyboard navigation or screen reader testing ❌

**Recommendations:**

- [ ] Conduct accessibility audit using WebAIM, WAVE, or Axe DevTools
- [ ] Target WCAG 2.1 AA as baseline
- [ ] Create `app/accessibility/page.tsx` with accessibility statement, known limitations, and feedback contact (accessibility@certestic.com)
- [ ] Add Axe DevTools to CI/CD to catch regressions

---

## III. Medium Priority Gaps ⚠️

### 10. Cookie Policy Merged into Privacy Policy

Privacy Policy covers cookies comprehensively but there is no standalone Cookie Policy page with a named cookie table (name, type, expiry, purpose).

**Recommendation:** Consider creating `app/cookies/page.tsx` with a full cookie table if targeting EU audiences. At minimum, document `_ga`, `certestic_cookie_consent`, `sidebar_state` etc.

---

### 11. AI Training Data Terms Inconsistent

Privacy Policy and Terms both mention AI training but with different wording and no unified statement.

**Recommendation:** Consolidate into one "AI Training & Anonymization" section covering: what data is used, how anonymization works, user opt-out mechanism (via privacy@certestic.com), and retention period for training data.

---

### 12. No Public Incident / Status Page

**Recommendation:** Post-launch, create `status.certestic.com` using StatusPage.io or Incident.io to show uptime, maintenance windows, and build user trust through transparency.

---

### 13. Support Response SLA Not Documented

Privacy Policy documents 20 working days for privacy rights requests, but general support response time is undefined.

**Recommendation:** Add response time SLAs to [app/support/page.tsx](../../app/support/page.tsx): general (48h), account/billing (24h), security (4h), privacy requests (20 working days).

---

### 14. Account Recovery Procedures Not Documented

No ToS section covers the scenario where a user loses access due to a compromised email address.

**Recommendation:** Add account recovery procedure to ToS and ensure [app/forgot-password/page.tsx](../../app/forgot-password/page.tsx) is complete. Cover identity verification fallback for cases where email itself is compromised.

---

## IV. Low Priority / Nice-to-Have 💚

| #   | Item                                     | Recommendation                                                                        |
| --- | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| 13  | Public Bug Bounty Program                | Post-launch; integrate HackerOne, Intigriti, or OpenBugBounty                         |
| 14  | CAPTCHA on Signup                        | Add reCAPTCHA v3 (invisible) when attack patterns emerge                              |
| 15  | Two-Factor Authentication                | Build for launch; document in ToS once available                                      |
| 16  | Incident Response Playbook               | Internal doc (not public); create for Series A due diligence                          |
| 17  | DPIA (Data Protection Impact Assessment) | Required under GDPR if expanding AI profiling or automated decision features          |
| 18  | Trademark Disclaimer Page                | Reorganize the 50-line Section 9 of ToS into a dedicated `/trademark-disclaimer` page |

---

## V. Missing Implementation Files (To Create)

| Feature                 | Priority    | Suggested Path                                        |
| ----------------------- | ----------- | ----------------------------------------------------- |
| Data Export API         | 🚨 Critical | `functions/src/endpoints/api/users/exportUserData.ts` |
| Data Export UI          | 🚨 Critical | `src/components/custom/ExportDataDialog.tsx`          |
| Email Preferences UI    | 🔴 High     | `src/components/profile/EmailPreferencesPanel.tsx`    |
| Accessibility Statement | 🔴 High     | `app/accessibility/page.tsx`                          |
| Security Policy         | 🔴 High     | `app/security-policy/page.tsx`                        |
| Security.txt            | 🟡 Medium   | `public/.well-known/security.txt`                     |
| Cookie Policy Page      | 🟡 Medium   | `app/cookies/page.tsx`                                |
| Sub-Processor List      | 🟡 Medium   | `app/vendors/page.tsx` or `public/vendor-list.json`   |

---

## VI. Action Plan

### Phase 1: Critical

1. ~~Update Terms of Service~~ ✅ Done — updated May 11, 2026
2. ~~Add breach notification timelines to Privacy Policy~~ ✅ Done — GDPR 72h, CCPA 30d, NZ as soon as practicable added
3. Build data export endpoint + UI ("Download My Data")
4. Create email preference UI in account settings
5. ~~Add GDPR/CCPA jurisdiction section to Privacy Policy~~ ✅ Done — legal bases, SCCs, CCPA "do not sell" statement added

**Estimated effort:** 2–3 weeks
**Success metric:** 0 GDPR/CCPA complaints; users can export data and manage email preferences

### Phase 2: High

1. Vendor sub-processor list with DPA status
2. Accessibility audit + accessibility statement page
3. Security policy + `security.txt`
4. Account recovery procedures in ToS
5. Support SLA documentation

**Estimated effort:** 4–6 weeks

### Phase 3: Medium / Nice-to-Have

1. Public incident/status page
2. Bug bounty program
3. 2FA documentation
4. Standalone cookie policy page (if EU focus expands)
5. Consolidated AI training data section

---

## Conclusion

Certestic has a strong compliance foundation: comprehensive Privacy Policy, proper security headers, consent-gated analytics, account deletion with cascading cleanup, and JWT-protected APIs. **Three of the five Phase 1 critical items are now resolved** (ToS updated, breach notification timelines added, GDPR/CCPA jurisdiction section complete). The two remaining critical items are data portability (export endpoint + UI) and email preference controls.

**Risk if unaddressed:** GDPR fines (up to 4% of annual revenue), CCPA penalties, user trust erosion, and failed compliance audits during Series A fundraising.
