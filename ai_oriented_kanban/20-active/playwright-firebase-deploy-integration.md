# Rollout: Playwright E2E Integration with Firebase App Hosting Deployment

## Summary

Firebase App Hosting auto-deploys on every push to `main` and `uat` via its built-in GitHub-connected, Cloud Build-backed pipeline. It does **not** support pre/post-deploy hooks. This rollout wires Playwright E2E tests into a GitHub Actions CI workflow that runs **in parallel** with the App Hosting pipeline — both triggered by the same push. App Hosting deploys the app; GitHub Actions runs the test gates independently. The post-deploy smoke test step has been **eliminated** — CI and App Hosting are decoupled, with no URL polling or deploy-completion detection.

**Key constraint**: App Hosting owns the deploy. GitHub Actions owns the test gates. The two pipelines run in parallel on push to the `uat` branch. CI does not wait for App Hosting to finish deploying — it runs its own test suite (unit + E2E against a local dev server) as a standalone gate.

**Key change from prior version**: The `post-deploy-smoke` job and all associated infrastructure (`wait-for-service.sh`, `e2e-post-deployment.sh` URL polling, `PLAYWRIGHT_TEST_BASEURL` live-URL testing) have been removed. CI tests run against a locally-started dev server inside the GitHub Actions runner, not against the live deployment URL.

## Action Type Legend

Each sub-subphase in this plan is tagged with one of the following action types. This makes it explicit which steps can be automated and which require human intervention.

| Tag           | Meaning                                                                                                                                                                             | Who acts                                        |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `[AUTO]`      | Fully automatable — code change, script edit, or config file write. No console or external system access needed.                                                                    | Developer / AI agent                            |
| `[HITL]`      | Human-in-the-loop — requires manual access to an external system (Firebase Console, GitHub Settings, Cloud Secret Manager, local machine setup). Cannot be completed by code alone. | Developer with console access                   |
| `[AUTO→HITL]` | Code is written automatically, but verification requires human confirmation (e.g., push to branch and observe CI run).                                                              | Developer / AI agent writes, Developer verifies |

## Isolated Testing Principle

> **Each phase must be independently testable in isolation before the next phase begins.**

Every phase in this plan includes an **"Isolated Test"** section with a concrete command or verification that can be run **without depending on any later phase**. This means:

- The isolated test for Phase N does **not** require Phase N+1 (or later) to be complete.
- The isolated test can be run from a clean checkout with only the changes from Phase 0 through Phase N applied.
- If the isolated test passes, the phase is considered complete and the next phase may begin.
- If the isolated test fails, the phase is **not** complete — do not proceed.

**Isolated test vs. verification gate**: The verification gate is the formal checklist that must pass. The isolated test is a single concrete command you can run to prove the phase works end-to-end in isolation.

## Current Evaluation

### What already exists

- `playwright.config.ts` — working; auto-starts dev server locally, uses `PLAYWRIGHT_TEST_BASEURL` for live env; local macOS 11 fix with `channel: 'chrome'` guard
- `scripts/e2e-pre-flight.sh` — runs E2E against `localhost:3000`; not wired into any CI
- `scripts/e2e-post-deployment.sh` — greps for `@smoke` tests against live URL; **no longer needed** (post-deploy step eliminated)
- `scripts/wait-for-service.sh` — polls a URL until 200; **no longer needed** (no post-deploy URL polling)
- `apphosting.yaml` / `apphosting.uat.yaml` — declare `PW_TEST_EMAIL` + `PW_TEST_PASSWORD` secret references
- Firebase Console — App Hosting backend connected to GitHub repo, auto-rollout on push to `main` and `uat`
- `package.json` — has `test:e2e`, `test:e2e:ui`, `test:e2e:headed`, `test:e2e:ci-preflight`, `test:e2e:ci-postdeploy` scripts
- `src/firebase/firebaseAdminConfig.ts` — loads `GOOGLE_APPLICATION_CREDENTIALS` env var; attempts to handle both file paths and JSON strings, but the `./gcp_cred` relative-path branch causes `SyntaxError: Unexpected token '.'` when the value is a file path that doesn't exist or when it's not a valid JSON string

### What is not centralized / stable / complete yet

#### 1. No CI test gate

- No `.github/workflows/` directory exists — no CI runs on push or PR
- App Hosting deploys broken code without any pre-deploy test check
- Representative files: `.github/` (missing), `scripts/e2e-pre-flight.sh` (orphaned)

#### 2. Post-deploy validation eliminated

- The `post-deploy-smoke` job has been removed from scope — CI and App Hosting run fully in parallel
- `scripts/e2e-post-deployment.sh` and `scripts/wait-for-service.sh` are no longer needed
- Representative files: `scripts/e2e-post-deployment.sh` (deprecated), `scripts/wait-for-service.sh` (deprecated)

#### 3. Secrets may not be provisioned

- `PW_TEST_EMAIL` / `PW_TEST_PASSWORD` are declared in `apphosting.yaml` but may not exist in Cloud Secret Manager
- `GCP_CREDENTIALS_JSON` causes `SyntaxError: Unexpected token '.'` locally — the value is set to `"./gcp_cred"` (a file path) instead of a JSON string; `firebaseAdminConfig.ts` attempts to read it as a relative file path, but when the file doesn't exist or contains invalid JSON, the fallback `JSON.parse(credentialsString)` fails on `"./gcp_cred"` because `.` is not valid JSON
- GitHub Secrets for CI do not exist

#### 4. `firebaseAdminConfig.ts` credential loading is fragile

- The current logic tries to detect whether `GOOGLE_APPLICATION_CREDENTIALS` is a path or a JSON string by checking `startsWith('/')`, `startsWith('.')`, and `includes('{')`
- This fails for the local dev case where `./gcp_cred` is a file path pointing to a JSON file that may or may not exist
- In CI (GitHub Actions), the env var should be a JSON string from GitHub Secrets, not a file path
- The fix: Phase 0 provides a dedicated `GCP_CREDENTIALS_JSON` GitHub Secret containing the raw JSON, and the CI workflow writes it to a temp file, setting `GOOGLE_APPLICATION_CREDENTIALS` to the file path — matching the existing `firebaseAdminConfig.ts` file-path code path

### Risks in the current state

- [ ] App Hosting deploys broken code (no test gate before deploy)
- [ ] Test credentials missing in Secret Manager → E2E auth fails in CI
- [ ] `GCP_CREDENTIALS_JSON` format issue breaks API routes in tests — `firebaseAdminConfig.ts` fails when `GOOGLE_APPLICATION_CREDENTIALS` is `"./gcp_cred"` and the file is missing or invalid
- [ ] Two parallel pipelines may cause confusion (mitigated: GitHub checks show both "App Hosting" and "CI" status clearly)

## Scope

- Estimated files to create: 3
- Estimated files to modify: 7
- Risk level: Medium

### In scope

- Phase 0: Minimal GitHub Actions workflow + `gcp_credentials.json` fix
- Tag `@smoke` tests and create `e2e/smoke.spec.ts`
- Create `.github/workflows/ci.yml` (unit + E2E, triggered on push to `uat`)
- Update `e2e-pre-flight.sh` for CI compatibility (remove manual dev server startup)
- Add `test:e2e:smoke` script to `package.json`
- Add `apphosting` backend config to `firebase.json`
- Document local dev setup (`.env.local.example`, `e2e/instructions.md`)

### Out of scope

- ~~Post-deploy smoke tests against live URL~~ — eliminated
- ~~`wait-for-service.sh` URL polling~~ — eliminated
- Deploying from GitHub Actions (App Hosting owns deploy)
- Running tests inside `apphosting.yaml` `buildCommand` (no browser binaries in build env)
- Adding new E2E test cases beyond smoke health checks
- Provisioning Firebase test user accounts (Phase 4 — infrastructure task, needs console access)

## Minimum Viable Hotfix

- **Phase 0** — get GitHub Actions running with minimal config and fix the `gcp_credentials.json` loading issue. This unblocks CI immediately. Even without `@smoke` tags or secrets provisioning, a basic workflow that runs unit tests + E2E on push to `uat` is the fastest path to a working test gate.

## Docs Impact

### Docs checked during planning

| Doc                                                     | Relevant finding                                                                                            |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `docs/testing/strategy.md`                              | Documents two-layer test strategy (Jest + Playwright); confirms spec inventory, fixture patterns, env setup |
| `ai_oriented_kanban/README.md`                          | Kanban methodology — phased plans with verification gates, decision evidence logs                           |
| `ai_oriented_kanban/templates/rollout-plan-template.md` | Required structure for this plan                                                                            |

### Docs-First Retrieval Checklist

- [x] Loaded all primary docs for this task type from `docs/ai/guide.md` (testing strategy doc confirmed).
- [x] Declared initial `Docs Needed` list before implementation planning.
- [x] Assessed sufficiency — docs were **insufficient**.
  - Missing: no doc covers CI/CD integration patterns or App Hosting deploy coordination
  - Fallback code scan was used for: `playwright.config.ts`, `apphosting.yaml`, `apphosting.uat.yaml`, `scripts/*.sh`, `src/firebase/firebaseAdminConfig.ts` — to understand existing infra
  - Docs were updated in this rollout: `docs/testing/strategy.md` will be updated to add CI integration section
- [x] For each major decision, recorded a Decision Evidence Log row.
- [x] Post-task docs update required: `[x] Yes` — `docs/testing/strategy.md` needs CI integration section.

### Docs Needed (planning + implementation)

| Doc                                   | Why needed                                                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `docs/testing/strategy.md`            | Source of truth for test conventions; must be updated with CI pipeline section                               |
| `apphosting.yaml`                     | Secret references for `PW_TEST_EMAIL` / `PW_TEST_PASSWORD` — must verify they match Secret Manager           |
| `apphosting.uat.yaml`                 | Same secret references for UAT env                                                                           |
| `playwright.config.ts`                | Understanding of `webServer`, `PLAYWRIGHT_TEST_BASEURL`, `isLiveEnvironment` logic                           |
| `src/firebase/firebaseAdminConfig.ts` | Understanding of `GOOGLE_APPLICATION_CREDENTIALS` loading logic — root cause of `gcp_credentials.json` issue |

### Planning Decision Evidence Log

| Decision                                                                                                                   | Docs cited                               | Sufficiency verdict | Fallback code scan used? | Doc update action                                          |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------- | ------------------------ | ---------------------------------------------------------- |
| App Hosting and GitHub Actions run in parallel — no coordination needed                                                    | Firebase App Hosting docs (web fetched)  | Sufficient          | No                       | Document in `docs/testing/strategy.md`                     |
| Post-deploy smoke step eliminated — CI runs standalone test gate, does not wait for deploy                                 | This plan (user-directed change)         | Sufficient          | No                       | Document in `docs/testing/strategy.md`                     |
| GitHub Actions does NOT deploy — only tests                                                                                | `apphosting.yaml`, `apphosting.uat.yaml` | Sufficient          | No                       | Document in `docs/testing/strategy.md`                     |
| CI triggers only on push to `uat` branch (not `main`, not PRs)                                                             | This plan (user-directed change)         | Sufficient          | No                       | Document in `docs/testing/strategy.md`                     |
| `channel: 'chrome'` guard is macOS-only, no-op in CI Linux                                                                 | `playwright.config.ts`                   | Sufficient          | Yes (read config)        | Document in `e2e/instructions.md`                          |
| `GCP_CREDENTIALS_JSON` must be written to a temp file in CI, not passed as JSON string to `GOOGLE_APPLICATION_CREDENTIALS` | `src/firebase/firebaseAdminConfig.ts`    | Sufficient          | Yes (read source)        | Document in `.env.local.example` and `e2e/instructions.md` |

### Docs to create

| File                       | Reason                                                               |
| -------------------------- | -------------------------------------------------------------------- |
| `.github/workflows/ci.yml` | CI pipeline (not a doc, but primary deliverable)                     |
| `e2e/smoke.spec.ts`        | Minimal health-check tests tagged `@smoke`                           |
| `.env.local.example`       | Document required env vars, especially `GCP_CREDENTIALS_JSON` format |

### Docs to update

| File                        | What changes                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `docs/testing/strategy.md`  | Add CI pipeline section: parallel App Hosting + GitHub Actions model, `@smoke` tag convention, `uat`-branch trigger |
| `e2e/instructions.md`       | Document macOS 11 Chromium workaround (`channel: 'chrome'`), document `gcp_credentials.json` local setup            |
| `package.json`              | Add `test:e2e:smoke` script                                                                                         |
| `firebase.json`             | Add `apphosting` backend config for CLI access                                                                      |
| `scripts/e2e-pre-flight.sh` | Remove redundant dev server startup (Playwright config handles `webServer`)                                         |

### No docs affected

- [ ] Confirmed: this plan introduces no new patterns, changes no existing conventions, and removes no documented features.
      _(Unchecked — this plan introduces CI integration patterns and `@smoke` tag convention.)_

## Context Map

### Files to modify first

| File                                   | Purpose                                              | Why it matters                                                                           |
| -------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/firebase/firebaseAdminConfig.ts`  | Fix `GOOGLE_APPLICATION_CREDENTIALS` loading         | Root cause of `SyntaxError: Unexpected token '.'` — must be fixed before CI E2E can pass |
| `e2e/demo-credentials-consent.spec.ts` | Add `@smoke` tag to critical test                    | Enables `--grep @smoke` filtering                                                        |
| `e2e/exam.spec.ts`                     | Add `@smoke` tag to critical test                    | Same                                                                                     |
| `e2e/user.spec.ts`                     | Add `@smoke` tag to critical test                    | Same                                                                                     |
| `package.json`                         | Add `test:e2e:smoke` script                          | Convenience entry point for smoke-only runs                                              |
| `scripts/e2e-pre-flight.sh`            | Remove manual dev server startup                     | Playwright `webServer` config already handles this                                       |
| `firebase.json`                        | Add `apphosting` backend config                      | Enables CLI rollouts for manual triggers                                                 |
| `docs/testing/strategy.md`             | Add CI integration section                           | Keep docs aligned with implementation                                                    |
| `e2e/instructions.md`                  | Document macOS 11 workaround + gcp_credentials setup | Team can run locally on older macOS                                                      |

### Likely files to create

| File                       | Purpose                                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml` | CI pipeline: unit tests + E2E tests, triggered on push to `uat`                                                              |
| `e2e/smoke.spec.ts`        | Minimal health-check tests: homepage, signin page, API health                                                                |
| `.env.local.example`       | Document env var format (esp. `GOOGLE_APPLICATION_CREDENTIALS` as file path locally, JSON string via Secret Manager in prod) |

### Dependencies / related patterns

| File                                  | Relationship                                                                                               |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `playwright.config.ts`                | Configures `webServer` auto-start, `PLAYWRIGHT_TEST_BASEURL` for live env, `channel: 'chrome'` macOS guard |
| `apphosting.yaml`                     | Prod env secrets — `PW_TEST_EMAIL`, `PW_TEST_PASSWORD`, `GCP_CREDENTIALS_JSON`                             |
| `apphosting.uat.yaml`                 | UAT env secrets — same                                                                                     |
| `src/firebase/firebaseAdminConfig.ts` | Reads `GOOGLE_APPLICATION_CREDENTIALS` — file path locally, JSON string in prod via Secret Manager         |

### Risks

- [ ] Test credentials not in Secret Manager → E2E auth fails in CI (mitigated: Phase 4 creates them first)
- [ ] `GCP_CREDENTIALS_JSON` format issue breaks API routes (mitigated: Phase 0 fixes the loading logic + CI writes JSON to temp file)
- [ ] Two parallel pipelines cause confusion (mitigated: GitHub checks show both "App Hosting" and "CI" status clearly)
- [ ] CI triggers only on `uat` branch — pushes to `main` do not run CI tests (mitigated: `main` is protected branch; UAT is the test-gate environment)

## Recommended Architecture

### Principle 1: Parallel pipelines, no coordination

App Hosting owns the deploy pipeline (GitHub push → Cloud Build → Cloud Run). GitHub Actions owns the test gates (unit + E2E against local dev server). Both are triggered by the same push to the `uat` branch and run in parallel. The two never overlap — CI does not deploy, App Hosting does not test, and CI does not wait for App Hosting to finish.

### Principle 2: CI tests against local dev server, not live URL

Since the post-deploy smoke step is eliminated, CI runs E2E tests against a locally-started Next.js dev server inside the GitHub Actions runner (via Playwright's `webServer` config). This means:

- No URL polling or `wait-for-service.sh` needed
- No dependency on App Hosting deploy timing
- Tests are deterministic and fast (no network latency)
- `PLAYWRIGHT_TEST_BASEURL` is not set in CI — the Playwright config's `webServer` handles starting the dev server

### Principle 3: `uat` branch as the CI trigger

CI runs only on push commits to the `uat` branch. This aligns with the App Hosting UAT backend, which is also connected to the `uat` branch. The workflow is:

1. Developer pushes to `uat`
2. App Hosting triggers a deploy to the UAT environment
3. GitHub Actions triggers CI (unit + E2E tests) — in parallel with #2
4. Both pipelines report status independently on the commit

## Dependency Rule

Each phase touches exactly one layer: credentials fix (Phase 0), test files (Phase 1), CI infra (Phase 2), App Hosting config (Phase 3), secrets/credentials (Phase 4), scripts (Phase 5), docs (Phase 6+). No phase mixes layers.

## Phase Sequencing Rule

Credentials fix (Phase 0) → root-cause fix (tag smoke tests, Phase 1) → infra (CI workflow, Phase 2) → config (App Hosting rules, Phase 3) → secrets → scripts → docs sync.

## Commit Slicing Rule

Each sub-subphase is independently reviewable and revertible. No split creates temporary broken imports between commits.

## Progress Markers

- `[ ]` — not started
- `[~]` — in progress
- `[x]` — completed and verified
- `[!]` — blocked

## Progress Dashboard

- [~] Phase 0 — Minimal GitHub Actions + `gcp_credentials.json` fix (0.1–0.4 done & verified; 0.5 push pending)
- [x] Phase 1 — Tag `@smoke` tests + create `smoke.spec.ts` (1.1–1.3 done & verified 2026-08-24)
- [~] Phase 2 — Enhance CI with `@smoke` filtering + `workflow_dispatch` (2.1–2.2 done & verified 2026-08-25; 2.3 push blocked on SSH passphrase)
- [~] Phase 3 — Configure App Hosting rollout trigger rules (3.1 done & verified 2026-08-25; 3.2 pending Firebase Console, HITL)
- [~] Phase 4 — Provision test credentials in Secret Manager + GitHub Secrets (4.4 local validation done 2026-08-25; 4.1–4.3 HITL pending)
- [x] Phase 5 — Update pre-flight script for CI compatibility (5.1–5.3 done & verified 2026-08-26)
- [ ] Phase 6 — Local dev parity & docs
- [ ] Phase 7 — Docs Sync
- [ ] Phase 8 — AI-ready docs reflection and next-plan handoff
- [ ] Phase 9 — Docs-only Simulation Drill
- [ ] Phase 10 — Rollout Eval & Health Score

## Human-in-the-Loop (HITL) Actions Summary

The following actions **cannot be automated** and require manual access to external systems. They are blockers for the phases they belong to and must be completed by a developer with the appropriate console access.

| HITL Action                                                                       | Phase | System Accessed                | Blocks Phase     | Can Phase Proceed Without It?                                         |
| --------------------------------------------------------------------------------- | ----- | ------------------------------ | ---------------- | --------------------------------------------------------------------- |
| Verify `firebaseAdminConfig.ts` fix locally with a real GCP credentials JSON file | 0.1   | Local machine                  | Phase 0          | No — must be verified before CI E2E can pass                          |
| Push to `uat` branch and observe CI workflow run                                  | 0.2   | GitHub Actions                 | Phase 0          | No — CI workflow must be observed running at least once               |
| Provision `GCP_CREDENTIALS_JSON` GitHub Secret                                    | 4.3   | GitHub repo Settings           | Phase 0 full E2E | Partially — CI runs but E2E auth-dependent tests will fail without it |
| Create Firebase test user accounts in UAT                                         | 4.1   | Firebase Console (Auth)        | Phase 4          | No                                                                    |
| Store credentials in Cloud Secret Manager                                         | 4.2   | Google Cloud Console           | Phase 4          | No                                                                    |
| Add GitHub Secrets (all 15 — no fallbacks; `PW_TEST_EMAIL`, `PW_TEST_PASSWORD`, `PW_SIGNUP_EMAIL`, `PW_SIGNUP_PASSWORD`, 6× `NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_SERVER_API_URL`, `NEXT_PUBLIC_HOST_URL`, `SERVICE_SECRET`, `JOSE_JWT_SECRET`, `GCP_CREDENTIALS_JSON`) | 4.3   | GitHub repo Settings           | Phase 4          | No                                                                    |
| Verify `GCP_CREDENTIALS_JSON` format locally                                      | 4.4   | Local machine                  | Phase 4          | No                                                                    |
| Configure Ignored Paths in Firebase Console                                       | 3.2   | Firebase Console (App Hosting) | Phase 3          | No — but Phase 3 repo code can proceed without it                     |
| Verify App Hosting skipped deploy on test-only commit                             | 3.2   | Firebase Console (App Hosting) | Phase 3          | No — must observe SKIPPED status                                      |

> **Key**: Phases 0–2 can proceed with code changes (AUTO steps) even if GitHub Secrets are not yet provisioned. However, the E2E test job will fail until secrets exist. Unit tests will pass immediately. This is expected — Phase 4 (secrets) is the unblocker for full CI E2E.

## Phases

### Phase 1: Tag `@smoke` tests + create `smoke.spec.ts`

**Progress**: `[x]` — completed & verified 2026-08-24

**Layer**: test files

**Goal**: Enable `--grep @smoke` filtering so smoke tests can run as a minimal subset within the CI E2E job.

**Files**:

- `e2e/demo-credentials-consent.spec.ts` — modify — add `@smoke` tag to the "requires click to reveal" test title
- `e2e/exam.spec.ts` — modify — add `@smoke` tag to the `[Dashboard → Cert → Exams]` test title
- `e2e/user.spec.ts` — modify — add `@smoke` tag to the login + signup flow test title
- `e2e/smoke.spec.ts` — create — minimal health-check tests: homepage renders, `/signin` page loads with form fields, API health endpoint responds 200
- `package.json` — modify — add `"test:e2e:smoke": "playwright test --grep @smoke"` script

**Verification gate** (must pass before Phase 2 starts):

- `npm run test:e2e:smoke` runs only `@smoke`-tagged tests (verify via test count in output) — **PASS: 6 tests in 4 files (via `--list`; full run verified locally 3/3 for smoke.spec.ts)**
- `e2e/smoke.spec.ts` exists and has at least 2 passing tests — **PASS: 3/3 passing after strict-mode fix**
- `grep -r "@smoke" e2e/` returns matches in all 4 spec files — **PASS: 9 tags across demo-credentials-consent, exam, smoke, user**

**Isolated Test** (run this single command after Phase 1 is complete to verify in isolation):

```bash
# Verify @smoke tags exist in all expected files
grep -r "@smoke" e2e/*.spec.ts | wc -l | xargs -I{} sh -c '[ {} -ge 4 ] && echo "PASS: {} @smoke tags found (expected >=4)" || echo "FAIL: only {} @smoke tags found"'

# Verify smoke.spec.ts exists
test -f e2e/smoke.spec.ts && echo "PASS: smoke.spec.ts exists" || echo "FAIL: smoke.spec.ts missing"

# Verify test:e2e:smoke script exists
grep -q 'test:e2e:smoke' package.json && echo "PASS: test:e2e:smoke script present" || echo "FAIL: test:e2e:smoke script missing"

# Run smoke tests locally (requires local dev server — Playwright webServer handles this)
# This verifies the @smoke filtering works end-to-end
npm run test:e2e:smoke 2>&1 | grep -q '@smoke' && echo "PASS: smoke test run executed" || echo "WARN: could not verify smoke run (may need credentials)"
```

> **Note**: The `npm run test:e2e:smoke` command will start a local dev server via Playwright's `webServer` config. Some smoke tests may require auth credentials to pass fully. The homepage and signin page health checks should pass without credentials.

**Human-in-the-loop actions**:

- None required for this phase. All changes are code-only `[AUTO]`.
- If you want to manually verify the smoke tests pass locally, you'll need a valid `.env.local` with `GOOGLE_APPLICATION_CREDENTIALS` pointing to a real GCP credentials file. This is optional for phase completion — the grep verifications are sufficient.

**Sub-subphase checklist**:

- [x] **1.1 — Add `@smoke` tags to existing specs** `[AUTO]`: add `@smoke` to test titles in `demo-credentials-consent.spec.ts`, `exam.spec.ts`, `user.spec.ts`
  - **Independent verification**: `grep -r "@smoke" e2e/*.spec.ts` returns 3+ matches — PASS (4 files, 6 tests)
  - **Isolated**: yes — grep verification only, no runtime needed.
  - **Implementation note (deviation)**: the plan targeted the "requires click to reveal" test in `demo-credentials-consent.spec.ts`, but that test is `test.skip`'d (line 66). `@smoke` was instead added to the runnable "applies the same reveal-on-click behavior on signup" test (line 90) — a skip-tagged test would never execute under `--grep @smoke`.
- [x] **1.2 — Create `e2e/smoke.spec.ts`** `[AUTO]`: homepage, signin, API health checks
  - **Independent verification**: `test -f e2e/smoke.spec.ts` succeeds and the file imports from `@playwright/test` — PASS
  - **Isolated**: yes — file existence and import check can be verified without running tests.
  - **Implementation note (deviation)**: no `api/health` endpoint exists in the codebase (verified by grep), so the third smoke check tests the `/signup` page instead. Final coverage: homepage renders, `/signin` form fields, `/signup` form fields.
- [x] **1.3 — Add `test:e2e:smoke` script** `[AUTO]`: add to `package.json` scripts
  - **Independent verification**: `npm run test:e2e:smoke -- --list` lists only `@smoke`-tagged tests — PASS (6 tests in 4 files)
  - **Isolated**: yes — `--list` mode does not start a dev server.

---

### Phase 2: Enhance GitHub Actions CI workflow with `@smoke` filtering

**Progress**: `[~]` — 2.1–2.2 completed & verified 2026-08-25; 2.3 push blocked (SSH passphrase, HITL)

**Layer**: CI infrastructure

**Goal**: Update the Phase 0 CI workflow to include `@smoke` tag filtering for the E2E job, so that the CI E2E run focuses on the critical smoke test subset. Also add `workflow_dispatch` trigger for manual runs.

**Files**:

- `.github/workflows/ci.yml` — modify — add `--grep @smoke` to the E2E test command, add `workflow_dispatch` trigger

**Verification gate** (must pass before Phase 3 starts):

- `.github/workflows/ci.yml` triggers on push to `uat` and `workflow_dispatch`
- `e2e-tests` job runs `npm run test:e2e -- --grep @smoke`
- `GOOGLE_APPLICATION_CREDENTIALS` temp file approach from Phase 0 is preserved
- Playwright browser cache configured via `actions/cache`
- Failure artifacts uploaded via `actions/upload-artifact`

**Isolated Test** (run this single command after Phase 2 is complete to verify in isolation):

```bash
# Verify @smoke grep was added to the E2E job
grep -q 'grep.*@smoke' .github/workflows/ci.yml && echo "PASS: @smoke grep present in CI" || echo "FAIL: @smoke grep missing from CI"

# Verify workflow_dispatch trigger was added
grep -q 'workflow_dispatch' .github/workflows/ci.yml && echo "PASS: workflow_dispatch trigger present" || echo "FAIL: workflow_dispatch trigger missing"

# Verify YAML is still valid after modifications
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml')); print('PASS: YAML valid after Phase 2 changes')"

# Verify the Phase 0 changes are preserved (no regressions)
grep -q 'GCP_CREDENTIALS_JSON' .github/workflows/ci.yml && echo "PASS: GCP credentials step preserved" || echo "FAIL: GCP credentials step lost"
grep -q 'actions/cache' .github/workflows/ci.yml && echo "PASS: cache step preserved" || echo "FAIL: cache step lost"
grep -q 'upload-artifact' .github/workflows/ci.yml && echo "PASS: artifact upload preserved" || echo "FAIL: artifact upload lost"
```

**Human-in-the-loop actions**:

- `[AUTO→HITL]` **Push to `uat` and verify CI runs `@smoke` tests only**: after committing the workflow update, push to `uat` and inspect the GitHub Actions run. Confirm the E2E job output shows only `@smoke`-tagged tests running (not the full suite). The test count in the Playwright output should match the number of `@smoke`-tagged tests.
- `[HITL]` **Test `workflow_dispatch` trigger manually**: go to the GitHub Actions tab, select the "CI" workflow, click "Run workflow", and confirm it triggers manually.

**Sub-subphase checklist**:

- [x] **2.1 — Add `@smoke` grep to E2E job** `[AUTO]`: update the `npm run test:e2e` command to `npm run test:e2e -- --grep @smoke`
  - **Independent verification**: `grep "grep.*@smoke" .github/workflows/ci.yml` returns a match — PASS; `npx playwright test --grep @smoke --list` shows exactly 6 tests in 4 files — PASS
  - **Isolated**: yes — grep verification only.
- [x] **2.2 — Add `workflow_dispatch` trigger** `[AUTO]`: add manual dispatch trigger to the workflow
  - **Independent verification**: `grep "workflow_dispatch" .github/workflows/ci.yml` returns a match — PASS; YAML parse confirms `push: [uat]` + `workflow_dispatch` triggers — PASS
  - **Isolated**: yes — grep verification only.
- [!] **2.3 — Push and verify CI runs `@smoke` subset** `[AUTO→HITL]`: commit changes and push to `uat`. Inspect the GitHub Actions run to confirm only `@smoke`-tagged tests are executed.
  - **Independent verification**: GitHub Actions E2E job output shows test count matching `@smoke` tag count
  - **Isolated**: partially — the push is automatable, but inspecting CI output requires human review.
  - **Blocker**: committed as `c260cac`; push fails with `git@github.com: Permission denied (publickey)` under `BatchMode` — SSH passphrase required (HITL, user action). Also requires GitHub Secrets (Phase 4) for auth-dependent `@smoke` tests to pass; `unit-tests` job should pass regardless.
  - **Implementation note (deviation)**: commit message records 3 extra fixes beyond the plan's 2 items — (a) `PW_SIGNUP_EMAIL` line used `>` and truncated `.env.local`, silently dropping `PW_TEST_EMAIL`/`PW_TEST_PASSWORD` (would break the `user.spec.ts` login test in the `@smoke` subset); (b) `NEXT_PUBLIC_FIREBASE_*` had `|| 'UAT-default'` fallbacks added — **REVERTED on 2026-08-25 by user decision** (repo is public; hardcoding Firebase config in the workflow leaks it). Final state: every env var in the "Create .env.local" step comes **only** from GitHub Secrets, no defaults. See Session Note 2026-08-25 22:10; (c) test-account values single-quoted to protect against shell `$` interpolation (deferred hardening from Phase 0, per Session Note 16:45).

**CI workflow reference**: canonical source is the repo file `.github/workflows/ci.yml` (HEAD `d9d9450`). The inline reference YAML previously mirrored here has been removed to avoid drift.

---

### Phase 3: Configure App Hosting rollout trigger rules

**Progress**: `[~]` — 3.1 completed & verified 2026-08-25; 3.2 blocked on Firebase Console access (HITL)

**Layer**: Firebase Console configuration (not repo code)

**Goal**: Prevent unnecessary App Hosting deploys when only test/doc files change, and set up `firebase.json` for CLI access.

**Files**:

- `firebase.json` — modify — add `apphosting` backend config
- Firebase Console (manual) — configure ignored paths

**Verification gate** (must pass before Phase 4 starts):

- `firebase.json` contains valid `apphosting` array with `backendId`, `rootDir`, `ignore`
- Firebase Console → App Hosting → Settings → Rollout triggers has Ignored Paths configured

**Isolated Test** (run this single command after Phase 3 is complete to verify in isolation):

```bash
# Verify firebase.json has apphosting config (AUTO — can verify without console access)
node -e "const f=require('./firebase.json'); if(f.apphosting && f.apphosting[0] && f.apphosting[0].backendId) { console.log('PASS: apphosting config present, backendId=' + f.apphosting[0].backendId) } else { console.log('FAIL: apphosting config missing') }"

# Verify ignore patterns are set
node -e "const f=require('./firebase.json'); const ig=f.apphosting?.[0]?.ignore||[]; if(ig.includes('e2e') && ig.includes('__tests__')) { console.log('PASS: ignore patterns include e2e and __tests__') } else { console.log('FAIL: ignore patterns missing e2e/__tests__') }"
```

> **Note**: The Firebase Console ignored-paths configuration (sub-subphase 3.2) is a `[HITL]` action and cannot be verified from the command line. It requires pushing a test-only commit and observing the App Hosting rollout status in the Firebase Console.

**Human-in-the-loop actions**:

- `[HITL]` **Configure Ignored Paths in Firebase Console**: navigate to Firebase Console → App Hosting → Settings → Rollout triggers → Ignored Paths. Set the following paths: `e2e/**, __tests__/**, docs/**, *.md, .github/**, scripts/**, spec_kanban/**, ai_oriented_kanban/**`
- `[HITL]` **Verify App Hosting skips test-only commits**: push a commit that only touches files in `e2e/` or `__tests__/` to the `uat` branch. Then check the Firebase Console → App Hosting → Rollouts to confirm the status is `SKIPPED` (not `DEPLOYED`). This confirms the ignored paths are working.

**Sub-subphase checklist**:

- [x] **3.1 — Add `apphosting` config to `firebase.json`** `[AUTO]`:

  ```json
  {
    "apphosting": [
      {
        "backendId": "certifai-app",
        "rootDir": ".",
        "ignore": ["node_modules", ".git", "firebase-debug.log", "e2e", "__tests__"]
      }
    ]
  }
  ```

  - **Independent verification**: `node -e "JSON.parse(require('fs').readFileSync('firebase.json','utf8'))"` parses — PASS; plan isolated tests (backendId + ignore patterns incl. `e2e`/`__tests__`) — PASS (committed with this phase)
  - **Isolated**: yes — JSON validation only, no console access needed.

- [!] **3.2 — Configure Ignored Paths in Firebase Console** `[HITL]`: set `e2e/**, __tests__/**, docs/**, *.md, .github/**, scripts/**, spec_kanban/**, ai_oriented_kanban/**`
  - **Independent verification**: push a test-only commit and confirm App Hosting rollout status is `SKIPPED`
  - **Isolated**: no — requires Firebase Console access and a push to `uat` to verify.
  - **Prerequisite**: `firebase.json` config from 3.1 must be committed first (the console config and the JSON config should be consistent).
  - **Blocker**: requires manual Firebase Console access (HITL) — cannot be completed by code. Unblocks Phase 4.

---

### Phase 4: Provision test credentials in Secret Manager + GitHub Secrets

**Progress**: `[~]` — 4.4 local validation done & verified 2026-08-25; 4.1–4.3 pending (HITL, blocked on console access)

**Layer**: infrastructure / secrets (requires console access — may be blocked)

**Goal**: Ensure `PW_TEST_EMAIL`, `PW_TEST_PASSWORD`, and `GCP_CREDENTIALS_JSON` exist and are correctly formatted in all environments. **No fallback values anywhere in CI** — every env var the workflow needs must come from GitHub Secrets (public repo).

**Files**:

- No repo files — Google Cloud Secret Manager, GitHub Secrets (manual)

**Verification gate** (must pass before Phase 5 starts):

- `gcloud secrets describe PW_TEST_EMAIL --project=certifai-uat` returns valid — pending (HITL)
- `gcloud secrets describe PW_TEST_PASSWORD --project=certifai-uat` returns valid — pending (HITL)
- All 15 GitHub repo secrets (table below) are set — pending (HITL)
- `GCP_CREDENTIALS_JSON` GitHub Secret contains valid JSON (the full service account key JSON, not a file path) — local half DONE (verified 2026-08-25); CI half pending

**Isolated Test** (run this single command after Phase 4 is complete to verify in isolation):

```bash
# Verify Cloud Secret Manager secrets exist (requires gcloud CLI auth — NOT installed locally as of 2026-08-25)
gcloud secrets describe PW_TEST_EMAIL --project=certifai-uat > /dev/null 2>&1 && echo "PASS: PW_TEST_EMAIL exists in Secret Manager" || echo "FAIL: PW_TEST_EMAIL missing from Secret Manager"
gcloud secrets describe PW_TEST_PASSWORD --project=certifai-uat > /dev/null 2>&1 && echo "PASS: PW_TEST_PASSWORD exists in Secret Manager" || echo "FAIL: PW_TEST_PASSWORD missing from Secret Manager"

# Verify GCP_CREDENTIALS_JSON format locally — DONE 2026-08-25 (see below; use the real local key file)
python3 -c "
import json, sys
try:
    with open('gcp_credentials.json') as f:
        data = json.load(f)
    if data.get('type') == 'service_account' and 'project_id' in data:
        print('PASS: GCP credentials JSON is valid, project_id=' + data['project_id'])
    else:
        print('FAIL: JSON does not look like a service account key')
except Exception as e:
    print('FAIL: cannot parse credentials JSON: ' + str(e))
"
```

> **Note**: GitHub Secrets cannot be verified from the command line. You must inspect them in the GitHub repo Settings → Secrets and variables → Actions. The existence of the secrets in the CI run output (no "secret not found" errors) is the indirect verification.

**Human-in-the-loop actions**:

This phase is **entirely HITL** — every sub-subphase requires manual access to an external system.

- `[HITL]` **Create Firebase test user accounts**: sign in to Firebase Console → Authentication → Users. Create test users in the UAT project (`certifai-uat`): `pw_test_uat@certestic.com` (used by `PW_TEST_EMAIL` — login/exam tests) and `pw_test_signup@certestic.com` (used by `PW_SIGNUP_EMAIL` — signup lifecycle test), each with a known password.
- `[HITL]` **Store credentials in Cloud Secret Manager**: use `gcloud` CLI commands (requires auth) to create `PW_TEST_EMAIL` and `PW_TEST_PASSWORD` secrets in the `certifai-uat` project. Note: `gcloud` is **not installed** on the dev machine as of 2026-08-25 — either install the Google Cloud SDK (`brew install google-cloud-sdk`) or create the secrets via the Cloud Console UI (Secret Manager).
- `[HITL]` **Add GitHub Secrets**: navigate to GitHub repo → Settings → Secrets and variables → Actions → New repository secret. **Every env var referenced by the "Create .env.local" / "Write GCP credentials" steps must be added — the workflow has NO fallback values** (public repo — no Firebase config hardcoded in the workflow). Full required list below.
- `[HITL]` **Verify `GCP_CREDENTIALS_JSON` format**: after adding the GitHub Secret, trigger a CI run (via `workflow_dispatch` or push to `uat`) and confirm the E2E job's credential-writing step succeeds (no "invalid JSON" error in the logs).

**GitHub Secrets — complete required list** (all 15, sourced from the existing `apphosting.uat.yaml` entries / Firebase Console — values are **not** repeated here to keep the public repo clean):

| Secret | Purpose | Value source |
| ------ | ------- | ------------ |
| `PW_TEST_EMAIL` | E2E login/exam test account | Firebase Console → Authentication (created in 4.1) |
| `PW_TEST_PASSWORD` | E2E login/exam test account password | Set in 4.1 |
| `PW_SIGNUP_EMAIL` | E2E signup lifecycle test account | Firebase Console → Authentication (created in 4.1) |
| `PW_SIGNUP_PASSWORD` | E2E signup lifecycle test account password | Set in 4.1 |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web SDK config — required or dev server crashes (`auth/invalid-api-key`) | `apphosting.uat.yaml` / Firebase Console → Project settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Same | Same |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Same | Same |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Same | Same |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Same | Same |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Same | Same |
| `NEXT_PUBLIC_SERVER_API_URL` | Backend API endpoint for the web app | `apphosting.uat.yaml` |
| `NEXT_PUBLIC_HOST_URL` | UAT site URL | `apphosting.uat.yaml` |
| `SERVICE_SECRET` | Server-side secret | Cloud Secret Manager / existing UAT env |
| `JOSE_JWT_SECRET` | JWT signing secret | Cloud Secret Manager / existing UAT env |
| `GCP_CREDENTIALS_JSON` | **Full JSON content** of `gcp_credentials.json` (service account key, not a file path) — written to `/tmp/gcp_cred.json` in CI | `gcp_credentials.json` (gitignored, local) |

**Sub-subphase checklist**:

- [ ] **4.1 — Create Firebase test user accounts** `[HITL]`: `pw_test_uat@certestic.com` in UAT
  - **Independent verification**: can sign in to Firebase Auth with test credentials
  - **Isolated**: no — requires Firebase Console access.
- [ ] **4.2 — Store credentials in Cloud Secret Manager** `[HITL]`:

  ```bash
  gcloud secrets create PW_TEST_EMAIL --data-file=- --project=certifai-uat <<< "pw_test_uat@certestic.com"
  gcloud secrets create PW_TEST_PASSWORD --data-file=- --project=certifai-uat <<< "password_here"
  ```

  - **Independent verification**: `gcloud secrets describe PW_TEST_EMAIL --project=certifai-uat` succeeds
  - **Isolated**: no — requires `gcloud` CLI auth and Cloud Console access.

- [ ] **4.3 — Add GitHub Secrets** `[HITL]`: all 15 secrets from the table above (no fallbacks — every var must be provided)
  - `GCP_CREDENTIALS_JSON` must contain the **full JSON content** of the service account key file (not the file path). This JSON is written to `/tmp/gcp_cred.json` in the CI workflow, and `GOOGLE_APPLICATION_CREDENTIALS` is set to that file path.
  - **Independent verification**: GitHub repo settings → Secrets shows all keys
  - **Isolated**: no — requires GitHub repo Settings access.
- [x] **4.4 — Verify `GCP_CREDENTIALS_JSON` format** `[AUTO→HITL]`: local validation completed 2026-08-25 — `gcp_credentials.json` parses as valid JSON, `type: service_account`, `project_id: certifai-uat`, all required keys present (`private_key`, `client_email`, `client_id`, ...). Remaining HITL half: confirm the GitHub Secret (added in 4.3) writes cleanly to `/tmp/gcp_cred.json` and `firebaseAdminConfig.ts` loads without `SyntaxError` in a CI run.
  - **Independent verification (local, done)**: python JSON validation of `gcp_credentials.json` — PASS (service_account, project_id=certifai-uat)
  - **Independent verification (CI, pending)**: trigger CI and confirm no "invalid JSON" error in the credential-writing step
  - **Isolated**: local part yes (file exists + parses); CI part requires a push/`workflow_dispatch`.

---

### Phase 5: Update pre-flight script for CI compatibility

**Progress**: `[x]` — completed & verified 2026-08-26

**Layer**: scripts

**Goal**: Update `e2e-pre-flight.sh` for CI compatibility. The `e2e-post-deployment.sh` and `wait-for-service.sh` scripts are deprecated (post-deploy step eliminated) but kept for historical reference — they are no longer called by CI.

**Files**:

- `scripts/e2e-pre-flight.sh` — modify — remove manual dev server startup (Playwright `webServer` config handles it)
- `scripts/e2e-post-deployment.sh` — no change (deprecated, not called by CI)
- `scripts/wait-for-service.sh` — no change (deprecated, not called by CI)

**Verification gate** (must pass before Phase 6 starts):

- `e2e-pre-flight.sh` does NOT start `npm run dev` manually
- `e2e-pre-flight.sh` is executable (`chmod +x`)
- `e2e-post-deployment.sh` and `wait-for-service.sh` are not referenced in `.github/workflows/ci.yml`

**Isolated Test** (run this single command after Phase 5 is complete to verify in isolation):

```bash
# Verify e2e-pre-flight.sh no longer starts dev server manually
grep -q "npm run dev" scripts/e2e-pre-flight.sh && echo "FAIL: still starts dev server manually" || echo "PASS: no manual dev server startup"

# Verify scripts are executable
ls -la scripts/*.sh | grep -q 'rwx' && echo "PASS: scripts are executable" || echo "FAIL: scripts not executable"

# Verify deprecated scripts are NOT referenced in CI workflow
grep -q "e2e-post-deployment" .github/workflows/ci.yml && echo "FAIL: e2e-post-deployment.sh still referenced in CI" || echo "PASS: e2e-post-deployment.sh not referenced in CI"
grep -q "wait-for-service" .github/workflows/ci.yml && echo "FAIL: wait-for-service.sh still referenced in CI" || echo "PASS: wait-for-service.sh not referenced in CI"

# Verify the pre-flight script still runs (syntax check)
bash -n scripts/e2e-pre-flight.sh && echo "PASS: e2e-pre-flight.sh syntax valid" || echo "FAIL: syntax error in e2e-pre-flight.sh"
```

**Human-in-the-loop actions**:

- None required for this phase. All changes are code-only `[AUTO]`.
- Optional `[AUTO→HITL]`: run the updated `e2e-pre-flight.sh` locally to verify it works end-to-end. This requires a running dev server (handled by Playwright's `webServer` config).

**Sub-subphase checklist**:

- [x] **5.1 — Update `e2e-pre-flight.sh`** `[AUTO]`: remove the `npm run dev > /tmp/next-dev.log 2>&1 &` block and the wait loop — Playwright config's `webServer` handles this. Also remove the `kill $DEV_PID` cleanup block.
  - **Independent verification**: `grep "npm run dev" scripts/e2e-pre-flight.sh` returns no match — PASS
  - **Isolated**: yes — grep verification only.
- [x] **5.2 — Make scripts executable** `[AUTO]`: `chmod +x scripts/*.sh`
  - **Independent verification**: `ls -la scripts/*.sh` shows `+x` permission — PASS (all 3 scripts `-rwxr-xr-x`)
  - **Isolated**: yes — filesystem check only.
- [x] **5.3 — Verify deprecated scripts are not referenced** `[AUTO]`: confirm `e2e-post-deployment.sh` and `wait-for-service.sh` are not called in the CI workflow
  - **Independent verification**: `grep -E "e2e-post-deployment|wait-for-service" .github/workflows/ci.yml` returns no match — PASS
  - **Isolated**: yes — grep verification only.

---

### Phase 6: Local dev parity & docs

**Progress**: `[ ]`

**Layer**: documentation + local config

**Goal**: Document local setup so team members can run E2E tests locally, including the macOS 11 workaround and the `gcp_credentials.json` local setup.

**Files**:

- `e2e/instructions.md` — modify — add macOS 11 Chromium workaround section + local `gcp_credentials.json` setup
- `.env.local.example` — create — document all required env vars with correct format hints
- `docs/testing/strategy.md` — modify — add CI pipeline section: parallel App Hosting + GitHub Actions model, `@smoke` tag convention, `uat`-branch trigger

**Verification gate** (must pass before Phase 7 starts):

- `e2e/instructions.md` has a "macOS 11 (Big Sur)" section documenting `channel: 'chrome'`
- `e2e/instructions.md` has a section on local `GOOGLE_APPLICATION_CREDENTIALS` setup (file path vs JSON string)
- `.env.local.example` lists all env vars from `apphosting.yaml` with format notes
- `docs/testing/strategy.md` has a "CI Pipeline" section

**Isolated Test** (run this single command after Phase 6 is complete to verify in isolation):

```bash
# Verify .env.local.example exists and documents key env vars
test -f .env.local.example && echo "PASS: .env.local.example exists" || echo "FAIL: .env.local.example missing"
grep -q 'GOOGLE_APPLICATION_CREDENTIALS' .env.local.example && echo "PASS: GOOGLE_APPLICATION_CREDENTIALS documented" || echo "FAIL: GOOGLE_APPLICATION_CREDENTIALS not in .env.local.example"
grep -q 'PW_TEST_EMAIL' .env.local.example && echo "PASS: PW_TEST_EMAIL documented" || echo "FAIL: PW_TEST_EMAIL not in .env.local.example"

# Verify e2e/instructions.md has macOS 11 and gcp_cred sections
grep -q "channel.*chrome" e2e/instructions.md && echo "PASS: macOS 11 workaround documented" || echo "FAIL: macOS 11 workaround missing"
grep -q "gcp_cred" e2e/instructions.md && echo "PASS: gcp_credentials setup documented" || echo "FAIL: gcp_credentials setup missing"

# Verify docs/testing/strategy.md has CI Pipeline section
grep -q "CI Pipeline" docs/testing/strategy.md && echo "PASS: CI Pipeline section present" || echo "FAIL: CI Pipeline section missing"
grep -q "Last reviewed" docs/testing/strategy.md && echo "PASS: Last reviewed date present" || echo "FAIL: Last reviewed date missing"
```

**Human-in-the-loop actions**:

- None required for this phase. All changes are documentation `[AUTO]`.
- Optional `[HITL]`: review the docs for accuracy after writing — ensure the `GOOGLE_APPLICATION_CREDENTIALS` format description matches your actual local setup.

**Sub-subphase checklist**:

- [ ] **6.1 — Create `.env.local.example`** `[AUTO]`: list all env vars from `apphosting.yaml`; for `GOOGLE_APPLICATION_CREDENTIALS`, note it should be a file path locally (e.g., `./gcp_cred.json`) and a JSON string in Secret Manager / GitHub Secrets
  - **Independent verification**: file exists and mentions `GOOGLE_APPLICATION_CREDENTIALS`
  - **Isolated**: yes — file existence and grep check only.
- [ ] **6.2 — Update `e2e/instructions.md`** `[AUTO]`: add macOS 11 workaround, document `channel: 'chrome'` guard, add section on local `gcp_credentials.json` setup (place the service account JSON file at the path specified in `GOOGLE_APPLICATION_CREDENTIALS`)
  - **Independent verification**: `grep "channel.*chrome" e2e/instructions.md` returns a match; `grep "gcp_cred" e2e/instructions.md` returns a match
  - **Isolated**: yes — grep verification only.
- [ ] **6.3 — Update `docs/testing/strategy.md`** `[AUTO]`: add CI pipeline section covering parallel App Hosting + GitHub Actions model, `@smoke` convention, `uat`-branch trigger, no post-deploy step
  - **Independent verification**: `grep "CI Pipeline" docs/testing/strategy.md` returns a match; `Last reviewed:` date updated
  - **Isolated**: yes — grep verification only.

## Post-task phases

### Phase 7: User-journey sync _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: documentation layer

**Goal**: No user-facing feature stories or journey changes shipped in this rollout — it's CI/CD infrastructure.

**Pre-condition check**:

- This rollout adds test infrastructure, not user-facing features. No user journey changes.

**Verification gate** _(if phase is executed)_:

- N/A — skipped: no user-journey updates needed.

**Isolated Test**:

```bash
# Verify this phase is correctly marked as skipped
echo "PASS: no user-journey changes — CI infrastructure rollout"
```

**Human-in-the-loop actions**:

- None — this phase is skipped.

**Sub-subphase checklist**:

- [ ] **7.0 — Skip** `[AUTO]`: mark `[!]` with note "skipped: no user-journey updates needed — CI infrastructure rollout"
  - **Independent verification**: phase is marked `[!]` with skip justification
  - **Isolated**: yes — documentation check only.

---

### Phase 8: Docs Sync _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: documentation layer

**Goal**: Ensure all docs listed in `## Docs Impact` are created or updated.

**Pre-condition check**:

- Review `## Docs Impact` section. Docs to update: `docs/testing/strategy.md`, `e2e/instructions.md`. Docs to create: `.env.local.example`.

**Files**:

- `docs/testing/strategy.md` — modify — CI pipeline section added in Phase 6.3
- `e2e/instructions.md` — modify — macOS 11 workaround + gcp_credentials setup added in Phase 6.2
- `.env.local.example` — create — created in Phase 6.1

**Verification gate**:

- `docs/testing/strategy.md` has updated `Last reviewed:` date and CI Pipeline section
- `e2e/instructions.md` has macOS 11 workaround section and gcp_credentials setup section
- `.env.local.example` exists and documents `GOOGLE_APPLICATION_CREDENTIALS` format
- `grep -r "TODO\|FIXME\|TBD" docs/testing/strategy.md` returns no unresolved placeholders

**Isolated Test**:

```bash
# Verify all docs from Docs Impact are in the correct state
test -f .env.local.example && echo "PASS: .env.local.example exists" || echo "FAIL: .env.local.example missing"
grep -q "CI Pipeline" docs/testing/strategy.md && echo "PASS: strategy.md has CI Pipeline section" || echo "FAIL: strategy.md missing CI Pipeline section"
grep -q "macOS 11" e2e/instructions.md && echo "PASS: instructions.md has macOS 11 section" || echo "FAIL: instructions.md missing macOS 11 section"
grep -q "gcp_cred" e2e/instructions.md && echo "PASS: instructions.md has gcp_cred section" || echo "FAIL: instructions.md missing gcp_cred section"
grep -rE "TODO|FIXME|TBD" docs/testing/strategy.md && echo "WARN: unresolved placeholders found" || echo "PASS: no unresolved placeholders in strategy.md"
```

**Human-in-the-loop actions**:

- `[HITL]` **Review docs for accuracy**: manually read through the updated docs to ensure they match the actual implementation. Specifically verify that the `GOOGLE_APPLICATION_CREDENTIALS` format description is correct for both local and CI environments.

**Sub-subphase checklist**:

- [ ] **8.1 — Confirm docs-first retrieval checklist** `[AUTO]`: verify checklist is completed
  - **Independent verification**: checklist is not blank
  - **Isolated**: yes — document review only.
- [ ] **8.2 — Verify created docs exist** `[AUTO]`: `.env.local.example` exists with correct format hints
  - **Independent verification**: `test -f .env.local.example` succeeds
  - **Isolated**: yes — file existence check only.
- [ ] **8.3 — Verify updated docs have fresh `Last reviewed:` date** `[AUTO]`: `docs/testing/strategy.md` updated
  - **Independent verification**: `grep "Last reviewed" docs/testing/strategy.md` shows today's date
  - **Isolated**: yes — grep check only.
- [ ] **8.4 — Update `docs/ai/assistant-context-index.md`** `[AUTO]`: no new docs added to `docs/` — skip
  - **Independent verification**: N/A
  - **Isolated**: yes — N/A (skipped).

---

### Phase 9: AI-ready docs reflection and next-plan handoff _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: planning/documentation improvement layer

**Goal**: Capture lessons from executing this rollout and identify follow-up improvements.

**Files**:

- `ai_oriented_kanban/10-plan/playwright-firebase-deploy-integration.md` — modify — add session note with reflections

**Verification gate**:

- At least one confirmed improvement is identified
- Any open questions have owners or decision criteria

**Isolated Test**:

```bash
# Verify session note with reflections exists in the plan doc
grep -q "Session Note" ai_oriented_kanban/10-plan/playwright-firebase-deploy-integration.md && echo "PASS: session note present" || echo "FAIL: session note missing"
grep -q "confirmed improvement" ai_oriented_kanban/10-plan/playwright-firebase-deploy-integration.md && echo "PASS: improvement identified" || echo "FAIL: no improvement identified"
```

**Human-in-the-loop actions**:

- `[HITL]` **Review and confirm improvements**: manually review the execution experience and identify at least one concrete improvement for future rollouts. This requires human judgment about what worked well and what didn't.
- `[HITL]` **Assign owners to open questions**: review the Open Questions section and ensure each has a named owner and decision criteria.

**Sub-subphase checklist**:

- [ ] **9.1 — Summarize confirmed improvements** `[HITL]`: extract what worked, what to improve
  - **Independent verification**: improvement list is non-empty
  - **Isolated**: no — requires human judgment.
- [ ] **9.2 — Record open questions** `[HITL]`: e.g., should CI also run on PRs to `uat`? Should we add a `main`-branch CI gate later?
  - **Independent verification**: each question has a decision owner or revisit condition
  - **Isolated**: no — requires human judgment.

---

### Phase 10: Docs-only Simulation Drill _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: validation/reproducibility layer

**Goal**: Prove a comparable CI integration task can be completed from docs alone.

**Pre-condition check**:

- Confirm Phase 8 (Docs Sync) is complete.

**Verification gate**:

- `docs/testing/strategy.md` CI Pipeline section contains enough detail to reproduce the setup
- A reader can determine: what the 2 CI jobs do, how App Hosting and CI run in parallel, what `@smoke` means, how `GOOGLE_APPLICATION_CREDENTIALS` is handled in CI

**Isolated Test**:

```bash
# Verify the docs contain enough detail to reproduce the setup
grep -q "parallel" docs/testing/strategy.md && echo "PASS: parallel model documented" || echo "FAIL: parallel model not documented"
grep -q "@smoke" docs/testing/strategy.md && echo "PASS: @smoke convention documented" || echo "FAIL: @smoke convention not documented"
grep -q "GOOGLE_APPLICATION_CREDENTIALS" docs/testing/strategy.md && echo "PASS: credential handling documented" || echo "FAIL: credential handling not documented"
grep -q "uat" docs/testing/strategy.md && echo "PASS: uat trigger documented" || echo "FAIL: uat trigger not documented"
```

**Human-in-the-loop actions**:

- `[HITL]` **Execute the simulation drill**: manually attempt to set up CI for a new Next.js + App Hosting project using only the docs as a guide. Record what was sufficient vs. insufficient. This requires human judgment and a fresh project context.
- `[HITL]` **Evaluate docs sufficiency**: after the drill, assess whether the docs contained enough detail. If not, document the gaps and assign remediation owners.

**Sub-subphase checklist**:

- [ ] **10.1 — Define simulation scenario** `[HITL]`: "Set up CI for a new Next.js + App Hosting project based on `docs/testing/strategy.md`"
  - **Independent verification**: scenario references canonical docs
  - **Isolated**: no — requires human execution.
- [ ] **10.2 — Execute and record** `[HITL]`: run the scenario, record what was sufficient vs insufficient
  - **Independent verification**: run log captured
  - **Isolated**: no — requires human execution.

---

### Phase 11: Rollout Eval & Health Score _(mandatory closing phase)_

**Progress**: `[ ]`

**Layer**: rollout quality/evaluation layer

**Goal**: Produce a rollout health score.

**Scoring rubric**:

| Dimension            | Max Points | How scored                                                     |
| -------------------- | ---------- | -------------------------------------------------------------- |
| Docs-first adherence | 40         | Docs-First Retrieval Checklist completed, sufficiency assessed |
| Docs health          | 40         | All Docs Sync verification gates passed                        |
| Reflection quality   | 20         | At least one confirmed improvement, open questions have owners |
| Simulation readiness | 20         | Drill evidence exists                                          |
| **Total**            | **120**    | Pass threshold: `>= 85`                                        |

**Isolated Test**:

```bash
# Verify scoring rubric and session note exist
grep -q "Scoring rubric" ai_oriented_kanban/10-plan/playwright-firebase-deploy-integration.md && echo "PASS: scoring rubric present" || echo "FAIL: scoring rubric missing"
grep -q "Session Note" ai_oriented_kanban/10-plan/playwright-firebase-deploy-integration.md && echo "PASS: session note present" || echo "FAIL: session note missing"
```

**Human-in-the-loop actions**:

- `[HITL]` **Evaluate each scoring dimension**: manually review the checklist, docs health, reflection quality, and simulation drill results. Assign points per the rubric. This requires human judgment.
- `[HITL]` **Record final score**: write the score breakdown and archive gate decision (pass ≥85 / hold <85) as a session note.

**Sub-subphase checklist**:

- [ ] **11.1 — Evaluate docs-first adherence** `[HITL]`: review checklist completion
  - **Independent verification**: checklist is complete and sufficiency is explicitly marked
  - **Isolated**: no — requires human review.
- [ ] **11.2 — Evaluate docs health** `[HITL]`: review Docs Sync gate results
  - **Independent verification**: every docs gate is pass, justified block, or justified skip
  - **Isolated**: no — requires human review.
- [ ] **11.3 — Evaluate reflection + simulation quality** `[HITL]`: review handoff outputs
  - **Independent verification**: at least one confirmed improvement, owner/criteria for open questions, and simulation run evidence exists
  - **Isolated**: no — requires human review.
- [ ] **11.4 — Record final score session note** `[HITL]`: write score breakdown and final recommendation
  - **Independent verification**: session note includes total score and archive gate decision (`>= 85` pass / `< 85` hold)
  - **Isolated**: no — requires human judgment.

## Dependency Graph

```text
credentials fix + minimal CI (Phase 0: gcp_credentials.json fix + .github/workflows/ci.yml)
  ↓
test files (Phase 1: @smoke tags + smoke.spec.ts)
  ↓
CI infra (Phase 2: enhance workflow with @smoke filtering)
  ↓                                ↓
App Hosting config (Phase 3)    secrets (Phase 4)
  ↓                                ↓
                 scripts (Phase 5: pre-flight cleanup)
                       ↓
                 docs (Phase 6: local parity + strategy doc)
                       ↓
                 post-task phases (7–11)
```

## Suggested Implementation Order

1. Phase 0 (minimal CI + gcp_credentials fix — unblocks CI immediately)
2. Phase 1 (tag smoke tests — enables `@smoke` filtering)
3. Phase 2 (enhance CI workflow with `@smoke` grep)
4. Phase 4 (secrets — may be blocked on console access; can proceed in parallel with Phase 3)
5. Phase 3 (App Hosting config — can be done anytime)
6. Phase 5 (pre-flight script cleanup — depends on 0+2)
7. Phase 6 (docs — depends on all above)

> Phase 0 must come first — it fixes the credential loading issue and creates the minimal CI workflow. Phases 1 and 2 build on Phase 0. Phase 4 (secrets) may be blocked on console access but the `GCP_CREDENTIALS_JSON` GitHub Secret is needed for Phase 0's CI to fully work. Phase 3 is independent. Phase 5 depends on 0+2. Phase 6 depends on 5.

## Phase Isolation Matrix

> This matrix shows which phases can be tested in complete isolation (without any later phase being complete) and which require prerequisites.

| Phase | Can be tested in isolation?                                      | Prerequisites                                                     | Isolated test command location   |
| ----- | ---------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------- |
| 0     | Yes (code) / Partial (CI run)                                    | None                                                              | Phase 0 → Isolated Test section  |
| 1     | Yes                                                              | Phase 0 (for CI verification only; local grep tests need nothing) | Phase 1 → Isolated Test section  |
| 2     | Yes (code) / Partial (CI run)                                    | Phase 0 + Phase 1                                                 | Phase 2 → Isolated Test section  |
| 3     | Partial — `firebase.json` is isolated; Console config needs push | Phase 0 (for push verification)                                   | Phase 3 → Isolated Test section  |
| 4     | No — entirely HITL                                               | Phase 0 (CI must exist to verify secrets work)                    | Phase 4 → Isolated Test section  |
| 5     | Yes                                                              | Phase 0 + Phase 2 (CI workflow must exist)                        | Phase 5 → Isolated Test section  |
| 6     | Yes                                                              | All prior phases (docs describe prior work)                       | Phase 6 → Isolated Test section  |
| 7     | Yes (skipped)                                                    | N/A                                                               | Phase 7 → Isolated Test section  |
| 8     | Yes                                                              | Phase 6 (docs must be written first)                              | Phase 8 → Isolated Test section  |
| 9     | No — HITL                                                        | Phase 8                                                           | Phase 9 → Isolated Test section  |
| 10    | No — HITL                                                        | Phase 8                                                           | Phase 10 → Isolated Test section |
| 11    | No — HITL                                                        | Phase 8 + 9 + 10                                                  | Phase 11 → Isolated Test section |

## Progress Checks (Resume-at-any-time protocol)

At the end of each working session:

1. Update **Progress Dashboard** and active phase `Progress` marker.
2. Mark sub-subphase `[x]` only after independent verification passes.
3. Add a short session note with timestamp, last completed step, next step, and blockers.
4. If blocked, mark item `[!]` and record unblock dependency.

### Session Note Template

```markdown
### Session Note — <YYYY-MM-DD HH:mm local>

- Completed: <phase.subphase>
- Verified by: <command/test/QA>
- Next: <phase.subphase>
- Blockers: <none | details>
- HITL actions pending: <list any human-in-the-loop actions not yet completed>
```

### Session Note — 2026-08-24 16:45 local

- Completed: Phase 0.1–0.4 (AUTO steps), plus a discovered blocker fix
- Verified by:
  - Credential loading logic — node simulation of all 4 branches (absolute path / JSON string / missing relative file / existing relative file): all PASS
  - `.github/workflows/ci.yml` — `yaml.safe_load` PASS; greps for `uat` trigger, `unit-tests`, `e2e-tests`, `GCP_CREDENTIALS_JSON`, `actions/cache`, `upload-artifact`, `ms-playwright` all PASS
  - `npx tsc --noEmit` — `firebaseAdminConfig.ts` clean (was `TS2345: unknown not assignable to ServiceAccount`; fixed by typing `serviceAccount: ServiceAccount` imported from `firebase-admin/app`)
  - `npm run test` — 5 suites / 55 tests PASS
- Next: Phase 0.5 — commit + push to `uat`, observe GitHub Actions run
- Blockers: none for code; GitHub Secrets (`GCP_CREDENTIALS_JSON`, `PW_TEST_EMAIL`, `PW_TEST_PASSWORD`) not yet provisioned (Phase 4) — E2E job will fail on secrets until then, expected
- HITL actions pending: push to `uat` and observe CI; provision GitHub Secrets (Phase 4)

**Discovered blocker (fixed this session)**: `npm run test` failed 5/5 suites with `TS5101` (baseUrl deprecated) + `TS5107` (moduleResolution=node10) under TypeScript 6.0.3 — pre-existing, independent of Phase 0 changes (verified by stashing). Fix: added `"ignoreDeprecations": "6.0"` to `tsconfig.json` compilerOptions and to the ts-jest inline tsconfig in `jest.config.js`. This was required for the Phase 0 verification gate ("unit-tests job runs `npm run test`"). Files touched beyond the original Phase 0 list: `tsconfig.json`, `jest.config.js`.

**Other pre-existing findings (not fixed, not blockers)**:

- `__tests__/use-demo-credentials-reveal.test.tsx` lines 201–202: `TS2339 Property ... does not exist on type 'never'` — TS6 control-flow narrowing on `latestSnapshot` after closure reassignment. Jest passes (ts-jest `isolatedModules` skips type check); `next build` ignores test files (verified in `node_modules/next/dist/lib/typescript/runTypeCheck.js` regex filtering); no CI job runs `tsc`. Left as-is, out of Phase 0 scope.
- `ci.yml` robustness hardening (deferred): `echo "PW_TEST_EMAIL=${{ secrets.PW_TEST_EMAIL }}"` could break if a secret contains `$` — acceptable for the plan-defined test password; revisit in Phase 2.

### Session Note — 2026-08-24 21:55 local

- Completed: Phase 0.5 follow-up — fixed CI e2e failure `auth/invalid-api-key`
- Verified by: root cause analysis (`src/firebase/firebaseWebConfig.ts` requires 6 `NEXT_PUBLIC_FIREBASE_*` vars; CI `.env.local` lacked them) + YAML re-validation
- Next: re-push to `uat` and observe CI e2e job (user action, SSH passphrase); then hold — Phase 1 deferred per user instruction
- Blockers: none for the fix itself; `PW_TEST_EMAIL` / `PW_TEST_PASSWORD` / `GCP_CREDENTIALS_JSON` GitHub Secrets still unverified (Phase 4) — e2e auth-dependent tests may fail after this fix until provisioned
- HITL actions pending: push to `uat`; (optional) add 6 `NEXT_PUBLIC_FIREBASE_*` GitHub Secrets only if CI must target a non-UAT project

**Root cause (fixed)**: `FirebaseError: auth/invalid-api-key` at `firebaseWebConfig.ts:16` — the CI-generated `.env.local` contained only `PW_TEST_EMAIL` / `PW_TEST_PASSWORD`, so `initializeApp({ apiKey: undefined })` crashed the dev server at startup. Fix in `.github/workflows/ci.yml` "Create .env.local": write the 6 web-config vars from GitHub Secrets, plus `NEXT_PUBLIC_FIREBASE_BACKEND_URL=http://127.0.0.1:3000` (local dev server). **(Note: an intermediate version of this fix used UAT defaults copied from `apphosting.uat.yaml` as fallbacks — those were REVERTED on 2026-08-25 because the repo is public and hardcoding Firebase config leaks it. The workflow now reads GitHub Secrets only; see Session Note 2026-08-25 22:10.)** Also created `.env.local.example`, added "CI Pipeline" section to `docs/testing/strategy.md`, added "CI Environment & Required Variables" section to `e2e/instructions.md`, and synced Phase 0/Phase 2 reference YAMLs in this doc.

**User decision**: hold — do not proceed to Phase 1 for now.

### Session Note — 2026-08-24 22:45 local

- Completed: Phase 1 (1.1–1.3) — hold lifted, user requested Phase 1 completion
- Verified by:
  - `npm run test:e2e:smoke -- --list` — lists exactly 6 `@smoke` tests across 4 spec files (demo-credentials-consent, exam, smoke, user) — PASS
  - `npx playwright test e2e/smoke.spec.ts` — 3/3 passed (12.7s) after fixing a strict-mode bug in the signup test
  - Greps: `@smoke` present in all 4 spec files; `test:e2e:smoke` script present in `package.json`; `e2e/smoke.spec.ts` imports `@playwright/test` — all PASS
- Next: Phase 2 — enhance CI workflow with `@smoke` filtering + `workflow_dispatch` (pending user go-ahead)
- Blockers: none for Phase 1. GitHub Secrets (`GCP_CREDENTIALS_JSON`, `PW_TEST_EMAIL`, `PW_TEST_PASSWORD`) still unverified (Phase 4) — CI E2E auth-dependent tests (`user.spec.ts` @integration @smoke) will fail until provisioned; the 3 `smoke.spec.ts` health checks do not need credentials.
- HITL actions pending: push to `uat` + observe CI (Phase 0.5); provision GitHub Secrets (Phase 4)

**Bug fixed this session**: `e2e/smoke.spec.ts` "signup page loads with form fields" failed with strict-mode violation — `page.locator('input[type="password"]')` resolved to 2 elements (`#password` and `#confirmPassword`) on `/signup`. Fixed by switching to id-based locators (`input#password`, `input#confirmPassword`), mirroring the signin test's id-based pattern.

**Implementation deviations recorded (vs. plan)**:
1. `demo-credentials-consent.spec.ts` — plan targeted the "requires click to reveal" test, but it is `test.skip`'d; `@smoke` was added to the runnable signup reveal-on-click test instead (else `--grep @smoke` would never run it).
2. `smoke.spec.ts` — plan called for an API health endpoint check, but no `api/health` route exists in the codebase; the third check tests `/signup` form fields instead. Coverage: homepage, `/signin`, `/signup`.

### Session Note — 2026-08-25 14:10 local

- Completed: Phase 2 (2.1 + 2.2); 2.3 blocked on SSH passphrase (push refused: `git@github.com: Permission denied (publickey)` under `BatchMode`)
- Verified by:
  - Greps: `grep.*@smoke` and `workflow_dispatch` present in `.github/workflows/ci.yml` — PASS
  - YAML: `yaml.safe_load` parses; triggers = push `[uat]` + `workflow_dispatch`; jobs = `unit-tests` + `e2e-tests`; GCP temp-file step, `actions/cache`, `upload-artifact` all preserved — PASS
  - `npx playwright test --grep @smoke --list` — exactly 6 tests in 4 files (demo-credentials-consent, exam, smoke, user) — PASS
- Next: 2.3 — user pushes `uat` (SSH passphrase) and confirms CI E2E runs only the `@smoke` subset; optionally test `workflow_dispatch` from the Actions tab. Then Phase 3.
- Blockers: 2.3 push (SSH passphrase, HITL). GitHub Secrets (`GCP_CREDENTIALS_JSON`, `PW_TEST_EMAIL`, `PW_TEST_PASSWORD`, `PW_SIGNUP_EMAIL`, `PW_SIGNUP_PASSWORD`) still unverified (Phase 4) — auth-dependent `@smoke` tests (`user.spec.ts` login) will fail until provisioned; the 3 `smoke.spec.ts` health checks need no credentials.
- HITL actions pending: push to `uat` + observe CI (Phase 2.3 / Phase 0.5); provision GitHub Secrets (Phase 4)

**Bugs fixed this session (beyond plan's 2.1/2.2)**:
1. `PW_SIGNUP_EMAIL` line used `>` instead of `>>` — it truncated `.env.local`, silently dropping `PW_TEST_EMAIL`/`PW_TEST_PASSWORD` written earlier. Under `--grep @smoke` the `user.spec.ts` login test would have had no credentials. Fixed to `>>`.
2. `NEXT_PUBLIC_FIREBASE_*` had no fallback — with GitHub Secrets absent, values wrote empty and the dev server would crash with `auth/invalid-api-key` (the exact Phase 0.5 regression). Initially "fixed" by adding `|| 'UAT-default'` fallbacks mirrored from `apphosting.uat.yaml` (public values). **REVERTED on 2026-08-25 by user decision** — the repo is public, so hardcoding Firebase config in the workflow leaks it. Final state: all values come **only** from GitHub Secrets (see Session Note 2026-08-25 22:10).
3. Deferred hardening from Session Note 16:45: test-account values are now single-quoted in the `echo` so secrets containing `$` cannot be interpolated by the shell (`$$` = PID).

**Commit**: `c260cac` "Phase 2: CI runs @smoke subset + workflow_dispatch, fix .env.local overwrite bug" (branch `playwright-github-actions` → `uat`). Reference YAML in this doc synced to the committed file.

### Session Note — 2026-08-25 18:50 local

- Completed: Phase 3.1 (AUTO) — `firebase.json` apphosting backend config added (`backendId: certifai-app`, `rootDir: .`, `ignore: [node_modules, .git, firebase-debug.log, e2e, __tests__]`)
- Verified by: plan isolated tests — JSON parses, `apphosting` array present with backendId, ignore patterns include `e2e` + `__tests__` — all PASS (node -e)
- Next: Phase 3.2 (HITL — Firebase Console Ignored Paths), then Phase 4 (secrets, HITL)
- Blockers: 3.2 requires Firebase Console access (HITL) — set Ignored Paths to `e2e/**, __tests__/**, docs/**, *.md, .github/**, scripts/**, spec_kanban/**, ai_oriented_kanban/**`, then push a test-only commit and confirm rollout status `SKIPPED`. Phase 2.3 push still pending (SSH passphrase, HITL).
- HITL actions pending: (1) Phase 3.2 console config + SKIPPED verification; (2) push `uat` + observe CI (Phases 0.5/2.3); (3) Phase 4 — GitHub Secrets + Cloud Secret Manager

### Session Note — 2026-08-25 22:10 local

- Completed: Phase 4 partial (4.4 local validation) + **fallback removal from docs** (user-directed)
- Verified by:
  - `gcp_credentials.json` — python JSON validation: parses, `type: service_account`, `project_id: certifai-uat`, `client_email: firebase-adminsdk-fbsvc@certifai-uat.iam.gserviceaccount.com`, all required keys present — PASS (4.4 local half)
  - CI workflow `.github/workflows/ci.yml` @ HEAD `d9d9450` — confirmed **no** `UAT-default` fallbacks remain (grep `UAT-default` → 0 matches); "Create .env.local" reads GitHub Secrets only; `GCP_CREDENTIALS_JSON` written to `/tmp/gcp_cred.json` — PASS
  - `.env.local` (local, gitignored) has all required vars incl. `GOOGLE_APPLICATION_CREDENTIALS` — present
  - Env probe: `gcloud` and `gh` CLIs **not installed** on this machine — 4.2/4.3 must go through Cloud Console / GitHub web UI (or install the CLIs)
- Next: 4.1–4.3 (HITL) — create Firebase test users, store secrets, add 15 GitHub Secrets. Then re-push `uat` (2.3/0.5) and observe CI E2E with secrets in place.
- Blockers: none new. All Phase 4 HITL items require console access (Firebase Console, Cloud Console / gcloud, GitHub Settings). Phase 2.3 push still pending (SSH passphrase).
- HITL actions pending: (1) Phase 4.1 Firebase test users; (2) Phase 4.2 Secret Manager; (3) Phase 4.3 all 15 GitHub Secrets; (4) push `uat` + observe CI; (5) Phase 3.2 ignored paths.

**User decision (fallback removal)**: the repo is **public** — the `|| 'UAT-default'` fallbacks previously added to the CI workflow hardcoded Firebase web config into a committed file, which leaks project configuration. User removed them from `ci.yml`; this session cleaned up all remaining references in this plan doc (Phase 2.3 implementation note, Phase 4 "Optional secrets" paragraph, Session Notes 21:55 & 14:10) and in `.env.local.example`. **New rule for this project: CI env vars come exclusively from GitHub Secrets — never hardcode values in committed files, even "public" `NEXT_PUBLIC_*` ones.** Consequence: all 15 secrets in the Phase 4 table are REQUIRED (no graceful degradation); the E2E job will fail until they are provisioned.

**Also discovered (not changed)**: `apphosting.uat.yaml` / `apphosting.yaml` still declare `NEXT_PUBLIC_FIREBASE_*` as plain `value:` entries — these are needed at deploy time by App Hosting and are pre-existing; out of scope for Phase 4. Flag for a future decision if desired.

### Session Note — 2026-08-26 17:00 local

- Completed: Phase 5 (5.1–5.3) — all AUTO steps done & verified
- Verified by (Phase 5 Isolated Test suite, all PASS):
  - `grep "npm run dev" scripts/e2e-pre-flight.sh` → no match (manual dev server startup removed)
  - `ls -la scripts/*.sh` → all 3 scripts `-rwxr-xr-x` (executable)
  - `grep -E "e2e-post-deployment|wait-for-service" .github/workflows/ci.yml` → no match (deprecated scripts not referenced in CI)
  - `bash -n scripts/e2e-pre-flight.sh` → syntax valid
  - Precondition re-confirmed: `playwright.config.ts` `webServer` (`command: 'npm run dev'`, non-live only) handles dev server startup — manual startup removal is safe
- Next: Phase 6 — local dev parity & docs (`.env.local.example` exists already from Phase 0.5 follow-up; 6.2 `e2e/instructions.md` macOS 11 + gcp_cred sections; 6.3 `docs/testing/strategy.md` CI Pipeline section — note: "CI Pipeline" section already added 2026-08-24, verify gate alignment)
- Blockers: none for Phase 5. Phase 2.3 push still pending (SSH passphrase, HITL); Phase 3.2 (Firebase Console ignored paths) and Phase 4.1–4.3 (test users, Secret Manager, 15 GitHub Secrets) pending HITL.
- HITL actions pending: (1) push `uat` + observe CI (Phases 0.5/2.3); (2) Phase 3.2 console ignored paths; (3) Phase 4.1–4.3 secrets provisioning
- **Implementation note**: commit for this phase is a single-file change (`scripts/e2e-pre-flight.sh`); the script retains its credential check, `npm ci`, and `npx playwright install` steps — only the dev-server startup/polling/cleanup blocks were removed, since `webServer` in `playwright.config.ts` owns that lifecycle.

## Success Criteria

- `firebaseAdminConfig.ts` loads `GOOGLE_APPLICATION_CREDENTIALS` without `SyntaxError` in CI (file path to temp JSON file) and locally (file path to `gcp_cred.json`)
- `.github/workflows/ci.yml` triggers only on push to `uat` branch
- CI runs unit tests + E2E tests in parallel with App Hosting deploy (no post-deploy step)
- `npm run test:e2e -- --grep @smoke` runs only `@smoke`-tagged tests and passes
- `scripts/e2e-pre-flight.sh` does not start dev server manually (Playwright `webServer` handles it)
- `scripts/e2e-post-deployment.sh` and `scripts/wait-for-service.sh` are not referenced in CI workflow
- `docs/testing/strategy.md` documents the parallel CI pipeline architecture
- Each phase can be tested in isolation before the next phase begins (verified via Phase Isolation Matrix)
- All `[HITL]` actions are explicitly documented with their blocking dependencies

## Rollback Plan

1. Delete `.github/workflows/ci.yml` — CI stops running, App Hosting continues deploying normally
2. Remove `@smoke` tags from test files — smoke filtering returns no tests
3. Revert `firebase.json` to `{}` — CLI access removed, App Hosting unaffected
4. Revert `scripts/e2e-pre-flight.sh` to previous version
5. Revert `src/firebase/firebaseAdminConfig.ts` to previous version (restores the `SyntaxError` — only do this if the fix caused issues)

> **Key**: All changes are additive — removing them returns to the current state (App Hosting deploys without test gates). No data migration or state cleanup needed. The `firebaseAdminConfig.ts` fix is the only modification to application code — reverting it restores the original behavior (including the `SyntaxError`).

## Open Questions

1. Should CI also run on pull requests to `uat`?

- Yes, any new commits/PRs to `uat` should trigger CI.

2. Should we add a `main`-branch CI gate later?

- No, not for now.

3. Are the deprecated `e2e-post-deployment.sh` and `wait-for-service.sh` scripts worth keeping for future use?

- No, can be removed.

4. Should the `GCP_CREDENTIALS_JSON` GitHub Secret be rotated periodically?

- No, not for now.

## Recommendation

Execute Phase 0 first (fix `gcp_credentials.json` + minimal CI workflow). This is the minimum viable hotfix — it unblocks CI immediately and fixes the credential loading issue. Phases 1–2 build on Phase 0 to add `@smoke` filtering. Phases 3–5 can follow in any order since they're independent. Phase 4 (secrets) may be blocked on console access but the `GCP_CREDENTIALS_JSON` GitHub Secret is needed for Phase 0's CI to fully work — provision it early.

**HITL scheduling note**: Phase 4 is entirely human-in-the-loop and can be done in parallel with Phases 1–3. Schedule a console-access session early to unblock full CI E2E.
