import { MongoClient, Db } from 'mongodb';
import { DatabaseAdapter } from './databaseAdapter.js';
import { AdaptiveLearning, SessionMetrics, StorageBackendType } from '../../types.js';
import { LedgerEntry, ResetDatabaseResult } from '../types.js';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class MongoAdapter implements DatabaseAdapter {
  readonly backendType: StorageBackendType = 'mongodb';
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private uri: string;
  private dbName: string;

  constructor(customUri?: string, customDb?: string) {
    this.uri = customUri || process.env.MONGODB_URI || 'mongodb://localhost:27017';
    this.dbName = customDb || process.env.MONGODB_DATABASE || 'zenth';
  }

  async init(): Promise<void> {
    if (this.db) return;
    this.client = new MongoClient(this.uri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 });
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);

      await this.db.collection('trade_ledger').createIndex({ symbol: 1 });
      await this.db.collection('trade_ledger').createIndex({ timestamp: -1 });
      await this.db.collection('adaptive_learnings').createIndex({ symbol: 1, status: 1 });
      await this.db.collection('session_metrics').createIndex({ session_id: 1 }, { unique: true });
    } catch (err) {
      if (this.client) {
        await this.client.close().catch(() => {});
      }
      this.client = null;
      this.db = null;
      throw err;
    }
  }

  isAvailable(): boolean {
    return this.db !== null;
  }

  async logTrade(entry: LedgerEntry): Promise<void> {
    if (!this.db) await this.init();
    const id = entry.id || `trade_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const notional = (entry.notional_value !== undefined) ? entry.notional_value : (entry.price * entry.quantity);
    await this.db!.collection('trade_ledger').insertOne({
      _id: id as any,
      id,
      timestamp: entry.timestamp,
      symbol: entry.symbol,
      action: entry.action,
      price: entry.price,
      quantity: entry.quantity,
      notional_value: notional,
      entry_value: entry.entry_value || 0,
      exit_value: entry.exit_value || 0,
      pnl_percentage: entry.pnl_percentage || 0,
      fee_cost: entry.fee_cost || 0,
      session_id: entry.session_id || null,
      reason: entry.reason || '',
      mode: entry.mode || 'PAPER',
      outcome: entry.outcome || 'PENDING',
      pnl: entry.pnl || 0
    });
  }

  async updateSessionMetrics(m: SessionMetrics): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.collection('session_metrics').updateOne(
      { session_id: m.session_id },
      { $set: { ...m, active_position: m.active_position || null } },
      { upsert: true }
    );
  }

  async recordLearning(l: AdaptiveLearning): Promise<void> {
    if (!this.db) await this.init();
    const id = l.id || `rule_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = l.created_at || new Date().toISOString();
    await this.db!.collection('adaptive_learnings').insertOne({
      _id: id as any,
      id,
      created_at: createdAt,
      symbol: l.symbol,
      pattern_condition: l.pattern_condition,
      loss_reason: l.loss_reason,
      trading_rule: l.trading_rule,
      status: l.status,
      trigger_count: l.trigger_count || 0,
      last_triggered_at: l.last_triggered_at || null,
      metadata: l.metadata || {}
    });
  }

  async getActiveLearnings(symbol?: string): Promise<AdaptiveLearning[]> {
    if (!this.db) await this.init();
    const filter: any = { status: 'ACTIVE' };
    if (symbol) {
      const safe = escapeRegex(symbol);
      filter.$or = [{ symbol: { $regex: new RegExp(`^${safe}$`, 'i') } }, { symbol: { $regex: /^all$/i } }];
    }
    const docs = await this.db!.collection('adaptive_learnings').find(filter).sort({ created_at: 1 }).toArray();
    return docs.map(d => ({
      id: d.id || d._id?.toString(),
      created_at: d.created_at,
      symbol: d.symbol,
      pattern_condition: d.pattern_condition,
      loss_reason: d.loss_reason,
      trading_rule: d.trading_rule,
      status: d.status,
      trigger_count: d.trigger_count || 0,
      last_triggered_at: d.last_triggered_at,
      metadata: d.metadata || {}
    }));
  }

  async getLedger(symbol?: string, limit = 50): Promise<LedgerEntry[]> {
    if (!this.db) await this.init();
    const filter: any = symbol ? { symbol: { $regex: new RegExp(escapeRegex(symbol), 'i') } } : {};
    const docs = await this.db!.collection('trade_ledger').find(filter).sort({ timestamp: -1 }).limit(limit).toArray();
    return docs.map(d => ({
      id: d.id || d._id?.toString(),
      timestamp: d.timestamp,
      symbol: d.symbol,
      action: d.action,
      price: d.price,
      quantity: d.quantity,
      notional_value: d.notional_value,
      entry_value: d.entry_value,
      exit_value: d.exit_value,
      pnl_percentage: d.pnl_percentage,
      fee_cost: d.fee_cost,
      session_id: d.session_id,
      reason: d.reason,
      mode: d.mode,
      outcome: d.outcome,
      pnl: d.pnl || 0
    }));
  }

  async incrementTrigger(ruleId: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.collection('adaptive_learnings').updateOne(
      { $or: [{ id: ruleId }, { pattern_condition: ruleId }] },
      { $inc: { trigger_count: 1 }, $set: { last_triggered_at: new Date().toISOString() } }
    );
  }

  async reset(symbol?: string): Promise<{ deletedLedger: number; deletedLearnings: number }> {
    if (!this.db) await this.init();
    const filter = symbol ? { symbol: { $regex: new RegExp(`^${escapeRegex(symbol)}$`, 'i') } } : {};
    const l = await this.db!.collection('trade_ledger').deleteMany(filter);
    const a = await this.db!.collection('adaptive_learnings').deleteMany(filter);
    return { deletedLedger: l.deletedCount, deletedLearnings: a.deletedCount };
  }

  async resetAll(): Promise<ResetDatabaseResult> {
    if (!this.db) await this.init();
    const l = await this.db!.collection('trade_ledger').deleteMany({});
    const a = await this.db!.collection('adaptive_learnings').deleteMany({});
    const m = await this.db!.collection('session_metrics').deleteMany({});
    return {
      success: true,
      deletedLedger: l.deletedCount,
      deletedLearnings: a.deletedCount,
      deletedMetrics: m.deletedCount,
      message: `MongoDB collections cleared (${this.dbName})`
    };
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close().catch(() => {});
      this.client = null;
      this.db = null;
    }
  }
}
