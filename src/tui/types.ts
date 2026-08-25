export type ActiveView = 'dashboard' | 'coins' | 'stocks' | 'ledger' | 'learnings' | 'theme' | 'config' | 'help';

export interface ActivePositionState {
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
