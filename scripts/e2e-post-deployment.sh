#!/bin/bash
set -e

##############################################################################
# Post-Deployment E2E Smoke Tests
# Runs Playwright tests against the live deployment URL
# This is a non-blocking validation that alerts on issues
##############################################################################

echo "=========================================="
echo "Starting Post-Deployment E2E Smoke Tests"
echo "=========================================="

# Set environment to CI mode
export CI=true

# Determine the target URL based on NODE_ENV
if [[ "$NODE_ENV" == "production" ]] || [[ "$DEPLOYMENT_ENV" == "prod" ]]; then
  TARGET_URL="https://certestic.com"
  echo "Target environment: PRODUCTION"
elif [[ "$NODE_ENV" == "uat" ]] || [[ "$DEPLOYMENT_ENV" == "uat" ]]; then
  TARGET_URL="https://uat--certifai-uat.us-central1.hosted.app"
  echo "Target environment: UAT"
else
  echo "WARNING: NODE_ENV is '$NODE_ENV' - falling back to UAT URL"
  TARGET_URL="https://uat--certifai-uat.us-central1.hosted.app"
fi

echo "Testing against: $TARGET_URL"

# Ensure test credentials are available
if [[ -z "$PW_TEST_EMAIL" ]] || [[ -z "$PW_TEST_PASSWORD" ]]; then
  echo "ERROR: Test credentials not found in environment"
  echo "  Required: PW_TEST_EMAIL, PW_TEST_PASSWORD"
  exit 1
fi

echo "✓ Test credentials loaded from environment"

# Install dependencies if not already done
if [[ ! -d "node_modules" ]]; then
  echo "Installing dependencies..."
  npm ci
fi

# Install Playwright browsers
echo "Ensuring Playwright browsers are installed..."
npx playwright install --with-deps chromium

# Wait for the service to be healthy with retries
echo "Checking service health..."
max_health_checks=30
health_check_attempt=0

while [ $health_check_attempt -lt $max_health_checks ]; do
  if curl -s -f "$TARGET_URL" > /dev/null 2>&1; then
    echo "✓ Service is healthy"
    break
  fi
  health_check_attempt=$((health_check_attempt + 1))
  echo "  Health check attempt $health_check_attempt/$max_health_checks..."
  sleep 10
done

if [ $health_check_attempt -ge $max_health_checks ]; then
  echo "WARNING: Service health check timed out after $(($max_health_checks * 10)) seconds"
  echo "  Proceeding anyway - tests may fail if service is unreachable"
fi

# Run Playwright tests with target URL override
echo "Running Playwright smoke tests..."
PLAYWRIGHT_TEST_BASEURL="$TARGET_URL" npm run test:e2e -- --grep @smoke || {
  TEST_STATUS=$?
  echo ""
  echo "=========================================="
  echo "⚠ Post-deployment tests had issues (exit code: $TEST_STATUS)"
  echo "=========================================="
  echo "Note: Post-deployment test failures are non-blocking"
  echo "The deployment has completed, but may have functional issues"
  exit 0  # Non-blocking - don't fail the deployment
}

echo ""
echo "=========================================="
echo "✓ Post-deployment tests PASSED"
echo "=========================================="
exit 0
