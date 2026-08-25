import { BaseAdapter } from './baseAdapter.js';
import { ExchangeAdapter, SupportedExchange, TickerData } from './exchangeAdapter.js';
import { Candle } from '../../types.js';
import { CoinInfo, StockInfo } from '../types.js';
import { fetchMarketKlines } from '../klineFetcher.js';
import { fetchMarketTicker, fetchTopCoinsData, fetchTopStocksData } from '../tickerFetcher.js';
import { findCoinItem, findStockItem } from '../search.js';
import { SymbolNormalizer } from '../normalization/symbolNormalizer.js';

export class XtAdapter extends BaseAdapter implements ExchangeAdapter {
  readonly exchangeId: SupportedExchange = 'xt';
  readonly displayName = 'XT.com';
  readonly supportsFutures = true;
  readonly supportsStocks = true;
  readonly defaultQuoteAsset = 'USDT';

  private baseUrl = 'https://sapi.xt.com/v4/public';
  private futuresBaseUrl = 'https://fapi.xt.com/future/market/v1/public';
  private coinsCache: CoinInfo[] = [];
  private lastCoinsFetch = 0;
  private stocksCache: StockInfo[] = [];
  private lastStocksFetch = 0;

  formatSymbol(symbol: string): string {
    return SymbolNormalizer.formatForExchange(symbol, 'xt');
  }

  normalizeSymbol(symbol: string): string {
    return SymbolNormalizer.toNormalized(symbol);
  }

  async fetchKlines(symbol = 'btc_usdt', interval = '5m', limit = 300): Promise<Candle[]> {
    return fetchMarketKlines(
      this.formatSymbol(symbol),
      interval,
      limit,
      this.baseUrl,
      this.futuresBaseUrl,
      sym => this.fetchTicker(sym)
    );
  }

  async fetchTicker(symbol = 'btc_usdt'): Promise<TickerData> {
    return fetchMarketTicker(this.formatSymbol(symbol), this.baseUrl, this.futuresBaseUrl);
  }

  async fetchTopCoins(forceRefresh = false): Promise<CoinInfo[]> {
    const now = Date.now();
    if (!forceRefresh && this.coinsCache.length > 0 && now - this.lastCoinsFetch < 60000) {
      return this.coinsCache;
    }
    this.coinsCache = await fetchTopCoinsData(this.baseUrl);
    this.lastCoinsFetch = now;
    return this.coinsCache;
  }

  async fetchTopStocks(forceRefresh = false): Promise<StockInfo[]> {
    const now = Date.now();
    if (!forceRefresh && this.stocksCache.length > 0 && now - this.lastStocksFetch < 60000) {
      return this.stocksCache;
    }
    this.stocksCache = await fetchTopStocksData(this.futuresBaseUrl);
    this.lastStocksFetch = now;
    return this.stocksCache;
  }

  async findCoin(query: string): Promise<CoinInfo | null> {
    return findCoinItem(query, () => this.fetchTopCoins(), sym => this.fetchTicker(sym));
  }

  async findStock(query: string): Promise<StockInfo | null> {
    return findStockItem(query, () => this.fetchTopStocks());
  }
}
