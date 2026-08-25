import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import { DatabaseAdapter } from './databaseAdapter.js';
import { AdaptiveLearning, SessionMetrics, StorageBackendType } from '../../types.js';
import { LedgerEntry, ResetDatabaseResult } from '../types.js';
import { SQLITE_SCHEMA_SQL } from '../../config/schemaSql.js';

export class SQLiteAdapter implements DatabaseAdapter {
  readonly backendType: StorageBackendType = 'sqlite';
  private db: DatabaseSync | null = null;
  private dbPath: string;

  constructor(customPath?: string) {
    this.dbPath = customPath || process.env.SQLITE_DB_PATH || path.resolve(process.cwd(), 'data', 'zenth.db');
  }

  async init(): Promise<void> {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.db = new DatabaseSync(this.dbPath);
    this.db.exec(SQLITE_SCHEMA_SQL);
  }

  isAvailable(): boolean {
    return this.db !== null;
  }

  async logTrade(entry: LedgerEntry): Promise<void> {
    if (!this.db) await this.init();
    const stmt = this.db!.prepare(`
      INSERT INTO trade_ledger (id, timestamp, symbol, action, price, quantity, notional_value, entry_value, exit_value, pnl_percentage, fee_cost, session_id, reason, mode, outcome, pnl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const id = entry.id || `trade_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const notional = (entry.notional_value !== undefined) ? entry.notional_value : (entry.price * entry.quantity);
    stmt.run(
      id, entry.timestamp, entry.symbol, entry.action, entry.price, entry.quantity,
      notional, entry.entry_value || 0, entry.exit_value || 0,
      entry.pnl_percentage || 0, entry.fee_cost || 0, entry.session_id || null,
      entry.reason || '', entry.mode || 'PAPER', entry.outcome || 'PENDING', entry.pnl || 0
    );
  }

  async updateSessionMetrics(m: SessionMetrics): Promise<void> {
    if (!this.db) await this.init();
    const stmt = this.db!.prepare(`
      INSERT INTO session_metrics (id, session_id, symbol, started_at, last_updated_at, total_entries, total_wins, total_losses, win_rate, entered_capital, closed_capital, realized_pnl, realized_pnl_percentage, peak_unrealized_pnl, peak_unrealized_pct, active_position)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(session_id) DO UPDATE SET
        symbol = excluded.symbol,
        last_updated_at = excluded.last_updated_at,
        total_entries = excluded.total_entries,
        total_wins = excluded.total_wins,
        total_losses = excluded.total_losses,
        win_rate = excluded.win_rate,
        entered_capital = excluded.entered_capital,
        closed_capital = excluded.closed_capital,
        realized_pnl = excluded.realized_pnl,
        realized_pnl_percentage = excluded.realized_pnl_percentage,
        peak_unrealized_pnl = excluded.peak_unrealized_pnl,
        peak_unrealized_pct = excluded.peak_unrealized_pct,
        active_position = excluded.active_position
    `);
    const id = m.id || `sess_${Date.now()}`;
    const posJson = m.active_position ? JSON.stringify(m.active_position) : null;
    stmt.run(
      id, m.session_id, m.symbol, m.started_at, m.last_updated_at,
      m.total_entries, m.total_wins, m.total_losses, m.win_rate,
      m.entered_capital, m.closed_capital, m.realized_pnl, m.realized_pnl_percentage,
      m.peak_unrealized_pnl, m.peak_unrealized_pct, posJson
    );
  }

  async recordLearning(l: AdaptiveLearning): Promise<void> {
    if (!this.db) await this.init();
    const stmt = this.db!.prepare(`
      INSERT INTO adaptive_learnings (id, created_at, symbol, pattern_condition, loss_reason, trading_rule, status, trigger_count, last_triggered_at, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const id = l.id || `rule_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = l.created_at || new Date().toISOString();
    const metaJson = l.metadata ? JSON.stringify(l.metadata) : '{}';
    stmt.run(
      id, createdAt, l.symbol, l.pattern_condition, l.loss_reason,
      l.trading_rule, l.status, l.trigger_count || 0, l.last_triggered_at || null, metaJson
    );
  }

  async getActiveLearnings(symbol?: string): Promise<AdaptiveLearning[]> {
    if (!this.db) await this.init();
    let query = `SELECT * FROM adaptive_learnings WHERE status = 'ACTIVE'`;
    const params: string[] = [];
    if (symbol) {
      query += ` AND (LOWER(symbol) = LOWER(?) OR LOWER(symbol) = 'all')`;
      params.push(symbol);
    }
    query += ` ORDER BY created_at ASC`;
    const rows = this.db!.prepare(query).all(...params) as any[];
    return rows.map(r => ({
      id: r.id,
      created_at: r.created_at,
      symbol: r.symbol,
      pattern_condition: r.pattern_condition,
      loss_reason: r.loss_reason,
      trading_rule: r.trading_rule,
      status: r.status,
      trigger_count: r.trigger_count,
      last_triggered_at: r.last_triggered_at,
      metadata: typeof r.metadata === 'string' ? (() => { try { return JSON.parse(r.metadata || '{}'); } catch { return {}; } })() : (r.metadata || {})
    }));
  }

  async getLedger(symbol?: string, limit = 50): Promise<LedgerEntry[]> {
    if (!this.db) await this.init();
    let query = `SELECT * FROM trade_ledger`;
    const params: any[] = [];
    if (symbol) {
      query += ` WHERE LOWER(symbol) LIKE ?`;
      params.push(`%${symbol.toLowerCase()}%`);
    }
    query += ` ORDER BY timestamp DESC LIMIT ?`;
    params.push(limit);
    return this.db!.prepare(query).all(...params) as unknown as LedgerEntry[];
  }

  async incrementTrigger(ruleId: string): Promise<void> {
    if (!this.db) await this.init();
    const stmt = this.db!.prepare(`
      UPDATE adaptive_learnings
      SET trigger_count = trigger_count + 1, last_triggered_at = ?
      WHERE id = ? OR pattern_condition = ?
    `);
    stmt.run(new Date().toISOString(), ruleId, ruleId);
  }

  async reset(symbol?: string): Promise<{ deletedLedger: number; deletedLearnings: number }> {
    if (!this.db) await this.init();
    let deletedLedger = 0;
    let deletedLearnings = 0;
    if (symbol) {
      const r1 = this.db!.prepare(`DELETE FROM trade_ledger WHERE LOWER(symbol) = LOWER(?)`).run(symbol);
      const r2 = this.db!.prepare(`DELETE FROM adaptive_learnings WHERE LOWER(symbol) = LOWER(?)`).run(symbol);
      deletedLedger = Number(r1.changes);
      deletedLearnings = Number(r2.changes);
    } else {
      const r1 = this.db!.prepare(`DELETE FROM trade_ledger`).run();
      const r2 = this.db!.prepare(`DELETE FROM adaptive_learnings`).run();
      deletedLedger = Number(r1.changes);
      deletedLearnings = Number(r2.changes);
    }
    return { deletedLedger, deletedLearnings };
  }

  async resetAll(): Promise<ResetDatabaseResult> {
    if (!this.db) await this.init();
    const r1 = this.db!.prepare(`DELETE FROM trade_ledger`).run();
    const r2 = this.db!.prepare(`DELETE FROM adaptive_learnings`).run();
    const r3 = this.db!.prepare(`DELETE FROM session_metrics`).run();
    return {
      success: true,
      deletedLedger: Number(r1.changes),
      deletedLearnings: Number(r2.changes),
      deletedMetrics: Number(r3.changes),
      message: `SQLite database wiped (${this.dbPath})`
    };
  }

  async close(): Promise<void> {
    if (this.db) {
      try { this.db.close(); } catch {}
      this.db = null;
    }
  }
}
