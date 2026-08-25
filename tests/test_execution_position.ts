import assert from 'node:assert';
import { ExecutionEngine } from '../src/core/execution/executionEngine.js';
import { PositionManager } from '../src/core/bot/positionManager.js';
import { ActivePosition } from '../src/core/bot/types.js';
import { StrategyResult } from '../src/core/types.js';
import { MemoryService } from '../src/core/memory/memoryService.js';
import { SessionTracker } from '../src/core/bot/sessionTracker.js';

console.log('[TEST] Running Execution & Position Manager test suite...');

async function runExecutionTests() {
  // 1. Paper Order Execution
  const execution = new ExecutionEngine();
  const order = execution.executePaperOrder('btc_usdt', 'BUY', 65000, 0.01, 'Bullish MA breakout');
  assert.ok(order.id.startsWith('PAPER-'));
  assert.strictEqual(order.symbol, 'btc_usdt');
  assert.strictEqual(order.action, 'BUY');
  assert.strictEqual(order.price, 65000);
  assert.strictEqual(order.quantity, 0.01);
  assert.strictEqual(order.notionalValue, 650);
  assert.strictEqual(order.mode, 'PAPER');
  console.log('  [PASS] ExecutionEngine generates valid simulated paper orders.');

  // Base position fixture
  function createBasePos(): ActivePosition {
    return {
      symbol: 'btc_usdt',
      entryPrice: 60000,
      quantity: 0.01,
      enteredCapital: 600,
      stopLossPrice: 59100, // -1.5%
      takeProfitPrice: 61800, // +3.0%
      enteredAt: new Date().toISOString(),
      patternCondition: 'STANDARD_MA_CROSSOVER'
    };
  }

  const dummyStrategy: StrategyResult = {
    signal: 'HOLD',
    fastMA: 60000,
    slowMA: 60000,
    rsi: 50,
    volumeSMA: 100,
    currentPrice: 60000,
    reason: 'Hold',
    timestamp: Date.now()
  };

  // 2. Take-Profit Evaluation (+3% target = $61,800)
  const posTP = createBasePos();
  const evalTP = PositionManager.evaluatePosition(posTP, 61900, [], dummyStrategy, 1.5, 3.0);
  assert.strictEqual(evalTP.shouldClose, true);
  assert.strictEqual(evalTP.outcome, 'WIN');
  assert.ok(evalTP.exitReason.includes('Take-Profit hit'));
  assert.strictEqual(evalTP.unrealizedPnL, 19); // (61900 - 60000) * 0.01 = 19
  console.log('  [PASS] Take-Profit trigger evaluates correctly as WIN.');

  // 3. Stop-Loss Evaluation (-1.5% stop = $59,100)
  const posSL = createBasePos();
  const evalSL = PositionManager.evaluatePosition(posSL, 59000, [], dummyStrategy, 1.5, 3.0);
  assert.strictEqual(evalSL.shouldClose, true);
  assert.strictEqual(evalSL.outcome, 'LOSS');
  assert.ok(evalSL.exitReason.includes('Stop-Loss hit'));
  assert.strictEqual(evalSL.unrealizedPnL, -10); // (59000 - 60000) * 0.01 = -10
  console.log('  [PASS] Stop-Loss trigger evaluates correctly as LOSS.');

  // 4. Breakeven Stop Adjustment (Trigger at +1.0% gain -> moves SL to entry $60,000)
  const posBE = createBasePos();
  // Price reaches $60,700 (+1.16% > 1.0%)
  const evalBE1 = PositionManager.evaluatePosition(posBE, 60700, [], dummyStrategy, 1.5, 3.0, true, 1.0, 0);
  assert.strictEqual(evalBE1.shouldClose, false);
  assert.strictEqual(posBE.breakevenApplied, true);
  assert.strictEqual(posBE.stopLossPrice, 60000);

  // Price pulls back to $59,950 -> triggers breakeven stop
  const evalBE2 = PositionManager.evaluatePosition(posBE, 59950, [], dummyStrategy, 1.5, 3.0, true, 1.0, 0);
  assert.strictEqual(evalBE2.shouldClose, true);
  assert.ok(evalBE2.exitReason.includes('Breakeven Stop triggered'));
  console.log('  [PASS] Breakeven stop ratchets SL to entry and protects capital.');

  // 5. Trailing Stop Adjustment (1.0% trailing)
  const posTrail = createBasePos();
  // Price pumps to $65,000 -> trailing stop should ratchet to $65,000 * 0.99 = $64,350
  PositionManager.evaluatePosition(posTrail, 65000, [], dummyStrategy, 1.5, 3.0, true, 0, 1.0);
  assert.strictEqual(posTrail.highestPrice, 65000);
  assert.strictEqual(posTrail.stopLossPrice, 64350);

  // Price dips to $64,300 -> triggers trailing stop
  const evalTrail = PositionManager.evaluatePosition(posTrail, 64300, [], dummyStrategy, 1.5, 3.0, true, 0, 1.0);
  assert.strictEqual(evalTrail.shouldClose, true);
  assert.strictEqual(evalTrail.outcome, 'BREAKEVEN');
  assert.strictEqual(evalTrail.unrealizedPnL, 43);
  console.log('  [PASS] Trailing stop dynamically follows highs and locks in positive gains.');

  // 6. Reverse Bearish MA Crossover Exit
  const posBear = createBasePos();
  const bearStrategy: StrategyResult = { ...dummyStrategy, signal: 'SELL' };
  const evalBear = PositionManager.evaluatePosition(posBear, 60200, [], bearStrategy, 1.5, 3.0, true);
  assert.strictEqual(evalBear.shouldClose, true);
  assert.ok(evalBear.exitReason.includes('Bearish MA crossover exit'));
  console.log('  [PASS] Reverse MA crossunder triggers clean position exit.');

  // 7. Close Position & Auto-learning Synthesis
  const memory = new MemoryService();
  await memory.resetMemory('btc_usdt');
  const session = new SessionTracker();

  const lossPos = createBasePos();
  lossPos.patternCondition = 'MA_CROSSOVER_LOW_VOLUME';

  await PositionManager.closePosition(
    lossPos,
    59000,
    'Stop-Loss hit (-1.5%) at $59000.00',
    'LOSS',
    -10,
    -1.66,
    590,
    memory,
    session,
    'btc_usdt',
    true
  );

  assert.strictEqual(session.sessionLosses, 1);
  assert.strictEqual(session.consecutiveLosses, 1);
  assert.strictEqual(session.sessionRealizedPnL, -10);

  // Verify learning was recorded in memory
  const learnings = await memory.getActiveLearnings('btc_usdt');
  assert.strictEqual(learnings.length, 1);
  assert.strictEqual(learnings[0].pattern_condition, 'MA_CROSSOVER_LOW_VOLUME');
  assert.ok(learnings[0].trading_rule.includes('Skip BTC_USDT 9/21 MA crossovers on low volume'));
  console.log('  [PASS] Position closing updates session stats and distills adaptive learning.');

  await memory.resetMemory('btc_usdt');
}

runExecutionTests().then(() => {
  console.log('[OK] All Execution & Position Manager tests passed successfully!\n');
}).catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
