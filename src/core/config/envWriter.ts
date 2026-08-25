import fs from 'fs';
import path from 'path';
import { OnboardingEnvConfig } from './types.js';

export class EnvWriter {
  static getEnvPath(): string {
    return path.resolve(process.cwd(), '.env');
  }

  static writeEnv(config: OnboardingEnvConfig): void {
    const lines: string[] = [];

    lines.push('# ==============================================================================');
    lines.push('# Zenth Trading Bot — Runtime Environment Configuration');
    lines.push('# Generated during Onboarding Wizard / Configs');
    lines.push('# ==============================================================================');
    lines.push('');

    lines.push('# Storage Backend (sqlite | postgres | mongodb | supabase | local)');
    lines.push(`STORAGE_BACKEND=${config.storageBackend}`);
    lines.push('');

    if (config.storageBackend === 'sqlite') {
      lines.push('# SQLite Local Database Configuration');
      lines.push(`SQLITE_DB_PATH=${config.sqlitePath || './data/zenth.db'}`);
    } else if (config.storageBackend === 'postgres') {
      lines.push('# PostgreSQL Local / Server Configuration');
      if (config.postgresUrl) {
        lines.push(`POSTGRES_URL=${config.postgresUrl}`);
      } else {
        lines.push(`POSTGRES_HOST=${config.postgresHost || 'localhost'}`);
        lines.push(`POSTGRES_PORT=${config.postgresPort || 5432}`);
        lines.push(`POSTGRES_USER=${config.postgresUser || 'postgres'}`);
        lines.push(`POSTGRES_PASSWORD=${config.postgresPassword || 'postgres'}`);
        lines.push(`POSTGRES_DATABASE=${config.postgresDatabase || 'zenth'}`);
      }
    } else if (config.storageBackend === 'mongodb') {
      lines.push('# MongoDB Local / Server Configuration');
      if (config.mongoUri) {
        lines.push(`MONGODB_URI=${config.mongoUri}`);
      } else {
        lines.push(`MONGODB_URI=mongodb://localhost:27017`);
        lines.push(`MONGODB_DATABASE=${config.mongoDatabase || 'zenth'}`);
      }
    } else if (config.storageBackend === 'supabase') {
      lines.push('# Supabase Cloud PostgreSQL Configuration');
      lines.push(`SUPABASE_URL=${config.supabaseUrl || ''}`);
      lines.push(`SUPABASE_KEY=${config.supabaseKey || ''}`);
    }

    lines.push('');
    lines.push('# Core Paper Trading Strategy & Risk Parameters');
    lines.push(`EXCHANGE=${config.tradingParams.exchange || 'binance'}`);
    lines.push(`DEFAULT_SYMBOL=${config.tradingParams.symbol || 'btc_usdt'}`);
    lines.push(`DEFAULT_INTERVAL=${config.tradingParams.interval || '5m'}`);
    lines.push(`DEFAULT_QUANTITY=${config.tradingParams.quantity || 0.01}`);
    lines.push(`MAX_POSITION_NOTIONAL_CAP=${config.tradingParams.maxPositionNotionalCap || 1000.0}`);
    lines.push(`STOP_LOSS_PCT=${config.tradingParams.stopLossPct || 1.5}`);
    lines.push(`TAKE_PROFIT_PCT=${config.tradingParams.takeProfitPct || 3.0}`);
    lines.push(`CANDLE_LOOKBACK=${config.tradingParams.candleLookback || 300}`);
    lines.push(`POLL_INTERVAL_SECONDS=15`);
    lines.push('');

    const envPath = this.getEnvPath();
    fs.writeFileSync(envPath, lines.join('\n'), 'utf-8');

    // Synchronize current process.env in-memory
    process.env.STORAGE_BACKEND = config.storageBackend;
    if (config.sqlitePath) process.env.SQLITE_DB_PATH = config.sqlitePath;
    if (config.postgresUrl) process.env.POSTGRES_URL = config.postgresUrl;
    if (config.postgresHost) process.env.POSTGRES_HOST = config.postgresHost;
    if (config.postgresPort) process.env.POSTGRES_PORT = String(config.postgresPort);
    if (config.postgresUser) process.env.POSTGRES_USER = config.postgresUser;
    if (config.postgresPassword) process.env.POSTGRES_PASSWORD = config.postgresPassword;
    if (config.postgresDatabase) process.env.POSTGRES_DATABASE = config.postgresDatabase;
    if (config.mongoUri) process.env.MONGODB_URI = config.mongoUri;
    if (config.mongoDatabase) process.env.MONGODB_DATABASE = config.mongoDatabase;
    process.env.SUPABASE_URL = config.supabaseUrl || '';
    process.env.SUPABASE_KEY = config.supabaseKey || '';
    process.env.EXCHANGE = config.tradingParams.exchange || 'binance';
    process.env.DEFAULT_SYMBOL = config.tradingParams.symbol || 'btc_usdt';
    process.env.DEFAULT_INTERVAL = config.tradingParams.interval || '5m';
    process.env.DEFAULT_QUANTITY = String(config.tradingParams.quantity || 0.01);
    process.env.MAX_POSITION_NOTIONAL_CAP = String(config.tradingParams.maxPositionNotionalCap || 1000.0);
    process.env.STOP_LOSS_PCT = String(config.tradingParams.stopLossPct || 1.5);
    process.env.TAKE_PROFIT_PCT = String(config.tradingParams.takeProfitPct || 3.0);
    process.env.CANDLE_LOOKBACK = String(config.tradingParams.candleLookback || 300);
  }
}
