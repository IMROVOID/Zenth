import { Candle } from '../../types.js';
import type { SupportedExchange } from '../../types.js';
import { CoinInfo, StockInfo } from '../types.js';

export type { SupportedExchange };

export interface TickerData {
  price: number;
  high: number;
  low: number;
  volume: number;
  changePct: number;
}

export interface SymbolSearchResult {
  symbol: string;
  baseCoin: string;
  quoteCoin: string;
  displayName: string;
  price?: number;
}

export interface ExchangeAdapter {
  readonly exchangeId: SupportedExchange;
  readonly displayName: string;
  readonly supportsFutures: boolean;
  readonly supportsStocks: boolean;
  readonly defaultQuoteAsset: string;

  fetchKlines(symbol: string, interval: string, limit?: number): Promise<Candle[]>;
  fetchTicker(symbol: string): Promise<TickerData>;
  fetchTopCoins(forceRefresh?: boolean): Promise<CoinInfo[]>;
  fetchTopStocks?(forceRefresh?: boolean): Promise<StockInfo[]>;
  findCoin(query: string): Promise<CoinInfo | null>;
  findStock?(query: string): Promise<StockInfo | null>;
  formatSymbol(normalizedSymbol: string): string;
  normalizeSymbol(exchangeSymbol: string): string;
}
