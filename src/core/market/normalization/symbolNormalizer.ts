import { SupportedExchange } from '../adapters/exchangeAdapter.js';

export class SymbolNormalizer {
  static parsePair(symbol: string): { base: string; quote: string } {
    const clean = symbol.trim().toUpperCase().replace(/[\/\-_]/g, ' ');
    const parts = clean.split(' ').filter(Boolean);

    if (parts.length === 2) {
      // In Upbit format KRW-BTC, quote is first
      if (['KRW', 'USDT', 'BTC', 'ETH'].includes(parts[0]) && !['USDT', 'KRW'].includes(parts[1])) {
        return { base: parts[1], quote: parts[0] };
      }
      return { base: parts[0], quote: parts[1] };
    }

    const raw = symbol.trim().toUpperCase();
    for (const q of ['USDT', 'USDC', 'USD', 'KRW', 'BUSD', 'BTC', 'ETH']) {
      if (raw.endsWith(q) && raw.length > q.length) {
        return { base: raw.slice(0, -q.length), quote: q };
      }
    }

    return { base: raw, quote: 'USDT' };
  }

  static toNormalized(symbol: string): string {
    const { base, quote } = this.parsePair(symbol);
    return `${base.toLowerCase()}_${quote.toLowerCase()}`;
  }

  static formatForExchange(symbol: string, exchange: SupportedExchange): string {
    const { base, quote } = this.parsePair(symbol);
    const b = base.toUpperCase();
    const q = quote.toUpperCase();

    switch (exchange) {
      case 'binance':
      case 'bitget':
        return `${b}${q}`;

      case 'coinbase':
        // If quote is USDT and Coinbase prefers USD, default to USD or keep USDT if specified
        return `${b}-${q === 'USDT' ? 'USD' : q}`;

      case 'okx':
        return `${b}-${q}`;

      case 'upbit':
        // Upbit convention: QUOTE-BASE (e.g. KRW-BTC, USDT-BTC)
        return `${q}-${b}`;

      case 'xt':
      default:
        return `${b.toLowerCase()}_${q.toLowerCase()}`;
    }
  }
}
