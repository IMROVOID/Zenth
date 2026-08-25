import assert from 'node:assert';
import { createDatabaseAdapter } from '../src/core/memory/factory.js';

async function runTest() {
  console.log('[TEST] Starting multi-db factory test...');

  const sqlite = createDatabaseAdapter('sqlite');
  assert.strictEqual(sqlite.backendType, 'sqlite');

  const postgres = createDatabaseAdapter('postgres');
  assert.strictEqual(postgres.backendType, 'postgres');

  const mongo = createDatabaseAdapter('mongodb');
  assert.strictEqual(mongo.backendType, 'mongodb');

  const supabase = createDatabaseAdapter('supabase');
  assert.strictEqual(supabase.backendType, 'supabase');

  const inMem = createDatabaseAdapter('local');
  assert.strictEqual(inMem.backendType, 'local');

  console.log('[TEST OK] DatabaseAdapter factory instantiated all 5 backends successfully!');
}

runTest().catch((err) => {
  console.error('[TEST FAILED]', err);
  process.exit(1);
});
