import assert from 'assert';
import { SupabaseValidator, normalizeSupabaseUrl } from '../src/core/config/supabaseValidator.js';
import { SUPABASE_SCHEMA_SQL } from '../src/core/config/schemaSql.js';

console.log('[TEST] Running SupabaseValidator & URL Normalization test suite...');

async function runTests() {
  // Test 1: URL Normalization
  assert.strictEqual(normalizeSupabaseUrl('raldiotdrucziygthaly.supabase.co'), 'https://raldiotdrucziygthaly.supabase.co');
  assert.strictEqual(normalizeSupabaseUrl('https://raldiotdrucziygthaly.supabase.co/'), 'https://raldiotdrucziygthaly.supabase.co');
  assert.strictEqual(normalizeSupabaseUrl('http://localhost:54321'), 'http://localhost:54321');
  console.log('  [PASS] Test 1: URL auto-normalization with https:// and trailing slash stripping passed.');

  // Test 2: Invalid URL formatting
  const res1 = await SupabaseValidator.validate('not-a-valid-url', 'sbp_12345678901234567890');
  assert.strictEqual(res1.status, 'NETWORK_ERROR');
  console.log('  [PASS] Test 2: Invalid host domain fails with diagnostic network status.');

  // Test 3: Short / invalid Key formatting
  const res2 = await SupabaseValidator.validate('https://xyz.supabase.co', 'short');
  assert.strictEqual(res2.status, 'AUTH_ERROR');
  assert.ok(res2.message.includes('API Key'));
  console.log('  [PASS] Test 3: Short API Key properly rejected with AUTH_ERROR.');

  // Test 4: SQL Schema content verification
  assert.ok(SUPABASE_SCHEMA_SQL.includes('CREATE TABLE IF NOT EXISTS public.trade_ledger'));
  assert.ok(SUPABASE_SCHEMA_SQL.includes('CREATE TABLE IF NOT EXISTS public.adaptive_learnings'));
  assert.ok(SUPABASE_SCHEMA_SQL.includes('CREATE TABLE IF NOT EXISTS public.session_metrics'));
  assert.ok(SUPABASE_SCHEMA_SQL.includes('ROW LEVEL SECURITY'));
  console.log('  [PASS] Test 4: SUPABASE_SCHEMA_SQL verified containing all 3 tables and RLS.');

  // Test 5: Unreachable host / network failure
  const res4 = await SupabaseValidator.validate('https://unreachable-domain-12345xyz.supabase.co', 'valid-length-key-1234567890123456');
  assert.strictEqual(res4.status, 'NETWORK_ERROR');
  assert.ok(res4.suggestions.length > 0);
  console.log('  [PASS] Test 5: Unreachable host emits NETWORK_ERROR with suggestions.');

  console.log('[OK] All SupabaseValidator tests passed successfully!\n');
}

runTests().catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
