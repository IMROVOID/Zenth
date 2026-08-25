import assert from 'node:assert';
import { classifyPattern } from '../src/core/replay/patternClassifier.js';
import { calculateSummary } from '../src/core/replay/metrics.js';
import { ReplayEngine } from '../src/core/replay/replayEngine.js';
import { ReplayTrade, AdaptiveLearning } from '../src/core/types.js';
import { generateSyntheticCandles } from '../src/core/market/synthetic.js';

console.log('[TEST] Running Replay Engine & Pattern Classifier test suite...');

function runReplayTests() {
  // 1. Pattern Classification
  const lowVol = classifyPattern({ fastMA: 100, slowMA: 90, rsi: 55, volume: 50, volumeSMA: 100 });
  assert.strictEqual(lowVol, 'MA_CROSSOVER_LOW_VOLUME');

  const highRsi = classifyPattern({ fastMA: 100, slowMA: 90, rsi: 72, volume: 100, volumeSMA: 100 });
  assert.strictEqual(highRsi, 'MA_CROSSOVER_HIGH_RSI');

  const highVol = classifyPattern({ fastMA: 100, slowMA: 90, rsi: 55, volume: 250, volumeSMA: 100 });
  assert.strictEqual(highVol, 'MA_CROSSOVER_HIGH_VOLUME_BREAKOUT');

  const standard = classifyPattern({ fastMA: 100, slowMA: 90, rsi: 55, volume: 110, volumeSMA: 100 });
  assert.strictEqual(standard, 'STANDARD_MA_CROSSOVER');
  console.log('  [PASS] classifyPattern categorizes low-volume, high-RSI, breakout, and standard patterns.');

  // 2. Metrics & Summary Calculation
  const mockTrades: ReplayTrade[] = [
    {
      entryTime: 1000,
      exitTime: 2000,
      entryPrice: 100,
      exitPrice: 105,
      quantity: 5,
      pnl: 25,
      pnlPct: 5.0,
      outcome: 'WIN',
      exitReason: 'Take profit',
      patternCondition: 'STANDARD_MA_CROSSOVER'
    },
    {
      entryTime: 3000,
      exitTime: 4000,
      entryPrice: 105,
      exitPrice: 103,
      quantity: 5,
      pnl: -10,
      pnlPct: -1.9,
      outcome: 'LOSS',
      exitReason: 'Stop loss',
      patternCondition: 'MA_CROSSOVER_LOW_VOLUME'
    },
    {
      entryTime: 5000,
      exitTime: 6000,
      entryPrice: 103,
      exitPrice: 107,
      quantity: 5,
      pnl: 20,
      pnlPct: 3.88,
      outcome: 'WIN',
      exitReason: 'Take profit',
      patternCondition: 'MA_CROSSOVER_HIGH_VOLUME_BREAKOUT'
    }
  ];

  const summary = calculateSummary('btc_usdt', '5m', 100, mockTrades);
  assert.strictEqual(summary.symbol, 'btc_usdt');
  assert.strictEqual(summary.totalSetups, 3);
  assert.strictEqual(summary.wins, 2);
  assert.strictEqual(summary.losses, 1);
  assert.strictEqual(Math.round(summary.winRate), 67);
  assert.strictEqual(summary.totalPnL, 35); // 25 - 10 + 20 = 35
  assert.strictEqual(summary.bestTrade, 25);
  assert.strictEqual(summary.worstTrade, -10);
  assert.strictEqual(summary.profitFactor, 4.5); // 45 / 10 = 4.5
  console.log('  [PASS] calculateSummary accurately computes win rate, profit factor, and PnL metrics.');

  // 3. ReplayEngine: Raw vs Memory Replay
  const engine = new ReplayEngine();
  const candles = generateSyntheticCandles(100, '5m', 150);

  const rawRes = engine.runRawReplay({
    candles,
    symbol: 'btc_usdt',
    timeframe: '5m',
    targetAllocation: 500,
    stopLossPct: 1.5,
    takeProfitPct: 3.0
  });
  assert.ok(Array.isArray(rawRes.trades));
  assert.ok(rawRes.summary !== undefined);
  console.log(`  [PASS] runRawReplay executed successfully (${rawRes.trades.length} setups detected).`);

  // Active learning rule blocking low volume setups
  const activeLearnings: AdaptiveLearning[] = [
    {
      id: 'rule-low-vol',
      symbol: 'btc_usdt',
      pattern_condition: 'MA_CROSSOVER_LOW_VOLUME',
      loss_reason: 'Low volume false breakout',
      trading_rule: 'Skip MA crossover on low volume',
      status: 'ACTIVE'
    }
  ];

  const memRes = engine.runMemoryReplay({
    candles,
    symbol: 'btc_usdt',
    timeframe: '5m',
    targetAllocation: 500,
    stopLossPct: 1.5,
    takeProfitPct: 3.0
  }, activeLearnings);

  assert.ok(Array.isArray(memRes.trades));
  assert.ok(Array.isArray(memRes.skippedSetups));
  assert.ok(memRes.summary !== undefined);

  // Formatter verification
  const rawOutput = engine.formatOutput(rawRes.trades, rawRes.summary);
  assert.ok(rawOutput.includes('RAW BASELINE REPLAY'));
  const comparisonOutput = engine.formatComparison(rawRes.summary, memRes.summary, memRes.skippedSetups, activeLearnings);
  assert.ok(comparisonOutput.includes('RAW BASELINE vs. ADAPTIVE MEMORY COMPARISON'));

  console.log('  [PASS] runMemoryReplay and formatters generate structured comparison reports.');
}

runReplayTests();
console.log('[OK] All Replay Engine tests passed successfully!\n');
