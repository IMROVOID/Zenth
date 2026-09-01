import type { MetadataRoute } from 'next';
import { getAllDocSlugs } from '@/config/docs';
import { canonicalUrl } from '@/config/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const docRoutes = getAllDocSlugs().map((slug) => ({
    url: canonicalUrl(`/documentation/${slug}/`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  return [
    { url: canonicalUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: canonicalUrl('/documentation/'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    ...docRoutes,
  ];
}
