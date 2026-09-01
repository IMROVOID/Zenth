export interface FooterLinkItem {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
  isModalTrigger?: boolean;
  modalType?: 'privacy' | 'terms';
}

export interface FooterColumnItem {
  title: string;
  iconType: 'terminal' | 'exchange' | 'database' | 'docs' | 'community';
  links: FooterLinkItem[];
}

export interface FooterConfig {
  tagline: string;
  statusText: string;
  statusBadge: string;
  badges: string[];
  columns: FooterColumnItem[];
  disclaimer: {
    title: string;
    description: string;
    notionalCapText: string;
  };
  attribution: {
    prefixText: string;
    authorName: string;
    authorUrl: string;
    copyrightText: string;
  };
  legalModal: {
    privacy: {
      title: string;
      lastUpdated: string;
      sections: { heading: string; body: string }[];
    };
    terms: {
      title: string;
      lastUpdated: string;
      sections: { heading: string; body: string }[];
    };
  };
}

export const footerConfig: FooterConfig = {
  tagline:
    'Autonomous self-learning cryptocurrency paper trading terminal with multi-exchange feeds, adaptive memory, and institutional risk management.',
  statusText: 'All Exchange Feeds Operational',
  statusBadge: '[SYSTEM ONLINE]',
  badges: ['[v1.0.1]', '[PAPER_ONLY]', '[GPL-3.0]'],
  columns: [
    {
      title: 'Product & Engine',
      iconType: 'terminal',
      links: [
        { label: 'Autonomous Engine', href: '/documentation/overview/' },
        { label: 'Signal Pipeline', href: '/documentation/quantitative-strategy/' },
        { label: 'Core Capabilities', href: '/documentation/architecture/' },
        { label: 'Quick Installation', href: '/documentation/installation/' },
        { label: 'Frequently Asked Questions', href: '#faq' },
        { label: 'Multi-Format Exporter', href: '/documentation/export-engine/', badge: 'PDF/DOCX' },
      ],
    },
    {
      title: 'Exchange Venues',
      iconType: 'exchange',
      links: [
        { label: 'Binance (Spot & Futures)', href: '/documentation/market-feeds/', badge: 'ZERO-KEY' },
        { label: 'Coinbase (Exchange & CDP)', href: '/documentation/market-feeds/', badge: 'ZERO-KEY' },
        { label: 'OKX (v5 Unified REST)', href: '/documentation/market-feeds/', badge: 'ZERO-KEY' },
        { label: 'Upbit (KRW/USDT Markets)', href: '/documentation/market-feeds/', badge: 'ZERO-KEY' },
        { label: 'Bitget (v2 Spot & Futures)', href: '/documentation/market-feeds/', badge: 'ZERO-KEY' },
        { label: 'XT.com (Spot & Equities)', href: '/documentation/market-feeds/', badge: 'ZERO-KEY' },
      ],
    },
    {
      title: 'Storage & Memory',
      iconType: 'database',
      links: [
        { label: 'SQLite (node:sqlite)', href: '/documentation/storage-engines/', badge: 'EMBEDDED' },
        { label: 'PostgreSQL (pg.Pool)', href: '/documentation/storage-engines/' },
        { label: 'MongoDB (MongoClient)', href: '/documentation/storage-engines/' },
        { label: 'Supabase Cloud PostgreSQL', href: '/documentation/storage-engines/', badge: 'RLS' },
        { label: 'In-Memory RAM Store', href: '/documentation/storage-engines/', badge: 'OFFLINE' },
      ],
    },
    {
      title: 'Guides & Docs',
      iconType: 'docs',
      links: [
        { label: 'Architecture Specifications', href: '/documentation/architecture/' },
        { label: '$1,000 Hard Cap Rules', href: '/documentation/risk-management/' },
        { label: 'SMA 9/21 & RSI 14 Formulas', href: '/documentation/quantitative-strategy/' },
        { label: 'Docker Compose Setup', href: '/documentation/installation/' },
        { label: 'Continuous Test Suites', href: '/documentation/test-suite/' },
      ],
    },
    {
      title: 'Ecosystem',
      iconType: 'community',
      links: [
        { label: 'GitHub Repository', href: 'https://github.com/IMROVOID/Zenth', isExternal: true },
        { label: 'NPM Global Package', href: 'https://www.npmjs.com/package/zenth', isExternal: true, badge: 'npm' },
        { label: 'Release Notes & Changelog', href: 'https://github.com/IMROVOID/Zenth/releases', isExternal: true },
        { label: 'Bug Reports & Issues', href: 'https://github.com/IMROVOID/Zenth/issues', isExternal: true },
        { label: 'Community Discussions', href: 'https://github.com/IMROVOID/Zenth/discussions', isExternal: true },
      ],
    },
  ],
  disclaimer: {
    title: 'Simulated Paper Trading & Capital Risk Notice',
    description:
      'Zenth is an open-source educational software suite and algorithmic paper trading terminal. Zenth connects exclusively to public market data feeds, does not execute live financial transactions, does not hold custody of user funds, and does not require private exchange API keys.',
    notionalCapText:
      'All order routing is strictly simulated with a hard ceiling of $1,000.00 USD/USDT maximum allocation per trade. Nothing on this website or in the Zenth codebase constitutes financial, investment, or legal advice.',
  },
  attribution: {
    prefixText: 'Designed & Developed by',
    authorName: 'ROVOID',
    authorUrl: 'https://rovoid.netlify.app',
    copyrightText: '© 2026 Zenth Platform. Released as Open Source under GNU General Public License v3.0.',
  },
  legalModal: {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'August 2026',
      sections: [
        {
          heading: '1. Zero Telemetry & Data Sovereignty',
          body: 'Zenth operates locally on your machine. We do not collect, transmit, track, or monetize your trading data, IP addresses, terminal commands, or runtime telemetry.',
        },
        {
          heading: '2. Public Market Data Access',
          body: 'Market feeds (Binance, Coinbase, OKX, Upbit, Bitget, XT.com) are consumed via public read-only endpoints without authentication, API keys, or user-identifying credentials.',
        },
        {
          heading: '3. Local & Cloud Persistence',
          body: 'Database credentials (PostgreSQL, MongoDB, Supabase) are stored locally in your .env file. When using Supabase, Row-Level Security (RLS) policies enforce cryptographic isolation.',
        },
        {
          heading: '4. Third-Party Links',
          body: 'External links provided on this site are for documentation and developer convenience. We do not control or assume responsibility for external site privacy policies.',
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'August 2026',
      sections: [
        {
          heading: '1. Acceptance & Open Source License',
          body: 'By downloading, running, or accessing Zenth, you agree to these Terms. Zenth is licensed under the GNU General Public License v3.0 (GPL-3.0).',
        },
        {
          heading: '2. Strictly Simulated Paper Trading',
          body: 'Zenth is designed exclusively for quantitative research, backtesting, and paper trading simulation (mode: PAPER). The software is hardcoded with a $1,000 simulated allocation cap.',
        },
        {
          heading: '3. No Financial Advice & Disclaimer of Warranties',
          body: 'The software is provided AS IS without warranty of any kind. Developers and contributors bear no liability for simulated losses, software bugs, market discrepancies, or data feed downtime.',
        },
        {
          heading: '4. Compliance & Local Laws',
          body: 'Users are solely responsible for ensuring compliance with all local laws and regulations governing cryptocurrency market analysis in their jurisdiction.',
        },
      ],
    },
  },
};
