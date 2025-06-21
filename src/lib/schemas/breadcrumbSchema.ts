// Breadcrumb Schema Generator for SEO
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// Common breadcrumb paths
export const commonBreadcrumbs = {
  home: { name: 'Home', url: 'https://certifai.app' },
  about: { name: 'About', url: 'https://certifai.app/about' },
  pricing: { name: 'Pricing', url: 'https://certifai.app/pricing' },
  blog: { name: 'Blog', url: 'https://certifai.app/blog' },
  studyGuides: { name: 'Study Guides', url: 'https://certifai.app/study-guides' },
  documentation: { name: 'Documentation', url: 'https://certifai.app/documentation' },
  support: { name: 'Support', url: 'https://certifai.app/support' },
  contact: { name: 'Contact', url: 'https://certifai.app/contact' },
  community: { name: 'Community', url: 'https://certifai.app/community' },
};

// Predefined breadcrumb schemas for main pages
export const breadcrumbSchemas = {
  about: generateBreadcrumbSchema([commonBreadcrumbs.home, commonBreadcrumbs.about]),
  pricing: generateBreadcrumbSchema([commonBreadcrumbs.home, commonBreadcrumbs.pricing]),
  blog: generateBreadcrumbSchema([commonBreadcrumbs.home, commonBreadcrumbs.blog]),
  studyGuides: generateBreadcrumbSchema([commonBreadcrumbs.home, commonBreadcrumbs.studyGuides]),
  documentation: generateBreadcrumbSchema([
    commonBreadcrumbs.home,
    commonBreadcrumbs.documentation,
  ]),
  support: generateBreadcrumbSchema([commonBreadcrumbs.home, commonBreadcrumbs.support]),
  contact: generateBreadcrumbSchema([commonBreadcrumbs.home, commonBreadcrumbs.contact]),
  community: generateBreadcrumbSchema([commonBreadcrumbs.home, commonBreadcrumbs.community]),
};
