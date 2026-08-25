import { BaseAdapter } from './baseAdapter.js';
import { ExchangeAdapter, SupportedExchange, TickerData } from './exchangeAdapter.js';
import { Candle } from '../../types.js';
import { CoinInfo } from '../types.js';
import { IntervalMapper } from '../normalization/intervalMapper.js';
import { SymbolNormalizer } from '../normalization/symbolNormalizer.js';
import { COIN_FULL_NAMES } from '../dictionaries.js';
import { generateSparkline, generateSyntheticCandles } from '../synthetic.js';
import { getFallbackCoins } from '../fallbackData.js';

export class CoinbaseAdapter extends BaseAdapter implements ExchangeAdapter {
  readonly exchangeId: SupportedExchange = 'coinbase';
  readonly displayName = 'Coinbase (CDP / Exchange)';
  readonly supportsFutures = false;
  readonly supportsStocks = false;
  readonly defaultQuoteAsset = 'USD';

  private baseUrl = 'https://api.exchange.coinbase.com';
  private coinsCache: CoinInfo[] = [];
  private lastCoinsFetch = 0;

  formatSymbol(symbol: string): string {
    return SymbolNormalizer.formatForExchange(symbol, 'coinbase');
  }

  normalizeSymbol(symbol: string): string {
    return SymbolNormalizer.toNormalized(symbol);
  }

  async fetchKlines(symbol = 'BTC-USD', interval = '5m', limit = 300): Promise<Candle[]> {
    const sym = this.formatSymbol(symbol);
    const granularity = IntervalMapper.toExchangeInterval(interval, 'coinbase');
    const url = `${this.baseUrl}/products/${sym}/candles?granularity=${granularity}`;

    const data = await this.fetchJson<any[][]>(url, 4000);
    if (Array.isArray(data) && data.length > 0) {
      // Coinbase format: [ time (seconds), low, high, open, close, volume ]
      const candles: Candle[] = data.map(k => ({
        timestamp: Number(k[0]) * 1000,
        low: this.safeParseFloat(k[1]),
        high: this.safeParseFloat(k[2]),
        open: this.safeParseFloat(k[3]),
        close: this.safeParseFloat(k[4]),
        volume: this.safeParseFloat(k[5]),
        quoteVolume: this.safeParseFloat(k[5]) * this.safeParseFloat(k[4])
      }));
      candles.sort((a, b) => a.timestamp - b.timestamp);
      return candles.slice(-limit);
    }

    const ticker = await this.fetchTicker(sym);
    return generateSyntheticCandles(ticker.price || 100, interval, limit);
  }

  async fetchTicker(symbol = 'BTC-USD'): Promise<TickerData> {
    const sym = this.formatSymbol(symbol);
    const [tickerData, statsData] = await Promise.all([
      this.fetchJson<any>(`${this.baseUrl}/products/${sym}/ticker`, 3000),
      this.fetchJson<any>(`${this.baseUrl}/products/${sym}/stats`, 3000)
    ]);

    if (tickerData && tickerData.price) {
      const price = this.safeParseFloat(tickerData.price);
      const high = statsData ? this.safeParseFloat(statsData.high) || price : price;
      const low = statsData ? this.safeParseFloat(statsData.low) || price : price;
      const open = statsData ? this.safeParseFloat(statsData.open) || price : price;
      const changePct = open > 0 ? ((price - open) / open) * 100 : 0;
      return {
        price,
        high,
        low,
        volume: this.safeParseFloat(tickerData.volume),
        changePct
      };
    }

    return { price: 100, high: 105, low: 95, volume: 10000, changePct: 0 };
  }

  async fetchTopCoins(forceRefresh = false): Promise<CoinInfo[]> {
    const now = Date.now();
    if (!forceRefresh && this.coinsCache.length > 0 && now - this.lastCoinsFetch < 60000) {
      return this.coinsCache;
    }

    const products = await this.fetchJson<any[]>(`${this.baseUrl}/products`, 4000);
    if (Array.isArray(products)) {
      const usdPairs = products.filter(p => p.quote_currency === 'USD' && !p.trading_disabled);
      const sample = usdPairs.slice(0, 30);

      this.coinsCache = sample.map(p => {
        const base = p.base_currency.toUpperCase();
        const baseKey = base.toLowerCase();
        const price = 100;
        return {
          symbol: `${baseKey}_usdt`,
          baseCoin: base,
          fullName: COIN_FULL_NAMES[baseKey] || p.display_name || `${base} Token`,
          price,
          change24hPct: 0,
          volume24h: 10000,
          sparkline: generateSparkline(price, 0, price * 1.02, price * 0.98, 16)
        };
      });
      this.lastCoinsFetch = now;
      return this.coinsCache;
    }

    return getFallbackCoins();
  }

  async findCoin(query: string): Promise<CoinInfo | null> {
    const q = query.trim().toUpperCase().replace(/_USD$/, '').replace(/_USDT$/, '');
    const coins = await this.fetchTopCoins();
    const exact = coins.find(c => c.baseCoin === q || c.symbol === `${q.toLowerCase()}_usdt`);
    if (exact) return exact;

    try {
      const ticker = await this.fetchTicker(`${q}-USD`);
      if (ticker.price > 0) {
        return {
          symbol: `${q.toLowerCase()}_usdt`,
          baseCoin: q,
          fullName: COIN_FULL_NAMES[q.toLowerCase()] || `${q} Token`,
          price: ticker.price,
          change24hPct: ticker.changePct,
          volume24h: ticker.volume,
          sparkline: [ticker.low, (ticker.low + ticker.high) / 2, ticker.price]
        };
      }
    } catch {
      // ignore
    }
    return null;
  }
}
