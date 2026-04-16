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

# Start the development server in the background
echo "Starting Next.js development server..."
npm run dev > /tmp/next-dev.log 2>&1 &
DEV_PID=$!

# Wait for dev server to be ready
echo "Waiting for dev server to be ready..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✓ Dev server is ready"
    break
  fi
  attempt=$((attempt + 1))
  sleep 2
done

if [ $attempt -ge $max_attempts ]; then
  echo "ERROR: Dev server did not start within expected time"
  kill $DEV_PID || true
  cat /tmp/next-dev.log
  exit 1
fi

# Run Playwright tests
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

# Cleanup: stop the dev server
echo "Cleaning up..."
kill $DEV_PID || true
wait $DEV_PID 2>/dev/null || true

exit $TEST_STATUS
