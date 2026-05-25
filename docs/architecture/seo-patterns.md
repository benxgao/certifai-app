# SEO Patterns

> **Source of truth**: `src/lib/seo.ts`, `src/lib/seo-utils.ts`, `src/config/seo.ts`, `app/sitemap.ts`, `app/robots.ts`
> **Last reviewed**: 2026-05-26
> **Owner**: engineering

## Purpose

Documents the canonical SEO patterns used by `certifai-app`: metadata generation, structured data helpers, sitemap generation, robots rules, and the shared configuration object that keeps marketing routes consistent.

## Key Concepts

- **Metadata factory**: a helper that returns Next.js `Metadata` objects with consistent defaults.
- **SEO config**: shared tokens for titles, descriptions, social handles, verification codes, and keyword groups.
- **Structured data**: schema.org objects used to enrich public pages for search engines.
- **Crawler controls**: `robots.ts` and `sitemap.ts` outputs that define what bots should index.

## Primary Pattern: `generateMetadata()`

`src/lib/seo.ts` provides the default page-level metadata factory.

### Usage pattern

```typescript
export const metadata = generateMetadata({
  title: 'Pricing',
  description: 'Choose the right plan for your certification journey.',
  canonicalUrl: 'https://certestic.com/pricing',
});
```

### What it standardizes

- title composition with `SITE_NAME`
- description fallback to `SEO_CONFIG.SITE_DESCRIPTION`
- keyword fallback to `SEO_CONFIG.KEYWORDS.DEFAULT`
- Open Graph defaults
- Twitter card defaults
- canonical URL handling
- robots behavior for index vs. no-index pages
- verification metadata for Google/Bing/Yandex/Yahoo

## Shared Config: `SEO_CONFIG`

`src/config/seo.ts` is the canonical source for:

- site name and base URL
- default title and description
- social handles and links
- verification environment variables
- keyword groups
- page-template presets for major public routes

### Important config groups

| Group | Purpose |
| ----- | ------- |
| `SITE_*` | site identity and default metadata |
| `VERIFICATION` | search-engine verification codes |
| `KEYWORDS` | default, certifications, AI-feature, and training keyword sets |
| `PAGE_TEMPLATES` | reusable title/description presets for high-level routes |
| `SOCIAL_LINKS` | shared outbound social profile references |

## Specialized Metadata Helpers

`src/lib/seo.ts` includes route-aware helpers on top of the base factory.

| Helper | Use when |
| ------ | -------- |
| `generateMetadata()` | most public pages |
| `generateCertificationMetadata()` | certification detail or certification-focused marketing pages |
| `generateFirmMetadata()` | firm-specific certification hub pages |
| `generateCertificationStructuredData()` | certification pages that need course/schema markup |

These helpers keep marketing copy consistent and avoid each route manually reconstructing SEO tokens.

## Structured Data Helpers

`src/lib/seo-utils.ts` exports reusable schema generators.

| Helper | Schema type | Typical use |
| ------ | ----------- | ----------- |
| `generateOrganizationSchema()` | `Organization` | global/company identity |
| `generateWebPageSchema()` | `WebPage` + optional breadcrumbs | public content pages |
| `generateSoftwareApplicationSchema()` | `SoftwareApplication` | product/landing pages |
| `generateFAQSchema()` | `FAQPage` | FAQ-rich marketing content |
| `generateBreadcrumbs()` | breadcrumb utility | building structured breadcrumb trails |
| `generateMetaTags()` | non-Next helper bundle | lower-level meta-tag composition |

## Route-Level SEO Outputs

### `app/sitemap.ts`

The sitemap route:

- emits static marketing pages,
- fetches dynamic certification data through `fetchCertificationsData()` from the server-only public-data layer,
- adds firm hub pages and certification detail pages,
- gracefully falls back to static pages if dynamic generation fails.

### `app/robots.ts`

The robots route:

- allows indexing of public marketing content,
- explicitly disallows protected/private areas such as `/main/` and `/api/`,
- sets crawler-specific rules for Googlebot, Bingbot, and major social-preview bots,
- points search engines at `https://certestic.com/sitemap.xml`.

## Practical Rules

- Use `generateMetadata()` or one of its specialized wrappers for public pages instead of hand-assembling `Metadata` objects repeatedly.
- Keep SEO constants in `SEO_CONFIG`; avoid hardcoding titles, social handles, or verification fields across pages.
- Use structured data helpers only on public, indexable pages.
- Keep canonical URLs explicit for pages with multiple entry points or potential duplicate-content risk.
- Use `noIndex` for pages that should not be indexed rather than inventing custom robots snippets in leaf components.

## Example Decisions

| Scenario | Preferred pattern |
| -------- | ----------------- |
| Standard marketing route | `generateMetadata()` |
| Certification detail page | `generateCertificationMetadata()` + `generateCertificationStructuredData()` |
| Firm hub page | `generateFirmMetadata()` |
| FAQ-heavy content page | `generateMetadata()` + `generateFAQSchema()` |
| Search-engine crawl control | update `app/robots.ts` and/or `app/sitemap.ts` |

## Dangerous Areas / Anti-patterns

- Do not hardcode site URLs or business identity strings in page files when `SEO_CONFIG` already owns them.
- Do not use private/dashboard routes in the sitemap.
- Do not mark protected routes as indexable.
- Do not duplicate structured-data assembly logic inside page components when a helper already exists.
- Do not confuse server-only public-data fetching for sitemap generation with authenticated dashboard data fetching.

## Related Docs

- [Architecture: Next.js Conventions](nextjs-conventions.md)
- [Server Actions](server-actions.md)
- [API Connection](../api/api-connection.md)
- [Workflow: Signin](../workflow/signin-workflow.md)
