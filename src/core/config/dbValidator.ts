import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';
import { MongoClient } from 'mongodb';
import { DatabaseValidationResult, PostgresConfig, MongoConfig } from './types.js';
import { SupabaseValidator } from './supabaseValidator.js';

const { Client } = pg;

export class DbValidator {
  static async validateSqlite(dbPath: string): Promise<DatabaseValidationResult> {
    let db: DatabaseSync | null = null;
    try {
      const resolved = path.resolve(process.cwd(), dbPath);
      const dir = path.dirname(resolved);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      db = new DatabaseSync(resolved);
      const rows = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all() as Array<{ name: string }>;
      const tableNames = rows.map(r => r.name);

      const required = ['trade_ledger', 'adaptive_learnings', 'session_metrics'];
      const missing = required.filter(t => !tableNames.includes(t));

      if (missing.length > 0) {
        return {
          status: 'SCHEMA_MISMATCH',
          message: `SQLite database exists, but missing table(s): ${missing.join(', ')}`,
          missingTables: missing,
          suggestions: ['Press [1] to auto-provision tables or run initialization.']
        };
      }

      return {
        status: 'SUCCESS',
        message: `SQLite database verified at ${dbPath}! All 3 tables ready.`,
        hasTables: true,
        suggestions: []
      };
    } catch (err: any) {
      return {
        status: 'UNKNOWN_ERROR',
        message: `SQLite validation error: ${err.message}`,
        suggestions: ['Verify file path permissions.']
      };
    } finally {
      if (db) {
        try { db.close(); } catch {}
      }
    }
  }

  static async validatePostgres(config: PostgresConfig): Promise<DatabaseValidationResult> {
    const client = new Client({
      connectionString: config.url || undefined,
      host: config.url ? undefined : (config.host || 'localhost'),
      port: config.url ? undefined : (config.port || 5432),
      user: config.url ? undefined : (config.user || 'postgres'),
      password: config.url ? undefined : (config.password || 'postgres'),
      database: config.url ? undefined : (config.database || 'zenth'),
      connectionTimeoutMillis: 5000
    });

    try {
      await client.connect();
      const checkTables = await client.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name IN ('trade_ledger', 'adaptive_learnings', 'session_metrics')
      `);

      const foundTables = checkTables.rows.map(r => r.table_name);
      const required = ['trade_ledger', 'adaptive_learnings', 'session_metrics'];
      const missing = required.filter(t => !foundTables.includes(t));

      if (missing.length > 0) {
        return {
          status: 'SCHEMA_MISMATCH',
          message: `Connected to PostgreSQL, but missing table(s): ${missing.join(', ')}`,
          missingTables: missing,
          suggestions: ['Press [1] to auto-run DDL migration on this database.']
        };
      }

      return {
        status: 'SUCCESS',
        message: `PostgreSQL connection verified! All 3 tables ready.`,
        hasTables: true,
        suggestions: []
      };
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('ECONNREFUSED') || msg.includes('timeout')) {
        return {
          status: 'NETWORK_ERROR',
          message: `Cannot connect to PostgreSQL at ${config.host || 'localhost'}:${config.port || 5432}`,
          suggestions: ['Ensure PostgreSQL service or Docker container is running.', 'Verify port 5432 is accessible.']
        };
      }
      if (msg.includes('password') || msg.includes('authentication') || msg.includes('role')) {
        return {
          status: 'AUTH_ERROR',
          message: `PostgreSQL authentication failed: ${msg}`,
          suggestions: ['Check your username and password credentials.']
        };
      }
      return {
        status: 'UNKNOWN_ERROR',
        message: `PostgreSQL error: ${msg}`,
        suggestions: ['Verify connection settings.']
      };
    } finally {
      await client.end().catch(() => {});
    }
  }

  static async validateMongo(config: MongoConfig): Promise<DatabaseValidationResult> {
    const authPart = config.user && config.password ? `${encodeURIComponent(config.user)}:${encodeURIComponent(config.password)}@` : '';
    const uri = config.uri || `mongodb://${authPart}${config.host || 'localhost'}:${config.port || 27017}`;
    const dbName = config.database || 'zenth';

    let client: MongoClient | null = null;
    try {
      client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      const names = collections.map(c => c.name);

      const required = ['trade_ledger', 'adaptive_learnings', 'session_metrics'];
      const missing = required.filter(r => !names.includes(r));

      if (missing.length > 0) {
        return {
          status: 'SCHEMA_MISMATCH',
          message: `Connected to MongoDB, but missing collections: ${missing.join(', ')}`,
          missingTables: missing,
          suggestions: ['Press [1] to auto-create collections and indexes.']
        };
      }

      return {
        status: 'SUCCESS',
        message: `MongoDB connection verified! Database "${dbName}" ready.`,
        hasTables: true,
        suggestions: []
      };
    } catch (err: any) {
      return {
        status: 'NETWORK_ERROR',
        message: `Cannot connect to MongoDB: ${err.message}`,
        suggestions: ['Ensure MongoDB service or Docker container is running on port 27017.']
      };
    } finally {
      if (client) {
        await client.close().catch(() => {});
      }
    }
  }

  static async validateSupabase(url: string, key: string): Promise<DatabaseValidationResult> {
    return SupabaseValidator.validate(url, key);
  }
}
