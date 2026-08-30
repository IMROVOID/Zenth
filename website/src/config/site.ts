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

export interface KeyFeatureItem {
  id: string;
  icon: 'analytics' | 'security' | 'ecosystem' | 'multicurrency';
  title: string;
  description: string;
}

export interface KeyFeaturesConfig {
  pillText: string;
  title: string;
  subtitle: string;
  features: KeyFeatureItem[];
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
  keyFeatures: KeyFeaturesConfig;
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
    badgeHref: '#quickstart',
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
  keyFeatures: {
    pillText: 'Core Capabilities',
    title: 'Engineered for Autonomous Precision',
    subtitle:
      'Zenth integrates zero-key multi-exchange market feeds, episodic self-learning failure memory, institutional capital guardrails, and a multi-format export engine into a unified terminal.',
    features: [
      {
        id: 'security',
        icon: 'security',
        title: 'Institutional Risk & $1,000 Hard Cap',
        description:
          'Strict capital preservation: $1,000 max allocation per trade, drawdown circuit breakers, and 1:2 R:R profit brackets.',
      },
      {
        id: 'ecosystem',
        icon: 'ecosystem',
        title: 'Self-Learning Adaptive Memory',
        description:
          'Automatically debriefs losing trades, extracts failure patterns, and distills plain-English rules into local or cloud database memory.',
      },
      {
        id: 'analytics',
        icon: 'analytics',
        title: 'Pluggable Multi-Exchange Ingestion',
        description:
          'Stream public candlestick feeds across Binance, Coinbase, OKX, Upbit, and Bitget with zero API keys and instant normalization.',
      },
      {
        id: 'multicurrency',
        icon: 'multicurrency',
        title: 'Multi-Format Exporter & Touch TUI',
        description:
          'Touch-enabled terminal with docked HUD, live slash commands, and zero-dependency PDF, DOCX, CSV, and Markdown exports.',
      },
    ],
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

