# Notes

## Authenticate service account in local dev

```bash
gcloud config set project certifai-prod

export GOOGLE_APPLICATION_CREDENTIALS=/...

gcloud auth activate-service-account --key-file=...
```

## Grant app hosting secret access

```bash
# For each secret defined in apphosting.yaml, access request is needed

firebase apphosting:secrets:grantaccess -b [BACKEND_NAME] GCP_CREDENTIALS_JSON

firebase apphosting:secrets:grantaccess -b [BACKEND_NAME] JOSE_JWT_SECRET

firebase apphosting:secrets:grantaccess -b [BACKEND_NAME] NEXT_PUBLIC_FIREBASE_BACKEND_URL

```
