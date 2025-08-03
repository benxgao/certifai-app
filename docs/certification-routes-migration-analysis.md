# Certification Routes Migration Analysis

## Current Status

### ✅ Successfully Migrated (Slug-based)

1. **Main Certification Cards** (`/src/components/custom/CertificationsOverviewClient.tsx`)

   - ✅ Line 239: Updated to use `createSlug(cert.name)` instead of `cert.cert_id`
   - ✅ Links now go to `/certifications/[firmCode]/[slug]`

2. **Slug-based Route Structure**
   - ✅ `/app/certifications/[firmCode]/[slug]/page.tsx` - Main certification detail page
   - ✅ `/app/certifications/[firmCode]/[slug]/training/page.tsx` - Training page
   - ✅ `/app/api/public/certifications/slug/[slug]/route.ts` - API endpoint
   - ✅ `fetchCertificationDataBySlug()` server action implemented

### ⚠️ Legacy Routes Still Present (cert_id-based)

#### 1. Alternative Certification Detail Route

- **Location**: `/app/certifications/cert/[certId]/page.tsx`
- **Purpose**: Alternative route for certification details using cert_id
- **Status**: Still functional but should be deprecated

#### 2. Components Using Legacy Routes

- **CertificationsOverview.tsx** (Line 205):

  ```tsx
  href={`/certifications/cert/${cert.cert_id}`}
  ```

- **CertificationDetail.tsx** (Line 347):

  ```tsx
  : `/certifications/cert/${relatedCert.cert_id}`
  ```

  (Only as fallback when slug is not available)

- **CertificationMarketingPage.tsx** (Line 845):
  ```tsx
  href={`/certifications/${firmCode}/${related.cert_id}`}
  ```

#### 3. Main App Routes (User Dashboard - Keep These)

These are for authenticated user dashboard functionality and should be kept:

- **Keep**: `/app/main/certifications/[cert_id]/` - User's certification progress
- **Keep**: `/app/main/certifications/[cert_id]/exams/` - User's exam history
- **Keep**: `/app/main/certifications/[cert_id]/exams/[exam_id]/` - Specific exam details

## Recommended Actions

### Phase 1: Update Legacy Components

1. Update `CertificationsOverview.tsx` to use slug-based routing
2. Update `CertificationMarketingPage.tsx` related certification links
3. Improve fallback logic in `CertificationDetail.tsx`

### Phase 2: Deprecate Legacy Route

1. Add deprecation notice to `/app/certifications/cert/[certId]/page.tsx`
2. Implement redirect from cert_id to slug-based URL
3. Eventually remove the legacy route

### Phase 3: SEO and Redirects

1. Add 301 redirects from old cert_id URLs to new slug URLs
2. Update any external links or bookmarks
3. Update sitemap generation to only include slug-based URLs

## Routes to Keep (Different Purpose)

- `/app/main/certifications/[cert_id]/` - User dashboard (authenticated)
- All user exam management routes under `/main/` (authenticated area)

## Routes to Migrate/Remove

- `/app/certifications/cert/[certId]/` - Public certification details (duplicate)
- References in public-facing components that still use cert_id
