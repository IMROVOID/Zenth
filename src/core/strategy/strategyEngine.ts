import { Candle, StrategyResult, Signal } from '../types.js';
import { calculateSMA, calculateRSI } from './indicators.js';

export class StrategyEngine {
  readonly fastPeriod: number;
  readonly slowPeriod: number;
  readonly rsiPeriod: number;
  readonly volumePeriod: number;
  readonly rsiMaxEntry: number;
  readonly minVolumeRatio: number;

  constructor(
    fastPeriod = 9,
    slowPeriod = 21,
    rsiPeriod = 14,
    volumePeriod = 20,
    rsiMaxEntry = 75,
    minVolumeRatio = 0
  ) {
    this.fastPeriod = fastPeriod;
    this.slowPeriod = slowPeriod;
    this.rsiPeriod = rsiPeriod;
    this.volumePeriod = volumePeriod;
    this.rsiMaxEntry = rsiMaxEntry;
    this.minVolumeRatio = minVolumeRatio;
  }

  calculateSMA(data: number[], period: number): number[] {
    return calculateSMA(data, period);
  }

  calculateRSI(closes: number[], period = 14): number[] {
    return calculateRSI(closes, period);
  }

  /**
   * Evaluates the latest candle slice against strategy rules
   */
  evaluate(candles: Candle[]): StrategyResult {
    const minRequired = Math.max(this.slowPeriod, this.volumePeriod, this.rsiPeriod) + 2;
    if (candles.length < minRequired) {
      throw new Error(`Insufficient candles for strategy calculation: got ${candles.length}, require at least ${minRequired}`);
    }

    const closes = candles.map(c => c.close);
    const volumes = candles.map(c => c.volume);

    const fastMAs = this.calculateSMA(closes, this.fastPeriod);
    const slowMAs = this.calculateSMA(closes, this.slowPeriod);
    const volumeSMAs = this.calculateSMA(volumes, this.volumePeriod);
    const rsis = this.calculateRSI(closes, this.rsiPeriod);

    const lastIdx = candles.length - 1;
    const prevIdx = lastIdx - 1;

    const currPrice = closes[lastIdx];
    const currFast = fastMAs[lastIdx];
    const currSlow = slowMAs[lastIdx];
    const prevFast = fastMAs[prevIdx];
    const prevSlow = slowMAs[prevIdx];

    const currRSI = rsis[lastIdx] || 50;
    const currVolume = volumes[lastIdx];
    const currVolSMA = volumeSMAs[lastIdx] || currVolume;

    const lastCandleTime = candles[lastIdx].timestamp;

    // Detect Crossover Events
    const isBullishCrossover = prevFast <= prevSlow && currFast > currSlow;
    const isBearishCrossover = prevFast >= prevSlow && currFast < currSlow;

    let signal: Signal = 'HOLD';
    let reason = 'No moving average crossover detected. Market in holding pattern.';

    if (isBullishCrossover) {
      const volRatio = currVolSMA > 0 ? currVolume / currVolSMA : 1;
      if (currRSI >= this.rsiMaxEntry) {
        signal = 'HOLD';
        reason = `Bullish MA crossover detected (Fast: ${currFast.toFixed(2)} > Slow: ${currSlow.toFixed(2)}), but RSI is overbought (${currRSI.toFixed(1)} >= ${this.rsiMaxEntry}). Holding.`;
      } else if (this.minVolumeRatio > 0 && volRatio < this.minVolumeRatio) {
        signal = 'HOLD';
        reason = `Bullish MA crossover detected, but volume ratio (${volRatio.toFixed(2)}x) is below required ${this.minVolumeRatio.toFixed(2)}x threshold. Holding.`;
      } else {
        const volNote = this.minVolumeRatio > 0 ? ` [Vol: ${volRatio.toFixed(2)}x]` : '';
        signal = 'BUY';
        reason = `Bullish MA crossover: Fast MA(${this.fastPeriod}) [${currFast.toFixed(2)}] crossed above Slow MA(${this.slowPeriod}) [${currSlow.toFixed(2)}] with RSI at ${currRSI.toFixed(1)}${volNote}.`;
      }
    } else if (isBearishCrossover) {
      signal = 'SELL';
      reason = `Bearish MA crossover: Fast MA(${this.fastPeriod}) [${currFast.toFixed(2)}] crossed below Slow MA(${this.slowPeriod}) [${currSlow.toFixed(2)}]. Exit signal.`;
    }

    return {
      signal,
      fastMA: currFast,
      slowMA: currSlow,
      rsi: currRSI,
      volumeSMA: currVolSMA,
      currentPrice: currPrice,
      reason,
      timestamp: lastCandleTime,
      indicators: {
        fastMA: currFast,
        slowMA: currSlow,
        prevFastMA: prevFast,
        prevSlowMA: prevSlow,
        rsi: currRSI,
        volume: currVolume,
        volumeSMA: currVolSMA
      }
    };
  }
}
