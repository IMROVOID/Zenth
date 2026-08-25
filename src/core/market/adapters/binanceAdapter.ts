import { BaseAdapter } from './baseAdapter.js';
import { ExchangeAdapter, SupportedExchange, TickerData } from './exchangeAdapter.js';
import { Candle } from '../../types.js';
import { CoinInfo } from '../types.js';
import { IntervalMapper } from '../normalization/intervalMapper.js';
import { SymbolNormalizer } from '../normalization/symbolNormalizer.js';
import { COIN_FULL_NAMES } from '../dictionaries.js';
import { generateSparkline, generateSyntheticCandles } from '../synthetic.js';
import { getFallbackCoins } from '../fallbackData.js';

export class BinanceAdapter extends BaseAdapter implements ExchangeAdapter {
  readonly exchangeId: SupportedExchange = 'binance';
  readonly displayName = 'Binance';
  readonly supportsFutures = true;
  readonly supportsStocks = false;
  readonly defaultQuoteAsset = 'USDT';

  private spotBase = 'https://api.binance.com/api/v3';
  private futBase = 'https://fapi.binance.com/fapi/v1';
  private coinsCache: CoinInfo[] = [];
  private lastCoinsFetch = 0;

  formatSymbol(symbol: string): string {
    return SymbolNormalizer.formatForExchange(symbol, 'binance');
  }

  normalizeSymbol(symbol: string): string {
    return SymbolNormalizer.toNormalized(symbol);
  }

  async fetchKlines(symbol = 'BTCUSDT', interval = '5m', limit = 300): Promise<Candle[]> {
    const sym = this.formatSymbol(symbol);
    const exInterval = IntervalMapper.toExchangeInterval(interval, 'binance');

    // 1. Spot API
    const spotUrl = `${this.spotBase}/klines?symbol=${sym}&interval=${exInterval}&limit=${limit}`;
    const spotData = await this.fetchJson<any[][]>(spotUrl, 4000);
    if (Array.isArray(spotData) && spotData.length > 0) {
      return this.mapKlines(spotData);
    }

    // 2. Futures API fallback
    const futUrl = `${this.futBase}/klines?symbol=${sym}&interval=${exInterval}&limit=${limit}`;
    const futData = await this.fetchJson<any[][]>(futUrl, 4000);
    if (Array.isArray(futData) && futData.length > 0) {
      return this.mapKlines(futData);
    }

    // 3. Fallback Synthetic
    const ticker = await this.fetchTicker(sym);
    return generateSyntheticCandles(ticker.price || 100, interval, limit);
  }

  private mapKlines(raw: any[][]): Candle[] {
    const candles: Candle[] = raw.map(k => ({
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

  async fetchTicker(symbol = 'BTCUSDT'): Promise<TickerData> {
    const sym = this.formatSymbol(symbol);
    const data = await this.fetchJson<any>(`${this.spotBase}/ticker/24hr?symbol=${sym}`, 3000);
    if (data && data.lastPrice) {
      const price = this.safeParseFloat(data.lastPrice);
      const high = this.safeParseFloat(data.highPrice) || price;
      const low = this.safeParseFloat(data.lowPrice) || price;
      return {
        price,
        high,
        low,
        volume: this.safeParseFloat(data.volume),
        changePct: this.safeParseFloat(data.priceChangePercent)
      };
    }
    return { price: 100, high: 105, low: 95, volume: 10000, changePct: 0 };
  }

  async fetchTopCoins(forceRefresh = false): Promise<CoinInfo[]> {
    const now = Date.now();
    if (!forceRefresh && this.coinsCache.length > 0 && now - this.lastCoinsFetch < 60000) {
      return this.coinsCache;
    }

    const data = await this.fetchJson<any[]>(`${this.spotBase}/ticker/24hr`, 4000);
    if (Array.isArray(data)) {
      const usdtPairs = data.filter(item => item.symbol?.endsWith('USDT'));
      usdtPairs.sort((a, b) => this.safeParseFloat(b.quoteVolume) - this.safeParseFloat(a.quoteVolume));

      this.coinsCache = usdtPairs.slice(0, 40).map(item => {
        const rawSym = item.symbol;
        const base = rawSym.replace('USDT', '').toUpperCase();
        const baseKey = base.toLowerCase();
        const price = this.safeParseFloat(item.lastPrice);
        const change24hPct = this.safeParseFloat(item.priceChangePercent);
        const high = this.safeParseFloat(item.highPrice) || price;
        const low = this.safeParseFloat(item.lowPrice) || price;
        return {
          symbol: `${baseKey}_usdt`,
          baseCoin: base,
          fullName: COIN_FULL_NAMES[baseKey] || `${base} Token`,
          price,
          change24hPct,
          volume24h: this.safeParseFloat(item.volume),
          sparkline: generateSparkline(price, change24hPct, high, low, 16)
        };
      });
      this.lastCoinsFetch = now;
      return this.coinsCache;
    }

    return getFallbackCoins();
  }

  async findCoin(query: string): Promise<CoinInfo | null> {
    const q = query.trim().toUpperCase().replace(/_USDT$/, '').replace(/\/USDT$/, '');
    const coins = await this.fetchTopCoins();
    const exact = coins.find(c => c.baseCoin === q || c.symbol === `${q.toLowerCase()}_usdt`);
    if (exact) return exact;

    try {
      const ticker = await this.fetchTicker(`${q}USDT`);
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
