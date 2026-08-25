import { ReplayTrade, ReplaySummary, AdaptiveLearning } from '../types.js';
import { StrategyEngine } from '../strategy/strategyEngine.js';
import { RiskManager } from '../risk/riskManager.js';
import { ReplayOptions, SkippedSetup } from './types.js';
import { classifyPattern } from './patternClassifier.js';
import { calculateSummary } from './metrics.js';
import { formatRawReplayOutput, formatComparisonOutput } from './formatters.js';
import { executeRawReplay } from './rawReplay.js';
import { executeMemoryReplay } from './memoryReplay.js';

export class ReplayEngine {
  private strategy: StrategyEngine;
  private risk: RiskManager;

  constructor() {
    this.strategy = new StrategyEngine(9, 21, 14, 20);
    this.risk = new RiskManager(1000.0);
  }

  classifyPattern(indicators: { fastMA: number; slowMA: number; rsi: number; volume: number; volumeSMA: number }): string {
    return classifyPattern(indicators);
  }

  calculateSummary(symbol: string, timeframe: string, totalCandles: number, trades: ReplayTrade[]): ReplaySummary {
    return calculateSummary(symbol, timeframe, totalCandles, trades);
  }

  formatOutput(trades: ReplayTrade[], summary: ReplaySummary, title = 'RAW BASELINE REPLAY (NO MEMORY)'): string {
    return formatRawReplayOutput(trades, summary, title);
  }

  formatComparison(raw: ReplaySummary, mem: ReplaySummary, skipped: SkippedSetup[], activeRules: AdaptiveLearning[]): string {
    return formatComparisonOutput(raw, mem, skipped, activeRules);
  }

  runRawReplay(options: ReplayOptions): { trades: ReplayTrade[]; summary: ReplaySummary } {
    return executeRawReplay(options, this.strategy, this.risk);
  }

  runMemoryReplay(
    options: ReplayOptions,
    activeLearnings: AdaptiveLearning[]
  ): { trades: ReplayTrade[]; skippedSetups: SkippedSetup[]; summary: ReplaySummary } {
    return executeMemoryReplay(options, activeLearnings, this.strategy, this.risk);
  }
}
