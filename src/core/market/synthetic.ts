import { Candle } from '../types.js';

/**
 * Generates a smooth 16-point continuous micro-trajectory from 24h market metrics.
 */
export function generateSparkline(
  price: number,
  change24hPct: number,
  high: number,
  low: number,
  steps = 16
): number[] {
  if (steps < 2 || price <= 0 || change24hPct <= -100) {
    return new Array(Math.max(1, steps)).fill(Math.max(0, price));
  }

  const openPrice = price / (1 + change24hPct / 100);
  const sparkline: number[] = [];
  const range = Math.max(0.01, high - low);

  for (let s = 0; s < steps; s++) {
    const progress = s / (steps - 1);
    const trend = openPrice + (price - openPrice) * progress;
    const wave = Math.sin(progress * Math.PI * 2) * (range * 0.25);
    const subwave = Math.cos(progress * Math.PI * 4) * (range * 0.1);
    const minBound = low || price * 0.98;
    const maxBound = high || price * 1.02;
    const pt = Math.max(minBound, Math.min(maxBound, trend + wave + subwave));
    sparkline.push(pt);
  }
  sparkline[0] = openPrice;
  sparkline[sparkline.length - 1] = price;

  return sparkline;
}

/**
 * Generates realistic candlestick sequence from base price.
 */
export function generateSyntheticCandles(basePrice: number, interval: string, limit: number): Candle[] {
  const candles: Candle[] = [];
  const now = Date.now();
  const stepMs = interval === '1m' ? 60000 : interval === '15m' ? 900000 : 300000;

  let current = basePrice * 0.98;
  for (let i = limit; i >= 0; i--) {
    const t = now - i * stepMs;
    const drift = (Math.sin(i / 10) + (Math.random() - 0.48)) * (basePrice * 0.005);
    const open = current;
    const close = current + drift;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.003);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.003);
    const volume = 100 + Math.random() * 500;
    candles.push({
      timestamp: t,
      open,
      high,
      low,
      close,
      volume,
      quoteVolume: volume * close
    });
    current = close;
  }
  return candles;
}
