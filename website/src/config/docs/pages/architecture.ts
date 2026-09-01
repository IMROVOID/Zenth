import type { DocPage } from '../types';

export const architectureDocPage: DocPage = {
  slug: 'architecture',
  title: 'System Architecture & Invariants',
  subtitle:
    'Decoupled multi-tier system topology, clean domain separation, and hard architectural invariants under 200 lines per file.',
  category: 'Core Architecture',
  categorySlug: 'core-architecture',
  statusTag: '[STRICT MODULARITY]',
  badges: ['[DECOUPLED_TIERS]', '[<200_LINES/FILE]', '[ES2022/NodeNext]', '[STRICT_TYPES]'],
  lastUpdated: 'August 2026',
  prevPage: { title: 'Onboarding Wizard', slug: 'onboarding-wizard' },
  nextPage: { title: 'Market Feeds', slug: 'market-feeds' },
  sections: [
    {
      id: 'architecture-topology',
      title: 'Decoupled Multi-Tier System Topology',
      content:
        'Zenth is structured into four independent layers ensuring zero coupling between exchange feeds, strategy computation, risk controls, memory persistence, and terminal presentation.',
      statGrid: [
        { label: 'MARKET LAYER', value: '6 Feeds', badge: 'Zero Private API Keys' },
        { label: 'STRATEGY ENGINE', value: 'SMA + RSI', badge: 'Deterministic Signals' },
        { label: 'CAPITAL GUARD', value: '$1,000 Cap', badge: 'Hard Real-Time Ceilings' },
        { label: 'PERSISTENCE', value: '5 Backends', badge: 'Supabase RLS & Local' },
      ],
    },
    {
      id: 'domain-directory-map',
      title: 'Domain Package Map',
      content:
        'Every functional domain is strictly partitioned into dedicated directories:',
      matrixTable: {
        headers: ['Directory Package', 'Responsibility & Key Modules', 'Line Constraint'],
        rows: [
          ['src/core/bot', 'Main loop coordinator, scanner, position manager, session metrics', '< 200 lines / file'],
          ['src/core/market', 'ExchangeRegistry, venue adapters, interval & symbol normalizers', '< 200 lines / file'],
          ['src/core/strategy', 'Indicators math (SMA 9/21, RSI 14, Vol20) and StrategyEngine', '< 200 lines / file'],
          ['src/core/risk', 'RiskManager with $1,000 notional cap and drawdown circuit breakers', '< 200 lines / file'],
          ['src/core/memory', 'Polymorphic DatabaseAdapters (SQLite, PG, Mongo, Supabase, RAM)', '< 200 lines / file'],
          ['src/core/export', 'TXT, CSV, Markdown, Word DOCX, and Vector PDF 1.4 serializers', '< 200 lines / file'],
          ['src/tui', 'Fullscreen ANSI compositor, pinned HUD, themes & slash command palette', '< 200 lines / file'],
        ],
      },
    },
    {
      id: 'under-200-lines-rule',
      title: 'The Under 200 Lines Invariant',
      content:
        'Every source file in the repository must not exceed 200 lines of code. High-complexity domains are decomposed into single-responsibility submodules (e.g. `loopIteration.ts`, `loopEntryEvaluator.ts`, `loopPositionMonitor.ts`), ensuring zero circular dependencies and maximum testability.',
      callout: {
        type: 'invariant',
        title: 'ARCHITECTURAL INVARIANT',
        body: 'Hard ceiling: <= 200 lines per file. Enforced continuously in CI and development.',
      },
    },
  ],
};
