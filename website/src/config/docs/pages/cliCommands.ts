import type { DocPage } from '../types';

export const cliCommandsDocPage: DocPage = {
  slug: 'cli-reference',
  title: 'CLI Operational Commands & Flags',
  subtitle:
    'Complete command-line interface specification for running Zenth in TUI, headless scan, backtest replay, and memory administration modes.',
  category: 'Developer Reference',
  categorySlug: 'developer-reference',
  statusTag: '[BINARY: zenth]',
  badges: ['[HEADLESS_SCAN]', '[REPLAY_RAW]', '[REPLAY_MEMORY]', '[ENV_OVERRIDE]'],
  lastUpdated: 'August 2026',
  prevPage: { title: 'Export Subsystem', slug: 'export-engine' },
  nextPage: { title: 'Test Suites', slug: 'test-suite' },
  sections: [
    {
      id: 'cli-modes-matrix',
      title: 'Operational Modes & CLI Syntax',
      content:
        'Run Zenth in interactive TUI, single-pass evaluation, or historical backtest mode:',
      matrixTable: {
        headers: ['CLI Command', 'Mode Execution', 'Operational Behavior'],
        rows: [
          ['zenth / npm start', 'TUI Interactive', 'Boots fullscreen touch/mouse terminal with pinned HUD'],
          ['zenth scan', 'Headless Scan', 'Single-pass real-time scan on default exchange feed'],
          ['zenth scan -e <venue>', 'Venue Flag', 'Scan on binance, coinbase, okx, upbit, bitget, or xt'],
          ['zenth scan -s <pair>', 'Symbol Flag', 'Scan on specific pair (e.g. eth_usdt, sol_usdt)'],
          ['zenth replay:raw', 'Raw Replay', 'Historical backtest baseline without adaptive memory'],
          ['zenth replay:memory', 'Memory Replay', 'Backtest with Supabase adaptive filter enabled'],
          ['zenth memory:reset', 'Memory Reset', 'Truncates and re-initializes database ledger tables'],
        ],
      },
    },
    {
      id: 'environment-variables-dictionary',
      title: 'Environment Variables Reference',
      content:
        'All parameters configured in `.env` or passed via environment overrides:',
      matrixTable: {
        headers: ['Variable Key', 'Default Value', 'Valid Options', 'Description'],
        rows: [
          ['STORAGE_BACKEND', 'sqlite', 'sqlite, postgres, mongodb, supabase, local', 'Persistence database engine'],
          ['EXCHANGE', 'binance', 'binance, coinbase, okx, upbit, bitget, xt', 'Primary market data venue'],
          ['DEFAULT_SYMBOL', 'btc_usdt', 'Any valid ticker', 'Default target market pair'],
          ['DEFAULT_INTERVAL', '5m', '1m, 5m, 15m, 30m, 1h, 4h, 1d', 'Candlestick timeframe'],
          ['DEFAULT_QUANTITY', '0.01', 'Float > 0', 'Base order quantity per signal'],
          ['MAX_POSITION_NOTIONAL_CAP', '1000.0', 'Float <= 5000.0', 'Hard notional ceiling ($ USD)'],
          ['STOP_LOSS_PCT', '1.5', '0.5 to 5.0', 'Downside Stop-Loss bracket %'],
          ['TAKE_PROFIT_PCT', '3.0', '1.0 to 10.0', 'Upside Take-Profit bracket %'],
          ['POLL_INTERVAL_SECONDS', '15', 'Integer >= 5', 'Candle polling frequency in seconds'],
        ],
      },
    },
  ],
};
