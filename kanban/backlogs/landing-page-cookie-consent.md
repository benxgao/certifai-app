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

- Estimated files to modify: 8–14
- Estimated files to create: 2–5
- Risk level: **Medium** (privacy/compliance and analytics signal quality)

In scope:

- Marketing page analytics gating and consent UX.
- Consent-aware script injection strategy.
- Policy and consent copy updates.
- QA, telemetry validation, and rollout guardrails.

Out of scope (for this specific rollout):

- CMP vendor migration beyond `react-cookie-consent`.
- Server-side legal determination for each jurisdiction.
- Broader data-retention redesign in GA property.

## Current-State Risks

- GA cookies may be set before user action on first paint.
- No clear deny path or persistent preference center entry point.
- Possible mismatch between actual script behavior and privacy policy claims.
- Auditability gaps (no internal event trail for consent actions).

## Target Behavior Contract

1. **Default state (no consent yet)**
   - No GA script execution on marketing pages.
   - No analytics cookies created.

2. **Accept analytics**
   - GA loads only after accept.
   - Consent state persists with timestamp/version.

3. **Decline analytics**
   - GA remains blocked.
   - Existing non-essential analytics cookies are removed where feasible.

4. **Change mind later**
   - User can re-open preferences from footer/privacy area.
   - Updated preference immediately affects script behavior.

## Phased Plan

### Phase 0: Compliance Baseline & Decision Record

**Goal**: Lock legal/product decisions before engineering implementation.

**Tasks**:

- Define what counts as essential vs non-essential cookies on marketing pages.
- Confirm regional policy baseline (strict opt-in by default vs geo-conditional).
- Finalize consent copy and CTA labels with legal/product sign-off.
- Decide consent TTL and policy-version strategy.

**Deliverables**:

- Privacy decision record in docs/kanban.
- Approved banner text and preference wording.

**Exit criteria**:

- Written approval from product + legal stakeholders.

---

### Phase 1: Cookie & Script Inventory (Technical Audit)

**Goal**: Identify exactly what gets loaded, when, and why.

**Tasks**:

- Inventory all marketing-page scripts that set/read cookies/local storage.
- Identify GA initialization points and any indirect loaders (tag wrappers, custom hooks).
- Classify each script as Essential / Analytics / Functional / Marketing.
- Define which scripts must be gated behind consent.

**Deliverables**:

- Script inventory table (script, owner, purpose, category, gating rule).
- Consent category mapping used by implementation.

**Exit criteria**:

- No unidentified analytics/tracking script remains in marketing routes.

---

### Phase 2: Consent Architecture & UX Spec

**Goal**: Design a single, reusable consent model before coding.

**Tasks**:

- Adopt `react-cookie-consent` as the banner entry point.
- Define consent state schema:
  - `status`: `accepted | declined | unset`
  - `categories`: initially `analytics` (extensible)
  - `consentVersion`
  - `updatedAt`
- Specify banner behavior:
  - first-visit show conditions
  - accept/decline actions
  - policy links
- Specify preference re-open entry (footer “Cookie Settings”).
- Define accessibility requirements (keyboard, focus trap, contrast, screen reader labels).

**Deliverables**:

- UX acceptance criteria and state diagram.
- Event contract for consent changes.

**Exit criteria**:

- Product/design sign-off on banner + preference behavior.

---

### Phase 3: Controlled GA Loading Strategy

**Goal**: Ensure GA only loads after valid consent signal.

**Tasks**:

- Move GA bootstrap behind consent check (no eager load in global layout for marketing pages).
- Implement lazy analytics initializer triggered by consent acceptance.
- Ensure decline path does not initialize GA.
- Add revocation flow:
  - disable future GA calls
  - remove analytics cookies where technically possible
- Add safe fallback behavior for malformed consent state (default block).

**Deliverables**:

- Consent-gated analytics initialization flow.
- Revocation behavior checklist.

**Exit criteria**:

- Manual verification: first load sets no GA cookies until accept.

---

### Phase 4: Policy, Transparency & Visitor Controls

**Goal**: Align visible policy language with actual runtime behavior.

**Tasks**:

- Update privacy/cookie policy to describe analytics consent behavior.
- Add “Cookie Settings” link in footer and relevant legal pages.
- Document what data analytics receives post-consent.
- Include effective date and consent version references.

**Deliverables**:

- Updated privacy/cookie content.
- Visible, persistent preference entry point.

**Exit criteria**:

- Policy text and app behavior are consistent in QA checklist.

---

### Phase 5: QA, Telemetry Validation & Rollout

**Goal**: Prove compliance behavior before full release.

**Tasks**:

- Test matrix:
  - first visit (unset)
  - accept path
  - decline path
  - withdraw consent path
  - clear cookies and revisit
  - mobile/desktop + major browsers
- Verify network behavior:
  - no GA hits before consent
  - GA events appear only after accept
- Verify cookie behavior:
  - GA cookies absent pre-consent
  - consistent persistence post-consent
- Run accessibility checks for banner/modal interactions.
- Roll out behind feature flag if possible (staged deployment).

**Deliverables**:

- QA evidence log (screenshots + network captures).
- Rollout checklist with go/no-go criteria.

**Exit criteria**:

- All critical checks pass; no pre-consent analytics traffic observed.

---

### Phase 6: Post-Launch Monitoring & Governance

**Goal**: Keep compliance healthy as pages evolve.

**Tasks**:

- Add recurring script-audit cadence (e.g., monthly or per release train).
- Track consent acceptance/decline rates for UX tuning.
- Alert on accidental early GA load regressions (synthetic check).
- Define ownership for banner copy/version updates.

**Deliverables**:

- Operational runbook for consent governance.
- Regression checklist integrated into release QA.

**Exit criteria**:

- Ownership assigned and recurring checks scheduled.

## Recommended Timeline (Suggested)

- Week 1: Phases 0–2 (decisions + audit + UX spec)
- Week 2: Phase 3 (implementation)
- Week 3: Phases 4–5 (policy alignment + QA + staged rollout)
- Week 4+: Phase 6 (monitoring and governance)

## Risks & Mitigations

- **Risk**: Analytics volume drops after enforcing consent.
  - **Mitigation**: Set stakeholder expectation early; measure with before/after dashboard.

- **Risk**: Hidden script path still initializes GA.
  - **Mitigation**: Complete script inventory + automated smoke checks.

- **Risk**: Poor banner UX leads to confusion/abandonment.
  - **Mitigation**: Keep copy concise, avoid dark patterns, test on mobile.

- **Risk**: Policy text drifts from actual implementation.
  - **Mitigation**: Add policy-behavior parity check to release checklist.

## Rollback Plan

If rollout causes severe regressions (e.g., broken page behavior), temporarily disable consent-gated analytics initialization while preserving banner visibility, then:

1. Revert latest consent-gating deployment.
2. Keep visitor controls visible (do not remove transparency UI).
3. Triage root cause (script loading order, hydration timing, route-specific behavior).
4. Re-release with targeted fixes and repeat QA matrix.

## Open Questions

1. Do we want strict global opt-in for all visitors or geo-specific behavior by region?
2. Should we support category granularity now (Analytics vs Marketing) or start with Analytics-only?
3. What consent retention period should be used before re-prompting?
4. Is Google Consent Mode configuration required in this phase, or deferred to later hardening?
