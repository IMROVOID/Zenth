/**
 * Calculates Simple Moving Average (SMA) array
 */
export function calculateSMA(data: number[], period: number): number[] {
  const sma: number[] = new Array(data.length).fill(NaN);
  if (period <= 0 || data.length < period) return sma;

  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  sma[period - 1] = sum / period;

  for (let i = period; i < data.length; i++) {
    sum += data[i] - data[i - period];
    sma[i] = sum / period;
  }
  return sma;
}

/**
 * Calculates Relative Strength Index (RSI) array
 */
export function calculateRSI(closes: number[], period = 14): number[] {
  const rsi: number[] = new Array(closes.length).fill(NaN);
  if (period <= 0 || closes.length <= period) return rsi;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  if (avgGain === 0 && avgLoss === 0) {
    rsi[period] = 50;
  } else if (avgLoss === 0) {
    rsi[period] = 100;
  } else {
    rsi[period] = 100 - (100 / (1 + avgGain / avgLoss));
  }

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    if (avgGain === 0 && avgLoss === 0) {
      rsi[i] = 50;
    } else if (avgLoss === 0) {
      rsi[i] = 100;
    } else {
      const rs = avgGain / avgLoss;
      rsi[i] = 100 - (100 / (1 + rs));
    }
  }
  return rsi;
}
