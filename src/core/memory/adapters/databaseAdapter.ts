import { AdaptiveLearning, SessionMetrics } from '../../types.js';
import { LedgerEntry, ResetDatabaseResult, StorageBackendType } from '../types.js';

export interface DatabaseAdapter {
  readonly backendType: StorageBackendType;
  init(): Promise<void>;
  isAvailable(): boolean;
  logTrade(entry: LedgerEntry): Promise<void>;
  updateSessionMetrics(metrics: SessionMetrics): Promise<void>;
  recordLearning(learning: AdaptiveLearning): Promise<void>;
  getActiveLearnings(symbol?: string): Promise<AdaptiveLearning[]>;
  getLedger(symbol?: string, limit?: number): Promise<LedgerEntry[]>;
  incrementTrigger(ruleId: string): Promise<void>;
  reset(symbol?: string): Promise<{ deletedLedger: number; deletedLearnings: number }>;
  resetAll(): Promise<ResetDatabaseResult>;
  close(): Promise<void>;
}
