import { BaseAdapter } from './baseAdapter.js';
import { ExchangeAdapter, SupportedExchange, TickerData } from './exchangeAdapter.js';
import { Candle } from '../../types.js';
import { CoinInfo } from '../types.js';
import { IntervalMapper } from '../normalization/intervalMapper.js';
import { SymbolNormalizer } from '../normalization/symbolNormalizer.js';
import { COIN_FULL_NAMES } from '../dictionaries.js';
import { generateSparkline, generateSyntheticCandles } from '../synthetic.js';
import { getFallbackCoins } from '../fallbackData.js';

export class UpbitAdapter extends BaseAdapter implements ExchangeAdapter {
  readonly exchangeId: SupportedExchange = 'upbit';
  readonly displayName = 'Upbit';
  readonly supportsFutures = false;
  readonly supportsStocks = false;
  readonly defaultQuoteAsset = 'KRW';

  private baseUrl = 'https://api.upbit.com/v1';
  private coinsCache: CoinInfo[] = [];
  private lastCoinsFetch = 0;

  formatSymbol(symbol: string): string {
    return SymbolNormalizer.formatForExchange(symbol, 'upbit');
  }

  normalizeSymbol(symbol: string): string {
    return SymbolNormalizer.toNormalized(symbol);
  }

  async fetchKlines(symbol = 'KRW-BTC', interval = '5m', limit = 200): Promise<Candle[]> {
    const sym = this.formatSymbol(symbol);
    const unit = IntervalMapper.toExchangeInterval(interval, 'upbit');
    const endpoint = unit === 'days' ? 'days' : `minutes/${unit}`;
    const url = `${this.baseUrl}/candles/${endpoint}?market=${sym}&count=${Math.min(limit, 200)}`;

    const res = await this.fetchJson<any[]>(url, 4000);
    if (Array.isArray(res) && res.length > 0) {
      const candles: Candle[] = res.map(k => ({
        timestamp: Number(k.timestamp),
        open: this.safeParseFloat(k.opening_price),
        high: this.safeParseFloat(k.high_price),
        low: this.safeParseFloat(k.low_price),
        close: this.safeParseFloat(k.trade_price),
        volume: this.safeParseFloat(k.candle_acc_trade_volume),
        quoteVolume: this.safeParseFloat(k.candle_acc_trade_price)
      }));
      return candles.sort((a, b) => a.timestamp - b.timestamp);
    }

    const ticker = await this.fetchTicker(sym);
    return generateSyntheticCandles(ticker.price || 100, interval, limit);
  }

  async fetchTicker(symbol = 'KRW-BTC'): Promise<TickerData> {
    const sym = this.formatSymbol(symbol);
    let res = await this.fetchJson<any[]>(`${this.baseUrl}/ticker?markets=${sym}`, 3000);

    if (!Array.isArray(res) || res.length === 0) {
      const { base } = SymbolNormalizer.parsePair(symbol);
      res = await this.fetchJson<any[]>(`${this.baseUrl}/ticker?markets=KRW-${base}`, 3000);
    }

    if (Array.isArray(res) && res.length > 0) {
      const item = res[0];
      const price = this.safeParseFloat(item.trade_price);
      const high = this.safeParseFloat(item.high_price) || price;
      const low = this.safeParseFloat(item.low_price) || price;
      return {
        price,
        high,
        low,
        volume: this.safeParseFloat(item.acc_trade_volume_24h),
        changePct: this.safeParseFloat(item.signed_change_rate) * 100
      };
    }

    return { price: 100, high: 105, low: 95, volume: 10000, changePct: 0 };
  }

  async fetchTopCoins(forceRefresh = false): Promise<CoinInfo[]> {
    const now = Date.now();
    if (!forceRefresh && this.coinsCache.length > 0 && now - this.lastCoinsFetch < 60000) {
      return this.coinsCache;
    }

    const markets = await this.fetchJson<any[]>(`${this.baseUrl}/market/all?isDetails=false`, 4000);
    if (Array.isArray(markets)) {
      const krwMarkets = markets.filter(m => m.market?.startsWith('KRW-')).slice(0, 30);
      const tickersQuery = krwMarkets.map(m => m.market).join(',');
      const tickers = await this.fetchJson<any[]>(`${this.baseUrl}/ticker?markets=${tickersQuery}`, 4000);

      if (Array.isArray(tickers)) {
        this.coinsCache = tickers.map(item => {
          const rawSym = item.market;
          const base = rawSym.replace('KRW-', '').toUpperCase();
          const baseKey = base.toLowerCase();
          const price = this.safeParseFloat(item.trade_price);
          const change24hPct = this.safeParseFloat(item.signed_change_rate) * 100;
          const high = this.safeParseFloat(item.high_price) || price;
          const low = this.safeParseFloat(item.low_price) || price;
          return {
            symbol: `${baseKey}_usdt`,
            baseCoin: base,
            fullName: COIN_FULL_NAMES[baseKey] || `${base} Token`,
            price,
            change24hPct,
            volume24h: this.safeParseFloat(item.acc_trade_volume_24h),
            sparkline: generateSparkline(price, change24hPct, high, low, 16)
          };
        });
        this.lastCoinsFetch = now;
        return this.coinsCache;
      }
    }

    return getFallbackCoins();
  }

  async findCoin(query: string): Promise<CoinInfo | null> {
    const q = query.trim().toUpperCase().replace(/^KRW-/, '').replace(/_USDT$/, '');
    const coins = await this.fetchTopCoins();
    const exact = coins.find(c => c.baseCoin === q || c.symbol === `${q.toLowerCase()}_usdt`);
    if (exact) return exact;

    try {
      const ticker = await this.fetchTicker(`KRW-${q}`);
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
