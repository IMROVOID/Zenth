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

export interface WhatIsZenthConfig {
  title: string;
  subtitle: string;
  videoSrc: string;
  terminalTitle: string;
}

export interface HowItWorksStatItem {
  label: string;
  value: string;
  subtext?: string;
}

export interface HowItWorksConfig {
  pillText: string;
  title: string;
  subtitle: string;
  leftStats: HowItWorksStatItem[];
  rightStats: HowItWorksStatItem[];
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
  whatIsZenth: WhatIsZenthConfig;
  howItWorks: HowItWorksConfig;
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
      'Autonomous paper trading terminal with multi-exchange feeds, adaptive memory, and institutional risk management.',
    contactLabel: 'Get Started',
    languageLabel: 'EN',
  },
  whatIsZenth: {
    title: 'What is Zenth',
    subtitle:
      'An autonomous paper trading terminal engineered for precision market simulation. Connected to live XT.com candlestick feeds and Supabase PostgreSQL memory, Zenth runs continuous self-learning indicator loops with zero human intervention.',
    videoSrc: '/videos/Zenth-V1.0.0.mp4',
    terminalTitle: 'zenth-tui v1.0.0 — LIVE STREAM',
  },
  howItWorks: {
    pillText: 'Autonomous Execution Pipeline',
    title: 'From Market Signal to Execution in Milliseconds',
    subtitle:
      'Zenth continuously ingests live candlestick feeds, computes multi-timeframe indicators, and triggers optimal Buy and Sell positions with zero-delay risk checks.',
    leftStats: [
      {
        label: 'Candlestick Ingestion',
        value: '50B+',
        subtext: '5s Interval Feeds',
      },
      {
        label: 'Adaptive Risk Rules',
        value: '55+',
        subtext: 'Drawdown Guard < 3.5%',
      },
    ],
    rightStats: [
      {
        label: 'Active Indicator Loops',
        value: '70+',
        subtext: 'SMA 9/21 + RSI 14',
      },
      {
        label: 'Order Execution Speed',
        value: '< 12ms',
        subtext: 'Simulated Paper Mode',
      },
    ],
  },
};

