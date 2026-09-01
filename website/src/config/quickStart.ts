export interface InstallTabItem {
  id: string;
  label: string;
  badge: string;
  command: string;
  comment: string;
  description: string;
}

export interface QuickStartStepItem {
  step: string;
  badge: string;
  title: string;
  description: string;
  actionCode?: string;
  actionLabel?: string;
}

export interface DocsCalloutConfig {
  title: string;
  description: string;
  docsUrl: string;
  githubUrl?: string;
  features: string[];
}

export interface QuickStartConfig {
  pillText: string;
  title: string;
  subtitle: string;
  terminalTitle: string;
  installTabs: InstallTabItem[];
  steps: QuickStartStepItem[];
  docsCallout: DocsCalloutConfig;
}

export const quickStartConfig: QuickStartConfig = {
  pillText: 'Quick Installation & Setup',
  title: 'Deploy Zenth in Under 60 Seconds',
  subtitle:
    'Instant setup with zero-config embedded SQLite, pluggable multi-exchange feeds, and touch-enabled terminal controls.',
  terminalTitle: 'zenth-cli — QUICK START',
  installTabs: [
    {
      id: 'global-cli',
      label: 'Global CLI',
      badge: 'RECOMMENDED',
      command: 'npm i -g zenth\nzenth',
      comment: '# Install standalone binary globally and launch interactive TUI',
      description: 'Zero external database required. Automatically boots with embedded SQLite.',
    },
    {
      id: 'pnpm-cli',
      label: 'PNPM',
      badge: 'FAST',
      command: 'pnpm add -g zenth\nzenth',
      comment: '# Instant global install via PNPM package manager',
      description: 'Lightweight, rapid package installation for modern developer environments.',
    },
    {
      id: 'git-source',
      label: 'From Source',
      badge: 'DEVELOPER',
      command: 'git clone https://github.com/IMROVOID/Zenth.git\ncd Zenth && npm install\nnpm start',
      comment: '# Clone source repository, install dependencies, and build',
      description: 'Full access to TypeScript source code, test suites, and custom strategy modules.',
    },
    {
      id: 'one-line-scan',
      label: 'Live Scanner',
      badge: 'HEADLESS',
      command: 'npx tsx src/index.ts scan -e binance',
      comment: '# Single-pass real-time market scan without TUI mode',
      description: 'Stream live candlestick feeds and evaluate indicator signals instantaneously.',
    },
  ],
  steps: [
    {
      step: '01',
      badge: 'PREREQUISITES',
      title: 'Install Node.js & CLI',
      description:
        'Requires Node.js 22+ LTS. Install globally via npm or pnpm to access the standalone `zenth` terminal command anywhere.',
      actionCode: 'npm i -g zenth',
      actionLabel: 'Install Package',
    },
    {
      step: '02',
      badge: 'ONBOARDING',
      title: 'Guided Auto-Provisioning',
      description:
        'First launch triggers a 4-step wizard. Auto-creates SQLite, PostgreSQL, MongoDB, or connects to Supabase Cloud PostgreSQL.',
      actionCode: 'zenth',
      actionLabel: 'Launch Wizard',
    },
    {
      step: '03',
      badge: 'EXECUTION',
      title: 'Autonomous Simulation',
      description:
        'Monitor live feeds across 6 exchanges with pinned HUD, SMA 9/21 crossovers, RSI 14 momentum, and $1,000 capital guardrails.',
      actionCode: 'zenth scan -e binance',
      actionLabel: 'Live Feeds',
    },
  ],
  docsCallout: {
    title: 'Looking for Deep Architecture & Strategy Guides?',
    description:
      'Explore full documentation on pluggable exchange feeds (Binance, Coinbase, OKX, Upbit, Bitget, XT.com), Supabase PostgreSQL RLS policies, Docker Compose multi-DB provisioning, SMA/RSI quantitative formulas, and multi-format exporters (PDF, DOCX, CSV, MD).',
    docsUrl: '/documentation/',
    githubUrl: 'https://github.com/IMROVOID/Zenth',
    features: [
      'Multi-Exchange Normalization & Fallbacks',
      'Supabase Cloud RLS & Local Multi-DB DDL',
      'SMA 9/21, RSI 14 & 1:2 R:R Profit Brackets',
      'Zero-Dependency Vector PDF & DOCX Exports',
    ],
  },
};
