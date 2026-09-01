import type { DocPage } from '../types';

export const testSuitesDocPage: DocPage = {
  slug: 'test-suite',
  title: 'Verification & Automated Test Suites',
  subtitle:
    'Complete test harness documentation covering 14 unit and end-to-end simulation suites with Master Test Runner.',
  category: 'Developer Reference',
  categorySlug: 'developer-reference',
  statusTag: '[14/14 SUITES PASSING]',
  badges: ['[MASTER_RUNNER]', '[HEADLESS_E2E]', '[MATH_VERIFICATION]', '[ZERO_REGRESSIONS]'],
  lastUpdated: 'August 2026',
  prevPage: { title: 'CLI Reference', slug: 'cli-reference' },
  nextPage: undefined,
  sections: [
    {
      id: 'master-runner-command',
      title: 'Master Test Suite Runner',
      content:
        'Execute all 14 test suites sequentially with aggregated telemetry summary:',
      codeBlock: {
        language: 'bash',
        filename: 'Terminal',
        code: '# Run all 14 test suites sequentially\nnpm test\n\n# Or with tsx directly\nnpm run test:all',
      },
    },
    {
      id: 'test-suite-inventory',
      title: 'Automated Test Inventory & Coverage',
      content:
        'Every trading calculation, database operation, and TUI component is verified with dedicated suites:',
      matrixTable: {
        headers: ['Test Suite File', 'Verification Domain & Coverage'],
        rows: [
          ['test_strategy_indicators.ts', 'SMA 9, SMA 21, and RSI 14 mathematical calculation accuracy'],
          ['test_risk_manager.ts', '$1,000 notional cap enforcement, daily loss and loss streak breakers'],
          ['test_adaptive_filter.ts', 'Adaptive memory filtering across all 4 modes (STRICT, REPEAT, etc.)'],
          ['test_execution_position.ts', 'Paper order fill simulation, 1:2 SL/TP brackets, reverse cross exit'],
          ['test_market_service.ts', 'Multi-exchange REST ingestion, symbol normalizer, synthetic OHLCV'],
          ['test_replay_engine.ts', 'Backtest metrics (Win Rate, Profit Factor, Peak Drawdown)'],
          ['test_bot_session_loop.ts', 'SessionTracker live telemetry and asynchronous polling pipeline'],
          ['test_tui_utils.ts', 'Mathematical box drawing, Braille sparklines, ANSI color codes'],
          ['test_export_clipboard.ts', 'Serializer validation for TXT, CSV, MD, DOCX, Vector PDF & Clipboard'],
          ['test_database_reset.ts', 'Database truncation and table re-initialization verification'],
          ['test_env_config.ts', 'Environment variable validation and file writer integrity'],
          ['test_theme_presets.ts', 'Color palette contrast and ANSI styling validation for 14 themes'],
          ['test_tui_command_flow.ts', 'Headless E2E simulation of keyboard navigation, modal & slash flow'],
          ['test_supabase_validator.ts', 'Supabase client connection, credentials check, and RLS validation'],
        ],
      },
    },
  ],
};
