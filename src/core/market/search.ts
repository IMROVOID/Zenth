import { CoinInfo, StockInfo } from './types.js';
import { COIN_FULL_NAMES } from './dictionaries.js';

export async function findCoinItem(
  query: string,
  fetchCoins: () => Promise<CoinInfo[]>,
  fetchTicker: (sym: string) => Promise<{ price: number; changePct: number; volume: number; low: number; high: number }>
): Promise<CoinInfo | null> {
  const q = query.trim().toLowerCase().replace(/_usdt$/, '');
  const coins = await fetchCoins();

  const exact = coins.find(c => c.baseCoin.toLowerCase() === q || c.symbol === `${q}_usdt`);
  if (exact) return exact;

  const nameMatch = coins.find(c => c.fullName.toLowerCase() === q || c.fullName.toLowerCase().startsWith(q));
  if (nameMatch) return nameMatch;

  const partial = coins.find(c => c.baseCoin.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q));
  if (partial) return partial;

  try {
    const ticker = await fetchTicker(`${q}_usdt`);
    const base = q.toUpperCase();
    return {
      symbol: `${q}_usdt`,
      baseCoin: base,
      fullName: COIN_FULL_NAMES[q] || `${base} Token`,
      price: ticker.price,
      change24hPct: ticker.changePct,
      volume24h: ticker.volume,
      sparkline: [ticker.low, (ticker.low + ticker.high) / 2, ticker.price]
    };
  } catch {
    return null;
  }
}

export async function findStockItem(
  query: string,
  fetchStocks: () => Promise<StockInfo[]>
): Promise<StockInfo | null> {
  const q = query.trim().toLowerCase().replace(/_usdt$/, '');
  const stocks = await fetchStocks();

  const exactTicker = stocks.find(s => s.ticker.toLowerCase() === q || s.symbol === `${q}_usdt` || s.symbol === `${q}x_usdt`);
  if (exactTicker) return exactTicker;

  const exactName = stocks.find(s => s.companyName.toLowerCase() === q || s.companyName.toLowerCase().startsWith(q));
  if (exactName) return exactName;

  const partial = stocks.find(s => s.ticker.toLowerCase().includes(q) || s.companyName.toLowerCase().includes(q));
  return partial || null;
}
