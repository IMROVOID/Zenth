export interface FaqItem {
  id: string;
  category: 'SECURITY' | 'EXCHANGES' | 'MEMORY' | 'STORAGE' | 'RISK' | 'TUI' | 'STRATEGY';
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
  codeSnippet?: string;
}

export interface FaqConfig {
  pillText: string;
  title: string;
  subtitle: string;
  supportCard: {
    title: string;
    description: string;
    githubLabel: string;
    githubUrl: string;
    docsLabel: string;
    docsUrl: string;
  };
  items: FaqItem[];
}

export const faqConfig: FaqConfig = {
  pillText: 'Frequently Asked Questions',
  title: 'Everything You Need to Know About Zenth',
  subtitle:
    'Detailed technical answers covering paper trading safety, zero-key public market feeds, adaptive failure learning, multi-database persistence, and terminal controls.',
  supportCard: {
    title: 'Have More Technical Questions?',
    description:
      'Explore deep architectural documentation or join developer discussions on GitHub.',
    githubLabel: 'GitHub Discussions',
    githubUrl: 'https://github.com/IMROVOID/Zenth/discussions',
    docsLabel: 'Visit Documentation',
    docsUrl: '/documentation/',
  },
  items: [
    {
      id: 'faq-security',
      category: 'SECURITY',
      categoryLabel: '[SECURITY]',
      question: 'Is Zenth safe to run? Does it require live exchange API keys or real funds?',
      answer:
        'Zenth operates strictly in 100% simulated paper trading mode (mode: PAPER). It ingests real-time market data exclusively through public unauthenticated REST endpoints. Zenth never asks for private API keys, withdrawal permissions, or live capital funding, ensuring zero financial risk and zero credential exposure.',
      highlights: ['100% Simulated Paper Mode', 'Zero Private API Keys', 'Zero Financial Risk'],
    },
    {
      id: 'faq-exchanges',
      category: 'EXCHANGES',
      categoryLabel: '[EXCHANGES]',
      question: 'Which cryptocurrency exchanges and asset classes are supported?',
      answer:
        'Zenth features a pluggable market provider layer supporting 6 major cryptocurrency venues: Binance, Coinbase, OKX, Upbit, Bitget, and XT.com. It provides automatic symbol normalization across standard formats (BTC/USDT, BTCUSDT, KRW-BTC). In addition to crypto spot pairs, it supports tokenized US equities (AAPLX, NVDAX, TSLAX) on XT.com.',
      highlights: ['6 Pluggable Venues', 'Universal Symbol Normalizer', 'Tokenized Equities & Crypto'],
    },
    {
      id: 'faq-memory',
      category: 'MEMORY',
      categoryLabel: '[MEMORY & AI]',
      question: 'How does the Adaptive Learning Engine prevent repeat trading losses?',
      answer:
        'When a simulated paper trade hits a stop-loss, the Adaptive Learning Engine analyzes market conditions leading up to the exit (e.g. low-volume breakout whipsaw, RSI overbought trap). It synthesizes a plain-English rule and records it into active database memory. Future trade setups matching active failure patterns are automatically intercepted and skipped.',
      highlights: ['Episodic Failure Memory', 'Synthesized Plain-English Rules', 'Pre-Trade Pattern Interceptor'],
    },
    {
      id: 'faq-storage',
      category: 'STORAGE',
      categoryLabel: '[STORAGE]',
      question: 'What database storage backends are supported and how are they provisioned?',
      answer:
        'Zenth supports 5 persistent backends via a unified DatabaseAdapter: (1) Embedded SQLite (node:sqlite — zero external setup, built into Node.js 22+), (2) Local PostgreSQL (with automated CREATE DATABASE and DDL table provisioning), (3) Local MongoDB, (4) Supabase Cloud PostgreSQL with Row-Level Security (RLS), and (5) In-Memory Ephemeral RAM. The first-run onboarding wizard provisions your chosen backend in one click.',
      highlights: ['Zero-Config Embedded SQLite', '1-Click Auto-Provisioning', 'Supabase Cloud PostgreSQL RLS'],
    },
    {
      id: 'faq-risk',
      category: 'RISK',
      categoryLabel: '[RISK ENGINE]',
      question: 'How does Zenth enforce capital preservation and risk management?',
      answer:
        'Zenth enforces institutional capital preservation rules: a hard notional ceiling of $1,000.00 USD/USDT maximum allocation per trade (orders exceeding this cap are immediately converted to SKIP), daily drawdown circuit breakers, consecutive loss limits (3 strikes), single active position per symbol, and asymmetric 1:2 R:R brackets (1.5% Stop-Loss / 3.0% Take-Profit).',
      highlights: ['$1,000 Hard Allocation Cap', 'Drawdown Circuit Breakers', '1:2 R:R Profit Brackets'],
    },
    {
      id: 'faq-tui',
      category: 'TUI',
      categoryLabel: '[TUI & EXPORT]',
      question: 'Can I run Zenth in headless environments or export trading records?',
      answer:
        'Yes. Zenth runs as a touch/mouse interactive Terminal User Interface (zenth), a single-pass CLI scanner (zenth scan -e binance), or a continuous headless loop. Its zero-dependency export engine outputs complete trade ledgers, distilled rules, and performance metrics to 5 formats: Vector PDF 1.4, Office Open XML (.docx), Markdown (.md), CSV, and TXT, plus system clipboard integration.',
      highlights: ['Touch & Click TUI', 'Headless Scanner Mode', '5-Format Native Exporter (PDF/DOCX)'],
    },
    {
      id: 'faq-strategy',
      category: 'STRATEGY',
      categoryLabel: '[STRATEGY]',
      question: 'What quantitative indicators and mathematical formulas power the default strategy?',
      answer:
        'The core engine combines Fast SMA (9) and Slow SMA (21) trend crossovers, smoothed Wilder’s RSI (14) momentum oscillator with overbought threshold filtering (< 75 / < 65), and Volume SMA (20) liquidity confirmation. Indicators evaluate real-time OHLCV candles every 5–15 seconds. All parameters are fully customizable via .env or live in the TUI [5: CONFIG] tab.',
      highlights: ['SMA 9/21 Trend Crossovers', 'Wilder RSI 14 Smoothed Momentum', 'Volume SMA 20 Confirmation'],
    },
  ],
};
