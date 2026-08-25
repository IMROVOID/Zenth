import { SupportedExchange } from '../adapters/exchangeAdapter.js';

export class IntervalMapper {
  static toExchangeInterval(interval: string, exchange: SupportedExchange): string {
    const norm = interval.toLowerCase().trim();

    switch (exchange) {
      case 'binance':
      case 'xt':
        return norm;

      case 'coinbase':
        // Granularity in seconds for Coinbase
        switch (norm) {
          case '1m': return '60';
          case '5m': return '300';
          case '15m': return '900';
          case '30m': return '1800';
          case '1h': return '3600';
          case '4h': return '21600'; // Coinbase supports 6h (21600) or closest standard
          case '1d': return '86400';
          default: return '300';
        }

      case 'okx':
        switch (norm) {
          case '1m': return '1m';
          case '5m': return '5m';
          case '15m': return '15m';
          case '30m': return '30m';
          case '1h': return '1H';
          case '4h': return '4H';
          case '1d': return '1D';
          default: return '5m';
        }

      case 'upbit':
        switch (norm) {
          case '1m': return '1';
          case '5m': return '5';
          case '15m': return '15';
          case '30m': return '30';
          case '1h': return '60';
          case '4h': return '240';
          case '1d': return 'days';
          default: return '5';
        }

      case 'bitget':
        switch (norm) {
          case '1m': return '1min';
          case '5m': return '5min';
          case '15m': return '15min';
          case '30m': return '30min';
          case '1h': return '1h';
          case '4h': return '4h';
          case '1d': return '1day';
          default: return '5min';
        }

      default:
        return norm;
    }
  }
}
