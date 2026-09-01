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
  { label: 'FAQ', href: '#faq', hasDropdown: false },
  { label: 'Contribute', href: 'https://github.com/IMROVOID/Zenth', hasDropdown: false },
  { label: 'Docs', href: '/documentation/', hasDropdown: false },
];

export const exchanges: ExchangeItem[] = [
  { id: 'xt', name: 'XT.com', docsUrl: '/documentation/market-feeds/' },
  { id: 'binance', name: 'Binance', docsUrl: '/documentation/market-feeds/' },
  { id: 'coinbase', name: 'Coinbase', docsUrl: '/documentation/market-feeds/' },
  { id: 'okx', name: 'OKX', docsUrl: '/documentation/market-feeds/' },
  { id: 'upbit', name: 'Upbit', docsUrl: '/documentation/market-feeds/' },
  { id: 'bitget', name: 'Bitget', docsUrl: '/documentation/market-feeds/' },
];

