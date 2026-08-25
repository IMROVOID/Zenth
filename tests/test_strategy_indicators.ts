import assert from 'node:assert';
import { calculateSMA, calculateRSI } from '../src/core/strategy/indicators.js';
import { StrategyEngine } from '../src/core/strategy/strategyEngine.js';
import { Candle } from '../src/core/types.js';

console.log('[TEST] Running Strategy & Indicators test suite...');

// 1. SMA calculation tests
function testSMA() {
  const data = [10, 20, 30, 40, 50, 60];
  const sma3 = calculateSMA(data, 3);
  assert.strictEqual(sma3.length, 6);
  assert.ok(Number.isNaN(sma3[0]));
  assert.ok(Number.isNaN(sma3[1]));
  assert.strictEqual(sma3[2], 20); // (10+20+30)/3 = 20
  assert.strictEqual(sma3[3], 30); // (20+30+40)/3 = 30
  assert.strictEqual(sma3[4], 40); // (30+40+50)/3 = 40
  assert.strictEqual(sma3[5], 50); // (40+50+60)/3 = 50

  // Edge cases
  assert.ok(calculateSMA([], 5).every(v => Number.isNaN(v)));
  assert.ok(calculateSMA([10, 20], 5).every(v => Number.isNaN(v)));
  assert.ok(calculateSMA([10, 20], 0).every(v => Number.isNaN(v)));
  console.log('  [PASS] calculateSMA correctly computes moving averages and handles boundaries.');
}

// 2. RSI calculation tests
function testRSI() {
  const upward = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
  const rsiUp = calculateRSI(upward, 14);
  assert.strictEqual(rsiUp.length, 16);
  assert.strictEqual(rsiUp[14], 100);
  assert.strictEqual(rsiUp[15], 100);

  const flat = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
  const rsiFlat = calculateRSI(flat, 14);
  assert.strictEqual(rsiFlat[14], 50);

  const downward = [25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10];
  const rsiDown = calculateRSI(downward, 14);
  assert.ok(rsiDown[14] < 5);

  console.log('  [PASS] calculateRSI correctly detects upward, downward, and flat momentum.');
}

// 3. Helper to generate synthetic candle array
function makeCandle(close: number, volume = 100, timestamp = 1000): Candle {
  return {
    timestamp,
    open: close,
    high: close * 1.01,
    low: close * 0.99,
    close,
    volume,
    quoteVolume: close * volume
  };
}

// 4. StrategyEngine evaluations
function testStrategyEngine() {
  const engine = new StrategyEngine(3, 5, 4, 4, 101, 1.0);

  // Insufficient candles test
  assert.throws(() => engine.evaluate([makeCandle(100)]), /Insufficient candles/);

  // Build baseline candles where Fast <= Slow (flat at 100)
  const candles: Candle[] = [];
  const basePrices = [100, 100, 100, 100, 100, 100, 100, 100];
  basePrices.forEach((p, i) => candles.push(makeCandle(p, 100, 1000 + i * 60000)));

  // HOLD signal test
  const holdResult = engine.evaluate(candles);
  assert.strictEqual(holdResult.signal, 'HOLD');
  console.log('  [PASS] StrategyEngine returns HOLD in static/flat market conditions.');

  // Single jump at last candle triggers exact crossover:
  const bullishCandles = [...candles];
  bullishCandles.push(makeCandle(150, 300, 2000));

  const buyResult = engine.evaluate(bullishCandles);
  assert.strictEqual(buyResult.signal, 'BUY');
  assert.ok(buyResult.fastMA > buyResult.slowMA);
  console.log('  [PASS] StrategyEngine generates BUY signal on bullish MA crossover with volume.');

  // Bullish Crossover blocked by RSI overbought threshold (e.g. max entry RSI 70 while currRSI is 100)
  const overboughtEngine = new StrategyEngine(3, 5, 4, 4, 70, 0);
  const blockedByRsi = overboughtEngine.evaluate(bullishCandles);
  assert.strictEqual(blockedByRsi.signal, 'HOLD');
  assert.ok(blockedByRsi.reason.includes('RSI is overbought'));
  console.log('  [PASS] StrategyEngine blocks BUY when RSI exceeds max entry threshold.');

  // Bullish Crossover blocked by low volume ratio (requires 5x volume, but got only 3x)
  const highVolReqEngine = new StrategyEngine(3, 5, 4, 4, 101, 5.0);
  const blockedByVol = highVolReqEngine.evaluate(bullishCandles);
  assert.strictEqual(blockedByVol.signal, 'HOLD');
  assert.ok(blockedByVol.reason.includes('volume ratio'));
  console.log('  [PASS] StrategyEngine blocks BUY when volume ratio is below min threshold.');

  // Bearish Crossover (SELL) test:
  const highBaseCandles: Candle[] = [];
  [150, 150, 150, 150, 150, 150, 150, 150].forEach((p, i) => highBaseCandles.push(makeCandle(p, 100, 3000 + i * 60000)));
  highBaseCandles.push(makeCandle(80, 100, 4000));

  const sellResult = engine.evaluate(highBaseCandles);
  assert.strictEqual(sellResult.signal, 'SELL');
  assert.ok(sellResult.fastMA < sellResult.slowMA);
  console.log('  [PASS] StrategyEngine generates SELL signal on bearish MA crossover.');
}

testSMA();
testRSI();
testStrategyEngine();
console.log('[OK] All Strategy & Indicators tests passed successfully!\n');
