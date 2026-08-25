import assert from 'node:assert';
import { RiskManager } from '../src/core/risk/riskManager.js';

console.log('[TEST] Running RiskManager test suite...');

function runRiskTests() {
  const risk = new RiskManager(1000.0, 50.0, 3);

  // 1. HOLD Signal Pass-through
  const holdRes = risk.evaluate('HOLD', 50000, 0.01);
  assert.strictEqual(holdRes.approved, false);
  assert.strictEqual(holdRes.decision, 'HOLD');
  assert.strictEqual(holdRes.notionalValue, 0);
  console.log('  [PASS] HOLD signal returns non-approved HOLD decision.');

  // 2. Hard Allocation Cap Check ($1,000 max)
  const overCapRes = risk.evaluate('BUY', 60000, 0.02); // $1,200 > $1,000
  assert.strictEqual(overCapRes.approved, false);
  assert.strictEqual(overCapRes.decision, 'SKIP');
  assert.ok(overCapRes.reason.includes('exceeds $1000.00 maximum allocation limit'));
  console.log('  [PASS] Orders exceeding $1,000 allocation cap are converted to SKIP.');

  // 3. Valid Order Within Allocation Cap
  const validRes = risk.evaluate('BUY', 50000, 0.015); // $750 <= $1,000
  assert.strictEqual(validRes.approved, true);
  assert.strictEqual(validRes.decision, 'BUY');
  assert.strictEqual(validRes.notionalValue, 750);
  assert.strictEqual(validRes.quantity, 0.015);
  console.log('  [PASS] Valid order within notional cap is approved.');

  // 4. Circuit Breaker: Max Daily Loss Triggered
  const dailyLossBreaker = risk.evaluate('BUY', 50000, 0.01, -55.0, 0);
  assert.strictEqual(dailyLossBreaker.approved, false);
  assert.strictEqual(dailyLossBreaker.decision, 'SKIP');
  assert.ok(dailyLossBreaker.reason.includes('max daily loss limit'));
  console.log('  [PASS] Max daily loss circuit breaker halts trading.');

  // 5. Circuit Breaker: Max Consecutive Losses Triggered
  const consecLossBreaker = risk.evaluate('BUY', 50000, 0.01, 0, 3);
  assert.strictEqual(consecLossBreaker.approved, false);
  assert.strictEqual(consecLossBreaker.decision, 'SKIP');
  assert.ok(consecLossBreaker.reason.includes('Consecutive loss streak (3) reached limit (3)'));
  console.log('  [PASS] Consecutive losses circuit breaker halts trading.');

  // 6. Invalid Price or Quantity
  const zeroPrice = risk.evaluate('BUY', 0, 0.01);
  assert.strictEqual(zeroPrice.approved, false);
  assert.strictEqual(zeroPrice.decision, 'SKIP');
  assert.ok(zeroPrice.reason.includes('Invalid price'));

  const negativeQty = risk.evaluate('BUY', 50000, -1);
  assert.strictEqual(negativeQty.approved, false);
  assert.strictEqual(negativeQty.decision, 'SKIP');
  assert.ok(negativeQty.reason.includes('quantity'));
  console.log('  [PASS] Non-positive price or quantity rejected by risk engine.');

  // 7. Default Constructor Fallbacks
  const defaultRisk = new RiskManager();
  assert.strictEqual(defaultRisk.maxNotionalCap, 1000.0);
  assert.strictEqual(defaultRisk.maxDailyLoss, 0);
  assert.strictEqual(defaultRisk.maxConsecutiveLosses, 0);
  const defaultApprove = defaultRisk.evaluate('SELL', 100, 5, -1000, 10);
  assert.strictEqual(defaultApprove.approved, true);
  assert.strictEqual(defaultApprove.decision, 'SELL');
  console.log('  [PASS] Default RiskManager parameters disable soft limits.');
}

runRiskTests();
console.log('[OK] All RiskManager tests passed successfully!\n');
