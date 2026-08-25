import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseAdapter } from './databaseAdapter.js';
import { AdaptiveLearning, SessionMetrics } from '../../types.js';
import { LedgerEntry, ResetDatabaseResult, StorageBackendType } from '../types.js';
import { createSupabaseClient } from '../supabaseClient.js';
import { resetSupabaseTables } from '../supabaseReset.js';
import {
  insertLedgerSupabase,
  upsertSessionMetricsSupabase,
  upsertLearningSupabase,
  selectActiveLearningsSupabase,
  selectLedgerSupabase
} from '../supabaseQueries.js';

export class SupabaseAdapter implements DatabaseAdapter {
  readonly backendType: StorageBackendType = 'supabase';
  private supabase: SupabaseClient | null = null;
  private isConfigured = false;

  constructor() {
    const { client, isConfigured } = createSupabaseClient();
    this.supabase = client;
    this.isConfigured = isConfigured;
  }

  async init(): Promise<void> {
    if (!this.supabase) {
      const { client, isConfigured } = createSupabaseClient();
      this.supabase = client;
      this.isConfigured = isConfigured;
    }
  }

  isAvailable(): boolean {
    return this.isConfigured && this.supabase !== null;
  }

  async logTrade(entry: LedgerEntry): Promise<void> {
    if (this.isAvailable()) {
      await insertLedgerSupabase(this.supabase!, entry);
    }
  }

  async updateSessionMetrics(m: SessionMetrics): Promise<void> {
    if (this.isAvailable()) {
      await upsertSessionMetricsSupabase(this.supabase!, m);
    }
  }

  async recordLearning(l: AdaptiveLearning): Promise<void> {
    if (this.isAvailable()) {
      await upsertLearningSupabase(this.supabase!, l);
    }
  }

  async getActiveLearnings(symbol?: string): Promise<AdaptiveLearning[]> {
    if (this.isAvailable()) {
      const data = await selectActiveLearningsSupabase(this.supabase!, symbol);
      if (data) return data;
    }
    return [];
  }

  async getLedger(symbol?: string, limit = 50): Promise<LedgerEntry[]> {
    if (this.isAvailable()) {
      const data = await selectLedgerSupabase(this.supabase!, symbol, limit);
      if (data) return data;
    }
    return [];
  }

  async incrementTrigger(ruleId: string): Promise<void> {
    if (!this.isAvailable() || !ruleId) return;
    try {
      const { data } = await this.supabase!
        .from('adaptive_learnings')
        .select('id, trigger_count')
        .or(`id.eq.${ruleId},pattern_condition.eq.${ruleId}`)
        .limit(1);

      if (data && data.length > 0) {
        const item = data[0];
        const currentCount = item.trigger_count || 0;
        await this.supabase!
          .from('adaptive_learnings')
          .update({
            trigger_count: currentCount + 1,
            last_triggered_at: new Date().toISOString()
          })
          .eq('id', item.id);
      }
    } catch {
      // ignore
    }
  }

  async reset(symbol?: string): Promise<{ deletedLedger: number; deletedLearnings: number }> {
    if (this.isAvailable()) {
      const res = await resetSupabaseTables(this.supabase!, symbol);
      return {
        deletedLedger: res.deletedLedger,
        deletedLearnings: res.deletedLearnings
      };
    }
    return { deletedLedger: 0, deletedLearnings: 0 };
  }

  async resetAll(): Promise<ResetDatabaseResult> {
    if (this.isAvailable()) {
      return await resetSupabaseTables(this.supabase!);
    }
    return {
      success: true,
      deletedLedger: 0,
      deletedLearnings: 0,
      deletedMetrics: 0,
      message: 'Supabase unconfigured or reset skipped.'
    };
  }

  async close(): Promise<void> {
    this.supabase = null;
  }
}
