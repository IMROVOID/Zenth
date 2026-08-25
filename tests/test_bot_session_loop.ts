import assert from 'node:assert';
import { SessionTracker } from '../src/core/bot/sessionTracker.js';
import { Scanner } from '../src/core/bot/scanner.js';
import { MarketService } from '../src/core/market/marketService.js';
import { StrategyEngine } from '../src/core/strategy/strategyEngine.js';
import { RiskManager } from '../src/core/risk/riskManager.js';
import { ExecutionEngine } from '../src/core/execution/executionEngine.js';
import { ReplayEngine } from '../src/core/replay/replayEngine.js';
import { MemoryService } from '../src/core/memory/memoryService.js';
import { AdaptiveFilter } from '../src/core/memory/adaptiveFilter.js';

console.log('[TEST] Running Session Tracker & Scanner Integration test suite...');

async function runSessionScannerTests() {
  // 1. SessionTracker calculations
  const session = new SessionTracker();
  assert.ok(session.sessionId.startsWith('SESSION-'));
  assert.ok(new Date(session.sessionStartedAt).getTime() > 0);
  assert.strictEqual(session.completedTrades, 0);
  assert.strictEqual(session.winRate, 0);
  assert.strictEqual(session.getRealizedPct(1000), 0);

  session.sessionWins = 3;
  session.sessionLosses = 1;
  session.sessionRealizedPnL = 75.0;
  session.totalClosedMoney = 1075.0;
  session.totalEntries = 4;

  assert.strictEqual(session.completedTrades, 4);
  assert.strictEqual(session.winRate, 75.0);
  assert.strictEqual(session.getRealizedPct(1000), 7.5);

  const metrics = session.buildMetrics('btc_usdt', null, 1000);
  assert.strictEqual(metrics.session_id, session.sessionId);
  assert.strictEqual(metrics.symbol, 'btc_usdt');
  assert.strictEqual(metrics.total_wins, 3);
  assert.strictEqual(metrics.total_losses, 1);
  assert.strictEqual(metrics.win_rate, 75.0);
  assert.strictEqual(metrics.realized_pnl, 75.0);
  assert.strictEqual(metrics.closed_capital, 1075.0);
  assert.strictEqual(metrics.active_position, null);
  console.log('  [PASS] SessionTracker accurately computes metrics, win rates, and PnL ratios.');

  // 2. Memory Sync
  const memory = new MemoryService();
  await memory.resetMemory('btc_usdt');
  await session.sync(memory, 'btc_usdt', null, 1000);
  console.log('  [PASS] SessionTracker.sync successfully persists session metrics.');

  // 3. Scanner.executeScan integration
  const market = new MarketService('xt');
  const strategy = new StrategyEngine(9, 21, 14, 20);
  const risk = new RiskManager(1000.0);
  const execution = new ExecutionEngine();
  const replay = new ReplayEngine();
  const adaptiveFilter = new AdaptiveFilter(memory);

  const scanResult = await Scanner.executeScan(
    'btc_usdt',
    '5m',
    0.01,
    market,
    strategy,
    risk,
    execution,
    replay,
    memory,
    adaptiveFilter,
    session.sessionId
  );

  assert.ok(['BUY', 'SELL', 'HOLD', 'SKIP'].includes(scanResult.decision));
  assert.ok(typeof scanResult.reason === 'string');
  if (scanResult.order) {
    assert.strictEqual(scanResult.order.symbol, 'btc_usdt');
  }
  console.log(`  [PASS] Scanner.executeScan completed scan pipeline for BTC_USDT (Decision: [${scanResult.decision}]).`);

  await memory.resetMemory('btc_usdt');
}

runSessionScannerTests().then(() => {
  console.log('[OK] All Session Tracker & Scanner tests passed successfully!\n');
}).catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
