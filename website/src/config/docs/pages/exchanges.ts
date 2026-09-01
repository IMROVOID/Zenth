import type { DocPage } from '../types';

export const exchangesDocPage: DocPage = {
  slug: 'market-feeds',
  title: 'Multi-Exchange Market Feeds',
  subtitle:
    'Resilient, keyless market data ingestion across Binance, Coinbase, OKX, Upbit, Bitget, and XT.com with universal normalization.',
  category: 'Core Architecture',
  categorySlug: 'core-architecture',
  statusTag: '[6 EXCHANGES ONLINE]',
  badges: ['[ZERO_KEYS]', '[INTERVAL_MAPPING]', '[SYMBOL_NORMALIZATION]', '[RATE_RESILIENT]'],
  lastUpdated: 'August 2026',
  prevPage: { title: 'System Architecture', slug: 'architecture' },
  nextPage: { title: 'Quantitative Strategy', slug: 'quantitative-strategy' },
  sections: [
    {
      id: 'exchange-matrix',
      title: 'Supported Exchange Venues & Quotas',
      content:
        'All 6 integrated exchanges operate through 100% public REST endpoints requiring zero API keys, zero registration, and zero private credentials exposure.',
      matrixTable: {
        headers: ['Exchange Venue', 'Base REST Endpoint', 'Rate Quota', 'Key Capabilities'],
        rows: [
          ['Binance', 'api.binance.com', '1,200 req/min', 'Global Spot & Futures USDT markets with deep liquidity'],
          ['Coinbase', 'api.exchange.coinbase.com', '10 req/sec', 'US-regulated spot pairs & Coinbase CDP AgentKit'],
          ['OKX', 'www.okx.com/api/v5', '20 req/2s', 'Unified accounts, spot, swap, and perpetual futures'],
          ['Upbit', 'api.upbit.com', '10 req/sec', 'Leading Korean market with KRW and USDT trading pairs'],
          ['Bitget', 'api.bitget.com/api/v2', '20 req/sec', 'Spot and futures feeds with Agent Skill Hub support'],
          ['XT.com', 'sapi.xt.com / fapi.xt.com', '10 req/sec', 'Crypto pairs and tokenized US equities (AAPLX, NVDAX)'],
        ],
      },
    },
    {
      id: 'normalization-engine',
      title: 'Universal Normalization Engine',
      content:
        'Zenth transparently maps standard ticker representations (`BTC/USDT`) to venue-specific notations:',
      statGrid: [
        { label: 'BINANCE / BITGET', value: 'BTCUSDT', badge: 'Standard format' },
        { label: 'COINBASE / OKX', value: 'BTC-USDT', badge: 'Hyphenated' },
        { label: 'UPBIT', value: 'USDT-BTC', badge: 'Base-quote swap' },
        { label: 'XT.COM', value: 'btc_usdt', badge: 'Lower snake_case' },
      ],
    },
    {
      id: 'exchange-cli-commands',
      title: 'Dynamic Venue Selection',
      content:
        'Switch market providers on-the-fly using CLI flags or terminal slash commands:',
      codeBlock: {
        language: 'bash',
        filename: 'Terminal',
        code: '# Single-pass scan against Binance\nzenth scan -e binance\n\n# Single-pass scan against OKX\nzenth scan -e okx\n\n# Switch inside running TUI terminal\n/exchange bitget',
      },
    },
  ],
};
