export interface HeroConfig {
  badgeText: string;
  badgeHref: string;
  titleLine1: string;
  titleLine2Prefix: string;
  titleWords: string[];
  titleLine2: string;
  description: string;
  contactLabel: string;
  languageLabel: string;
}

export interface SiteMetaConfig {
  name: string;
  siteOrigin: string;
  base: string;
  version: string;
  npmPackage: string;
  installCommand: string;
  repoUrl: string;
  hero: HeroConfig;
}

export const siteMeta: SiteMetaConfig = {
  name: 'Zenth',
  siteOrigin: 'https://rovoid.github.io',
  base: '/Zenth',
  version: '1.0.1',
  npmPackage: 'zenth',
  installCommand: 'npm i -g zenth',
  repoUrl: 'https://github.com/IMROVOID/Zenth',
  hero: {
    badgeText: 'Get Started',
    badgeHref: '#terminal',
    titleLine1: 'Autonomous Platform for',
    titleLine2Prefix: 'Self-Learning',
    titleWords: ['Crypto', 'Stocks'],
    titleLine2: 'Self-Learning Crypto',
    description:
      'Zenth is an autonomous self-learning cryptocurrency paper trading terminal featuring multi-exchange public feeds, pluggable memory, and institutional risk management.',
    contactLabel: 'Get Started',
    languageLabel: 'EN',
  },
};
