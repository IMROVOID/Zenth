import { AdaptiveLearning, SessionMetrics } from '../types.js';
import { LedgerEntry, ResetDatabaseResult, StorageBackendType } from './types.js';
import { LocalMemoryStore } from './localStore.js';
import { DatabaseAdapter } from './adapters/databaseAdapter.js';
import { createDatabaseAdapter } from './factory.js';

export class MemoryService {
  private adapter: DatabaseAdapter;
  private local: LocalMemoryStore = new LocalMemoryStore();

  constructor(backend?: StorageBackendType) {
    this.adapter = createDatabaseAdapter(backend);
    this.adapter.init().catch(() => {});
  }

  getBackendType(): StorageBackendType {
    return this.adapter.backendType;
  }

  isRemoteConfigured(): boolean {
    return this.adapter.backendType === 'supabase' && this.adapter.isAvailable();
  }

  isDatabaseConfigured(): boolean {
    return this.adapter.isAvailable();
  }

  setBackend(backend: StorageBackendType): void {
    this.adapter.close().catch(() => {});
    this.adapter = createDatabaseAdapter(backend);
    this.adapter.init().catch(() => {});
  }

  async logTrade(entry: LedgerEntry): Promise<void> {
    this.local.addLedgerEntry(entry);
    try {
      if (this.adapter.isAvailable()) {
        await this.adapter.logTrade(entry);
      }
    } catch {
      // transparent local fallback
    }
  }

  async updateSessionMetrics(metrics: SessionMetrics): Promise<void> {
    this.local.setSessionMetrics(metrics);
    try {
      if (this.adapter.isAvailable()) {
        await this.adapter.updateSessionMetrics(metrics);
      }
    } catch {
      // transparent local fallback
    }
  }

  async recordLearning(learning: AdaptiveLearning): Promise<void> {
    this.local.setLearning(learning);
    try {
      if (this.adapter.isAvailable()) {
        await this.adapter.recordLearning(learning);
      }
    } catch {
      // transparent local fallback
    }
  }

  async getActiveLearnings(symbol?: string): Promise<AdaptiveLearning[]> {
    try {
      if (this.adapter.isAvailable()) {
        const data = await this.adapter.getActiveLearnings(symbol);
        if (data && data.length > 0) return data;
      }
    } catch {
      // fallback
    }
    return this.local.getActiveLearnings(symbol);
  }

  async getLedger(symbol?: string, limit = 50): Promise<LedgerEntry[]> {
    try {
      if (this.adapter.isAvailable()) {
        const data = await this.adapter.getLedger(symbol, limit);
        if (data && data.length > 0) return data;
      }
    } catch {
      // fallback
    }
    return this.local.getLedger(symbol, limit);
  }

  async incrementTrigger(ruleId: string): Promise<void> {
    this.local.incrementTrigger(ruleId);
    try {
      if (this.adapter.isAvailable()) {
        await this.adapter.incrementTrigger(ruleId);
      }
    } catch {
      // ignore
    }
  }

  async getLatestLedgerEntry(symbol?: string): Promise<LedgerEntry | null> {
    const list = await this.getLedger(symbol, 1);
    return list.length > 0 ? list[0] : null;
  }

  async getLatestLearning(symbol?: string): Promise<AdaptiveLearning | null> {
    const list = await this.getActiveLearnings(symbol);
    return list.length > 0 ? list[0] : null;
  }

  async resetMemory(symbol?: string): Promise<{ deletedLedger: number; deletedLearnings: number }> {
    const localResult = this.local.clear(symbol);
    try {
      if (this.adapter.isAvailable()) {
        const dbResult = await this.adapter.reset(symbol);
        return {
          deletedLedger: dbResult.deletedLedger || localResult.deletedLedger,
          deletedLearnings: dbResult.deletedLearnings || localResult.deletedLearnings
        };
      }
    } catch {
      // fallback
    }
    return localResult;
  }

  async resetAllDatabase(): Promise<ResetDatabaseResult> {
    const localResult = this.local.clear();
    try {
      if (this.adapter.isAvailable()) {
        const res = await this.adapter.resetAll();
        return res;
      }
    } catch (err: any) {
      return {
        success: false,
        deletedLedger: localResult.deletedLedger,
        deletedLearnings: localResult.deletedLearnings,
        deletedMetrics: 0,
        message: `Database reset error: ${err.message}`
      };
    }
    return {
      success: true,
      deletedLedger: localResult.deletedLedger,
      deletedLearnings: localResult.deletedLearnings,
      deletedMetrics: 1,
      message: `Local memory store wiped (${localResult.deletedLedger} trades, ${localResult.deletedLearnings} learnings).`
    };
  }

  async close(): Promise<void> {
    await this.adapter.close();
  }
}
