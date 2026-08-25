import { Candle } from '../types.js';
import { CoinInfo, StockInfo } from './types.js';
import { ExchangeAdapter, SupportedExchange, TickerData } from './adapters/exchangeAdapter.js';
import { ExchangeRegistry } from './exchangeRegistry.js';

export class MarketService {
  private adapter: ExchangeAdapter;

  constructor(exchangeId?: string) {
    this.adapter = ExchangeRegistry.getAdapter(exchangeId || process.env.EXCHANGE || 'xt');
  }

  setExchange(exchangeId: string): void {
    this.adapter = ExchangeRegistry.setActiveExchange(exchangeId);
  }

  getExchange(): SupportedExchange {
    return this.adapter.exchangeId;
  }

  getDisplayName(): string {
    return this.adapter.displayName;
  }

  async fetchKlines(symbol = 'btc_usdt', interval = '5m', limit = 300): Promise<Candle[]> {
    return this.adapter.fetchKlines(symbol, interval, limit);
  }

  async fetchTicker(symbol = 'btc_usdt'): Promise<TickerData> {
    return this.adapter.fetchTicker(symbol);
  }

  async fetchTopCoins(forceRefresh = false): Promise<CoinInfo[]> {
    return this.adapter.fetchTopCoins(forceRefresh);
  }

  async fetchTopStocks(forceRefresh = false): Promise<StockInfo[]> {
    if (this.adapter.fetchTopStocks) {
      return this.adapter.fetchTopStocks(forceRefresh);
    }
    const xtAdapter = ExchangeRegistry.getAdapter('xt');
    return xtAdapter.fetchTopStocks ? xtAdapter.fetchTopStocks(forceRefresh) : [];
  }

  async findCoin(query: string): Promise<CoinInfo | null> {
    return this.adapter.findCoin(query);
  }

  async findStock(query: string): Promise<StockInfo | null> {
    if (this.adapter.findStock) {
      return this.adapter.findStock(query);
    }
    const xtAdapter = ExchangeRegistry.getAdapter('xt');
    return xtAdapter.findStock ? xtAdapter.findStock(query) : null;
  }
}
