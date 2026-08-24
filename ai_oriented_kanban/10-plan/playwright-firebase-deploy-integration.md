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

- [ ] Phase 0 — Minimal GitHub Actions + `gcp_credentials.json` fix
- [ ] Phase 1 — Tag `@smoke` tests + create `smoke.spec.ts`
- [ ] Phase 2 — Create GitHub Actions CI workflow
- [ ] Phase 3 — Configure App Hosting rollout trigger rules
- [ ] Phase 4 — Provision test credentials in Secret Manager + GitHub Secrets
- [ ] Phase 5 — Update pre-flight script for CI compatibility
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
| Add GitHub Secrets (`PW_TEST_EMAIL`, `PW_TEST_PASSWORD`, `GCP_CREDENTIALS_JSON`)  | 4.3   | GitHub repo Settings           | Phase 4          | No                                                                    |
| Verify `GCP_CREDENTIALS_JSON` format locally                                      | 4.4   | Local machine                  | Phase 4          | No                                                                    |
| Configure Ignored Paths in Firebase Console                                       | 3.2   | Firebase Console (App Hosting) | Phase 3          | No — but Phase 3 repo code can proceed without it                     |
| Verify App Hosting skipped deploy on test-only commit                             | 3.2   | Firebase Console (App Hosting) | Phase 3          | No — must observe SKIPPED status                                      |

> **Key**: Phases 0–2 can proceed with code changes (AUTO steps) even if GitHub Secrets are not yet provisioned. However, the E2E test job will fail until secrets exist. Unit tests will pass immediately. This is expected — Phase 4 (secrets) is the unblocker for full CI E2E.

## Phases

### Phase 0: Minimal GitHub Actions + `gcp_credentials.json` fix

**Progress**: `[ ]`

**Layer**: CI infrastructure + credentials loading fix

**Goal**: Get a minimal GitHub Actions workflow running on push to `uat` that executes unit tests and E2E tests. Fix the `GOOGLE_APPLICATION_CREDENTIALS` loading issue so that API routes work in CI.

**Files**:

- `.github/workflows/ci.yml` — create — minimal CI pipeline (unit tests + E2E, triggered on push to `uat` only)
- `src/firebase/firebaseAdminConfig.ts` — modify — improve `GOOGLE_APPLICATION_CREDENTIALS` loading logic to handle the CI case where the env var is a JSON string written to a temp file

**Verification gate** (must pass before Phase 1 starts):

- `.github/workflows/ci.yml` exists and is valid YAML
- Workflow triggers only on `push` to `uat` branch
- `unit-tests` job runs `npm run test`
- `e2e-tests` job runs `npm run test:e2e` with Playwright Chromium installed
- `GOOGLE_APPLICATION_CREDENTIALS` is set to a temp file path containing the JSON from `GCP_CREDENTIALS_JSON` GitHub Secret
- `firebaseAdminConfig.ts` no longer throws `SyntaxError: Unexpected token '.'` when the env var is a file path to a valid JSON file
- Playwright browser cache configured via `actions/cache`
- Failure artifacts uploaded via `actions/upload-artifact`

**Isolated Test** (run this single command after Phase 0 is complete to verify in isolation):

```bash
# 1. Verify the credential fix locally (no CI needed)
#    Create a temp JSON file with valid service account JSON
echo '{"type":"service_account","project_id":"test"}' > /tmp/test_cred.json
GOOGLE_APPLICATION_CREDENTIALS=/tmp/test_cred.json /Users/benxgao/.workbuddy-ai/binaries/python/versions/3.13.12/bin/python3 -c "
import json, sys
# Simulate the logic: if it's a file path, read and parse
cred = '/tmp/test_cred.json'
if cred.startswith('/'):
    with open(cred) as f:
        data = json.load(f)
    print('PASS: file path loading works, project_id=' + data.get('project_id',''))
else:
    print('FAIL: should not reach here')
"

# 2. Verify YAML validity
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml')); print('PASS: YAML valid')"

# 3. Verify workflow trigger and job structure
grep -q 'branches:.*uat' .github/workflows/ci.yml && echo 'PASS: uat trigger present' || echo 'FAIL: uat trigger missing'
grep -q 'unit-tests' .github/workflows/ci.yml && echo 'PASS: unit-tests job present' || echo 'FAIL: unit-tests job missing'
grep -q 'e2e-tests' .github/workflows/ci.yml && echo 'PASS: e2e-tests job present' || echo 'FAIL: e2e-tests job missing'
grep -q 'GCP_CREDENTIALS_JSON' .github/workflows/ci.yml && echo 'PASS: GCP credentials step present' || echo 'FAIL: GCP credentials step missing'
grep -q 'actions/cache' .github/workflows/ci.yml && echo 'PASS: cache step present' || echo 'FAIL: cache step missing'
grep -q 'upload-artifact' .github/workflows/ci.yml && echo 'PASS: artifact upload present' || echo 'FAIL: artifact upload missing'
```

> **Note**: The isolated test above verifies the code changes without pushing to GitHub. The full end-to-end test (observing CI actually run) is a `[HITL]` action — see below.

**Human-in-the-loop actions**:

- `[HITL]` **Verify `firebaseAdminConfig.ts` fix locally**: set `GOOGLE_APPLICATION_CREDENTIALS` to a valid JSON file path and verify the module loads without error. Also test with a JSON string to verify both paths work. This requires a real service account JSON file on your machine.
- `[HITL]` **Push to `uat` and observe CI run**: after the workflow file is committed, push to the `uat` branch and observe the GitHub Actions tab. Confirm both `unit-tests` and `e2e-tests` jobs are triggered. The E2E job may fail if GitHub Secrets are not yet provisioned (expected — Phase 4 unblocks this).
- `[HITL]` **Provision `GCP_CREDENTIALS_JSON` GitHub Secret**: this is listed in Phase 4.3 but is a prerequisite for Phase 0's E2E job to fully pass. If not provisioned, the E2E job will fail at the credential-writing step. Phase 0 can still be considered "complete" if the unit-tests job passes and the e2e-tests job fails only due to missing secrets.

**Sub-subphase checklist**:

- [ ] **0.1 — Fix `firebaseAdminConfig.ts` credential loading** `[AUTO]`: the current logic checks `startsWith('.')` which catches `"./gcp_cred"` but then tries `path.resolve` + `fs.existsSync` — if the file doesn't exist, it falls through to `JSON.parse(credentialsString)` which fails on `"./gcp_cred"` because `.` is not valid JSON. Fix: add a clear `try/catch` around the `fs.existsSync` path and a better error message when neither file-read nor JSON.parse works. Also ensure that when `GOOGLE_APPLICATION_CREDENTIALS` points to a valid file, the file content is parsed correctly.
  - **Independent verification**: create a temp JSON file with `echo '{"type":"service_account"}' > /tmp/test_cred.json`, set `GOOGLE_APPLICATION_CREDENTIALS=/tmp/test_cred.json`, and verify the module loads. Also test with `GOOGLE_APPLICATION_CREDENTIALS='{"type":"service_account"}'` (JSON string) to verify both paths.
  - **Isolated**: yes — this sub-subphase can be verified entirely locally with a temp file, no GitHub or Firebase access needed.
- [ ] **0.2 — Create minimal `.github/workflows/ci.yml`** `[AUTO]`: write the workflow with 2 jobs (`unit-tests`, `e2e-tests`), triggered on push to `uat` only. The `e2e-tests` job writes `GCP_CREDENTIALS_JSON` secret to a temp file and sets `GOOGLE_APPLICATION_CREDENTIALS` to that path.
  - **Independent verification**: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"` parses without error
  - **Isolated**: yes — YAML validity and structure can be verified without pushing.
- [ ] **0.3 — Add Playwright browser caching** `[AUTO]`: cache `~/.cache/ms-playwright` keyed on `package-lock.json`
  - **Independent verification**: cache key pattern is present in workflow YAML
  - **Isolated**: yes — grep verification only.
- [ ] **0.4 — Add `.env.local` generation step** `[AUTO]`: create `.env.local` from GitHub Secrets in `e2e-tests` job, including writing `GCP_CREDENTIALS_JSON` to a temp file and setting `GOOGLE_APPLICATION_CREDENTIALS` to its path
  - **Independent verification**: step exists in `e2e-tests` job and writes the temp file
  - **Isolated**: yes — grep verification only.
- [ ] **0.5 — Push to `uat` and observe CI run** `[AUTO→HITL]`: commit the changes and push to the `uat` branch. Observe the GitHub Actions tab to confirm both jobs are triggered.
  - **Independent verification**: GitHub Actions tab shows both `unit-tests` and `e2e-tests` jobs running (or attempted).
  - **Isolated**: partially — the push is automatable, but observing the CI run requires human inspection of the GitHub Actions UI.
  - **Blocker**: GitHub Secrets (`GCP_CREDENTIALS_JSON`, `PW_TEST_EMAIL`, `PW_TEST_PASSWORD`) must be provisioned (Phase 4) for the E2E job to fully pass. If not yet provisioned, the E2E job will fail — this is expected and does not block Phase 0 completion. The unit-tests job should pass immediately.

**Full CI workflow YAML** (reference for implementation — minimal Phase 0 version):

```yaml
name: CI

on:
  push:
    branches: [uat]

env:
  NODE_VERSION: '24'

jobs:
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

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
      - run: npx playwright install --with-deps chromium
      - name: Create .env.local
        run: |
          echo "PW_TEST_EMAIL=${{ secrets.PW_TEST_EMAIL }}" > .env.local
          echo "PW_TEST_PASSWORD=${{ secrets.PW_TEST_PASSWORD }}" >> .env.local
      - name: Write GCP credentials to temp file
        run: |
          echo '${{ secrets.GCP_CREDENTIALS_JSON }}' > /tmp/gcp_cred.json
          echo "GOOGLE_APPLICATION_CREDENTIALS=/tmp/gcp_cred.json" >> .env.local
      - run: npm run test:e2e
        env:
          CI: true
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

> **Note**: This Phase 0 version is minimal — it does not include `@smoke` tag filtering (added in Phase 1) or the full `firebase.json` config (Phase 3). The workflow will be updated in Phase 2 to include `@smoke` filtering once tags exist.

---

### Phase 1: Tag `@smoke` tests + create `smoke.spec.ts`

**Progress**: `[ ]`

**Layer**: test files

**Goal**: Enable `--grep @smoke` filtering so smoke tests can run as a minimal subset within the CI E2E job.

**Files**:

- `e2e/demo-credentials-consent.spec.ts` — modify — add `@smoke` tag to the "requires click to reveal" test title
- `e2e/exam.spec.ts` — modify — add `@smoke` tag to the `[Dashboard → Cert → Exams]` test title
- `e2e/user.spec.ts` — modify — add `@smoke` tag to the login + signup flow test title
- `e2e/smoke.spec.ts` — create — minimal health-check tests: homepage renders, `/signin` page loads with form fields, API health endpoint responds 200
- `package.json` — modify — add `"test:e2e:smoke": "playwright test --grep @smoke"` script

**Verification gate** (must pass before Phase 2 starts):

- `npm run test:e2e:smoke` runs only `@smoke`-tagged tests (verify via test count in output)
- `e2e/smoke.spec.ts` exists and has at least 2 passing tests
- `grep -r "@smoke" e2e/` returns matches in all 4 spec files

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

- [ ] **1.1 — Add `@smoke` tags to existing specs** `[AUTO]`: add `@smoke` to test titles in `demo-credentials-consent.spec.ts`, `exam.spec.ts`, `user.spec.ts`
  - **Independent verification**: `grep -r "@smoke" e2e/*.spec.ts` returns 3+ matches
  - **Isolated**: yes — grep verification only, no runtime needed.
- [ ] **1.2 — Create `e2e/smoke.spec.ts`** `[AUTO]`: homepage, signin, API health checks
  - **Independent verification**: `test -f e2e/smoke.spec.ts` succeeds and the file imports from `@playwright/test`
  - **Isolated**: yes — file existence and import check can be verified without running tests.
- [ ] **1.3 — Add `test:e2e:smoke` script** `[AUTO]`: add to `package.json` scripts
  - **Independent verification**: `npm run test:e2e:smoke -- --list` lists only `@smoke`-tagged tests
  - **Isolated**: yes — `--list` mode does not start a dev server.

---

### Phase 2: Enhance GitHub Actions CI workflow with `@smoke` filtering

**Progress**: `[ ]`

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

- [ ] **2.1 — Add `@smoke` grep to E2E job** `[AUTO]`: update the `npm run test:e2e` command to `npm run test:e2e -- --grep @smoke`
  - **Independent verification**: `grep "grep.*@smoke" .github/workflows/ci.yml` returns a match
  - **Isolated**: yes — grep verification only.
- [ ] **2.2 — Add `workflow_dispatch` trigger** `[AUTO]`: add manual dispatch trigger to the workflow
  - **Independent verification**: `grep "workflow_dispatch" .github/workflows/ci.yml` returns a match
  - **Isolated**: yes — grep verification only.
- [ ] **2.3 — Push and verify CI runs `@smoke` subset** `[AUTO→HITL]`: commit changes and push to `uat`. Inspect the GitHub Actions run to confirm only `@smoke`-tagged tests are executed.
  - **Independent verification**: GitHub Actions E2E job output shows test count matching `@smoke` tag count
  - **Isolated**: partially — the push is automatable, but inspecting CI output requires human review.
  - **Blocker**: requires GitHub Secrets to be provisioned (Phase 4) for E2E tests to pass. Without secrets, the E2E job will fail at auth-dependent tests. The unit-tests job should still pass.

**Updated CI workflow YAML** (reference — shows changes from Phase 0):

```yaml
name: CI

on:
  push:
    branches: [uat]
  workflow_dispatch:

env:
  NODE_VERSION: '24'

jobs:
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

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
      - run: npx playwright install --with-deps chromium
      - name: Create .env.local
        run: |
          echo "PW_TEST_EMAIL=${{ secrets.PW_TEST_EMAIL }}" > .env.local
          echo "PW_TEST_PASSWORD=${{ secrets.PW_TEST_PASSWORD }}" >> .env.local
      - name: Write GCP credentials to temp file
        run: |
          echo '${{ secrets.GCP_CREDENTIALS_JSON }}' > /tmp/gcp_cred.json
          echo "GOOGLE_APPLICATION_CREDENTIALS=/tmp/gcp_cred.json" >> .env.local
      - run: npm run test:e2e -- --grep @smoke
        env:
          CI: true
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

### Phase 3: Configure App Hosting rollout trigger rules

**Progress**: `[ ]`

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

- [ ] **3.1 — Add `apphosting` config to `firebase.json`** `[AUTO]`:

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

  - **Independent verification**: `node -e "JSON.parse(require('fs').readFileSync('firebase.json','utf8'))"` parses
  - **Isolated**: yes — JSON validation only, no console access needed.

- [ ] **3.2 — Configure Ignored Paths in Firebase Console** `[HITL]`: set `e2e/**, __tests__/**, docs/**, *.md, .github/**, scripts/**, spec_kanban/**, ai_oriented_kanban/**`
  - **Independent verification**: push a test-only commit and confirm App Hosting rollout status is `SKIPPED`
  - **Isolated**: no — requires Firebase Console access and a push to `uat` to verify.
  - **Prerequisite**: `firebase.json` config from 3.1 must be committed first (the console config and the JSON config should be consistent).

---

### Phase 4: Provision test credentials in Secret Manager + GitHub Secrets

**Progress**: `[ ]`

**Layer**: infrastructure / secrets (requires console access — may be blocked)

**Goal**: Ensure `PW_TEST_EMAIL`, `PW_TEST_PASSWORD`, and `GCP_CREDENTIALS_JSON` exist and are correctly formatted in all environments.

**Files**:

- No repo files — Google Cloud Secret Manager, GitHub Secrets (manual)

**Verification gate** (must pass before Phase 5 starts):

- `gcloud secrets describe PW_TEST_EMAIL --project=certifai-uat` returns valid
- `gcloud secrets describe PW_TEST_PASSWORD --project=certifai-uat` returns valid
- GitHub repo secrets `PW_TEST_EMAIL`, `PW_TEST_PASSWORD`, and `GCP_CREDENTIALS_JSON` are set
- `GCP_CREDENTIALS_JSON` GitHub Secret contains valid JSON (the full service account key JSON, not a file path)

**Isolated Test** (run this single command after Phase 4 is complete to verify in isolation):

```bash
# Verify Cloud Secret Manager secrets exist (requires gcloud CLI auth)
gcloud secrets describe PW_TEST_EMAIL --project=certifai-uat > /dev/null 2>&1 && echo "PASS: PW_TEST_EMAIL exists in Secret Manager" || echo "FAIL: PW_TEST_EMAIL missing from Secret Manager"
gcloud secrets describe PW_TEST_PASSWORD --project=certifai-uat > /dev/null 2>&1 && echo "PASS: PW_TEST_PASSWORD exists in Secret Manager" || echo "FAIL: PW_TEST_PASSWORD missing from Secret Manager"

# Verify GCP_CREDENTIALS_JSON format locally (requires the actual JSON file)
# Replace /path/to/service-account.json with your actual key file
python3 -c "
import json, sys
try:
    with open('/path/to/service-account.json') as f:
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

- `[HITL]` **Create Firebase test user accounts**: sign in to Firebase Console → Authentication → Users. Create a test user `pw_test_uat@certestic.com` with a known password in the UAT project (`certifai-uat`).
- `[HITL]` **Store credentials in Cloud Secret Manager**: use `gcloud` CLI commands (requires auth) to create `PW_TEST_EMAIL` and `PW_TEST_PASSWORD` secrets in the `certifai-uat` project.
- `[HITL]` **Add GitHub Secrets**: navigate to GitHub repo → Settings → Secrets and variables → Actions → New repository secret. Add `PW_TEST_EMAIL`, `PW_TEST_PASSWORD`, and `GCP_CREDENTIALS_JSON`. The `GCP_CREDENTIALS_JSON` value must be the **full JSON content** of the service account key file (not a file path).
- `[HITL]` **Verify `GCP_CREDENTIALS_JSON` format**: after adding the GitHub Secret, trigger a CI run (via `workflow_dispatch` or push to `uat`) and confirm the E2E job's credential-writing step succeeds (no "invalid JSON" error in the logs).

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

- [ ] **4.3 — Add GitHub Secrets** `[HITL]`: `PW_TEST_EMAIL`, `PW_TEST_PASSWORD`, and `GCP_CREDENTIALS_JSON`
  - `GCP_CREDENTIALS_JSON` must contain the **full JSON content** of the service account key file (not the file path). This JSON is written to `/tmp/gcp_cred.json` in the CI workflow, and `GOOGLE_APPLICATION_CREDENTIALS` is set to that file path.
  - **Independent verification**: GitHub repo settings → Secrets shows all keys
  - **Isolated**: no — requires GitHub repo Settings access.
- [ ] **4.4 — Verify `GCP_CREDENTIALS_JSON` format** `[HITL]`: ensure the GitHub Secret contains valid JSON that can be written to a file and parsed by `firebaseAdminConfig.ts`
  - **Independent verification**: locally, write the JSON to a file, set `GOOGLE_APPLICATION_CREDENTIALS` to the file path, and verify `firebaseAdminConfig.ts` loads without `SyntaxError`
  - **Isolated**: no — requires the actual service account JSON file and local verification.

---

### Phase 5: Update pre-flight script for CI compatibility

**Progress**: `[ ]`

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

- [ ] **5.1 — Update `e2e-pre-flight.sh`** `[AUTO]`: remove the `npm run dev > /tmp/next-dev.log 2>&1 &` block and the wait loop — Playwright config's `webServer` handles this. Also remove the `kill $DEV_PID` cleanup block.
  - **Independent verification**: `grep "npm run dev" scripts/e2e-pre-flight.sh` returns no match
  - **Isolated**: yes — grep verification only.
- [ ] **5.2 — Make scripts executable** `[AUTO]`: `chmod +x scripts/*.sh`
  - **Independent verification**: `ls -la scripts/*.sh` shows `+x` permission
  - **Isolated**: yes — filesystem check only.
- [ ] **5.3 — Verify deprecated scripts are not referenced** `[AUTO]`: confirm `e2e-post-deployment.sh` and `wait-for-service.sh` are not called in the CI workflow
  - **Independent verification**: `grep -E "e2e-post-deployment|wait-for-service" .github/workflows/ci.yml` returns no match
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
