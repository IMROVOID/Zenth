import type { DocPage } from '../types';

export const adaptiveMemoryDocPage: DocPage = {
  slug: 'adaptive-learning',
  title: 'Adaptive Failure Learning Engine',
  subtitle:
    'Self-learning failure ingestion, pattern classification taxonomy, and pre-trade memory gating for automated capital defense.',
  category: 'Storage & Memory',
  categorySlug: 'storage-memory',
  statusTag: '[ACTIVE FAILURE FILTERING]',
  badges: ['[AUTO_INGESTION]', '[PATTERN_TAXONOMY]', '[PRE_TRADE_GATING]', '[4_FILTER_MODES]'],
  lastUpdated: 'August 2026',
  prevPage: { title: 'Storage & Memory', slug: 'storage-engines' },
  nextPage: { title: 'TUI Terminal', slug: 'tui-terminal' },
  sections: [
    {
      id: 'failure-learning-lifecycle',
      title: 'Continuous Failure Learning Lifecycle',
      content:
        'Whenever a paper trade closes with a realized loss, Zenth analyzes the context leading to the loss, extracts the root pattern, and writes a synthesized rule into active memory.',
      statGrid: [
        { label: 'CLASSIFIER TAGS', value: 'Taxonomy Engine', badge: 'Auto Root-Cause Analysis' },
        { label: 'RULE SYNTHESIS', value: 'Instant DB Sync', badge: 'adaptive_learnings' },
        { label: 'PRE-TRADE GATE', value: 'AdaptiveFilter', badge: 'Blocks High-Risk Traps' },
        { label: 'TRIGGER AUDIT', value: 'Count & Timestamps', badge: 'Rule Effectiveness Metric' },
      ],
    },
    {
      id: 'pattern-taxonomy-cards',
      title: 'Failure Pattern Taxonomy',
      content:
        'Common market traps classified and filtered by the learning engine:',
      taxonomyCards: [
        { tag: 'LOW_VOL_WHIPSAW', description: 'Golden crossover on volume < 80% of 20-period average, causing immediate false breakout whipsaw.' },
        { tag: 'HIGH_RSI_EXHAUSTION', description: 'Golden crossover with RSI > 70, resulting in overbought momentum reversal before target.' },
        { tag: 'CHOPPY_SIDEWAYS_TRAP', description: 'Oscillating MA crossover within tight 0.3% price corridor across 10 consecutive candles.' },
        { tag: 'MACRO_RESISTANCE_REJECTION', description: 'Entry near 24h high with negative taker volume divergence.' },
      ],
    },
    {
      id: 'filter-modes-matrix',
      title: 'The 4 Adaptive Filtering Modes',
      content:
        'Control how aggressively active learned failure rules gate incoming trade signals:',
      matrixTable: {
        headers: ['Mode', 'Execution Action on Pattern Match', 'Recommended Purpose'],
        rows: [
          ['STRICT (Default)', 'Instantly converts [BUY] signal to [SKIP]', 'Production paper trading with maximum capital protection'],
          ['REPEAT_LOSSES', 'Blocks signal ONLY after pattern caused >= 2 losses', 'Allows single anomaly while filtering repeating traps'],
          ['DRY_RUN', 'Logs match telemetry but allows paper trade to execute', 'Observing pattern impact without intervening'],
          ['DISABLED', 'Disables memory filter completely', 'Raw baseline strategy backtesting & benchmarking'],
        ],
      },
    },
  ],
};
