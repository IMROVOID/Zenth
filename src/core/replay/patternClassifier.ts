/**
 * Identifies the pattern classification for a crossover setup.
 */
export function classifyPattern(indicators: { fastMA: number; slowMA: number; rsi: number; volume: number; volumeSMA: number }): string {
  const volRatio = indicators.volume / (indicators.volumeSMA || 1);
  if (volRatio < 0.75) {
    return 'MA_CROSSOVER_LOW_VOLUME';
  } else if (indicators.rsi > 65) {
    return 'MA_CROSSOVER_HIGH_RSI';
  } else if (volRatio > 1.8) {
    return 'MA_CROSSOVER_HIGH_VOLUME_BREAKOUT';
  }
  return 'STANDARD_MA_CROSSOVER';
}
