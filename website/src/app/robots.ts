import type { MetadataRoute } from 'next';
import { canonicalUrl } from '@/config/seo';
import { BASE_PATH } from '@/config/sitePaths';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: `${BASE_PATH}/_next/` }],
    sitemap: canonicalUrl('/sitemap.xml'),
  };
}
