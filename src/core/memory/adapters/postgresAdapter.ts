import pg from 'pg';
import { DatabaseAdapter } from './databaseAdapter.js';
import { AdaptiveLearning, SessionMetrics } from '../../types.js';
import { LedgerEntry, ResetDatabaseResult, StorageBackendType } from '../types.js';
import { POSTGRES_SCHEMA_SQL } from '../../config/schemaSql.js';

const { Pool } = pg;

export class PostgresAdapter implements DatabaseAdapter {
  readonly backendType: StorageBackendType = 'postgres';
  private pool: pg.Pool | null = null;
  private connectionConfig: pg.PoolConfig;

  constructor(customConfig?: pg.PoolConfig) {
    const base: pg.PoolConfig = {
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      max: 10
    };
    if (customConfig) {
      this.connectionConfig = { ...base, ...customConfig };
    } else if (process.env.POSTGRES_URL) {
      this.connectionConfig = { ...base, connectionString: process.env.POSTGRES_URL };
    } else {
      this.connectionConfig = {
        ...base,
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DATABASE || 'zenth'
      };
    }
  }

  async init(): Promise<void> {
    if (this.pool) return;
    try {
      this.pool = new Pool(this.connectionConfig);
      this.pool.on('error', (err) => {
        console.warn(`[WARN] PG Pool idle client error: ${err.message}`);
      });
      await this.pool.query(POSTGRES_SCHEMA_SQL);
    } catch (err) {
      if (this.pool) {
        await this.pool.end().catch(() => {});
      }
      this.pool = null;
      throw err;
    }
  }

  isAvailable(): boolean {
    return this.pool !== null;
  }

  async logTrade(entry: LedgerEntry): Promise<void> {
    if (!this.pool) await this.init();
    const id = entry.id || `trade_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const notional = (entry.notional_value !== undefined) ? entry.notional_value : (entry.price * entry.quantity);
    await this.pool!.query(`
      INSERT INTO public.trade_ledger (id, timestamp, symbol, action, price, quantity, notional_value, entry_value, exit_value, pnl_percentage, fee_cost, session_id, reason, mode, outcome, pnl)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `, [
      id, entry.timestamp, entry.symbol, entry.action, entry.price, entry.quantity,
      notional, entry.entry_value || 0, entry.exit_value || 0,
      entry.pnl_percentage || 0, entry.fee_cost || 0, entry.session_id || null,
      entry.reason || '', entry.mode || 'PAPER', entry.outcome || 'PENDING', entry.pnl || 0
    ]);
  }

  async updateSessionMetrics(m: SessionMetrics): Promise<void> {
    if (!this.pool) await this.init();
    const id = m.id || `sess_${Date.now()}`;
    await this.pool!.query(`
      INSERT INTO public.session_metrics (id, session_id, symbol, started_at, last_updated_at, total_entries, total_wins, total_losses, win_rate, entered_capital, closed_capital, realized_pnl, realized_pnl_percentage, peak_unrealized_pnl, peak_unrealized_pct, active_position)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT(session_id) DO UPDATE SET
        symbol = EXCLUDED.symbol,
        last_updated_at = EXCLUDED.last_updated_at,
        total_entries = EXCLUDED.total_entries,
        total_wins = EXCLUDED.total_wins,
        total_losses = EXCLUDED.total_losses,
        win_rate = EXCLUDED.win_rate,
        entered_capital = EXCLUDED.entered_capital,
        closed_capital = EXCLUDED.closed_capital,
        realized_pnl = EXCLUDED.realized_pnl,
        realized_pnl_percentage = EXCLUDED.realized_pnl_percentage,
        peak_unrealized_pnl = EXCLUDED.peak_unrealized_pnl,
        peak_unrealized_pct = EXCLUDED.peak_unrealized_pct,
        active_position = EXCLUDED.active_position
    `, [
      id, m.session_id, m.symbol, m.started_at, m.last_updated_at,
      m.total_entries, m.total_wins, m.total_losses, m.win_rate,
      m.entered_capital, m.closed_capital, m.realized_pnl, m.realized_pnl_percentage,
      m.peak_unrealized_pnl, m.peak_unrealized_pct, m.active_position ? JSON.stringify(m.active_position) : null
    ]);
  }

  async recordLearning(l: AdaptiveLearning): Promise<void> {
    if (!this.pool) await this.init();
    const id = l.id || `rule_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = l.created_at || new Date().toISOString();
    await this.pool!.query(`
      INSERT INTO public.adaptive_learnings (id, created_at, symbol, pattern_condition, loss_reason, trading_rule, status, trigger_count, last_triggered_at, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      id, createdAt, l.symbol, l.pattern_condition, l.loss_reason,
      l.trading_rule, l.status, l.trigger_count || 0, l.last_triggered_at || null,
      l.metadata ? JSON.stringify(l.metadata) : '{}'
    ]);
  }

  async getActiveLearnings(symbol?: string): Promise<AdaptiveLearning[]> {
    if (!this.pool) await this.init();
    let query = `SELECT * FROM public.adaptive_learnings WHERE status = 'ACTIVE'`;
    const params: string[] = [];
    if (symbol) {
      query += ` AND (LOWER(symbol) = LOWER($1) OR LOWER(symbol) = 'all')`;
      params.push(symbol);
    }
    query += ` ORDER BY created_at ASC`;
    const res = await this.pool!.query(query, params);
    return res.rows.map(r => ({
      id: r.id,
      created_at: r.created_at,
      symbol: r.symbol,
      pattern_condition: r.pattern_condition,
      loss_reason: r.loss_reason,
      trading_rule: r.trading_rule,
      status: r.status,
      trigger_count: parseInt(r.trigger_count, 10) || 0,
      last_triggered_at: r.last_triggered_at,
      metadata: typeof r.metadata === 'string' ? (() => { try { return JSON.parse(r.metadata || '{}'); } catch { return {}; } })() : (r.metadata || {})
    }));
  }

  async getLedger(symbol?: string, limit = 50): Promise<LedgerEntry[]> {
    if (!this.pool) await this.init();
    let query = `SELECT * FROM public.trade_ledger`;
    const params: any[] = [];
    if (symbol) {
      query += ` WHERE LOWER(symbol) LIKE $1`;
      params.push(`%${symbol.toLowerCase()}%`);
    }
    query += ` ORDER BY timestamp DESC LIMIT $${params.length + 1}`;
    params.push(limit);
    const res = await this.pool!.query(query, params);
    return res.rows.map(r => ({
      ...r,
      price: parseFloat(r.price),
      quantity: parseFloat(r.quantity),
      notional_value: r.notional_value ? parseFloat(r.notional_value) : undefined,
      entry_value: r.entry_value ? parseFloat(r.entry_value) : undefined,
      exit_value: r.exit_value ? parseFloat(r.exit_value) : undefined,
      pnl_percentage: r.pnl_percentage ? parseFloat(r.pnl_percentage) : undefined,
      fee_cost: r.fee_cost ? parseFloat(r.fee_cost) : undefined,
      pnl: r.pnl ? parseFloat(r.pnl) : 0
    }));
  }

  async incrementTrigger(ruleId: string): Promise<void> {
    if (!this.pool) await this.init();
    await this.pool!.query(`
      UPDATE public.adaptive_learnings
      SET trigger_count = trigger_count + 1, last_triggered_at = NOW()
      WHERE id = $1 OR pattern_condition = $1
    `, [ruleId]);
  }

  async reset(symbol?: string): Promise<{ deletedLedger: number; deletedLearnings: number }> {
    if (!this.pool) await this.init();
    if (symbol) {
      const lRes = await this.pool!.query(`DELETE FROM public.trade_ledger WHERE LOWER(symbol) = LOWER($1)`, [symbol]);
      const aRes = await this.pool!.query(`DELETE FROM public.adaptive_learnings WHERE LOWER(symbol) = LOWER($1)`, [symbol]);
      return { deletedLedger: lRes.rowCount || 0, deletedLearnings: aRes.rowCount || 0 };
    }
    const lRes = await this.pool!.query(`DELETE FROM public.trade_ledger`);
    const aRes = await this.pool!.query(`DELETE FROM public.adaptive_learnings`);
    return { deletedLedger: lRes.rowCount || 0, deletedLearnings: aRes.rowCount || 0 };
  }

  async resetAll(): Promise<ResetDatabaseResult> {
    if (!this.pool) await this.init();
    const lRes = await this.pool!.query(`DELETE FROM public.trade_ledger`);
    const aRes = await this.pool!.query(`DELETE FROM public.adaptive_learnings`);
    const mRes = await this.pool!.query(`DELETE FROM public.session_metrics`);
    return {
      success: true,
      deletedLedger: lRes.rowCount || 0,
      deletedLearnings: aRes.rowCount || 0,
      deletedMetrics: mRes.rowCount || 0,
      message: `PostgreSQL database tables truncated.`
    };
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end().catch(() => {});
      this.pool = null;
    }
  }
}
