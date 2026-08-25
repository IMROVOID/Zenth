import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { EnvValidator } from '../src/core/config/envValidator.js';
import { EnvWriter } from '../src/core/config/envWriter.js';
import { OnboardingEnvConfig } from '../src/core/config/types.js';

console.log('[TEST] Running EnvValidator & EnvWriter test suite...');

const originalEnvPath = path.resolve(process.cwd(), '.env');

let hadOriginalEnv = false;
let originalEnvContent = '';
if (fs.existsSync(originalEnvPath)) {
  hadOriginalEnv = true;
  originalEnvContent = fs.readFileSync(originalEnvPath, 'utf-8');
}

try {
  // Test 1: Writing Local Configuration
  const localConfig: OnboardingEnvConfig = {
    storageBackend: 'local',
    tradingParams: {
      symbol: 'eth_usdt',
      interval: '15m',
      quantity: 0.5,
      maxPositionNotionalCap: 1000.0,
      stopLossPct: 2.0,
      takeProfitPct: 4.0,
      candleLookback: 250
    }
  };

  EnvWriter.writeEnv(localConfig);
  assert.strictEqual(process.env.STORAGE_BACKEND, 'local');
  assert.strictEqual(process.env.DEFAULT_SYMBOL, 'eth_usdt');
  assert.strictEqual(process.env.DEFAULT_INTERVAL, '15m');
  assert.strictEqual(process.env.DEFAULT_QUANTITY, '0.5');

  const check1 = EnvValidator.checkEnv();
  assert.strictEqual(check1.hasEnvFile, true);
  assert.strictEqual(check1.isConfigured, true);
  assert.strictEqual(check1.storageBackend, 'local');
  console.log('  [PASS] Test 1: Local configuration write and validation passed.');

  // Test 2: Writing Postgres Configuration
  const pgConfig: OnboardingEnvConfig = {
    storageBackend: 'postgres',
    postgresHost: '127.0.0.1',
    postgresPort: 5432,
    postgresUser: 'postgres',
    postgresPassword: 'pg_secret_password',
    postgresDatabase: 'zenth',
    tradingParams: {
      symbol: 'sol_usdt',
      interval: '1h',
      quantity: 1.0,
      maxPositionNotionalCap: 1000.0,
      stopLossPct: 1.5,
      takeProfitPct: 3.0,
      candleLookback: 300
    }
  };
  EnvWriter.writeEnv(pgConfig);
  assert.strictEqual(process.env.STORAGE_BACKEND, 'postgres');
  assert.strictEqual(process.env.POSTGRES_HOST, '127.0.0.1');
  assert.strictEqual(process.env.POSTGRES_PASSWORD, 'pg_secret_password');
  const checkPg = EnvValidator.checkEnv();
  assert.strictEqual(checkPg.isConfigured, true);
  assert.strictEqual(checkPg.storageBackend, 'postgres');
  console.log('  [PASS] Test 2: PostgreSQL configuration write and validation passed.');

  // Test 3: Writing MongoDB Configuration
  const mongoConfig: OnboardingEnvConfig = {
    storageBackend: 'mongodb',
    mongoUri: 'mongodb://127.0.0.1:27017',
    mongoDatabase: 'zenth_db',
    tradingParams: {
      symbol: 'btc_usdt',
      interval: '5m',
      quantity: 0.01,
      maxPositionNotionalCap: 1000.0,
      stopLossPct: 1.5,
      takeProfitPct: 3.0,
      candleLookback: 300
    }
  };
  EnvWriter.writeEnv(mongoConfig);
  assert.strictEqual(process.env.STORAGE_BACKEND, 'mongodb');
  assert.strictEqual(process.env.MONGODB_URI, 'mongodb://127.0.0.1:27017');
  const checkMongo = EnvValidator.checkEnv();
  assert.strictEqual(checkMongo.isConfigured, true);
  assert.strictEqual(checkMongo.storageBackend, 'mongodb');
  console.log('  [PASS] Test 3: MongoDB configuration write and validation passed.');

  // Test 4: Writing Supabase Configuration
  const supabaseConfig: OnboardingEnvConfig = {
    storageBackend: 'supabase',
    supabaseUrl: 'https://testproject.supabase.co',
    supabaseKey: 'test-supabase-key-1234567890123456',
    tradingParams: {
      symbol: 'btc_usdt',
      interval: '5m',
      quantity: 0.01,
      maxPositionNotionalCap: 1000.0,
      stopLossPct: 1.5,
      takeProfitPct: 3.0,
      candleLookback: 300
    }
  };

  EnvWriter.writeEnv(supabaseConfig);
  assert.strictEqual(process.env.STORAGE_BACKEND, 'supabase');
  assert.strictEqual(process.env.SUPABASE_URL, 'https://testproject.supabase.co');
  assert.strictEqual(process.env.SUPABASE_KEY, 'test-supabase-key-1234567890123456');

  const check4 = EnvValidator.checkEnv();
  assert.strictEqual(check4.hasEnvFile, true);
  assert.strictEqual(check4.isConfigured, true);
  assert.strictEqual(check4.storageBackend, 'supabase');
  console.log('  [PASS] Test 4: Supabase configuration write and validation passed.');

  // Test 5: Placeholder detection
  fs.writeFileSync(originalEnvPath, 'SUPABASE_URL=https://your-project.supabase.co\nSUPABASE_KEY=your-key\n', 'utf-8');
  const check5 = EnvValidator.checkEnv();
  assert.strictEqual(check5.isConfigured, false);
  assert.strictEqual(EnvValidator.isOnboardingRequired(), true);
  console.log('  [PASS] Test 5: Placeholder detection triggers onboarding requirement.');

} finally {
  if (hadOriginalEnv) {
    fs.writeFileSync(originalEnvPath, originalEnvContent, 'utf-8');
  }
}

console.log('[OK] All Env Configuration tests passed successfully!\n');
