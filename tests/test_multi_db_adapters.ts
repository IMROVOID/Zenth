import assert from 'node:assert';
import { createDatabaseAdapter } from '../src/core/memory/factory.js';
import { MongoAdapter } from '../src/core/memory/adapters/mongoAdapter.js';
import { PostgresAdapter } from '../src/core/memory/adapters/postgresAdapter.js';
import { SupabaseAdapter } from '../src/core/memory/adapters/supabaseAdapter.js';
import { SQLiteAdapter } from '../src/core/memory/adapters/sqliteAdapter.js';

async function runTests() {
  console.log('[TEST] Starting multi-db adapter unit tests...');

  // 1. Factory Alias and Fallback Resolution
  const defaultAdapter = createDatabaseAdapter(undefined as any);
  assert.strictEqual(defaultAdapter.backendType, 'sqlite', 'Undefined backend should fallback to sqlite');

  const unknownAdapter = createDatabaseAdapter('unknown_engine' as any);
  assert.strictEqual(unknownAdapter.backendType, 'sqlite', 'Unknown backend should fallback to sqlite');

  const pgAdapter = createDatabaseAdapter('postgres');
  assert.strictEqual(pgAdapter.backendType, 'postgres');

  const mongoAdapter = createDatabaseAdapter('mongodb');
  assert.strictEqual(mongoAdapter.backendType, 'mongodb');

  const supaAdapter = createDatabaseAdapter('supabase');
  assert.strictEqual(supaAdapter.backendType, 'supabase');

  console.log('  [PASS] Test 1: Factory aliases and default fallbacks verified.');

  // 2. MongoAdapter Instantiation & Safe Defaults
  const customMongo = new MongoAdapter('mongodb://127.0.0.1:27017', 'custom_zenth');
  assert.strictEqual(customMongo.backendType, 'mongodb');
  assert.strictEqual(customMongo.isAvailable(), false, 'Mongo should not be available before connect');

  console.log('  [PASS] Test 2: MongoAdapter configuration and safety verified.');

  // 3. PostgresAdapter Instantiation & Pool Options
  const customPg = new PostgresAdapter({
    host: '127.0.0.1',
    port: 5432,
    database: 'custom_zenth'
  });
  assert.strictEqual(customPg.backendType, 'postgres');
  assert.strictEqual(customPg.isAvailable(), false, 'Postgres should not be available before connect');

  console.log('  [PASS] Test 3: PostgresAdapter configuration verified.');

  // 4. SupabaseAdapter Non-UUID Trigger Increment Guard
  const customSupa = new SupabaseAdapter();
  // Call incrementTrigger with arbitrary string ID when unconfigured -> should safely no-op without throwing
  await customSupa.incrementTrigger('custom_rule_id_no_hyphen');
  assert.strictEqual(customSupa.backendType, 'supabase');

  console.log('  [PASS] Test 4: SupabaseAdapter trigger increment safety verified.');

  console.log('[OK] All multi-db adapter unit tests passed successfully!\n');
}

runTests().catch((err) => {
  console.error('[TEST FAILED]', err);
  process.exit(1);
});
