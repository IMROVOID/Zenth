export interface ExchangeItem {
  id: string;
  name: string;
  docsUrl: string;
}

export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export const siteConfig = {
  siteOrigin: 'https://rovoid.github.io',
  base: '/Zenth',
  version: '1.0.1',
  npmPackage: 'zenth',
  installCommand: 'npm i -g zenth',
  repoUrl: 'https://github.com/IMROVOID/Zenth',
  navItems: [
    { label: 'Features', href: '#features', hasDropdown: false },
    { label: 'Engine', href: '#engine', hasDropdown: false },
    { label: 'Exchanges', href: '#exchanges', hasDropdown: false },
    { label: 'Contribute', href: 'https://github.com/IMROVOID/Zenth', hasDropdown: false },
    { label: 'Docs', href: '#docs', hasDropdown: false },
  ] as NavItem[],
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
  exchanges: [
    { id: 'xt', name: 'XT.com', docsUrl: '/docs/reference/exchanges/#xt' },
    { id: 'binance', name: 'Binance', docsUrl: '/docs/reference/exchanges/#binance' },
    { id: 'coinbase', name: 'Coinbase', docsUrl: '/docs/reference/exchanges/#coinbase' },
    { id: 'okx', name: 'OKX', docsUrl: '/docs/reference/exchanges/#okx' },
    { id: 'upbit', name: 'Upbit', docsUrl: '/docs/reference/exchanges/#upbit' },
    { id: 'bitget', name: 'Bitget', docsUrl: '/docs/reference/exchanges/#bitget' },
  ] as ExchangeItem[],
};
