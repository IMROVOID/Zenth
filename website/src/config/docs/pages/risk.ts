import type { DocPage } from '../types';

export const riskDocPage: DocPage = {
  slug: 'risk-management',
  title: 'Risk Management & Circuit Breakers',
  subtitle:
    'Institutional capital preservation guardrails, hard $1,000 USD/USDT allocation cap, daily drawdown limit breaker, and consecutive loss protections.',
  category: 'Strategy & Math',
  categorySlug: 'strategy-math',
  statusTag: '[CAPITAL PRESERVATION ACTIVE]',
  badges: ['[$1000_NOTIONAL_CAP]', '[DRAWDOWN_BREAKER]', '[STREAK_GUARD]', '[SINGLE_POSITION]'],
  lastUpdated: 'August 2026',
  prevPage: { title: 'Quantitative Strategy', slug: 'quantitative-strategy' },
  nextPage: { title: 'Storage & Memory', slug: 'storage-engines' },
  sections: [
    {
      id: 'risk-guardrails-overview',
      title: 'Four Automated Safety Circuits',
      content:
        'All trade proposals must pass through the `RiskManager` before any simulated paper order can be executed.',
      statGrid: [
        { label: 'NOTIONAL CAP', value: '$1,000.00', badge: 'Hard Trade Upper Limit' },
        { label: 'DAILY DRAWDOWN', value: '-$50.00', badge: 'Halts New Buy Signals' },
        { label: 'LOSS STREAK', value: '3 Losses', badge: 'Automated Circuit Lock' },
        { label: 'ACTIVE POSITIONS', value: 'Max 1', badge: 'Prevents Overexposure' },
      ],
    },
    {
      id: 'protective-circuit-details',
      title: 'Deep Dive: Capital Guard Circuits',
      content:
        'How each protective breaker preserves simulated balance under volatile market regimes:',
      matrixTable: {
        headers: ['Circuit Name', 'Enforcement Rule', 'Engine Action Upon Trigger'],
        rows: [
          ['1. Hard Notional Cap', 'Order Value (Price * Qty) <= $1,000.00', 'Converts order to [SKIP] with explicit log reason'],
          ['2. Daily Drawdown Breaker', 'Session Realized PnL <= -maxDailyLoss (-$50)', 'Suspends new entries until manual operator reset'],
          ['3. Consecutive Loss Guard', 'Consecutive Losses >= 3', 'Halts execution and ingests pattern into adaptive memory'],
          ['4. Single Position Rule', 'Maximum 1 open trade per symbol', 'Blocks duplicate buy signals on existing active positions'],
        ],
      },
    },
    {
      id: 'risk-ledger-sample',
      title: 'Structured Skip Reason Emitted to Ledger',
      content:
        'When an order violates safety thresholds, the execution engine records a deterministic skip record:',
      codeBlock: {
        language: 'json',
        filename: 'Trade Ledger Telemetry',
        code: '{\n  "id": "ord_987654321",\n  "action": "SKIP",\n  "symbol": "btc_usdt",\n  "price": 96500.00,\n  "quantity": 0.02,\n  "notional_value": 1930.00,\n  "reason": "Order notional value $1,930.00 exceeds $1,000.00 hard allocation cap",\n  "outcome": "SKIPPED"\n}',
      },
    },
  ],
};
