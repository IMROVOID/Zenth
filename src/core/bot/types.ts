import { PaperOrder, Decision } from '../types.js';

export interface ActivePosition {
  id: string;
  symbol: string;
  entryPrice: number;
  quantity: number;
  enteredCapital: number;
  entryTime: string;
  stopLossPrice: number;
  takeProfitPrice: number;
  patternCondition: string;
  indicatorsAtEntry: Record<string, unknown>;
  highestPrice?: number;
  breakevenApplied?: boolean;
}

export interface ScanResult {
  order?: PaperOrder;
  decision: Decision;
  reason: string;
}
