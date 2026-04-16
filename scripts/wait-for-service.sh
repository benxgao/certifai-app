#!/bin/bash

##############################################################################
# Wait for Service Health Check
# Used in Cloud Build to wait for the Cloud Run service to be ready
# before running post-deployment tests
##############################################################################

SERVICE_URL="${1:?Error: SERVICE_URL required as first argument}"
MAX_ATTEMPTS="${2:-60}"
WAIT_INTERVAL="${3:-5}"

echo "Waiting for service to be healthy..."
echo "  URL: $SERVICE_URL"
echo "  Timeout: $((MAX_ATTEMPTS * WAIT_INTERVAL)) seconds"

attempt=0
while [ $attempt -lt $MAX_ATTEMPTS ]; do
  if curl -s -f "$SERVICE_URL" > /dev/null 2>&1; then
    echo "✓ Service is ready and healthy"
    exit 0
  fi

  attempt=$((attempt + 1))
  echo "  Attempt $attempt/$MAX_ATTEMPTS: Service not ready yet..."
  sleep $WAIT_INTERVAL
done

echo "✗ Service did not become healthy within timeout"
exit 1
