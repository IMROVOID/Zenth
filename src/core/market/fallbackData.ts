import { CoinInfo, StockInfo } from './types.js';
import { COIN_FULL_NAMES } from './dictionaries.js';

export function getFallbackCoins(): CoinInfo[] {
  const fallbackBases = ['btc', 'eth', 'sol', 'xrp', 'doge', 'ada', 'bnb', 'avax', 'sui', 'near', 'pepe', 'link', 'shib', 'dot', 'ltc'];
  return fallbackBases.map(base => ({
    symbol: `${base}_usdt`,
    baseCoin: base.toUpperCase(),
    fullName: COIN_FULL_NAMES[base] || `${base.toUpperCase()} Token`,
    price: base === 'btc' ? 78450 : base === 'eth' ? 2450 : base === 'sol' ? 185.5 : 1.25,
    change24hPct: 2.5,
    volume24h: 15000000,
    sparkline: [1, 2, 4, 3, 5, 6]
  }));
}

export function getFallbackStocks(): StockInfo[] {
  const fallbackStocks = [
    { sym: 'aaplx_usdt', ticker: 'AAPLX', name: 'Apple Inc.', price: 312.45, chg: 0.85, vol: 2500000 },
    { sym: 'tslax_usdt', ticker: 'TSLAX', name: 'Tesla Inc.', price: 351.20, chg: -2.14, vol: 3100000 },
    { sym: 'nvdax_usdt', ticker: 'NVDAX', name: 'NVIDIA Corp', price: 209.50, chg: 3.40, vol: 8900000 },
    { sym: 'googlx_usdt', ticker: 'GOOGLX', name: 'Alphabet / Google', price: 188.75, chg: 0.45, vol: 1800000 },
    { sym: 'amznx_usdt', ticker: 'AMZNX', name: 'Amazon.com Inc.', price: 204.10, chg: 1.15, vol: 2200000 },
    { sym: 'metax_usdt', ticker: 'METAX', name: 'Meta Platforms', price: 685.30, chg: -0.65, vol: 2700000 },
    { sym: 'msft_usdt', ticker: 'MSFT', name: 'Microsoft Corp', price: 448.90, chg: 0.95, vol: 3500000 },
    { sym: 'mstr_usdt', ticker: 'MSTR', name: 'MicroStrategy', price: 395.00, chg: 4.80, vol: 4500000 },
    { sym: 'coinx_usdt', ticker: 'COINX', name: 'Coinbase Global', price: 180.80, chg: 2.10, vol: 3800000 },
    { sym: 'pltr_usdt', ticker: 'PLTR', name: 'Palantir Tech', price: 78.40, chg: 5.25, vol: 5100000 },
    { sym: 'spy_usdt', ticker: 'SPY', name: 'SPDR S&P 500 ETF', price: 598.60, chg: 0.35, vol: 12000000 },
    { sym: 'qqq_usdt', ticker: 'QQQ', name: 'Invesco QQQ Trust', price: 515.20, chg: 0.60, vol: 9500000 },
    { sym: 'tqqq_usdt', ticker: 'TQQQ', name: 'ProShares Ultra QQQ', price: 82.50, chg: 1.80, vol: 6400000 },
    { sym: 'amd_usdt', ticker: 'AMD', name: 'AMD', price: 128.40, chg: -1.20, vol: 2900000 },
    { sym: 'nflx_usdt', ticker: 'NFLX', name: 'Netflix Inc.', price: 892.00, chg: 1.40, vol: 1600000 },
    { sym: 'dis_usdt', ticker: 'DIS', name: 'Walt Disney', price: 114.30, chg: -0.25, vol: 1200000 },
    { sym: 'gme_usdt', ticker: 'GME', name: 'GameStop Corp', price: 28.50, chg: 8.40, vol: 7200000 },
    { sym: 'hoodx_usdt', ticker: 'HOODX', name: 'Robinhood Markets', price: 104.60, chg: -1.80, vol: 2100000 },
    { sym: 'soxl_usdt', ticker: 'SOXL', name: 'Direxion Semi Bull 3X', price: 42.80, chg: 3.10, vol: 4800000 },
    { sym: 'bito_usdt', ticker: 'BITO', name: 'ProShares Bitcoin ETF', price: 34.20, chg: 2.80, vol: 3300000 },
    { sym: 'openai_usdt', ticker: 'OPENAI', name: 'OpenAI (TradFi)', price: 155.00, chg: 6.20, vol: 5400000 },
    { sym: 'anthropic_usdt', ticker: 'ANTHROPIC', name: 'Anthropic (TradFi)', price: 92.50, chg: 4.10, vol: 4200000 },
    { sym: 'gold_usdt', ticker: 'GOLD', name: 'Gold Spot / USDT', price: 2940.00, chg: 0.40, vol: 8500000 }
  ];

  return fallbackStocks.map(s => ({
    symbol: s.sym,
    ticker: s.ticker,
    companyName: s.name,
    price: s.price,
    change24hPct: s.chg,
    volume24h: s.vol,
    sparkline: [s.price * 0.98, s.price * 0.99, s.price * 1.01, s.price]
  }));
}
