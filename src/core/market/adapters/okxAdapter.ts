import { BaseAdapter } from './baseAdapter.js';
import { ExchangeAdapter, SupportedExchange, TickerData } from './exchangeAdapter.js';
import { Candle } from '../../types.js';
import { CoinInfo } from '../types.js';
import { IntervalMapper } from '../normalization/intervalMapper.js';
import { SymbolNormalizer } from '../normalization/symbolNormalizer.js';
import { COIN_FULL_NAMES } from '../dictionaries.js';
import { generateSparkline, generateSyntheticCandles } from '../synthetic.js';
import { getFallbackCoins } from '../fallbackData.js';

export class OkxAdapter extends BaseAdapter implements ExchangeAdapter {
  readonly exchangeId: SupportedExchange = 'okx';
  readonly displayName = 'OKX';
  readonly supportsFutures = true;
  readonly supportsStocks = false;
  readonly defaultQuoteAsset = 'USDT';

  private baseUrl = 'https://www.okx.com/api/v5/market';
  private coinsCache: CoinInfo[] = [];
  private lastCoinsFetch = 0;

  formatSymbol(symbol: string): string {
    return SymbolNormalizer.formatForExchange(symbol, 'okx');
  }

  normalizeSymbol(symbol: string): string {
    return SymbolNormalizer.toNormalized(symbol);
  }

  async fetchKlines(symbol = 'BTC-USDT', interval = '5m', limit = 300): Promise<Candle[]> {
    const sym = this.formatSymbol(symbol);
    const bar = IntervalMapper.toExchangeInterval(interval, 'okx');
    const url = `${this.baseUrl}/candles?instId=${sym}&bar=${bar}&limit=${limit}`;

    const res = await this.fetchJson<{ code: string; data: any[][] }>(url, 4000);
    if (res && res.code === '0' && Array.isArray(res.data) && res.data.length > 0) {
      const candles: Candle[] = res.data.map(k => ({
        timestamp: Number(k[0]),
        open: this.safeParseFloat(k[1]),
        high: this.safeParseFloat(k[2]),
        low: this.safeParseFloat(k[3]),
        close: this.safeParseFloat(k[4]),
        volume: this.safeParseFloat(k[5]),
        quoteVolume: this.safeParseFloat(k[7])
      }));
      return candles.sort((a, b) => a.timestamp - b.timestamp);
    }

    const ticker = await this.fetchTicker(sym);
    return generateSyntheticCandles(ticker.price || 100, interval, limit);
  }

  async fetchTicker(symbol = 'BTC-USDT'): Promise<TickerData> {
    const sym = this.formatSymbol(symbol);
    const res = await this.fetchJson<{ code: string; data: any[] }>(`${this.baseUrl}/ticker?instId=${sym}`, 3000);

    if (res && res.code === '0' && Array.isArray(res.data) && res.data.length > 0) {
      const item = res.data[0];
      const price = this.safeParseFloat(item.last);
      const high = this.safeParseFloat(item.high24h) || price;
      const low = this.safeParseFloat(item.low24h) || price;
      const open = this.safeParseFloat(item.open24h) || price;
      const changePct = open > 0 ? ((price - open) / open) * 100 : 0;
      return {
        price,
        high,
        low,
        volume: this.safeParseFloat(item.vol24h),
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

    const res = await this.fetchJson<{ code: string; data: any[] }>(`${this.baseUrl}/tickers?instType=SPOT`, 4000);
    if (res && res.code === '0' && Array.isArray(res.data)) {
      const usdtPairs = res.data.filter(item => item.instId?.endsWith('-USDT'));
      usdtPairs.sort((a, b) => this.safeParseFloat(b.volCcy24h) - this.safeParseFloat(a.volCcy24h));

      this.coinsCache = usdtPairs.slice(0, 40).map(item => {
        const rawSym = item.instId;
        const base = rawSym.replace('-USDT', '').toUpperCase();
        const baseKey = base.toLowerCase();
        const price = this.safeParseFloat(item.last);
        const open = this.safeParseFloat(item.open24h) || price;
        const change24hPct = open > 0 ? ((price - open) / open) * 100 : 0;
        const high = this.safeParseFloat(item.high24h) || price;
        const low = this.safeParseFloat(item.low24h) || price;
        return {
          symbol: `${baseKey}_usdt`,
          baseCoin: base,
          fullName: COIN_FULL_NAMES[baseKey] || `${base} Token`,
          price,
          change24hPct,
          volume24h: this.safeParseFloat(item.vol24h),
          sparkline: generateSparkline(price, change24hPct, high, low, 16)
        };
      });
      this.lastCoinsFetch = now;
      return this.coinsCache;
    }

    return getFallbackCoins();
  }

  async findCoin(query: string): Promise<CoinInfo | null> {
    const q = query.trim().toUpperCase().replace(/_USDT$/, '').replace(/-USDT$/, '');
    const coins = await this.fetchTopCoins();
    const exact = coins.find(c => c.baseCoin === q || c.symbol === `${q.toLowerCase()}_usdt`);
    if (exact) return exact;

    try {
      const ticker = await this.fetchTicker(`${q}-USDT`);
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
