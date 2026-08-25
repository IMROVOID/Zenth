import { DatabaseAdapter } from './databaseAdapter.js';
import { AdaptiveLearning, SessionMetrics } from '../../types.js';
import { LedgerEntry, ResetDatabaseResult, StorageBackendType } from '../types.js';
import { LocalMemoryStore } from '../localStore.js';

export class InMemoryAdapter implements DatabaseAdapter {
  readonly backendType: StorageBackendType = 'local';
  private store: LocalMemoryStore;

  constructor(existingStore?: LocalMemoryStore) {
    this.store = existingStore || new LocalMemoryStore();
  }

  async init(): Promise<void> {}

  isAvailable(): boolean {
    return true;
  }

  async logTrade(entry: LedgerEntry): Promise<void> {
    this.store.addLedgerEntry(entry);
  }

  async updateSessionMetrics(m: SessionMetrics): Promise<void> {
    this.store.setSessionMetrics(m);
  }

  async recordLearning(l: AdaptiveLearning): Promise<void> {
    this.store.setLearning(l);
  }

  async getActiveLearnings(symbol?: string): Promise<AdaptiveLearning[]> {
    return this.store.getActiveLearnings(symbol);
  }

  async getLedger(symbol?: string, limit = 50): Promise<LedgerEntry[]> {
    return this.store.getLedger(symbol, limit);
  }

  async incrementTrigger(ruleId: string): Promise<void> {
    this.store.incrementTrigger(ruleId);
  }

  async reset(symbol?: string): Promise<{ deletedLedger: number; deletedLearnings: number }> {
    return this.store.clear(symbol);
  }

  async resetAll(): Promise<ResetDatabaseResult> {
    const res = this.store.clear();
    return {
      success: true,
      deletedLedger: res.deletedLedger,
      deletedLearnings: res.deletedLearnings,
      deletedMetrics: 1,
      message: `Local store wiped (${res.deletedLedger} trades, ${res.deletedLearnings} learnings).`
    };
  }

  async close(): Promise<void> {
    this.store.clear();
  }

  getStore(): LocalMemoryStore {
    return this.store;
  }
}
