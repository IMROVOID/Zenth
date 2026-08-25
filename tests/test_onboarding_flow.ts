import assert from 'node:assert';
import { OnboardingState } from '../src/tui/onboarding/onboardingState.js';
import { OnboardingInput } from '../src/tui/onboarding/onboardingInput.js';
import { OnboardingMouseInput } from '../src/tui/onboarding/onboardingMouseInput.js';

async function runOnboardingFlowTests() {
  console.log('[TEST] Running Onboarding Flow & State Machine test suite...');

  // Test 1: Storage choice transitions
  const state1 = new OnboardingState();
  assert.strictEqual(state1.data.currentStep, 'STORAGE_CHOICE');
  assert.strictEqual(state1.data.storageBackend, 'sqlite');

  // Select local storage with key '5' and press Enter
  await OnboardingInput.handle('5', state1, () => {});
  assert.strictEqual(state1.data.storageBackend, 'local');
  await OnboardingInput.handle('\r', state1, () => {});
  assert.strictEqual(state1.data.currentStep, 'TRADING_PARAMS', 'Local storage transitions directly to TRADING_PARAMS');

  // Back button returns to STORAGE_CHOICE
  await OnboardingInput.handle('\u001b', state1, () => {});
  assert.strictEqual(state1.data.currentStep, 'STORAGE_CHOICE');

  // Select Supabase with key '4' and press Enter
  await OnboardingInput.handle('4', state1, () => {});
  assert.strictEqual(state1.data.storageBackend, 'supabase');
  await OnboardingInput.handle('\r', state1, () => {});
  assert.strictEqual(state1.data.currentStep, 'SUPABASE_SETUP_CHOICE');

  // Back button returns to STORAGE_CHOICE
  await OnboardingInput.handle('\u001b', state1, () => {});
  assert.strictEqual(state1.data.currentStep, 'STORAGE_CHOICE');

  // Select SQLite with key '1' and press Enter
  await OnboardingInput.handle('1', state1, () => {});
  assert.strictEqual(state1.data.storageBackend, 'sqlite');
  await OnboardingInput.handle('\r', state1, () => {});
  assert.strictEqual(state1.data.currentStep, 'SQLITE_SETUP');
  console.log('  [PASS] Test 1: Storage backend state transitions verified.');

  // Test 2: Parameter Picker modal selection (Interval)
  const state2 = new OnboardingState();
  state2.goToStep('TRADING_PARAMS');
  state2.data.activeTradingParamIndex = 2; // interval

  await OnboardingInput.handle('\r', state2, () => {});
  assert.strictEqual(state2.data.currentStep, 'PARAM_PICKER');
  assert.strictEqual(state2.data.activeParamPickerKey, 'interval');

  // Initial interval is '5m' (index 1). Navigate down once to '15m' (index 2) and select
  await OnboardingInput.handle('\u001b[B', state2, () => {}); // index 2 ('15m')
  await OnboardingInput.handle('\r', state2, () => {});
  assert.strictEqual(state2.data.currentStep, 'TRADING_PARAMS');
  assert.strictEqual(state2.data.tradingParams.interval, '15m');
  console.log('  [PASS] Test 2: Parameter picker modal selection and mutation verified.');

  // Test 2B: Exchange Picker modal selection
  const stateExchange = new OnboardingState();
  stateExchange.goToStep('TRADING_PARAMS');
  stateExchange.data.activeTradingParamIndex = 0; // exchange

  await OnboardingInput.handle('\r', stateExchange, () => {});
  assert.strictEqual(stateExchange.data.currentStep, 'PARAM_PICKER');
  assert.strictEqual(stateExchange.data.activeParamPickerKey, 'exchange');

  // Navigate down to 'okx' (index 2) and select
  await OnboardingInput.handle('\u001b[B', stateExchange, () => {});
  await OnboardingInput.handle('\u001b[B', stateExchange, () => {});
  await OnboardingInput.handle('\r', stateExchange, () => {});
  assert.strictEqual(stateExchange.data.currentStep, 'TRADING_PARAMS');
  assert.strictEqual(stateExchange.data.tradingParams.exchange, 'okx');
  assert.strictEqual(stateExchange.marketService.getExchange(), 'okx');
  console.log('  [PASS] Test 2B: Exchange picker modal selection verified.');

  // Test 3: Symbol search and category filter cycling
  const state3 = new OnboardingState();
  state3.goToStep('TRADING_PARAMS');
  state3.data.activeTradingParamIndex = 1; // symbol
  state3.data.availableSymbols = [
    { symbol: 'btc_usdt', ticker: 'BTC', name: 'Bitcoin', price: 95000, change24hPct: 2.5, type: 'crypto', sparkline: [] },
    { symbol: 'eth_usdt', ticker: 'ETH', name: 'Ethereum', price: 2800, change24hPct: -1.2, type: 'crypto', sparkline: [] },
    { symbol: 'aapl_usdt', ticker: 'AAPL', name: 'Apple Inc', price: 230, change24hPct: 0.8, type: 'stock', sparkline: [] }
  ];

  await OnboardingInput.handle('\r', state3, () => {});
  assert.strictEqual(state3.data.currentStep, 'SYMBOL_PICKER');

  // Cycle category filters with TAB
  assert.strictEqual(state3.data.symbolCategoryFilter, 'ALL');
  await OnboardingInput.handle('\t', state3, () => {});
  assert.strictEqual(state3.data.symbolCategoryFilter, 'CRYPTO');
  await OnboardingInput.handle('\t', state3, () => {});
  assert.strictEqual(state3.data.symbolCategoryFilter, 'STOCK');
  await OnboardingInput.handle('\t', state3, () => {});
  assert.strictEqual(state3.data.symbolCategoryFilter, 'ALL');

  // Type search query 'eth'
  await OnboardingInput.handle('e', state3, () => {});
  await OnboardingInput.handle('t', state3, () => {});
  await OnboardingInput.handle('h', state3, () => {});
  assert.strictEqual(state3.data.symbolSearchQuery, 'eth');

  // Select result with Enter
  await OnboardingInput.handle('\r', state3, () => {});
  assert.strictEqual(state3.data.currentStep, 'TRADING_PARAMS');
  assert.strictEqual(state3.data.tradingParams.symbol, 'eth_usdt');
  console.log('  [PASS] Test 3: Symbol search and category cycling verified.');

  // Test 4: Mouse wheel clamping
  const state4 = new OnboardingState();
  state4.goToStep('PARAM_PICKER');
  state4.data.activeParamPickerKey = 'interval';
  state4.data.paramPickerSelectedIndex = 0;

  // Scroll down 20 times — should clamp to last option without overflow
  for (let i = 0; i < 20; i++) {
    OnboardingMouseInput.handle({ type: 'press', button: 65, row: 10, col: 10 }, state4, () => {});
  }
  assert.strictEqual(state4.data.paramPickerSelectedIndex, 6, 'Clamped to max index 6');
  console.log('  [PASS] Test 4: Mouse wheel bounds clamping verified.');

  console.log('[OK] All Onboarding Flow unit tests passed successfully!\n');
}

runOnboardingFlowTests().catch((err) => {
  console.error('[FAIL] Onboarding Flow test failed:', err);
  process.exit(1);
});
