# Plan: Integrate Playwright E2E Testing with Firebase App Hosting Deployment

> **Status**: Draft
> **Created**: 2026-08-24
> **Updated**: 2026-08-24 — revised to reflect that deployment is managed by Firebase App Hosting's built-in CI/CD pipeline (GitHub-connected, Cloud Build-backed), not a custom GitHub Actions deploy step
> **Owner**: Engineering
> **Related files**: `playwright.config.ts`, `apphosting.yaml`, `apphosting.uat.yaml`, `scripts/e2e-pre-flight.sh`, `scripts/e2e-post-deployment.sh`, `scripts/wait-for-service.sh`, `firebase.json`

---

## 0. Key Constraint: App Hosting Pipeline Architecture

Firebase App Hosting manages its own deployment pipeline. When a backend is connected to a GitHub repository:

1. **Push to live branch** → App Hosting auto-triggers a Cloud Build job
2. **Cloud Build** runs a 5-stage build (workspace init → preparer → pre-buildpack → build → publisher)
3. The built container image is deployed to **Cloud Run**

**Critical limitation**: App Hosting does **not** support pre-deploy or post-deploy lifecycle hooks. You cannot inject custom scripts (like Playwright tests) into the App Hosting build pipeline itself. The `scripts.buildCommand` in `apphosting.yaml` can be overridden, but using it for tests is an anti-pattern — it would run tests inside the container build step, which has no browser binaries and isn't designed for test execution.

**Therefore**: The E2E test integration must happen **outside** the App Hosting pipeline — as a GitHub Actions workflow that runs alongside it. The App Hosting deploy is triggered by the same Git push, but the test gate runs independently in GitHub Actions. The two pipelines are coordinated by branch/tag conventions, not by hooks.

---

## 1. Current State Assessment

### What exists today

| Component                                | Status         | Notes                                                                                                          |
| ---------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------- |
| `playwright.config.ts`                   | ✅ Working     | Configured for local dev + live env via `PLAYWRIGHT_TEST_BASEURL`; local macOS 11 fix with `channel: 'chrome'` |
| `scripts/e2e-pre-flight.sh`              | ✅ Exists      | Runs tests against `localhost:3000` before deploy — not wired into any CI                                      |
| `scripts/e2e-post-deployment.sh`         | ✅ Exists      | Runs `@smoke` tests against live URL after deploy — not wired into any CI                                      |
| `scripts/wait-for-service.sh`            | ✅ Exists      | Health-check helper — not called by any pipeline                                                               |
| `apphosting.yaml` (prod)                 | ✅ Has secrets | `PW_TEST_EMAIL` + `PW_TEST_PASSWORD` secrets defined                                                           |
| `apphosting.uat.yaml` (UAT)              | ✅ Has secrets | Same test credential secrets defined                                                                           |
| Firebase Console pipeline                | ✅ Active      | App Hosting backend connected to GitHub repo; auto-rollout on push to `main`                                   |
| GitHub Actions CI                        | ❌ Missing     | No `.github/workflows/` CI pipeline exists                                                                     |
| `@smoke` test tags                       | ❌ Missing     | Post-deploy script greps for `@smoke` but no tests are tagged                                                  |
| Firebase secrets in Cloud Secret Manager | ⚠️ Unknown     | Secrets declared in YAML but may not be provisioned in Secret Manager                                          |
| `firebase.json`                          | ✅ Empty `{}`  | No `apphosting` backend config — CLI deploy not yet set up                                                     |

### Key insight

The App Hosting pipeline **already deploys automatically** on push to `main`. The problem is:

- There's no **test gate** before the deploy happens
- There's no **post-deploy validation** after the deploy completes
- The existing shell scripts were written for this purpose but were never wired in

---

## 2. Architecture Overview

```
                    ┌──────────────────────────────────┐
                    │      Push to `main` / PR          │
                    └─────────┬────────────┬───────────┘
                              │            │
                 ┌────────────▼──┐   ┌──────▼───────────────────┐
                 │  App Hosting  │   │  GitHub Actions Workflow  │
                 │  (Firebase     │   │  (CI Pipeline)            │
                 │   Console CI) │   │                           │
                 │                │   │  ┌─────────────────────┐  │
                 │  Cloud Build    │   │  │ Unit Tests (Jest)   │  │
                 │  → Cloud Run    │   │  │ BLOCKING             │  │
                 │                │   │  └─────────────────────┘  │
                 │  (no test gate) │   │  ┌─────────────────────┐  │
                 └────────┬────────┘   │  │ Pre-Flight E2E      │  │
                          │            │  │ (local dev server)   │  │
                          │            │  │ BLOCKING             │  │
                          ▼            │  └──────────┬──────────┘  │
              ┌──────────────────┐    │             │ pass?       │
              │  Cloud Run       │    │             ▼             │
              │  (deployed app)  │    │  ┌─────────────────────┐  │
              └────────┬─────────┘    │  │ Post-Deploy Smoke   │  │
                       │              │  │ (against live URL)  │  │
                       │              │  │ waits for App        │  │
                       │              │  │ Hosting deploy      │  │
                       │              │  │ NON-BLOCKING        │  │
                       │              │  └─────────────────────┘  │
                       │              └───────────────────────────┘
                       │                            │
                       └──────────┬─────────────────┘
                                  ▼
                        ┌──────────────────┐
                        │  Smoke report    │
                        │  (artifact +     │
                        │   notification)  │
                        └──────────────────┘
```

### How the two pipelines coordinate

| Event                      | App Hosting (Firebase Console)                 | GitHub Actions (CI)                                                                                                              |
| -------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Push to `main`             | Auto-triggers Cloud Build → Cloud Run deploy   | Runs unit + pre-flight E2E (blocking on PR), then waits for App Hosting deploy to finish, then runs smoke tests against live URL |
| PR to `main`               | No deploy (not live branch)                    | Runs unit + pre-flight E2E — blocks merge if failing                                                                             |
| Manual `workflow_dispatch` | No auto-trigger (unless same commit is pushed) | Can trigger targeted smoke run against UAT or prod URL                                                                           |

**Key**: The GitHub Actions workflow **does not deploy**. App Hosting owns the deploy. GitHub Actions owns the test gates.

---

## 3. Implementation Plan

### Phase 1: Tag smoke tests (Day 1)

**Goal**: Enable the `--grep @smoke` filter in the post-deployment script.

**Tasks**:

1. Add `@smoke` tag to critical-path tests in each spec file:
   - `e2e/demo-credentials-consent.spec.ts` → tag the "requires click to reveal" test
   - `e2e/exam.spec.ts` → tag the `[Dashboard → Cert → Exams]` test
   - `e2e/user.spec.ts` → tag the login + signup flow test
2. Add a dedicated `e2e/smoke.spec.ts` with minimal health-check tests:
   - Homepage loads and renders hero section
   - `/signin` page loads with form fields visible
   - API health endpoint responds 200
3. Add `test:e2e:smoke` script to `package.json`: `playwright test --grep @smoke`

**Acceptance**: `npm run test:e2e:smoke` runs only tagged tests.

---

### Phase 2: Create GitHub Actions CI workflow (Day 1–2)

**Goal**: Create a GitHub Actions workflow that runs unit + E2E tests on every push/PR, and runs smoke tests after App Hosting deploy completes.

**Tasks**:

1. Create `.github/workflows/ci.yml` with three jobs:
   - **Job 1 — `unit-tests`**: `npm run test` (blocking)
   - **Job 2 — `pre-flight-e2e`**: `npm run test:e2e` with local dev server (blocking on PRs)
   - **Job 3 — `post-deploy-smoke`**: waits for App Hosting deploy, then runs `@smoke` tests against live URL (non-blocking)
2. Cache `node_modules` and Playwright browser binaries (`~/.cache/ms-playwright`)
3. Upload Playwright HTML report as artifact on failure
4. Configure environment:
   - `PW_TEST_EMAIL` and `PW_TEST_PASSWORD` from GitHub Secrets
   - `.env.local` generated from secrets during CI run
5. Set up Node 24 (matching `engines` field in `package.json`)

**Key detail — detecting App Hosting deploy completion**:

App Hosting exposes the deploy status via the GitHub check run (named "App Hosting"). The `post-deploy-smoke` job can:

- **Option A (recommended)**: Poll the live URL with `scripts/wait-for-service.sh` until it responds 200, with a generous timeout (5 min). This is simple and reliable.
- **Option B**: Use the GitHub API to wait for the "App Hosting" check run on the same commit to reach `completed` status with `success` conclusion.

We recommend **Option A** for simplicity — the health-check script already exists.

**Acceptance**: PRs show green/red CI status. Pushes to `main` trigger smoke tests after deploy.

---

### Phase 3: Coordinate with App Hosting auto-rollout rules (Day 2)

**Goal**: Ensure the App Hosting pipeline and CI workflow don't conflict, and configure rollout trigger rules.

**Tasks**:

1. **Verify live branch**: Ensure App Hosting backend's live branch is `main` (check in Firebase Console → App Hosting → Settings → Deployment)
2. **Configure rollout trigger paths** (Firebase Console → Settings → Rollouts → Rollout triggers):
   - Set **Ignored Paths** to skip deploys when only test/doc files change:
     ```
     e2e/**
     __tests__/**
     docs/**
     *.md
     .github/**
     scripts/**
     ```
   - This prevents unnecessary App Hosting deploys when you only change test files
3. **Verify environment configs**:
   - Confirm `apphosting.yaml` (prod) and `apphosting.uat.yaml` (UAT) have correct `PW_TEST_EMAIL` / `PW_TEST_PASSWORD` secret references (they do — no change needed)
4. **Set up `firebase.json`** for CLI access (optional, for manual rollouts):
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
   This enables `firebase apphosting:rollouts:create` CLI commands for manual triggers.

**Acceptance**: App Hosting only deploys on real source code changes. Test-only commits don't trigger unnecessary deploys.

---

### Phase 4: Harden test credentials & secrets (Day 2–3)

**Goal**: Ensure test credentials exist in all environments.

**Tasks**:

1. Create dedicated Firebase test user accounts:
   - UAT: `pw_test_uat@certestic.com` (in `certifai-uat` project)
   - Prod: `pw_test_prod@certestic.com` (in `certifai-prod` project)
2. Store credentials in Google Cloud Secret Manager (referenced by `apphosting.yaml`):

   ```bash
   # UAT project
   gcloud secrets create PW_TEST_EMAIL --data-file=- --project=certifai-uat <<< "pw_test_uat@certestic.com"
   gcloud secrets create PW_TEST_PASSWORD --data-file=- --project=certifai-uat <<< "password_here"

   # Prod project
   gcloud secrets create PW_TEST_EMAIL --data-file=- --project=certifai-prod <<< "pw_test_prod@certestic.com"
   gcloud secrets create PW_TEST_PASSWORD --data-file=- --project=certifai-prod <<< "password_here"
   ```

3. Add the same credentials to GitHub Secrets for the CI workflow:
   - `PW_TEST_EMAIL` (UAT)
   - `PW_TEST_PASSWORD` (UAT)
   - `PW_TEST_EMAIL_PROD` (prod)
   - `PW_TEST_PASSWORD_PROD` (prod)
4. Verify `GCP_CREDENTIALS_JSON` secret is valid JSON (not a file path) — this was causing `gcp_cred` parse errors in local testing

**Acceptance**: `gcloud secrets describe PW_TEST_EMAIL` returns a valid secret in both projects. CI tests can authenticate.

---

### Phase 5: Post-deploy smoke test integration (Day 3)

**Goal**: Run `@smoke` tests against the live URL after every App Hosting deploy.

**Tasks**:

1. Update `scripts/e2e-post-deployment.sh`:
   - Use `scripts/wait-for-service.sh` instead of inline health check (DRY)
   - Accept `TARGET_URL` as env var or first argument
   - Clean auth state cache (`.auth/user.json`) before post-deploy tests (fresh session)
   - Set `PLAYWRIGHT_TEST_BASEURL` before running tests
2. The GitHub Actions `post-deploy-smoke` job calls the script:
   ```yaml
   - name: Wait for App Hosting deploy and run smoke tests
     run: bash scripts/e2e-post-deployment.sh
     env:
       NODE_ENV: uat
       PW_TEST_EMAIL: ${{ secrets.PW_TEST_EMAIL }}
       PW_TEST_PASSWORD: ${{ secrets.PW_TEST_PASSWORD }}
     continue-on-error: true
   ```
3. Add Slack/Teams notification on smoke test failure (optional — GitHub status check is sufficient initially)

**Acceptance**: After App Hosting deploys to UAT, smoke tests run automatically and report pass/fail as a GitHub status check.

---

### Phase 6: Local dev parity & docs (Day 3–4)

**Goal**: Ensure local development works alongside CI.

**Tasks**:

1. The `channel: 'chrome'` fix in `playwright.config.ts` is local-only (guarded by `process.platform === 'darwin' && !isLiveEnvironment`) — CI uses Linux, so this is a no-op there ✅
2. In CI, `npx playwright install --with-deps chromium` installs the correct Linux Chromium — no change needed ✅
3. Document the local workaround in `e2e/instructions.md` for macOS 11 users
4. Add `.env.local.example` with `GCP_CREDENTIALS_JSON` format hint to fix the `gcp_cred` parse error seen in local testing

**Acceptance**: Local `npm run test:e2e` works on macOS 11+ and CI.

---

## 4. File Changes Summary

| File                                    | Action        | Purpose                                                                             |
| --------------------------------------- | ------------- | ----------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`              | **Create**    | GitHub Actions CI: unit tests + pre-flight E2E + post-deploy smoke                  |
| `e2e/smoke.spec.ts`                     | **Create**    | Minimal health-check tests tagged `@smoke`                                          |
| `e2e/demo-credentials-consent.spec.ts`  | **Edit**      | Add `@smoke` tag to critical test                                                   |
| `e2e/exam.spec.ts`                      | **Edit**      | Add `@smoke` tag to critical test                                                   |
| `e2e/user.spec.ts`                      | **Edit**      | Add `@smoke` tag to critical test                                                   |
| `scripts/e2e-post-deployment.sh`        | **Edit**      | Use `wait-for-service.sh`, clean auth cache, accept `TARGET_URL`                    |
| `scripts/e2e-pre-flight.sh`             | **Edit**      | Remove redundant dev server startup (Playwright config already handles `webServer`) |
| `package.json`                          | **Edit**      | Add `test:e2e:smoke` script                                                         |
| `firebase.json`                         | **Edit**      | Add `apphosting` backend config for CLI access                                      |
| `playwright.config.ts`                  | **Review**    | No changes needed for CI (local `channel: 'chrome'` guard is macOS-only)            |
| `e2e/instructions.md`                   | **Edit**      | Document macOS 11 Chromium workaround                                               |
| `.env.local.example`                    | **Create**    | Document required env vars (especially `GCP_CREDENTIALS_JSON` format)               |
| Firebase Console (App Hosting settings) | **Configure** | Set rollout trigger ignored paths for test/doc files                                |

---

## 5. CI Pipeline Detail (`.github/workflows/ci.yml`)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      target:
        description: 'Smoke test target'
        type: choice
        options: [uat, production]
        default: uat

env:
  NODE_VERSION: '24'

jobs:
  # ──────────────────────────────────────────────
  # Job 1: Unit tests — BLOCKING on all events
  # ──────────────────────────────────────────────
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npm run test

  # ──────────────────────────────────────────────
  # Job 2: Pre-flight E2E — BLOCKING on PRs and pushes
  #   Runs against local dev server (Playwright config auto-starts it)
  # ──────────────────────────────────────────────
  pre-flight-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      # Cache Playwright browsers
      - uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
      - name: Create .env.local
        run: |
          echo "PW_TEST_EMAIL=${{ secrets.PW_TEST_EMAIL }}" > .env.local
          echo "PW_TEST_PASSWORD=${{ secrets.PW_TEST_PASSWORD }}" >> .env.local
          # Add GCP_CREDENTIALS_JSON and other secrets as needed
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report-preflight
          path: playwright-report/

  # ──────────────────────────────────────────────
  # Job 3: Post-deploy smoke tests — NON-BLOCKING
  #   Runs after App Hosting auto-deploys on push to main.
  #   For PRs: skipped (App Hosting doesn't deploy on PRs).
  #   For workflow_dispatch: runs against specified target URL.
  #
  #   Strategy: Poll the live URL with wait-for-service.sh
  #   until the new deploy is live, then run @smoke tests.
  # ──────────────────────────────────────────────
  post-deploy-smoke:
    needs: [unit-tests, pre-flight-e2e]
    if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    continue-on-error: true
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}

      - name: Determine target URL
        id: target
        run: |
          if [[ "${{ github.event_name }}" == "workflow_dispatch" ]]; then
            if [[ "${{ inputs.target }}" == "production" ]]; then
              echo "url=https://certestic.com" >> $GITHUB_OUTPUT
              echo "env=production" >> $GITHUB_OUTPUT
            else
              echo "url=https://uat--certifai-uat.us-central1.hosted.app" >> $GITHUB_OUTPUT
              echo "env=uat" >> $GITHUB_OUTPUT
            fi
          else
            # Push to main → App Hosting auto-deploys to UAT
            echo "url=https://uat--certifai-uat.us-central1.hosted.app" >> $GITHUB_OUTPUT
            echo "env=uat" >> $GITHUB_OUTPUT
          fi

      - name: Wait for App Hosting deploy to go live
        run: |
          echo "Waiting for new deploy at ${{ steps.target.outputs.url }}..."
          bash scripts/wait-for-service.sh "${{ steps.target.outputs.url }}" 60 10
        # 60 attempts × 10s = 10 min max wait

      - name: Run smoke tests against live URL
        run: bash scripts/e2e-post-deployment.sh
        env:
          NODE_ENV: ${{ steps.target.outputs.env }}
          PLAYWRIGHT_TEST_BASEURL: ${{ steps.target.outputs.url }}
          PW_TEST_EMAIL: ${{ secrets.PW_TEST_EMAIL }}
          PW_TEST_PASSWORD: ${{ secrets.PW_TEST_PASSWORD }}

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-smoke
          path: playwright-report/
```

---

## 6. App Hosting Console Configuration

These changes are made in the **Firebase Console** (not in the repo):

### Rollout trigger rules (Settings → Rollouts → Rollout triggers)

| Setting           | Value                                                                                                | Purpose                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Ignored Paths** | `e2e/**, __tests__/**, docs/**, *.md, .github/**, scripts/**, spec_kanban/**, ai_oriented_kanban/**` | Prevent unnecessary App Hosting deploys when only test/doc files change |

### Live branch

| Setting                | Value   |
| ---------------------- | ------- |
| **Live branch**        | `main`  |
| **Automatic rollouts** | Enabled |

### Environment (for UAT backend)

| Setting                | Value                                   |
| ---------------------- | --------------------------------------- |
| **App root directory** | `/` (project root)                      |
| **Environment**        | `uat` (points to `apphosting.uat.yaml`) |

---

## 7. Risk Assessment

| Risk                                                | Impact                                       | Mitigation                                                                                                                |
| --------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| App Hosting deploy takes >10 min                    | Smoke test job waits too long                | `wait-for-service.sh` has 60×10s = 10 min timeout; if exceeded, job still runs (non-blocking)                             |
| Test credentials not in Secret Manager              | E2E auth fails in CI                         | Phase 4: create & verify secrets before first CI run                                                                      |
| App Hosting deploys broken code (no test gate)      | Bad deploy reaches UAT                       | Pre-flight E2E in GitHub Actions is a **status check** — configure branch protection to require it before merge to `main` |
| Smoke tests flaky on live env                       | False alarms                                 | Non-blocking by design; `retries: 3` for live env in `playwright.config.ts`                                               |
| `gcp_cred` JSON parse error (seen locally)          | API routes fail in tests                     | Ensure `GCP_CREDENTIALS_JSON` secret is valid JSON, not a file path                                                       |
| Playwright browser install slow in CI               | CI takes too long                            | Cache `~/.cache/ms-playwright` with `actions/cache`                                                                       |
| App Hosting and CI run in parallel, no coordination | Smoke tests hit old deploy                   | `wait-for-service.sh` polls until URL responds; if deploy is faster, tests start immediately; if slower, it waits         |
| Two pipelines cause confusion                       | Developer doesn't know which pipeline failed | GitHub PR checks show both "App Hosting" and "CI" status checks clearly                                                   |
| macOS 11 dev machine can't run Chromium 147         | Local dev blocked                            | Already fixed with `channel: 'chrome'` in config (local-only guard)                                                       |

---

## 8. Rollout Sequence

```
Phase 1: Tag @smoke tests                 ───→  can verify locally
    │
Phase 2: Create GitHub Actions CI         ───→  PRs get test gates
    │
Phase 4: Set up secrets (Secret Manager   ───→  CI can authenticate
    │      + GitHub Secrets)
    │
Phase 3: Configure App Hosting rollout    ───→  no wasted deploys on
    │      trigger rules in Console              test-only commits
    │
Phase 5: Post-deploy smoke integration    ───→  live health validation
    │
Phase 6: Local parity & docs               ───→  team can run locally
```

> Phases 1, 2, and 4 can be done in parallel. Phase 3 can be done anytime (Console config). Phase 5 depends on 1+2. Phase 6 is independent.

---

## 9. What This Plan Does NOT Do (and Why)

| Not doing                                         | Reason                                                                                                                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Deploy from GitHub Actions                        | App Hosting owns the deploy pipeline via its GitHub integration. Deploying from CI would conflict with App Hosting's auto-rollout.                                 |
| Run tests inside `apphosting.yaml` `buildCommand` | The App Hosting Cloud Build pipeline runs in a container build environment with no browser binaries. Hacking tests into `buildCommand` is fragile and unsupported. |
| Use Cloud Build triggers directly                 | App Hosting manages its own Cloud Build jobs internally. Adding separate Cloud Build triggers would create a parallel, conflicting pipeline.                       |
| Use Firebase Extensions user hooks                | Firebase Extensions user hooks are for Firestore/Auth/Storage triggers, not for App Hosting deploy lifecycle events.                                               |
| Wire `firebase deploy` CLI into CI                | The App Hosting backend is connected to GitHub for auto-rollout. CLI deploys would create conflicting rollouts. CLI is reserved for manual triggers only.          |
