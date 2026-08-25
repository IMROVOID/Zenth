import { Candle } from '../types.js';

export interface ReplayOptions {
  symbol?: string;
  timeframe?: string;
  candles: Candle[];
  stopLossPct?: number;   // default 1.5%
  takeProfitPct?: number; // default 3.0%
  allocationUsd?: number; // default $500 (within $1,000 max cap)
}

export interface SkippedSetup {
  time: string;
  symbol: string;
  price: number;
  patternCondition: string;
  reason: string;
}
