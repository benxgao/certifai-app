# Firebase App Hosting Setup for Multiple Branches

This guide explains how to configure Firebase App Hosting to run E2E tests on both the production (master) and UAT (uat) branches.

## Overview

Firebase App Hosting integrates with your GitHub repository and can deploy multiple backends based on different branches:
- **master branch** → Production deployment using `apphosting.yaml` and `cloudbuild.yaml`
- **uat branch** → UAT deployment using `apphosting.uat.yaml` and `cloudbuild.uat.yaml`

Both deployments include pre-flight E2E tests that block the build if tests fail.

## Initial Setup (One-Time)

### 1. Connect Your Repository to Firebase App Hosting

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **App Hosting** (or **Build** → **App Hosting** depending on your Firebase version)
4. Click **Create backend** or **Connect repository**
5. Select your GitHub repository (`github.com/your-org/certifai-app`)

### 2. Create Secrets in Google Cloud Secret Manager

Create secrets in both your production and UAT GCP projects:

```bash
# Production Project
gcloud config set project certifai-prod
gcloud secrets create PW_TEST_EMAIL --replication-policy="automatic" --data-file=- <<< "test-user-prod@example.com"
gcloud secrets create PW_TEST_PASSWORD --replication-policy="automatic" --data-file=- <<< "prod-test-password"

# UAT Project (if in separate GCP project)
gcloud config set project certifai-uat
gcloud secrets create PW_TEST_EMAIL --replication-policy="automatic" --data-file=- <<< "test-user-uat@example.com"
gcloud secrets create PW_TEST_PASSWORD --replication-policy="automatic" --data-file=- <<< "uat-test-password"
```

### 3. Grant Cloud Build Service Account Permission

For each GCP project, grant the Cloud Build service account permission to access the secrets:

```bash
# Get your Cloud Build service account
SERVICE_ACCOUNT=$(gcloud projects describe PROJECT_ID --format='value(projectNumber)')-cloudbuild@cloudbuild.gserviceaccount.com

# Grant permissions
gcloud secrets add-iam-policy-binding PW_TEST_EMAIL \
  --member=serviceAccount:$SERVICE_ACCOUNT \
  --role=roles/secretmanager.secretAccessor

gcloud secrets add-iam-policy-binding PW_TEST_PASSWORD \
  --member=serviceAccount:$SERVICE_ACCOUNT \
  --role=roles/secretmanager.secretAccessor
```

## Production Branch Configuration (master)

### Step 1: Create Backend for master branch

1. In Firebase Console → App Hosting
2. Click **Create service** or **Create backend**
3. Configure:
   - **Backend name:** `certifai-app` or similar
   - **Region:** `us-central1`
   - **Branch:** `master` (or `main`)
   - **Build configuration:** Select `Custom Cloud Build configuration`
   - **Build file location:** `cloudbuild.yaml`
   - **Runtime:** Cloud Run

### Step 2: Configure Environment Variables

Firebase App Hosting automatically reads from `apphosting.yaml`. Ensure your `apphosting.yaml` contains:
- All required public environment variables (Firebase config, API URLs)
- Secret references (PW_TEST_EMAIL, PW_TEST_PASSWORD, etc.)

The secrets will be automatically resolved from Google Cloud Secret Manager.

### Step 3: Verify Pre-Flight Tests Run

When you push to the `master` branch:
1. Firebase App Hosting triggers a Cloud Build
2. Cloud Build executes `cloudbuild.yaml`
3. Pre-flight E2E tests run against localhost
4. If tests pass, deployment proceeds
5. If tests fail, deployment is blocked

Monitor the build in Cloud Build console or Firebase Console.

## UAT Branch Configuration (uat)

### Step 1: Create Backend for uat branch

1. In Firebase Console → App Hosting
2. Click **Create service** or **Create backend** (usually within same project or in UAT project)
3. Configure:
   - **Backend name:** `certifai-app-uat`
   - **Region:** `us-central1`
   - **Branch:** `uat`
   - **Build configuration:** Select `Custom Cloud Build configuration`
   - **Build file location:** `cloudbuild.uat.yaml`
   - **Runtime:** Cloud Run

### Step 2: Configure Environment Variables

Firebase App Hosting will use `apphosting.uat.yaml` for the UAT branch. Ensure it contains:
- HTTP_HOST_URL pointing to UAT domain
- UAT Firebase project credentials
- Secret references (same secret names as production)

### Step 3: Verify Pre-Flight Tests Run

When you push to the `uat` branch:
1. Firebase App Hosting triggers a Cloud Build
2. Cloud Build executes `cloudbuild.uat.yaml`
3. Environment detected as UAT by playwright.config.ts
4. Pre-flight E2E tests run (tests reuse auth state)
5. If tests pass, UAT deployment proceeds
6. If tests fail, UAT deployment is blocked

## Post-Deployment Testing (Optional)

Post-deployment smoke tests validate the live environment. They're non-blocking and can be set up separately.

### For Production

Create a Cloud Build trigger:
- **Name:** `certifai-app-e2e-postdeploy-prod`
- **Source:** GitHub repository, branch `^master$`
- **Build configuration:** `cloudbuild.postdeploy.yaml`
- **Trigger on:** Push or Manual

Substitutions:
```yaml
_SERVICE_URL: https://certestic.com
_DEPLOYMENT_ENV: prod
```

### For UAT

Create a Cloud Build trigger:
- **Name:** `certifai-app-e2e-postdeploy-uat`
- **Source:** GitHub repository, branch `^uat$`
- **Build configuration:** `cloudbuild.postdeploy.uat.yaml`
- **Trigger on:** Push or Manual

Substitutions:
```yaml
_SERVICE_URL: https://uat--certifai-uat.us-central1.hosted.app
_DEPLOYMENT_ENV: uat
```

## Files Overview

### Build Configuration Files

| File | Purpose | Trigger |
|------|---------|---------|
| `cloudbuild.yaml` | Production pre-flight tests | master branch push |
| `cloudbuild.uat.yaml` | UAT pre-flight tests | uat branch push |
| `cloudbuild.postdeploy.yaml` | Production post-deployment smoke tests | Manual or scheduled |
| `cloudbuild.postdeploy.uat.yaml` | UAT post-deployment smoke tests | Manual or scheduled |

### Configuration Files

| File | Purpose | Branch |
|------|---------|--------|
| `apphosting.yaml` | Production environment config | master |
| `apphosting.uat.yaml` | UAT environment config | uat |

### Test Scripts

| File | Purpose |
|------|---------|
| `scripts/e2e-pre-flight.sh` | Run tests on localhost (used by cloudbuild.yaml) |
| `scripts/e2e-post-deployment.sh` | Run tests on live URL (used by cloudbuild.postdeploy.yaml) |
| `scripts/wait-for-service.sh` | Health check for Cloud Run service |

## Workflow

### Development → UAT → Production

1. **Create feature branch:** `git checkout -b feature/my-feature`
2. **Commit and test:** Ensure local tests pass
3. **Create PR to uat:** Push to GitHub, create pull request
4. **PR triggers UAT build:**
   - Firebase App Hosting runs `cloudbuild.uat.yaml`
   - Pre-flight tests run on localhost
   - If tests pass, review and merge
5. **Merge to uat branch:** Build triggers UAT deployment
   - Pre-flight tests run
   - UAT Cloud Run service deployed
   - Optionally, post-deployment smoke tests run
6. **Create PR to master:** After validation in UAT
7. **PR triggers prod build:**
   - Firebase App Hosting runs `cloudbuild.yaml`
   - Pre-flight tests run on localhost
   - If tests pass, review and merge
8. **Merge to master branch:** Build triggers production deployment
   - Pre-flight tests run
   - Production Cloud Run service deployed

## Monitoring

### Cloud Build Logs

View build logs in [Cloud Build Console](https://console.cloud.google.com/cloud-build):
1. Select your GCP project
2. Go to **Cloud Build** → **Build history**
3. Click on a build to see detailed logs
4. Search for "E2E test" or "Playwright" to find test output

### Firebase App Hosting Console

In Firebase Console:
1. Go to **App Hosting** → **Deployments**
2. View deployment status and history
3. Click on a deployment to see more details

### Test Reports

Pre-flight test reports are included in Cloud Build logs.

For post-deployment tests, reports are stored in `playwright-report/` directory in the build logs or can be uploaded to Cloud Storage (future enhancement).

## Troubleshooting

### Tests fail with "Missing test credentials"

**Check:**
1. Secrets exist in Google Cloud Secret Manager
2. Cloud Build service account has `roles/secretmanager.secretAccessor`
3. Build configuration specifies correct secret references

### UAT branch doesn't trigger build

**Check:**
1. Firebase App Hosting backend is configured for `uat` branch
2. Build configuration file is set to `cloudbuild.uat.yaml`
3. Repository branch naming is correct (exactly `uat`, not `uat-*`)

### Tests timeout in Cloud Build

**Solutions:**
1. Check if the build machine has enough resources
2. Increase timeout in shell scripts (currently 30 attempts × 2-10 seconds)
3. Verify Node.js and Playwright browser installation completes before tests

## Next Steps

1. ✅ Push to `uat` branch and monitor the build
2. ✅ Verify pre-flight tests run and pass
3. ✅ Set up post-deployment triggers (optional)
4. ✅ Configure Slack/email notifications for build status
5. ✅ Monitor test flakiness and adjust retry logic as needed
