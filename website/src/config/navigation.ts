export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface ExchangeItem {
  id: string;
  name: string;
  docsUrl: string;
}

export const navItems: NavItem[] = [
  { label: 'Features', href: '#features', hasDropdown: false },
  { label: 'Engine', href: '#engine', hasDropdown: false },
  { label: 'Exchanges', href: '#exchanges', hasDropdown: false },
  { label: 'Contribute', href: 'https://github.com/IMROVOID/Zenth', hasDropdown: false },
  { label: 'Docs', href: '#docs', hasDropdown: false },
];

export const exchanges: ExchangeItem[] = [
  { id: 'xt', name: 'XT.com', docsUrl: '/docs/reference/exchanges/#xt' },
  { id: 'binance', name: 'Binance', docsUrl: '/docs/reference/exchanges/#binance' },
  { id: 'coinbase', name: 'Coinbase', docsUrl: '/docs/reference/exchanges/#coinbase' },
  { id: 'okx', name: 'OKX', docsUrl: '/docs/reference/exchanges/#okx' },
  { id: 'upbit', name: 'Upbit', docsUrl: '/docs/reference/exchanges/#upbit' },
  { id: 'bitget', name: 'Bitget', docsUrl: '/docs/reference/exchanges/#bitget' },
];
