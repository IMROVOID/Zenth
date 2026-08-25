import {
  DatabaseValidationResult,
  OnboardingTradingParams,
  StorageBackendType
} from '../../core/config/types.js';

export type OnboardingStep =
  | 'STORAGE_CHOICE'
  | 'SQLITE_SETUP'
  | 'POSTGRES_SETUP_CHOICE'
  | 'POSTGRES_CREDENTIALS'
  | 'MONGO_SETUP_CHOICE'
  | 'MONGO_CREDENTIALS'
  | 'SUPABASE_SETUP_CHOICE'
  | 'SUPABASE_AUTO_TOKEN'
  | 'SUPABASE_MANUAL_GUIDE'
  | 'SUPABASE_CREDENTIALS'
  | 'TRADING_PARAMS'
  | 'PARAM_PICKER'
  | 'SYMBOL_PICKER'
  | 'COMPLETE';

export interface SymbolPickerItem {
  symbol: string;
  ticker: string;
  name: string;
  price: number;
  change24hPct: number;
  type: 'crypto' | 'stock';
  sparkline?: number[];
}

export type SymbolCategoryFilter = 'ALL' | 'CRYPTO' | 'STOCK';

export interface OnboardingStateData {
  currentStep: OnboardingStep;
  selectedOptionIndex: number;
  storageBackend: StorageBackendType;
  sqlitePath: string;
  postgresSetupMode: 'auto' | 'manual';
  postgresHost: string;
  postgresPort: string;
  postgresUser: string;
  postgresPassword: string;
  postgresDatabase: string;
  postgresUrl: string;
  activePostgresField: 'host' | 'port' | 'user' | 'password' | 'database' | 'url';
  mongoSetupMode: 'auto' | 'manual';
  mongoUri: string;
  mongoHost: string;
  mongoPort: string;
  mongoDatabase: string;
  activeMongoField: 'uri' | 'host' | 'port' | 'database';
  supabaseSetupMode: 'auto' | 'manual';
  supabasePatToken: string;
  supabaseUrl: string;
  supabaseKey: string;
  activeCredentialField: 'url' | 'key';
  tradingParams: OnboardingTradingParams;
  activeTradingParamIndex: number;
  activeParamPickerKey: keyof OnboardingTradingParams | null;
  paramPickerSelectedIndex: number;
  symbolSearchQuery: string;
  symbolCategoryFilter: SymbolCategoryFilter;
  symbolSelectedIndex: number;
  availableSymbols: SymbolPickerItem[];
  isLoadingSymbols: boolean;
  validationResult: DatabaseValidationResult | null;
  isValidating: boolean;
  isAutoProvisioning: boolean;
  statusMessage: string;
  copiedNotice: string;
  isCancelled?: boolean;
}
