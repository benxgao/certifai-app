import { MetadataRoute } from 'next';
import { fetchCertificationsData } from '@/src/lib/server-actions/certifications';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://certestic.com';
  const currentDate = new Date();

  // Static pages with optimized priorities and change frequencies
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/certifications`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/study-guides`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/documentation`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Dynamic certification pages
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const { firms } = await fetchCertificationsData();

    // Add firm-specific certification pages
    dynamicPages = firms.flatMap((firm) => {
      const firmPages: MetadataRoute.Sitemap = [
        // Firm-specific certifications page
        {
          url: `${baseUrl}/certifications/${firm.code.toLowerCase()}`,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        },
        // Individual certification pages for this firm
        ...firm.certifications.map((cert) => ({
          url: `${baseUrl}/certifications/${firm.code.toLowerCase()}/${cert.cert_id}`,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })),
      ];

      return firmPages;
    });
  } catch (error) {
    // Error generating dynamic sitemap entries
    // Gracefully handle errors - sitemap will still work with static pages
  }

  return [...staticPages, ...dynamicPages];
}
