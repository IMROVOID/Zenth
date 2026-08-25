import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { SQLiteAdapter } from '../src/core/memory/adapters/sqliteAdapter.js';

async function runTest() {
  console.log('[TEST] Starting SQLiteAdapter test...');
  const testDbPath = path.resolve(process.cwd(), 'data', 'test_zenth.db');
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }

  const adapter = new SQLiteAdapter(testDbPath);
  await adapter.init();
  assert.strictEqual(adapter.isAvailable(), true, 'Adapter should be available after init');

  // 1. Test Trade Logging
  await adapter.logTrade({
    id: 'test_trade_1',
    timestamp: new Date().toISOString(),
    symbol: 'BTC_USDT',
    action: 'BUY',
    price: 65000,
    quantity: 0.01,
    reason: 'Golden cross',
    mode: 'PAPER',
    outcome: 'PENDING',
    pnl: 0
  });

  const ledger = await adapter.getLedger('BTC_USDT', 10);
  assert.strictEqual(ledger.length, 1, 'Should return 1 trade record');
  assert.strictEqual(ledger[0].symbol, 'BTC_USDT');
  assert.strictEqual(ledger[0].price, 65000);

  // 2. Test Session Metrics Upsert
  await adapter.updateSessionMetrics({
    id: 'test_sess_1',
    session_id: 'test_sess_1',
    symbol: 'BTC_USDT',
    started_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString(),
    total_entries: 1,
    total_wins: 1,
    total_losses: 0,
    win_rate: 100.0,
    entered_capital: 650.0,
    closed_capital: 660.0,
    realized_pnl: 10.0,
    realized_pnl_percentage: 1.538,
    peak_unrealized_pnl: 12.0,
    peak_unrealized_pct: 1.846
  });

  // 3. Test Adaptive Learnings
  await adapter.recordLearning({
    id: 'rule_1',
    created_at: new Date().toISOString(),
    symbol: 'BTC_USDT',
    pattern_condition: 'LOW_VOL_WHIPSAW',
    loss_reason: 'Volume below 20-SMA at breakout',
    trading_rule: 'Require Volume Ratio > 1.0x on entry',
    status: 'ACTIVE',
    trigger_count: 0
  });

  // Wildcard 'all' learning
  await adapter.recordLearning({
    id: 'rule_all',
    created_at: new Date().toISOString(),
    symbol: 'all',
    pattern_condition: 'GLOBAL_MARKET_DUMP',
    loss_reason: 'Total market liquidation cascade',
    trading_rule: 'Halt all buy entries when total market drops > 5%',
    status: 'ACTIVE',
    trigger_count: 0
  });

  const learnings = await adapter.getActiveLearnings('BTC_USDT');
  assert.strictEqual(learnings.length, 2, 'Should find 2 active learnings (pair-specific + wildcard all)');

  // 4. Test Trigger Increment
  await adapter.incrementTrigger('rule_1');
  const updatedLearnings = await adapter.getActiveLearnings('BTC_USDT');
  const targetRule = updatedLearnings.find(r => r.id === 'rule_1');
  assert.strictEqual(targetRule?.trigger_count, 1, 'Trigger count should be 1');

  // 5. Test Scoped Reset
  const scopedReset = await adapter.reset('BTC_USDT');
  assert.strictEqual(scopedReset.deletedLedger, 1, 'Should report 1 deleted trade in scoped reset');
  assert.strictEqual(scopedReset.deletedLearnings, 1, 'Should report 1 deleted learning in scoped reset');

  // 6. Test Reset All
  const resetRes = await adapter.resetAll();
  assert.strictEqual(resetRes.success, true);
  const ledgerAfterReset = await adapter.getLedger();
  assert.strictEqual(ledgerAfterReset.length, 0, 'Ledger should be empty after resetAll');

  await adapter.close();
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }

  console.log('[TEST OK] SQLiteAdapter passed all checks!');
}

runTest().catch((err) => {
  console.error('[TEST FAILED]', err);
  process.exit(1);
});
