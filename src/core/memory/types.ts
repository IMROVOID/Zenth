import { Decision, BotMode, TradeOutcome, StorageBackendType } from '../types.js';

export { StorageBackendType };

export interface LedgerEntry {
  id?: string;
  timestamp: string;
  symbol: string;
  action: Decision;
  price: number;
  quantity: number;
  notional_value?: number;
  entry_value?: number;
  exit_value?: number;
  pnl_percentage?: number;
  fee_cost?: number;
  session_id?: string;
  reason: string;
  mode: BotMode;
  outcome: TradeOutcome;
  pnl: number;
}

export interface ResetDatabaseResult {
  success: boolean;
  deletedLedger: number;
  deletedLearnings: number;
  deletedMetrics: number;
  message: string;
}
