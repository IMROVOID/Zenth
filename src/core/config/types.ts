import { SupportedExchange, StorageBackendType } from '../types.js';

export { StorageBackendType };

export type DatabaseValidationStatus =
  | 'IDLE'
  | 'VALIDATING'
  | 'SUCCESS'
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'SCHEMA_MISMATCH'
  | 'UNKNOWN_ERROR';

export interface DatabaseValidationResult {
  status: DatabaseValidationStatus;
  message: string;
  suggestions: string[];
  missingTables?: string[];
  sqlFixScript?: string;
  hasTables?: boolean;
}

export type SupabaseValidationStatus = DatabaseValidationStatus;
export type SupabaseValidationResult = DatabaseValidationResult;

export interface SqliteConfig {
  dbPath: string;
}

export interface PostgresConfig {
  url?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
}

export interface MongoConfig {
  uri?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
}

export interface OnboardingTradingParams {
  exchange?: SupportedExchange;
  symbol: string;
  interval: string;
  quantity: number;
  maxPositionNotionalCap: number;
  stopLossPct: number;
  takeProfitPct: number;
  candleLookback: number;
}

export interface OnboardingEnvConfig {
  storageBackend: StorageBackendType;
  sqlitePath?: string;
  postgresUrl?: string;
  postgresHost?: string;
  postgresPort?: number;
  postgresUser?: string;
  postgresPassword?: string;
  postgresDatabase?: string;
  mongoUri?: string;
  mongoDatabase?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
  tradingParams: OnboardingTradingParams;
}
