# Project init checklist

## Architecture Decision: Server-Side Authenticated API Pattern

**Key Decision**: Public pages use server-side components with authenticated API requests instead of separate public endpoints.

**Why**: This approach provides better security, performance, and maintainability while ensuring all data access is properly authenticated and audited.

**Documentation**: See `/docs/server-side-authenticated-api-pattern.md` for complete implementation details.

## Set up new project

Navigate to Firebase settings, and register app and get env vars

Create .env.local, and fill up values based on env.sample

Replace values in apphosting.yml

Create the secrets in secret manager

- GCP_CREDENTIALS_JSON
- JOSE_JWT_SECRET
- NEXT_PUBLIC_FIREBASE_BACKEND_URL

```sh
firebase use default

firebase apphosting:secrets:grantaccess -b app GCP_CREDENTIALS_JSON
firebase apphosting:secrets:grantaccess -b app JOSE_JWT_SECRET
firebase apphosting:secrets:grantaccess -b app NEXT_PUBLIC_FIREBASE_BACKEND_URL

firebase apphosting:secrets:set SERVICE_SECRET
firebase apphosting:secrets:grantaccess -b app SERVICE_SECRET
```

Enable Firebase Authentication

- Email/password

## Start local dev

```bash
gcloud config set project certifai-prod
export GOOGLE_APPLICATION_CREDENTIALS=/...
gcloud auth activate-service-account --key-file=...

npm run dev
```
