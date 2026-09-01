import type { DocPage } from '../types';

export const strategyDocPage: DocPage = {
  slug: 'quantitative-strategy',
  title: 'Quantitative Strategy & Indicators',
  subtitle:
    'Mathematical formulations for Dual SMA Crossover (9/21), RSI 14 momentum oscillator, Volume SMA 20 liquidity confirmation, and 1:2 asymmetric profit brackets.',
  category: 'Strategy & Math',
  categorySlug: 'strategy-math',
  statusTag: '[QUANTITATIVE ALGORITHM]',
  badges: ['[SMA_9/21]', '[RSI_14]', '[VOL_SMA_20]', '[1:2_RR]', '[REVERSE_CROSS_EXIT]'],
  lastUpdated: 'August 2026',
  prevPage: { title: 'Market Feeds', slug: 'market-feeds' },
  nextPage: { title: 'Risk Management', slug: 'risk-management' },
  sections: [
    {
      id: 'mathematical-formulas',
      title: 'Indicator Formulations & Smoothing',
      content:
        'The quantitative core calculates momentum and trend continuation across standard candlestick series:',
      callout: {
        type: 'math',
        title: 'MATHEMATICAL INDICATOR FORMULATIONS',
        body: 'Fast SMA(9): SMA_fast(t) = (1/9) * sum(Close(t-i), i=0..8)\nSlow SMA(21): SMA_slow(t) = (1/21) * sum(Close(t-i), i=0..20)\nRelative Strength Index (RSI 14): RS = Smoothed Gain / Smoothed Loss, RSI = 100 - (100 / (1 + RS))\nVolume Confirmation: Volume(t) >= SMA_vol(20) * minVolumeRatio',
      },
    },
    {
      id: 'signal-decision-matrix',
      title: 'Signal Generation Decision Matrix',
      content:
        'Every incoming market tick evaluates indicators against strict entry and exit criteria:',
      matrixTable: {
        headers: ['Signal Decision', 'Quantitative Trigger Conditions', 'Action Taken'],
        rows: [
          ['[BUY]', 'Golden Cross: SMA(9) > SMA(21) + RSI(14) < 75 + Volume confirmation', 'Simulates paper order fill at market price'],
          ['[SELL]', 'Death Cross: SMA(9) < SMA(21) or Take-Profit (+3.0%) / Stop-Loss (-1.5%) hit', 'Liquidates open paper position and logs PnL'],
          ['[HOLD]', 'Open position active between brackets or flat trend without crossover', 'Maintains current portfolio state'],
          ['[SKIP]', 'Signal generated but rejected by RiskManager ($1,000 cap) or Adaptive Memory', 'Records skip reason to ledger without trading'],
        ],
      },
    },
    {
      id: 'profit-brackets-geometry',
      title: 'Asymmetric 1:2 Profit Brackets & Liquidation',
      content:
        'Dynamic bracket monitoring enforces discipline without manual intervention:',
      statGrid: [
        { label: 'STOP-LOSS (SL)', value: '-1.50%', badge: 'Entry * 0.985' },
        { label: 'TAKE-PROFIT (TP)', value: '+3.00%', badge: 'Entry * 1.030' },
        { label: 'RISK / REWARD', value: '1 : 2', badge: 'Positive Expectancy' },
        { label: 'REVERSE EXIT', value: 'Death Cross', badge: 'Early Protection' },
      ],
    },
  ],
};
