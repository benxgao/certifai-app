# Rollout: Security Vulnerability Disclosure — `security.txt` + `/security-policy` page

## Summary

The `260512-compliance-scan-report.md` gap #5 ("No Security Vulnerability Disclosure Policy / security.txt") is still outstanding. Investigation shows the situation is **partially built, not missing**: a `public/.well-known/security.txt` file already exists, but its `Expires` value (`2026-07-19`) is now in the past (today is `2026-09-23`), which makes the record non-compliant with RFC 9116, and it advertises two artifacts that do not exist (`/.well-known/pgp-key.txt` and `/security-acknowledgments`). The `Policy:` field points at `https://certestic.com/security-policy`, but that route does not exist — so the published policy link is a 404.

This rollout closes gap #5 with **minimum effort**: publish the missing `/security-policy` page (scope, safe harbor, how to report, response SLA), refresh `security.txt` so it is valid and only references real assets, wire both into sitemap/footer, add one `docs/security/` reference doc, and then clear the corresponding TODO recommendations in the compliance scan report. No PGP key, no bug-bounty program, and no new email infrastructure are in scope.

## Current Evaluation

### What already exists

- `public/.well-known/security.txt` — present, but stale/invalid (see below).
- `public/.well-known/appspecific/com.chrome.devtools.json` — unrelated DevTools shim.
- Route + metadata conventions for public policy pages: `app/privacy/page.tsx` (server component, inline `export const metadata`), `app/contact/page.tsx` + `app/contact/metadata.ts`.
- Marketing design system: `MarketingPageShell`, `MarketingSection`, `MarketingCard`, `MarketingBadge`, `MarketingHeading` (`src/components/marketing/index.ts`), plus `LandingHeader`, `Breadcrumb`, `ActionButton`.
- Site footer with a "Company" column already listing Privacy Policy and Terms of Service: `src/components/custom/MarketingFooter.tsx`.
- SEO plumbing: `app/sitemap.ts`, `app/robots.ts`, `docs/architecture/seo-patterns.md`.
- Static-asset serving rules for `/.well-known/:path*` in `next.config.ts` (CORS + long cache + passthrough rewrite).
- Published reporting expectations in other docs: `privacy@certestic.com` (privacy rights), `info@certestic.com` (general contact).

Representative files:

- `public/.well-known/security.txt`
- `app/privacy/page.tsx`
- `app/sitemap.ts`
- `src/components/custom/MarketingFooter.tsx`
- `keynotes/compliance/260512-compliance-scan-report.md`

### What is not centralized / stable / complete yet

#### 1. `security.txt` is present but non-compliant and points at missing assets

- `Expires: 2026-07-19T23:59:59.000Z` is in the past relative to `2026-09-23` → RFC 9116 requires a future expiry; scanners will treat the file as stale.
- `Encryption: https://certestic.com/.well-known/pgp-key.txt` → no PGP key exists anywhere in `public/`.
- `Acknowledgments: https://certestic.com/security-acknowledgments` → no such route/page exists.
- `Policy: https://certestic.com/security-policy` → target route does not exist.
- `Contact:` currently uses `info@certestic.com` (a real, existing mailbox) — keep to avoid provisioning new infrastructure.

#### 2. No public vulnerability disclosure policy page

- `app/security-policy/` does not exist; the `Policy:` link in `security.txt` therefore resolves to a 404.
- Scan report requires the page to cover: scope, safe-harbor statement, how to report, and response SLA (5-day acknowledgement, 30-day fix target).

#### 3. No canonical docs entry for the disclosure process

- `docs/security/` currently contains only `auth-patterns.md` and `_template.md`.
- The disclosure policy, SLA, and safe-harbor terms are not represented in `docs/`, so they cannot be discovered docs-first or linked from the assistant context index.

### Risks in the current state

- [ ] A stale `Expires` + dangling `Policy`/`Encryption`/`Acknowledgments` references project a broken security posture to researchers and automated scanners.
- [ ] Security researchers have no safe-harbor terms, so good-faith reporting carries legal ambiguity.
- [ ] The `Policy:` URL is a 404, so even the existing pointer is ineffective.
- [ ] Undocumented process → each future disclosure is handled ad hoc.

## Scope

- Estimated files to create: 2 (`app/security-policy/page.tsx`, `docs/security/vulnerability-disclosure.md`)
- Estimated files to modify: 5 (`public/.well-known/security.txt`, `app/sitemap.ts`, `src/components/custom/MarketingFooter.tsx`, `docs/ai/assistant-context-index.md`, `docs/ai/guide.md`, `docs/ai/repo-map.md`, `keynotes/compliance/260512-compliance-scan-report.md`) — see Phase files for the exact set
- Risk level: **Low** (one new static marketing route + one static text file + docs)

### In scope

- New public route `app/security-policy/page.tsx` with scope, safe harbor, reporting channel, and SLA.
- `security.txt` refresh: future `Expires`, valid `Canonical`/`Policy`, removal of references to non-existent assets.
- Discoverability: sitemap entry + footer "Company" link.
- One canonical reference doc `docs/security/vulnerability-disclosure.md` + index/guide/repo-map registration.
- Closing the gap #5 TODO recommendations in the compliance scan report.

### Out of scope

- PGP key publication and `Encryption:` field (future improvement; noted in Open Questions).
- Public acknowledgments page / hall-of-fame.
- Bug-bounty program integration (HackerOne/Intigriti).
- Provisioning a dedicated `security@certestic.com` mailbox (reuse `info@certestic.com` + subject prefix to minimise effort).
- Any `certifai-api` backend change.

## Minimum Viable Hotfix

- **Phase 1 + Phase 2** together close the scan-report gap: a live `/security-policy` page plus a valid, self-consistent `security.txt`. Both are static/presentation-only, carry no runtime risk, and can ship in a single small PR.
- Phase 3 (sitemap/footer) is a two-line discoverability add-on; Phase 4 (docs) and Phase 5 (scan-report closeout) follow immediately after.

## Docs Impact

### Docs checked during planning

| Doc | Relevant finding |
| --- | --- |
| `docs/ai/guide.md` | Task types 1 (page/route), 11A (SEO/sitemap/robots), 9 (rollout planning) apply; no existing security-disclosure task type |
| `docs/architecture/seo-patterns.md` | Public pages use `generateMetadata()` or inline `Metadata`; sitemap is edited in `app/sitemap.ts`; keep constants out of leaf files |
| `docs/architecture/nextjs-conventions.md` | Public marketing routes are plain `page.tsx` server components; `loading.tsx` only needed for async data (not required here) |
| `docs/ai/repo-map.md` | Route table lists public marketing routes; new public route should be reflected |
| `docs/security/auth-patterns.md` | Invariant security rules doc; the new disclosure doc must sit beside it and cross-link, not duplicate |
| `docs/operations/docs-maintenance.md` | Discoverability contract: register in `assistant-context-index.md`, route from `guide.md`, include `Source of truth` + `## Related Docs` |
| `docs/adr/0001-docs-architecture-mvp.md` | Twelve-domain docs structure incl. `security/`; adding `docs/security/vulnerability-disclosure.md` is compliant |
| `keynotes/compliance/260512-compliance-scan-report.md` | Gap #5 recommendations and Phase 2 action item to be cleared |
| `ai_oriented_kanban/templates/rollout-plan-template.md` | Mandatory structure + closing phases used by this plan |

### Docs-First Retrieval Checklist

- [x] Loaded all primary docs for this task type from `docs/ai/guide.md`.
- [x] Reviewed existing ADRs in `docs/adr/` — the only ADR (`0001`) is compatible (see ADR Conflict Check).
- [x] Declared initial `Docs Needed` list before implementation planning.
- [x] Assessed sufficiency — docs were **sufficient**.
  - If insufficient: docs that were missing, ambiguous, or outdated: n/a
  - If insufficient: fallback code scan was used for this specific decision: n/a (a bounded code scan was used only to confirm the current state of `security.txt`, which is a data file, not documented behaviour)
  - If insufficient: docs were updated in this rollout or explicitly blocked with owner + due date: n/a
- [x] For each major decision, recorded a `Decision Evidence Log` row.
- [x] Post-task docs update required: `[x] Yes` — captured in Docs to create/update below.

### Docs Needed (planning + implementation)

| Doc | Why needed |
| --- | --- |
| `docs/architecture/nextjs-conventions.md` | Public route/page structure and server-vs-client split |
| `docs/architecture/seo-patterns.md` | Metadata + sitemap edit rules for a new public route |
| `docs/ai/repo-map.md` | Route table update contract |
| `docs/security/auth-patterns.md` | Sibling security doc; establishes linking/layering style |
| `docs/operations/docs-maintenance.md` | Discoverability gates for the new doc |
| `docs/adr/0001-docs-architecture-mvp.md` | Confirm the new `security/` doc is consistent with the accepted structure |
| `ai_oriented_kanban/templates/rollout-plan-template.md` | Required plan structure and closing phases |

### Planning Decision Evidence Log

| Decision | Docs cited | Sufficiency verdict | Fallback code scan used? | Doc update action |
| --- | --- | --- | --- | --- |
| Publish `/security-policy` as a static public server-component page with inline `Metadata` (mirroring `app/privacy/page.tsx`) | `docs/architecture/nextjs-conventions.md`, `docs/architecture/seo-patterns.md` | Sufficient | No | Include in `docs/security/vulnerability-disclosure.md` |
| Reuse `info@certestic.com` as the reporting contact rather than provisioning `security@` | `privacy@certestic.com` / `info@certestic.com` references in `app/privacy/page.tsx`; existing `security.txt` | Sufficient | No | Document in `docs/security/vulnerability-disclosure.md` |
| Refresh `security.txt` in place and delete dangling `Encryption`/`Acknowledgments` fields (no PGP key / acknowledgments page exists) | existing `public/.well-known/security.txt`; RFC 9116 field requirements | Sufficient | Yes — file inspection only (data file, undocumented in `docs/`) | Document the field policy in `docs/security/vulnerability-disclosure.md` |
| Add route to `app/sitemap.ts` and footer "Company" column | `docs/architecture/seo-patterns.md`, `src/components/custom/MarketingFooter.tsx` | Sufficient | No | Reflect route in `docs/ai/repo-map.md` |
| Record no new ADR (policy page follows existing patterns) | `docs/adr/0001-docs-architecture-mvp.md` | Sufficient | No | None — see ADR Conflict Check |

### ADR Conflict Check

| ADR entry (`YYYY-MM-DD: title`) | Planned action that touches it | Conflict? | Explicitly addressed in plan? | Open question raised? |
| --- | --- | --- | --- | --- |
| `2026-05-24: AI-Ready Documentation MVP Structure` (ADR-0001) | Add `docs/security/vulnerability-disclosure.md` and register it in index + guide | No — ADR-0001 defines a `security/` domain section with `_template.md`; a new doc in that section conforms | N/A (no conflict) | No |

**Rules reminder**: the repo currently uses per-file numbered ADRs (`docs/adr/0001-*.md`); the month-log ADR convention exists only in the unexecuted `simplified-adr.md` plan. Because this rollout makes no architectural/process decision (it follows existing page, SEO, and docs patterns), N+1.6 will be marked "skipped: no significant ADRs" rather than creating an ADR under either convention.

No other ADRs exist at planning time.

### Docs to create

| File | Reason |
| --- | --- |
| `docs/security/vulnerability-disclosure.md` | Canonical source of truth for scope, safe-harbor, reporting channel, SLA, and `security.txt` field policy |

### Docs to update

| File | What changes |
| --- | --- |
| `docs/ai/assistant-context-index.md` | Add a Quick Reference row for vulnerability disclosure / `security.txt` |
| `docs/ai/guide.md` | Add routing (task-type "changing security disclosure policy / security.txt") pointing at the new doc |
| `docs/ai/repo-map.md` | Add `/security-policy` to the public route table |
| `keynotes/compliance/260512-compliance-scan-report.md` | Clear gap #5 recommendations; mark Phase 2 action item 3 resolved |

### Docs to delete or archive

| File | Reason |
| --- | --- |
| none | — |

### No docs affected

- [ ] Confirmed: this plan introduces no new patterns, changes no existing conventions, and removes no documented features. — **not applicable: a new canonical doc is created and three docs are updated.**

## Context Map

### Files to modify first

| File | Purpose | Why it matters |
| --- | --- | --- |
| `app/security-policy/page.tsx` (create) | The disclosure policy page | Makes the `security.txt` `Policy:` link live |
| `public/.well-known/security.txt` | Machine-readable disclosure record | Removes the stale/invalid record that triggers the scan-report gap |

### Likely files to create

| File | Purpose |
| --- | --- |
| `app/security-policy/page.tsx` | Public disclosure policy page |
| `docs/security/vulnerability-disclosure.md` | Canonical disclosure process doc |

### Dependencies / related patterns

| File | Relationship |
| --- | --- |
| `app/privacy/page.tsx` | Pattern source for a public policy page (shell + inline metadata) |
| `src/components/marketing/index.ts` | Design-system primitives used by the page |
| `src/components/custom/MarketingFooter.tsx` | Adds the "Security Policy" link |
| `app/sitemap.ts` | Publishes the new route to crawlers |
| `next.config.ts` | Serves `/.well-known/*` statically with long cache + CORS |

### Risks

- [ ] `next.config.ts` rewrites `/.well-known/:path*` to itself; verify the static `security.txt` is served (not shadowed by the `app/api/.well-known/route.ts` handler).
- [ ] Long `Cache-Control` on `/.well-known/*` (`max-age=31536000, immutable`) may delay propagation of the refreshed `security.txt` for returning visitors; note in docs and consider whether the record needs a cache note.
- [ ] Footer/sitemap edit touches shared marketing chrome — verify no regression on other marketing pages.

## Recommended Architecture

### Principle 1: One page, one file, minimal surface

A single static server component `app/security-policy/page.tsx` renders the entire policy inline, exactly like `app/privacy/page.tsx`. No new components, no data fetching, no feature flags.

### Principle 2: `security.txt` references only assets that exist

Every advertised field must resolve. Missing optional artifacts (PGP key, acknowledgments page) are removed rather than stubbed, keeping the record truthful and RFC 9116-valid.

### Principle 3: Reuse the existing reporting mailbox

Reuse `info@certestic.com` with a mandated subject prefix (`Security Vulnerability Report`). This avoids new infrastructure while keeping reports routable.

### Principle 4: Docs-first source of truth

The disclosure process lives in `docs/security/vulnerability-disclosure.md`; the page and `security.txt` are treated as its rendered projections.

## Dependency Rule

Each phase touches exactly one layer: (1) app route/presentation, (2) static asset, (3) discovery wiring, (4) documentation, (5) external compliance artifact (scan report). No phase edits a file that an earlier phase's verification depends on.

## Phase Sequencing Rule

Root cause first: the `security.txt` `Policy:` field is broken because the page does not exist, so the page (Phase 1) precedes the record refresh (Phase 2). Discovery wiring (Phase 3) depends on the page existing. Docs (Phase 4) describe the final state. Scan-report closeout (Phase 5) is last because it cites the delivered artifacts and plan.

## Commit Slicing Rule

Phases 1–3 are small enough to be individual commits; Phase 1 splits into 1.1 (shell + metadata) and 1.2 (content sections) to keep reviewable diff sizes. Phase 4 splits into 4.1 (new doc) and 4.2 (index/guide/repo-map registration). Phase 5 is one commit.

## Progress Markers

- `[ ]` — not started
- `[~]` — in progress
- `[x]` — completed and verified
- `[!]` — blocked

## Progress Dashboard

- [ ] Phase 1 — Publish `/security-policy` page
- [ ] Phase 2 — Refresh `security.txt`
- [ ] Phase 3 — Discoverability wiring (sitemap + footer)
- [ ] Phase 4 — Documentation
- [ ] Phase 5 — Compliance scan-report closeout
- [ ] Phase N — User-journey sync
- [ ] Phase N+1 — Docs Sync
- [ ] Phase N+2 — AI-ready docs reflection and next-plan handoff
- [ ] Phase N+3 — Docs-only Simulation Drill
- [ ] Phase N+4 — Rollout Eval & Health Score

## Phases

### Phase 1: Publish `/security-policy` page

**Progress**: `[ ]`

**Layer**: `app/` presentation/route layer

**Goal**: Ship a static public page at `/security-policy` covering scope, safe harbor, how to report, and response SLA, so the `security.txt` `Policy:` URL resolves.

**Files**:

- `app/security-policy/page.tsx` — create — the disclosure policy page (server component, inline `Metadata`)

**Verification gate** (must pass before Phase 2 starts):

- `npx tsc --noEmit` passes.
- `test -f app/security-policy/page.tsx` is true.
- `grep -n "export const metadata" app/security-policy/page.tsx` returns a match with `canonical: 'https://certestic.com/security-policy'`.
- `grep -niE "scope|safe harbor|report|5 business days|30 days" app/security-policy/page.tsx` returns matches for all required content areas.
- Manual QA: `npm run dev`, open `http://localhost:3000/security-policy` in light and dark mode — header/footer render, no console errors, page is indexable (no `noindex`).

**Sub-subphase checklist**:

- [ ] **1.1 — Page shell + metadata**: create `app/security-policy/page.tsx` as a server component using `MarketingPageShell` + `LandingHeader` + `Breadcrumb`, with inline `export const metadata` (title, description, canonical `https://certestic.com/security-policy`, `robots: index, follow`), matching `app/privacy/page.tsx` conventions.
  - **Independent verification**: file renders locally with header/footer; `npx tsc --noEmit` passes; canonical URL string present.
- [ ] **1.2 — Policy content sections**: author the required sections — **Scope** (in-scope: `certestic.com`, `/main` app, `/api` endpoints, auth flows; out-of-scope: third-party providers Google/Firebase/Stripe/MailerLite, volumetric DoS, social engineering, physical, spam), **Safe Harbor** (good-faith research authorised, no legal action, no data exfiltration/privacy violation, no service disruption, reasonable remediation time), **How to Report** (`info@certestic.com`, subject `Security Vulnerability Report`, include description/reproduction/impact, no sensitive data), **Response SLA** (acknowledge within **5 business days**, initial triage within 10 business days, fix target **30 days** for validated issues, coordinated disclosure), **No Bug Bounty** statement, and a **Change Log**/"Last updated" line.
  - **Independent verification**: each required heading present via `grep`; SLA numbers (`5 business days`, `30 days`) present; page has dark-mode variants on all sections.

---

### Phase 2: Refresh `security.txt`

**Progress**: `[ ]`

**Layer**: static public asset layer

**Goal**: Make the machine-readable record valid and self-consistent.

**Files**:

- `public/.well-known/security.txt` — modify — refresh `Expires`, keep valid `Canonical`/`Policy`/`Contact`, remove dangling optional fields

**Verification gate** (must pass before Phase 3 starts):

- `grep -E "^Expires:" public/.well-known/security.txt` returns a date in the future relative to the merge date.
- `grep -E "^(Contact|Canonical|Policy):" public/.well-known/security.txt` returns all three; `Canonical` = `https://certestic.com/.well-known/security.txt`; `Policy` = `https://certestic.com/security-policy`.
- `grep -nE "pgp-key|security-acknowledgments" public/.well-known/security.txt` returns **no** matches.
- `curl -sI http://localhost:3000/.well-known/security.txt` returns `200` and `content-type: text/plain`.

**Sub-subphase checklist**:

- [ ] **2.1 — Fix record fields**: set `Expires` to a future date (proposed `2027-03-23T23:59:59.000Z`, < 12 months per RFC 9116), keep two `Contact:` lines (`mailto:info@certestic.com`, `https://certestic.com/contact`), keep `Preferred-Languages: en`, `Canonical`, and `Policy`; remove `Encryption:` and `Acknowledgments:` lines that reference non-existent assets.
  - **Independent verification**: `Expires` parses to a future ISO-8601 timestamp; required fields present; dangling references absent.
- [ ] **2.2 — Confirm served output**: verify the static file (not `app/api/.well-known/route.ts`) is served at `/.well-known/security.txt` with `text/plain`.
  - **Independent verification**: `curl -s http://localhost:3000/.well-known/security.txt` returns the edited contents verbatim.

---

### Phase 3: Discoverability wiring (sitemap + footer)

**Progress**: `[ ]`

**Layer**: `app/sitemap.ts` + `src/components/custom/` presentation layer

**Goal**: Make the page crawlable and reachable from site chrome.

**Files**:

- `app/sitemap.ts` — modify — add `/security-policy` static entry (low priority, yearly change frequency)
- `src/components/custom/MarketingFooter.tsx` — modify — add "Security Policy" link to the "Company" column

**Verification gate** (must pass before Phase 4 starts):

- `grep -n "security-policy" app/sitemap.ts` returns the new entry.
- `grep -n "security-policy" src/components/custom/MarketingFooter.tsx` returns the new `Link`.
- `npx tsc --noEmit` passes.
- Manual QA: footer link navigates to `/security-policy`; other marketing pages' footers unchanged.

**Sub-subphase checklist**:

- [ ] **3.1 — Sitemap entry**: add `https://certestic.com/security-policy` with `changeFrequency: 'yearly'`, `priority: 0.3`.
  - **Independent verification**: `grep` returns the entry; sitemap route builds without TypeScript errors.
- [ ] **3.2 — Footer link**: add a `Link href="/security-policy"` under the "Company" column (near Privacy/Terms).
  - **Independent verification**: link renders and navigates; visual QA confirms no layout shift.

---

### Phase 4: Documentation

**Progress**: `[ ]`

**Layer**: documentation layer

**Goal**: Provide a canonical source of truth and register it per the discoverability contract.

**Files**:

- `docs/security/vulnerability-disclosure.md` — create — scope, safe harbor, reporting channel, SLA, `security.txt` field policy, maintenance steps
- `docs/ai/assistant-context-index.md` — modify — add Quick Reference row
- `docs/ai/guide.md` — modify — add routing entry for disclosure/`security.txt` changes
- `docs/ai/repo-map.md` — modify — add `/security-policy` to the public route table

**Verification gate** (must pass before Phase 5 starts):

- New doc exists with `Source of truth:`, `Last reviewed:`, `Owner:`, and a valid `## Related Docs` section.
- `grep -n "vulnerability-disclosure.md" docs/ai/assistant-context-index.md` and `docs/ai/guide.md` return matches.
- `grep -n "security-policy" docs/ai/repo-map.md` returns a match.
- `grep -rn "TODO\|FIXME\|TBD" docs/security/vulnerability-disclosure.md` returns no unresolved placeholders.

**Sub-subphase checklist**:

- [ ] **4.1 — Create the doc**: author `docs/security/vulnerability-disclosure.md` following `docs/security/_template.md`, linking `app/security-policy/page.tsx` and `public/.well-known/security.txt` as its sources of truth.
  - **Independent verification**: metadata fields present; Related Docs links resolve; content matches the shipped page (scope/SLA/contact).
- [ ] **4.2 — Register in index/guide/repo-map**: add the Quick Reference row, the guide routing entry, and the repo-map route row.
  - **Independent verification**: all three `grep` checks return matches; no orphan doc.

---

### Phase 5: Compliance scan-report closeout

**Progress**: `[ ]`

**Layer**: external compliance artifact (docs)

**Goal**: Clear the gap #5 TODO recommendations and the matching Phase 2 action item now that the plan (and, upon execution, the artifacts) exist.

**Files**:

- `keynotes/compliance/260512-compliance-scan-report.md` — modify — mark gap #5 recommendations resolved and reference this rollout plan; update Phase 2 action item 3

**Verification gate**:

- `grep -n "No Security Vulnerability Disclosure Policy" keynotes/compliance/260512-compliance-scan-report.md` shows the resolved entry.
- Gap #5 recommendation checkboxes are `[x]` with inline evidence notes referencing Phase 1/Phase 2 and this plan.
- Phase 2 action item 3 (`Security policy + security.txt`) is marked resolved with a link to this plan.

**Sub-subphase checklist**:

- [ ] **5.1 — Update gap #5**: convert the two `[ ]` recommendations to `[x]` with evidence notes (existing `security.txt` refreshed; page delivered by Phase 1) and link `ai_oriented_kanban/10-plan/security-policy.md`.
  - **Independent verification**: both recommendation lines show `[x]`; the plan link resolves from `keynotes/compliance/`.
- [ ] **5.2 — Update Phase 2 action plan**: mark the security policy + `security.txt` item resolved and reference this plan.
  - **Independent verification**: `grep -n "Security policy" ...scan-report.md` shows the resolved marker.

---

## Post-task phases

### Phase N: User-journey sync _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: documentation layer

**Goal**: Reflect the new public `/security-policy` route in the user journey if it adds a user-facing story.

**Pre-condition check**:

- A new public page route is user-visible; it is unlikely to change core journeys but it is a new reachable page (footer link + sitemap). If the team judges it non-journey-relevant, mark `[!]` with "skipped: no user-journey updates needed".

**Files** _(only if pre-condition is met)_:

- `docs/product/user-journey.md` — modify — note the security/research reporting entry point if the doc tracks public routes.

**Verification gate** _(if executed)_:

- `docs/product/user-journey.md` references the new route or explicitly excludes it.

**Sub-subphase checklist**:

- [ ] **N.0 — Decide relevance**: confirm whether the new route changes any documented journey.
  - **Independent verification**: decision recorded with rationale.
- [ ] **N.1 — Update doc if relevant**: add the route/story or record the skip.
  - **Independent verification**: doc reflects the decision.

---

### Phase N+1: Docs Sync _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: documentation layer

**Goal**: Ensure all `## Docs Impact` entries are landed and consistent.

**Pre-condition check**:

- `## Docs Impact → No docs affected` is not checked, so this phase executes.

**Files** _(from Docs Impact section above)_:

- `docs/security/vulnerability-disclosure.md` — create — canonical disclosure doc
- `docs/ai/assistant-context-index.md` — modify — Quick Reference row
- `docs/ai/guide.md` — modify — routing entry
- `docs/ai/repo-map.md` — modify — route table row
- `docs/adr/<YYYY-MM>.md` or `docs/adr/0002-*.md` — skip — no significant ADR (see N+1.6)

**Verification gate**:

- Every doc listed under "Docs to create" exists.
- Every doc listed under "Docs to update" has updated content and a fresh `Last reviewed:` date where applicable.
- `grep -r "TODO\|FIXME\|TBD" docs/security/ | grep -v "_template"` returns no unresolved placeholders in the new doc.
- New doc has `Source of truth:` and a valid `## Related Docs` section.
- `grep "vulnerability-disclosure" docs/ai/assistant-context-index.md` returns a match.

**Sub-subphase checklist**:

- [ ] **N+1.0 — Confirm checklist**: verify the Docs-First Retrieval Checklist is completed and post-task update field is Yes.
  - **Independent verification**: checklist populated; sufficiency marked.
- [ ] **N+1.1 — Create docs**: confirm `docs/security/vulnerability-disclosure.md` exists with required metadata.
  - **Independent verification**: metadata fields present.
- [ ] **N+1.2 — Update docs**: apply index/guide/repo-map updates and refresh `Last reviewed:`.
  - **Independent verification**: grep checks return matches.
- [ ] **N+1.3 — Archive/delete**: none.
  - **Independent verification**: n/a (no deletions).
- [ ] **N+1.4 — Update assistant-context-index.md**: confirm the new row is present.
  - **Independent verification**: Quick Reference table includes the disclosure doc.
- [ ] **N+1.5 — Verify link integrity**: spot-check the new doc's `## Related Docs` and inbound links.
  - **Independent verification**: no broken relative links.
- [ ] **N+1.6 — Record significant ADRs**: mark `[x]` with note "skipped: no significant ADRs" — the changes follow existing page/SEO/docs patterns and introduce no architectural or process decision.
  - **Independent verification**: justification recorded; no ADR required.

---

### Phase N+2: AI-ready docs reflection and next-plan handoff _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: planning/documentation improvement layer

**Goal**: Capture lessons (e.g. handling an already-existing-but-stale asset) and hand off confirmed follow-ups.

**Files**:

- `<next-rollout-path>.md` — create/modify — only if confirmed follow-ups exist (e.g. PGP key, acknowledgments page, `security@certestic.com`, vulnerability-management process)
- `ai_oriented_kanban/10-plan/security-policy.md` — modify — handoff note

**Verification gate**:

- If a next rollout is authored, it contains scope, phases, verification gates, and rollback.
- Confirmed improvements are listed; unresolved questions carry owner/criteria.

**Sub-subphase checklist**:

- [ ] **N+2.1 — Summarize confirmed improvements**: extract approved follow-ups (PGP key/acknowledgments optional).
  - **Independent verification**: each appears in the next rollout scope or is explicitly deferred.
- [ ] **N+2.2 — Convert unresolved questions to decisions**: add owner/criteria for Open Questions.
  - **Independent verification**: no open question lacks a decision path.
- [ ] **N+2.3 — Author next rollout plan** (if any).
  - **Independent verification**: plan includes phases, gates, rollback.
- [ ] **N+2.4 — Record handoff**: add session note linking to the next plan.
  - **Independent verification**: link present.

---

### Phase N+3: Docs-only Simulation Drill _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: validation/reproducibility layer

**Goal**: Prove a fresh agent can (a) author the disclosure page and (b) refresh `security.txt` using only `docs/security/vulnerability-disclosure.md` + `docs/architecture/seo-patterns.md`, with no unjustified code scan.

**Pre-condition check**: Phase N+1 docs updates complete.

**Files**:

- `docs/operations/ai-retrieval-smoke-tests.md` — modify — add drill prompt + pass criteria
- `docs/ai/project-simulation-readiness.md` — modify — run log, scorecard, verdict
- `ai_oriented_kanban/10-plan/security-policy.md` — modify — drill verdict

**Verification gate**:

- Drill output includes `Docs Needed` and a Decision Evidence Log.
- At least one run passes with no unjustified code scan.
- Any fallback scan has a same-rollout docs remediation action.

**Sub-subphase checklist**:

- [ ] **N+3.1 — Define scenario**: prompt a fresh agent to "add a new asset to `/.well-known/` and a linked public policy page" with expected output schema.
  - **Independent verification**: scenario references the canonical docs + pass/fail criteria.
- [ ] **N+3.2 — Execute and record**: run the drill and store evidence.
  - **Independent verification**: run log contains docs-needed list, decision evidence, fallback rationale.
- [ ] **N+3.3 — Apply corrective doc updates**: fix any insufficiency found.
  - **Independent verification**: insufficiency list empty or each item has owner + due date.

---

### Phase N+4: Rollout Eval & Health Score _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: rollout quality/evaluation layer

**Goal**: Produce the rollout health score with evidence.

**Pre-condition check**: Phases N–N+3 are `[x]` or have documented `[!]` justifications.

**Scoring rubric**:

| Dimension | Max Points | How scored |
| --- | --- | --- |
| Docs-first adherence | 40 | Checklist completed; sufficiency assessed; fallback documented |
| Docs health | 40 | All Docs Sync gates passed |
| Reflection quality | 20 | ≥1 confirmed improvement; open questions have owners/criteria |
| Simulation readiness | 20 | Drill evidence; no unjustified fallback |
| **Total** | **120** | Suggested pass threshold: `>= 85` |

**Sub-subphase checklist**:

- [ ] **N+4.1 — Evaluate docs-first adherence**.
  - **Independent verification**: checklist complete; sufficiency marked.
- [ ] **N+4.2 — Evaluate docs health**.
  - **Independent verification**: every docs gate pass/justified.
- [ ] **N+4.3 — Evaluate reflection + simulation quality**.
  - **Independent verification**: confirmed improvement + drill evidence exist.
- [ ] **N+4.4 — Record final score session note**.
  - **Independent verification**: score + archive decision recorded (`>= 85` pass).

---

## Dependency Graph

(app) `app/security-policy/page.tsx` (Phase 1)
  ↓ makes the Policy URL live
(asset) `public/.well-known/security.txt` (Phase 2)
  ↓ published route
(discovery) `app/sitemap.ts` + `MarketingFooter.tsx` (Phase 3)
  ↓ renders final state
(docs) `docs/security/vulnerability-disclosure.md` + index/guide/repo-map (Phase 4)
  ↓ cites delivered artifacts
(compliance) `keynotes/compliance/...scan-report.md` closeout (Phase 5)

Each arrow means "depends on". No phase edits a file an earlier phase's verification relies on.

## Suggested Implementation Order

1. Phase 1.1 → 1.2 (page shell, then content) — unblocks the Policy URL.
2. Phase 2.1 → 2.2 (refresh record, confirm served output).
3. Phase 3.1 → 3.2 (sitemap, footer).
4. Phase 4.1 → 4.2 (doc, then registration).
5. Phase 5.1 → 5.2 (scan-report closeout).
6. Closing phases N → N+4 in order.

If a gap is found downstream, add an isolated earlier-layer fix rather than patching inline.

## Progress Checks (Resume-at-any-time protocol)

At the end of each working session:

1. Update **Progress Dashboard** and the active phase `Progress` marker.
2. Mark sub-subphase `[x]` only after independent verification passes.
3. Add a session note with timestamp, last completed step, next step, and blockers.
4. If blocked, mark `[!]` and record the unblock dependency.

### Session Note Template

### Session Note — <YYYY-MM-DD HH:mm local>

- Completed: <phase.subphase>
- Verified by: <command/test/QA>
- Next: <phase.subphase>
- Blockers: <none | details>

### Session Note — 2026-09-23 23:16 local

- Completed: planning task — authored this rollout plan; verified current state of `security.txt` (exists but `Expires` expired 2026-07-19 and references missing `pgp-key.txt` / `security-acknowledgments`) and confirmed `app/security-policy/` does not exist.
- Verified by: `find`/`grep` over repo; file reads of `next.config.ts`, `app/sitemap.ts`, `app/privacy/page.tsx`, `MarketingFooter.tsx`, `docs/ai/guide.md`.
- Next: user approval, then Phase 1.
- Blockers: none.

## Essential Implementation Details

- **Contact**: reuse `info@certestic.com` with subject prefix `Security Vulnerability Report`; `security@certestic.com` is a future improvement, not a dependency.
- **`security.txt` field policy**: only advertise artifacts that exist; `Encryption`/`Acknowledgments` omitted until those assets ship.
- **SLA values are contractual copy**: page and `docs/security/vulnerability-disclosure.md` must state identical numbers (5 business days acknowledge, 30 days fix target).
- **Cache note**: `/.well-known/*` is served with `max-age=31536000, immutable`; document that `Expires` refresh may not propagate to returning visitors until cache expiry, or lower cache for this path if needed.
- **No new infra**: no PGP key, no mailbox provisioning, no bug-bounty integration.
- **No ADR**: changes follow existing patterns; ADR skipped with justification (N+1.6).

## Success Criteria

- [ ] `https://certestic.com/security-policy` renders with scope, safe harbor, how to report, and SLA sections.
- [ ] `public/.well-known/security.txt` has a future `Expires`, valid `Canonical`/`Policy`, and no dangling references.
- [ ] `/security-policy` appears in `app/sitemap.ts` and is linked from the footer "Company" column.
- [ ] `docs/security/vulnerability-disclosure.md` exists and is registered in index + guide + repo-map.
- [ ] `keynotes/compliance/260512-compliance-scan-report.md` gap #5 recommendations are cleared with evidence.
- [ ] `npx tsc --noEmit` passes; no regressions on other marketing pages.

## Rollback Plan

1. Delete `app/security-policy/page.tsx` and revert the `app/sitemap.ts` + `MarketingFooter.tsx` changes (`git checkout -- app/sitemap.ts src/components/custom/MarketingFooter.tsx`).
2. `git checkout -- public/.well-known/security.txt` to restore the prior record (accepting the prior stale state).
3. Delete `docs/security/vulnerability-disclosure.md` and revert index/guide/repo-map edits.
4. Revert the scan-report edit with `git checkout -- keynotes/compliance/260512-compliance-scan-report.md`.
5. Re-run `npx tsc --noEmit` and confirm no dangling links.

## Open Questions

1. **Reporting mailbox** — keep `info@certestic.com` (chosen default) or provision `security@certestic.com`? Default: keep `info@`.
2. **PGP encryption** — publish a key and re-add the `Encryption:` field, or leave out? Default: leave out (minimum effort).
3. **Acknowledgments page** — build a researcher hall-of-fame, or keep the field omitted? Default: omit.
4. **`security.txt` cache** — accept the long cache, or add a shorter `Cache-Control` for `/.well-known/security.txt` so `Expires` refreshes propagate? Default: accept and document.
5. **Bug bounty** — confirm no program now (scan report lists it as post-launch low priority). Default: none.

## Recommendation

Execute **Phase 1 → 2 → 3** as the minimum-viable path that clears the compliance gap (live policy page + valid `security.txt` + discoverability), then **Phase 4** docs and **Phase 5** scan-report closeout. The work is static/presentation/docs only, low risk, and each phase is independently verifiable. The only notable finding is that `security.txt` already exists but is stale — Phase 2 fixes it in place rather than recreating it.
