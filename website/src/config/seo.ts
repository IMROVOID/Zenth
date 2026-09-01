/** Canonical URL helpers and JSON-LD schema generators for Zenth. */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rovoid.github.io/Zenth';
const OG_IMAGE_URL = BASE_URL + '/images/og-image.jpg';

export const seoMeta = {
  siteUrl: BASE_URL,
  siteName: 'Zenth',
  twitterHandle: '@imrovoid',
  author: 'ROVOID',
  locale: 'en_US',
  keywords: [
    'autonomous trading bot',
    'cryptocurrency paper trading',
    'self-learning trading terminal',
    'algorithmic trading',
    'SMA RSI strategy',
    'crypto trading simulator',
    'XT.com market feeds',
    'adaptive trading memory',
    'TUI trading terminal',
    'open source trading bot',
  ],
  ogImage: {
    url: OG_IMAGE_URL,
    width: 1200,
    height: 630,
    alt: 'Zenth \u2014 Autonomous Self-Learning Trading Platform',
    type: 'image/jpeg',
  },
} as const;

export function canonicalUrl(path: string = ''): string {
  const clean = path.startsWith('/') ? path : '/' + path;
  return BASE_URL + clean;
}

export function getSoftwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Zenth',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Windows, macOS, Linux',
    description:
      'Autonomous paper trading terminal with multi-exchange feeds, adaptive self-learning memory, and institutional risk management.',
    url: canonicalUrl('/'),
    downloadUrl: 'https://www.npmjs.com/package/zenth',
    installUrl: 'https://github.com/IMROVOID/Zenth',
    softwareVersion: '1.0.1',
    author: { '@type': 'Person', name: 'ROVOID', url: 'https://github.com/IMROVOID' },
    publisher: { '@type': 'Organization', name: 'ROVOID', url: 'https://github.com/IMROVOID' },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: ['Zero-key public exchange feeds', 'Adaptive failure learning', 'Institutional risk controls'],
    screenshot: OG_IMAGE_URL,
  };
}

export function getFaqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function getBreadcrumbSchema(crumbs: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: canonicalUrl(c.href),
    })),
  };
}
