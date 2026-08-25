import assert from 'assert';
import { MemoryService } from '../src/core/memory/memoryService.js';

console.log('[TEST] Running Database Reset test suite...');

async function runTests() {
  const memory = new MemoryService();

  // 1. Seed some trade ledger entries and learnings in local store
  await memory.logTrade({
    timestamp: new Date().toISOString(),
    symbol: 'btc_usdt',
    action: 'BUY',
    price: 65000,
    quantity: 0.01,
    reason: 'Test entry',
    mode: 'PAPER',
    outcome: 'WIN',
    pnl: 15.0
  });

  await memory.recordLearning({
    symbol: 'btc_usdt',
    pattern_condition: 'LOW_VOL_WHIPSAW',
    loss_reason: 'Volume too low during breakout',
    trading_rule: 'Require min volume ratio > 1.2',
    status: 'ACTIVE',
    trigger_count: 1
  });

  const ledgerBefore = await memory.getLedger('btc_usdt');
  const learningsBefore = await memory.getActiveLearnings('btc_usdt');
  assert.ok(ledgerBefore.length > 0);
  assert.ok(learningsBefore.length > 0);
  console.log('  [PASS] Test 1: Data successfully logged to memory service.');

  // 2. Perform Database Reset
  const resetRes = await memory.resetAllDatabase();
  assert.strictEqual(resetRes.success, true);
  console.log(`  [PASS] Test 2: resetAllDatabase returned success: ${resetRes.message}`);

  // 3. Verify clean state
  const ledgerAfter = await memory.getLedger('btc_usdt');
  const learningsAfter = await memory.getActiveLearnings('btc_usdt');
  assert.strictEqual(ledgerAfter.length, 0);
  assert.strictEqual(learningsAfter.length, 0);
  console.log('  [PASS] Test 3: Verified all tables/stores are empty after reset.');

  console.log('[OK] All Database Reset tests passed successfully!\n');
}

runTests().catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
