# E2E Testing in Firebase App Hosting CI/CD

This document explains how the Playwright E2E tests are integrated into Firebase App Hosting's CI/CD pipeline.

**Multiple Branch Support:** E2E tests now run on both the **production (master)** and **UAT (uat)** branches. For detailed Firebase App Hosting setup instructions, see [FIREBASE_APPHOSTING_SETUP.md](./FIREBASE_APPHOSTING_SETUP.md).

## Overview

E2E tests run in two phases:

1. **Pre-Deployment (Pre-Flight)** - Tests run against `localhost` before the application is deployed
   - Blocks deployment if tests fail
   - Fast feedback loop, early error detection
   - Runs all tests in the suite

2. **Post-Deployment (Smoke Tests)** - Tests run against the live deployment after it's complete
   - Non-blocking - does not fail the deployment
   - Validates that the deployed environment works as expected
   - Runs only smoke-tagged tests (`@smoke`)

## Architecture

### Build Configuration

- **`cloudbuild.yaml`** - Google Cloud Build configuration for the **master** branch
  - Installs dependencies
  - Installs Playwright browsers
  - Builds the Next.js application
  - Runs pre-flight E2E tests (pre-deployment)

- **`cloudbuild.uat.yaml`** - Google Cloud Build configuration for the **uat** branch
  - Same steps as cloudbuild.yaml
  - Configured for UAT environment

- **`apphosting.yaml`** - Firebase App Hosting configuration for **master** branch
  - Specifies Node.js version (24)
  - Defines runtime resources for production
  - Stores environment variables and secrets for production
  - Test credentials stored in Google Cloud Secret Manager

- **`apphosting.uat.yaml`** - Firebase App Hosting configuration for **uat** branch
  - Specifies Node.js version (24)
  - Defines runtime resources for UAT
  - Stores environment variables and secrets for UAT
  - Test credentials stored in Google Cloud Secret Manager

### Shell Scripts

- **`scripts/e2e-pre-flight.sh`** - Pre-deployment test runner
  - Installs dependencies and Playwright browsers
  - Starts Next.js dev server on `http://localhost:3000`
  - Runs full Playwright test suite
  - Fails build if any tests fail
  - Called from `cloudbuild.yaml`

- **`scripts/e2e-post-deployment.sh`** - Post-deployment test runner
  - Gets target URL from environment (prod/uat)
  - Runs smoke tests only (tagged with `@smoke`)
  - Non-blocking - doesn't fail deployment
  - Can be triggered as a separate Cloud Build step or Cloud Run job

- **`scripts/wait-for-service.sh`** - Service health check utility
  - Waits for Cloud Run service to be ready
  - Used before running post-deployment tests

### Configuration Files

- **`playwright.config.ts`** - Test configuration updated to support both environments
  - Auto-detects if running in apphosting (checks environment variables)
  - Uses `http://localhost:3000` for local/preflight tests
  - Uses environment URL for post-deployment tests
  - Adjusts timeouts and retry logic based on environment

- **`package.json`** - New scripts for CI/CD
  - `npm run test:e2e:ci-preflight` - Run pre-flight tests
  - `npm run test:e2e:ci-postdeploy` - Run post-deployment tests

## Setup Instructions

### 1. Store Test Credentials in Secret Manager

Create secrets in your GCP project:

```bash
# Create test email secret
gcloud secrets create PW_TEST_EMAIL --replication-policy="automatic" --data-file=- <<< "test-user@example.com"

# Create test password secret
gcloud secrets create PW_TEST_PASSWORD --replication-policy="automatic" --data-file=- <<< "your-secure-test-password"
```

### 2. Grant Cloud Build Service Account Permissions

Find your Cloud Build service account:
```bash
gcloud projects describe PROJECT_ID --format='value(projectNumber)' | xargs -I{} echo {}-cloudbuild@cloudbuild.gserviceaccount.com
```

Grant the service account access to your secrets:
```bash
# For each secret, grant the accessor role
gcloud secrets add-iam-policy-binding PW_TEST_EMAIL \
  --member=serviceAccount:SERVICE_ACCOUNT_EMAIL \
  --role=roles/secretmanager.secretAccessor

gcloud secrets add-iam-policy-binding PW_TEST_PASSWORD \
  --member=serviceAccount:SERVICE_ACCOUNT_EMAIL \
  --role=roles/secretmanager.secretAccessor
```

### 3. Verify Configuration

The repository already includes:
- ✅ `apphosting.yaml` with test credential references (production)
- ✅ `apphosting.uat.yaml` with test credential references (UAT)
- ✅ `cloudbuild.yaml` with build steps and pre-flight tests (production)
- ✅ `cloudbuild.uat.yaml` with build steps and pre-flight tests (UAT)
- ✅ `cloudbuild.postdeploy.yaml` for post-deployment tests (production)
- ✅ `cloudbuild.postdeploy.uat.yaml` for post-deployment tests (UAT)
- ✅ Test scripts in `scripts/` directory
- ✅ Updated `playwright.config.ts` for environment detection

### 4. Configure Firebase App Hosting For Multiple Branches

For detailed instructions on setting up Firebase App Hosting for both production (master) and UAT (uat) branches, see [FIREBASE_APPHOSTING_SETUP.md](./FIREBASE_APPHOSTING_SETUP.md).

Quick summary:
1. Create backends in Firebase App Hosting for `master` and `uat` branches
2. Set build configuration to `cloudbuild.yaml` for master
3. Set build configuration to `cloudbuild.uat.yaml` for uat
4. Both branches will run pre-flight E2E tests automatically

### 5. Deploy

```bash
# Trigger production deployment (master branch)
git push origin master

# Trigger UAT deployment (uat branch)
git push origin uat
```

During deployment, Cloud Build will:
1. Install dependencies
2. Install Playwright browsers
3. Build the Next.js app
4. Run pre-flight E2E tests against localhost (will block if tests fail)
5. Create the Cloud Run image
6. Deploy to Cloud Run

## Post-Deployment Testing

Post-deployment tests are not automatically triggered by Firebase App Hosting. You have a few options:

### Option A: Manual Trigger
Run post-deployment tests manually after deployment completes:
```bash
npm run test:e2e:ci-postdeploy
```

### Option B: Cloud Scheduler + Cloud Function
1. Create a Cloud Function that triggers the test script
2. Set up Cloud Scheduler to call the function after deployment
3. Logs and failures are sent to Cloud Logging

### Option C: Separate Cloud Build Trigger
1. Create a Cloud Build trigger that runs `scripts/e2e-post-deployment.sh`
2. Configure it to run on a schedule or on manual trigger
3. Specify the target environment (prod/uat)

## Development

### Running Tests Locally

```bash
# Install dependencies
npm install

# Create .env.local from .env.example and add your test credentials
cp .env.example .env.local
# Edit .env.local and set PW_TEST_EMAIL and PW_TEST_PASSWORD

# Run tests
npm run test:e2e

# Run tests in headed mode (browser visible)
npm run test:e2e:headed

# Run tests in UI mode (interactive)
npm run test:e2e:ui
```

### Adding Tests

- Tests should be added to the `e2e/` directory with `.spec.ts` extension
- Use the test fixtures from `e2e/fixtures/auth.ts` for authenticated tests
- Tag smoke tests with `@smoke` for post-deployment validation

Example:
```typescript
import { test, expect } from './fixtures/auth';

test.describe('My Feature', () => {
  test('should do something important @smoke', async ({ page }) => {
    await page.goto('/my-feature');
    // ... test code
  });
});
```

### Running Pre-Flight Tests Locally

```bash
npm run test:e2e:ci-preflight
```

This will:
1. Install dependencies
2. Install Playwright browsers
3. Start the Next.js dev server
4. Run the full test suite against localhost
5. Clean up resources

## Troubleshooting

### Tests fail with "Missing test credentials"

**Problem:** Pre-flight tests fail because test credentials are not set.

**Solution:**
1. Ensure secrets exist in Google Cloud Secret Manager
2. Verify Cloud Build service account has `roles/secretmanager.secretAccessor`
3. Check that `apphosting.yaml` has the secret references

### Dev server hangs during pre-flight tests

**Problem:** Next.js dev server doesn't start within timeout.

**Solution:**
1. Increase timeout in `scripts/e2e-pre-flight.sh` (currently 30 attempts × 2 seconds)
2. Check for port conflicts on port 3000
3. Verify Node.js version (24+) is being used

### Post-deployment tests timeout

**Problem:** Post-deployment tests fail because service is not responding.

**Solution:**
1. Manually check if the Cloud Run service is healthy
2. Increase timeout in `scripts/e2e-post-deployment.sh` or `scripts/wait-for-service.sh`
3. Check Cloud Run logs for deployment issues

### Tests pass locally but fail in CI/CD

**Problem:** Tests work locally but fail in Cloud Build.

**Solution:**
1. Check environment variables are correctly set in `apphosting.yaml`
2. Verify test credentials in Secret Manager are correct
3. Check Cloud Build logs for specific error messages
4. Run pre-flight tests locally against the same environment (`npm run test:e2e:ci-preflight`)

## Files Changed

### New Files
- `scripts/e2e-pre-flight.sh` - Pre-deployment test runner
- `scripts/e2e-post-deployment.sh` - Post-deployment test runner
- `scripts/wait-for-service.sh` - Service health check utility
- `cloudbuild.yaml` - Cloud Build configuration for production (master) branch
- `cloudbuild.uat.yaml` - Cloud Build configuration for UAT (uat) branch
- `cloudbuild.postdeploy.yaml` - Cloud Build configuration for post-deployment smoke tests (production)
- `cloudbuild.postdeploy.uat.yaml` - Cloud Build configuration for post-deployment smoke tests (UAT)
- `docs/E2E_CI_CD_SETUP.md` - This document
- `docs/FIREBASE_APPHOSTING_SETUP.md` - Firebase App Hosting setup guide for multiple branches

### Modified Files
- `apphosting.yaml` - Added test credentials (production)
- `apphosting.uat.yaml` - Added test credentials (UAT)
- `playwright.config.ts` - Added environment detection for localhost vs live environment
- `package.json` - Added CI/CD test scripts
- `e2e/signin.spec.ts` - Added @smoke tag to critical test
- `README.md` - Updated testing documentation

### Removed Files
- `.github/workflows/playwright.yml` - Removed GitHub Actions workflow (no longer needed)

## Future Enhancements

1. **Parallel Test Execution:** Configure Cloud Build to run tests in parallel
2. **Test Report Storage:** Store HTML reports in Cloud Storage for long-term retention
3. **Slack Notifications:** Send test results to Slack for team visibility
4. **Custom Health Checks:** Add more sophisticated pre-flight validation
5. **Performance Monitoring:** Integrate with Cloud Trace to monitor test performance
6. **Database Seeding:** Optionally seed test data before running tests
