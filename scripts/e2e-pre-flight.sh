#!/bin/bash
set -e

##############################################################################
# Pre-Deployment E2E Tests
# Runs Playwright tests against localhost before deployment
# This acts as a gate - if tests fail, deployment is blocked
##############################################################################

echo "=========================================="
echo "Starting Pre-Flight E2E Tests"
echo "=========================================="

# Set environment to CI mode
export CI=true

# Ensure test credentials are available
if [[ -z "$PW_TEST_EMAIL" ]] || [[ -z "$PW_TEST_PASSWORD" ]]; then
  echo "ERROR: Test credentials not found in environment"
  echo "  Required: PW_TEST_EMAIL, PW_TEST_PASSWORD"
  echo "  These should be configured in your apphosting config via Secret Manager"
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

# Run Playwright tests
# Note: the dev server is started automatically by Playwright's `webServer`
# config in playwright.config.ts (non-live environments only) — no manual
# server startup or URL polling needed here.
echo "Running Playwright tests..."
if npm run test:e2e; then
  echo ""
  echo "=========================================="
  echo "✓ Pre-flight tests PASSED"
  echo "=========================================="
  TEST_STATUS=0
else
  echo ""
  echo "=========================================="
  echo "✗ Pre-flight tests FAILED"
  echo "=========================================="
  TEST_STATUS=1
fi

exit $TEST_STATUS
