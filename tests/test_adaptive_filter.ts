import assert from 'node:assert';
import { AdaptiveFilter } from '../src/core/memory/adaptiveFilter.js';
import { MemoryService } from '../src/core/memory/memoryService.js';

console.log('[TEST] Running AdaptiveFilter test suite...');

async function runFilterTests() {
  const memory = new MemoryService();
  await memory.resetMemory('eth_usdt');

  const filter = new AdaptiveFilter(memory);
  const dummyIndicators = { fastMA: 3100, slowMA: 3050, rsi: 62, volumeRatio: 0.7 };

  // 1. Initial State: No learnings recorded -> trade permitted
  const res1 = await filter.evaluate('eth_usdt', 'MA_CROSSOVER_LOW_VOLUME', dummyIndicators, 'STRICT');
  assert.strictEqual(res1.shouldSkip, false);
  assert.strictEqual(res1.patternCondition, 'MA_CROSSOVER_LOW_VOLUME');
  console.log('  [PASS] Clean state permits trade setup without prior learning records.');

  // 2. Record a learning rule in memory
  await memory.recordLearning({
    symbol: 'eth_usdt',
    pattern_condition: 'MA_CROSSOVER_LOW_VOLUME',
    loss_reason: 'Low volume false breakout',
    trading_rule: 'Avoid ETH MA crossovers when volume < 0.75x',
    status: 'ACTIVE',
    trigger_count: 0
  });

  // 3. STRICT mode evaluation: Known pattern matches -> shouldSkip: true
  const resStrict = await filter.evaluate('eth_usdt', 'MA_CROSSOVER_LOW_VOLUME', dummyIndicators, 'STRICT');
  assert.strictEqual(resStrict.shouldSkip, true);
  assert.ok(resStrict.matchedRule !== undefined);
  assert.strictEqual(resStrict.matchedRule?.pattern_condition, 'MA_CROSSOVER_LOW_VOLUME');
  assert.ok(resStrict.reason?.includes('Skipped known losing pattern'));
  console.log('  [PASS] STRICT mode skips trade matching known failure pattern.');

  // 4. DISABLED mode evaluation: Known pattern matches, but filter is disabled -> shouldSkip: false
  const resDisabled = await filter.evaluate('eth_usdt', 'MA_CROSSOVER_LOW_VOLUME', dummyIndicators, 'DISABLED');
  assert.strictEqual(resDisabled.shouldSkip, false);
  console.log('  [PASS] DISABLED mode allows trade execution despite matching rule.');

  // 5. DRY_RUN mode evaluation: Known pattern matches -> shouldSkip: false, but warns
  const resDryRun = await filter.evaluate('eth_usdt', 'MA_CROSSOVER_LOW_VOLUME', dummyIndicators, 'DRY_RUN');
  assert.strictEqual(resDryRun.shouldSkip, false);
  assert.ok(resDryRun.matchedRule !== undefined);
  assert.ok(resDryRun.reason?.includes('[DRY-RUN]'));
  console.log('  [PASS] DRY_RUN mode flags matching rule without blocking execution.');

  // 6. REPEAT_LOSSES mode:
  // Reset rule with trigger_count = 0
  await memory.resetMemory('eth_usdt');
  await memory.recordLearning({
    symbol: 'eth_usdt',
    pattern_condition: 'RSI_OVERBOUGHT',
    loss_reason: 'RSI > 75 exhaustion',
    trading_rule: 'Avoid buying RSI > 75',
    status: 'ACTIVE',
    trigger_count: 0
  });

  // First recurrence (trigger_count < 1) -> allowed
  const resRepeat1 = await filter.evaluate('eth_usdt', 'RSI_OVERBOUGHT', dummyIndicators, 'REPEAT_LOSSES');
  assert.strictEqual(resRepeat1.shouldSkip, false);
  assert.ok(resRepeat1.reason?.includes('[REPEAT_MODE]'));
  console.log('  [PASS] REPEAT_LOSSES mode permits first recurrence with warning.');

  // After trigger count increments (trigger_count >= 1) -> skipped
  const resRepeat2 = await filter.evaluate('eth_usdt', 'RSI_OVERBOUGHT', dummyIndicators, 'REPEAT_LOSSES');
  assert.strictEqual(resRepeat2.shouldSkip, true);
  console.log('  [PASS] REPEAT_LOSSES mode blocks repeated recurrence once trigger count >= 1.');

  // 7. Non-matching pattern -> shouldSkip: false
  const resUnrelated = await filter.evaluate('eth_usdt', 'HIGH_VOL_BREAKOUT', dummyIndicators, 'STRICT');
  assert.strictEqual(resUnrelated.shouldSkip, false);
  console.log('  [PASS] Non-matching pattern conditions are permitted.');

  // Cleanup
  await memory.resetMemory('eth_usdt');
}

runFilterTests().then(() => {
  console.log('[OK] All AdaptiveFilter tests passed successfully!\n');
}).catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
