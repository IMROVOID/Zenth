import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import { SQLITE_SCHEMA_SQL } from './schemaSql.js';

export interface SqliteSetupResult {
  success: boolean;
  dbPath: string;
  message: string;
  error?: string;
}

export class SqliteAutoSetup {
  static async provision(customPath?: string): Promise<SqliteSetupResult> {
    const dbPath = customPath || path.resolve(process.cwd(), 'data', 'zenth.db');
    let db: DatabaseSync | null = null;
    try {
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      db = new DatabaseSync(dbPath);
      db.exec(SQLITE_SCHEMA_SQL);

      // Verify table creation
      const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all() as Array<{ name: string }>;
      const tableNames = tables.map(t => t.name);

      const required = ['trade_ledger', 'adaptive_learnings', 'session_metrics'];
      const missing = required.filter(r => !tableNames.includes(r));

      if (missing.length > 0) {
        return {
          success: false,
          dbPath,
          message: `SQLite schema creation incomplete. Missing tables: ${missing.join(', ')}`,
          error: 'MISSING_TABLES'
        };
      }

      return {
        success: true,
        dbPath,
        message: `SQLite database auto-created and initialized at "${dbPath}"!`
      };
    } catch (err: any) {
      return {
        success: false,
        dbPath,
        message: `Failed to initialize SQLite database: ${err.message}`,
        error: err.code || 'SQLITE_ERROR'
      };
    } finally {
      if (db) {
        try { db.close(); } catch {}
      }
    }
  }
}
