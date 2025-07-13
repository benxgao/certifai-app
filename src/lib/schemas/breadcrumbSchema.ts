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
  home: { name: 'Home', url: 'https://certestic.com' },
  about: { name: 'About', url: 'https://certestic.com/about' },
  pricing: { name: 'Pricing', url: 'https://certestic.com/pricing' },
  blog: { name: 'Blog', url: 'https://certestic.com/blog' },
  studyGuides: { name: 'Study Guides', url: 'https://certestic.com/study-guides' },
  documentation: { name: 'Documentation', url: 'https://certestic.com/documentation' },
  support: { name: 'Support', url: 'https://certestic.com/support' },
  contact: { name: 'Contact', url: 'https://certestic.com/contact' },
  community: { name: 'Discussion Forum', url: 'https://certestic.com/community' },
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
