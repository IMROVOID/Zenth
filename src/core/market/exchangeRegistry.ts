import { ExchangeAdapter, SupportedExchange } from './adapters/exchangeAdapter.js';
import { XtAdapter } from './adapters/xtAdapter.js';
import { BinanceAdapter } from './adapters/binanceAdapter.js';
import { CoinbaseAdapter } from './adapters/coinbaseAdapter.js';
import { OkxAdapter } from './adapters/okxAdapter.js';
import { UpbitAdapter } from './adapters/upbitAdapter.js';
import { BitgetAdapter } from './adapters/bitgetAdapter.js';

export interface ExchangeOption {
  id: SupportedExchange;
  name: string;
  defaultQuote: string;
  supportsFutures: boolean;
  supportsStocks: boolean;
  description: string;
}

export class ExchangeRegistry {
  private static adapters = new Map<SupportedExchange, ExchangeAdapter>();
  private static activeExchange: SupportedExchange = 'xt';

  static {
    this.register(new XtAdapter());
    this.register(new BinanceAdapter());
    this.register(new CoinbaseAdapter());
    this.register(new OkxAdapter());
    this.register(new UpbitAdapter());
    this.register(new BitgetAdapter());
  }

  static register(adapter: ExchangeAdapter): void {
    this.adapters.set(adapter.exchangeId, adapter);
  }

  static getAdapter(exchangeId?: string): ExchangeAdapter {
    const key = (exchangeId || this.activeExchange).toLowerCase() as SupportedExchange;
    return this.adapters.get(key) || this.adapters.get('xt') || new XtAdapter();
  }

  static setActiveExchange(exchangeId: string): ExchangeAdapter {
    const key = exchangeId.toLowerCase() as SupportedExchange;
    if (this.adapters.has(key)) {
      this.activeExchange = key;
      return this.adapters.get(key)!;
    }
    return this.getAdapter();
  }

  static getActiveExchangeId(): SupportedExchange {
    return this.activeExchange;
  }

  static listExchanges(): ExchangeOption[] {
    return [
      { id: 'binance', name: 'Binance', defaultQuote: 'USDT', supportsFutures: true, supportsStocks: false, description: 'Global high-liquidity crypto exchange' },
      { id: 'coinbase', name: 'Coinbase', defaultQuote: 'USD', supportsFutures: false, supportsStocks: false, description: 'US compliant spot exchange & CDP AgentKit' },
      { id: 'okx', name: 'OKX', defaultQuote: 'USDT', supportsFutures: true, supportsStocks: false, description: 'Unified account spot & derivatives' },
      { id: 'upbit', name: 'Upbit', defaultQuote: 'KRW', supportsFutures: false, supportsStocks: false, description: 'Top Korean market (KRW & USDT pairs)' },
      { id: 'bitget', name: 'Bitget', defaultQuote: 'USDT', supportsFutures: true, supportsStocks: false, description: 'Spot and futures with Agent Skill Hub' },
      { id: 'xt', name: 'XT.com', defaultQuote: 'USDT', supportsFutures: true, supportsStocks: true, description: 'Crypto pairs and tokenized stock feeds' }
    ];
  }
}
