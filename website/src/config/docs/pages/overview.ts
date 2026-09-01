import type { DocPage } from '../types';

export const overviewDocPage: DocPage = {
  slug: 'overview',
  title: 'Platform Overview',
  subtitle:
    'Autonomous self-learning cryptocurrency paper trading terminal connected to public multi-exchange feeds and Supabase PostgreSQL memory with Row-Level Security (RLS).',
  category: 'Getting Started',
  categorySlug: 'getting-started',
  statusTag: '[SYSTEM ONLINE]',
  badges: ['[v1.0.1]', '[PAPER_ONLY]', '[ZERO_KEYS]', '[GPL-3.0]'],
  lastUpdated: 'August 2026',
  prevPage: undefined,
  nextPage: { title: 'Installation & Setup', slug: 'installation' },
  sections: [
    {
      id: 'high-impact-metrics',
      title: 'Platform High-Impact Metrics',
      content:
        'Zenth is engineered for quantitative signal discovery, execution simulation, and continuous failure learning without financial risk.',
      statGrid: [
        { label: 'HARD ALLOCATION CAP', value: '$1,000.00', badge: '100% Capital Safety' },
        { label: 'INTEGRATED EXCHANGES', value: '6 Venues', badge: 'Zero Keys Needed' },
        { label: 'STORAGE ENGINES', value: '5 Adapters', badge: 'SQLite/PG/Mongo/Supa' },
        { label: 'STRATEGY SIGNALS', value: 'SMA 9/21 + RSI', badge: '1:2 Asymmetric R:R' },
      ],
    },
    {
      id: 'core-value-proposition',
      title: 'Core Value Proposition',
      content:
        'Zenth operates in strict simulated paper trading mode (`mode: PAPER`), eliminating capital risk while evaluating quantitative momentum strategies against genuine, live cryptocurrency tick data across Binance, Coinbase, OKX, Upbit, Bitget, and XT.com.',
      callout: {
        type: 'invariant',
        title: 'CRITICAL SYSTEM INVARIANTS',
        body: '1. Zero Private API Keys: Zenth NEVER requires or stores exchange secret keys.\n2. Hard $1,000 Cap: Maximum allocation limit of $1,000.00 USD/USDT per trade.\n3. Under 200 Lines/File: Strict modularity invariant across the entire codebase.',
      },
    },
    {
      id: 'system-pipeline-cards',
      title: 'Autonomous System Pipeline',
      content:
        'The trading lifecycle is structured as a decoupled multi-tier pipeline with continuous failure distillation.',
      matrixTable: {
        headers: ['Subsystem Layer', 'Domain Package', 'Key Operational Responsibility'],
        rows: [
          ['1. Market Feed Ingestion', 'src/core/market', 'Direct public REST polling with interval and pair normalization'],
          ['2. Quantitative Strategy', 'src/core/strategy', 'SMA 9/21 crossover, RSI 14 momentum, Volume SMA 20 filter'],
          ['3. Risk Management', 'src/core/risk', '$1,000 notional ceiling, daily loss & loss streak circuit breakers'],
          ['4. Execution Simulation', 'src/core/execution', 'Paper order simulator with Stop-Loss (1.5%) and Take-Profit (3.0%)'],
          ['5. Adaptive Learning', 'src/core/memory', 'Real-time failure ingestion & pre-trade pattern rejection'],
          ['6. Fullscreen TUI', 'src/tui', 'Touch & click terminal with pinned 3-row HUD & 14 color themes'],
          ['7. Multi-Format Exporter', 'src/core/export', 'Session exports to TXT, CSV, Markdown, Word DOCX, and PDF 1.4'],
        ],
      },
    },
  ],
};
