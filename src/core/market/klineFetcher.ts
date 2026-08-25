import { Candle } from '../types.js';
import { XtKlineResponse } from './types.js';
import { generateSyntheticCandles } from './synthetic.js';

export async function fetchMarketKlines(
  symbol: string,
  interval: string,
  limit: number,
  baseUrl: string,
  futuresBaseUrl: string,
  tickerFetcher: (sym: string) => Promise<{ price: number }>
): Promise<Candle[]> {
  const formattedSymbol = symbol.toLowerCase().replace('/', '_');

  // 1. Spot API
  try {
    const url = `${baseUrl}/kline?symbol=${formattedSymbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'XT-PaperTrader/1.0' },
      signal: AbortSignal.timeout(4000)
    });
    if (response.ok) {
      const data = (await response.json()) as XtKlineResponse;
      if (data.rc === 0 && Array.isArray(data.result) && data.result.length > 0) {
        const candles: Candle[] = data.result.map(raw => ({
          timestamp: raw.t,
          open: parseFloat(raw.o),
          high: parseFloat(raw.h),
          low: parseFloat(raw.l),
          close: parseFloat(raw.c),
          volume: parseFloat(raw.q),
          quoteVolume: parseFloat(raw.v)
        }));
        candles.sort((a, b) => a.timestamp - b.timestamp);
        return candles;
      }
    }
  } catch {
    // fallback
  }

  // 2. Futures API
  try {
    const futUrl = `${futuresBaseUrl}/q/kline?symbol=${formattedSymbol}&interval=${interval}&limit=${limit}`;
    const futResponse = await fetch(futUrl, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'XT-PaperTrader/1.0' },
      signal: AbortSignal.timeout(4000)
    });
    if (futResponse.ok) {
      const futData = (await futResponse.json()) as any;
      if (futData?.returnCode === 0 && Array.isArray(futData.result) && futData.result.length > 0) {
        const candles: Candle[] = futData.result.map((raw: any) => ({
          timestamp: raw.t,
          open: parseFloat(raw.o),
          high: parseFloat(raw.h),
          low: parseFloat(raw.l),
          close: parseFloat(raw.c),
          volume: parseFloat(raw.a || raw.q || '0'),
          quoteVolume: parseFloat(raw.v || '0')
        }));
        candles.sort((a, b) => a.timestamp - b.timestamp);
        return candles;
      }
    }
  } catch {
    // fallback
  }

  // 3. Fallback: Synthetic generator
  try {
    const ticker = await tickerFetcher(formattedSymbol);
    return generateSyntheticCandles(ticker.price || 100, interval, limit);
  } catch (error) {
    throw new Error(`fetchMarketKlines failed for ${formattedSymbol}: ${(error as Error).message}`);
  }
}
