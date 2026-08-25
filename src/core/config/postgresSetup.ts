import pg from 'pg';
import { POSTGRES_SCHEMA_SQL } from './schemaSql.js';
import { PostgresConfig } from './types.js';

const { Client } = pg;

export interface PostgresSetupResult {
  success: boolean;
  message: string;
  config: PostgresConfig;
  error?: string;
}

export class PostgresAutoSetup {
  static async provision(config: PostgresConfig): Promise<PostgresSetupResult> {
    const host = config.host || 'localhost';
    const port = config.port || 5432;
    const user = config.user || 'postgres';
    const password = config.password || 'postgres';
    const targetDb = config.database || 'zenth';

    try {
      // 1. Connect to admin DB (postgres) to create database if not exists
      const adminClient = new Client({
        connectionString: config.url || undefined,
        host: config.url ? undefined : host,
        port: config.url ? undefined : port,
        user: config.url ? undefined : user,
        password: config.url ? undefined : password,
        database: config.url ? undefined : 'postgres',
        connectionTimeoutMillis: 5000
      });

      try {
        await adminClient.connect();
        const checkRes = await adminClient.query(
          `SELECT 1 FROM pg_database WHERE datname = $1`,
          [targetDb]
        );
        if (checkRes.rowCount === 0) {
          const safeDbName = targetDb.replace(/"/g, '""');
          await adminClient.query(`CREATE DATABASE "${safeDbName}"`);
        }
      } catch {
        // Fall through to connect to target DB
      } finally {
        await adminClient.end().catch(() => {});
      }

      // 2. Connect to target DB and apply DDL schema
      const targetClient = new Client({
        connectionString: config.url || undefined,
        host: config.url ? undefined : host,
        port: config.url ? undefined : port,
        user: config.url ? undefined : user,
        password: config.url ? undefined : password,
        database: config.url ? undefined : targetDb,
        connectionTimeoutMillis: 5000
      });

      let foundTables: string[] = [];
      try {
        await targetClient.connect();
        await targetClient.query(POSTGRES_SCHEMA_SQL);

        // 3. Verify tables
        const checkTables = await targetClient.query(`
          SELECT table_name FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name IN ('trade_ledger', 'adaptive_learnings', 'session_metrics')
        `);
        foundTables = checkTables.rows.map(r => r.table_name);
      } finally {
        await targetClient.end().catch(() => {});
      }

      if (foundTables.length < 3) {
        return {
          success: false,
          config,
          message: `Schema creation incomplete. Found tables: ${foundTables.join(', ')}`,
          error: 'MISSING_TABLES'
        };
      }

      return {
        success: true,
        config: { ...config, host, port, user, password, database: targetDb },
        message: `PostgreSQL database "${targetDb}" successfully created and provisioned on ${host}:${port}!`
      };
    } catch (err: any) {
      return {
        success: false,
        config,
        message: `PostgreSQL provisioning failed: ${err.message}`,
        error: err.code || 'POSTGRES_ERROR'
      };
    }
  }
}
