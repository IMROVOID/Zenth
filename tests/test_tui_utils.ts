import assert from 'node:assert';
import {
  stripAnsi,
  visibleWidth,
  padRight,
  padLeft,
  padCenter,
  truncateVisible,
  truncateAnsi
} from '../src/tui/utils/ansi.js';
import { Box } from '../src/tui/utils/box.js';
import { renderBrailleSparkline } from '../src/tui/utils/sparkline.js';
import { cycleConfigValue, setConfigOptionDirect } from '../src/tui/state/configCycle.js';
import { BotRuntimeConfig } from '../src/core/types.js';

console.log('[TEST] Running TUI Utils, Box & Config Cycle test suite...');

function runTuiUtilTests() {
  // 1. ANSI String Manipulation
  const coloredStr = '\x1b[32m\x1b[1mHELLO WORLD\x1b[0m';
  assert.strictEqual(stripAnsi(coloredStr), 'HELLO WORLD');
  assert.strictEqual(visibleWidth(coloredStr), 11);

  // Padding
  const paddedR = padRight(coloredStr, 15);
  assert.strictEqual(visibleWidth(paddedR), 15);

  const paddedL = padLeft(coloredStr, 15);
  assert.strictEqual(visibleWidth(paddedL), 15);

  const paddedC = padCenter(coloredStr, 15);
  assert.strictEqual(visibleWidth(paddedC), 15);

  // Truncation
  const truncatedRaw = truncateVisible('A very long string that should be cut short', 15);
  assert.strictEqual(visibleWidth(truncatedRaw), 15);
  assert.ok(truncatedRaw.endsWith('...'));

  const truncatedColored = truncateAnsi(coloredStr, 5);
  assert.strictEqual(visibleWidth(truncatedColored), 5);
  assert.strictEqual(stripAnsi(truncatedColored), 'HELLO');
  console.log('  [PASS] ANSI parsing, visible width calculations, padding, and truncation verified.');

  // 2. Box Drawing Mathematical Width Invariance
  const width = 60;
  const border = '\x1b[36m';
  const header = Box.header('SYSTEM STATUS', width, border, '\x1b[37m');
  const row = Box.row('Active Symbol: BTC_USDT | PnL: +$45.20', width, border);
  const divider = Box.divider(width, border, 'SECTION');
  const footer = Box.footer('Press [Q] to quit', width, border);

  assert.strictEqual(visibleWidth(header), width, `Header visible width (${visibleWidth(header)}) !== ${width}`);
  assert.strictEqual(visibleWidth(row), width, `Row visible width (${visibleWidth(row)}) !== ${width}`);
  assert.strictEqual(visibleWidth(divider), width, `Divider visible width (${visibleWidth(divider)}) !== ${width}`);
  assert.strictEqual(visibleWidth(footer), width, `Footer visible width (${visibleWidth(footer)}) !== ${width}`);
  console.log('  [PASS] Box helper guarantees mathematical width consistency across all borders.');

  // 3. Braille Micro-Dot Sparkline
  const sparkSeries = [100, 102, 105, 108, 104, 101, 107, 112, 115];
  const braille = renderBrailleSparkline(sparkSeries, 8);
  assert.strictEqual(braille.length, 8);
  for (let i = 0; i < braille.length; i++) {
    const code = braille.charCodeAt(i);
    assert.ok(code >= 0x2800 && code <= 0x28ff, `Braille character at ${i} is in Unicode Braille range`);
  }

  // Edge cases
  assert.strictEqual(renderBrailleSparkline([], 6), '      ');
  console.log('  [PASS] renderBrailleSparkline produces valid 2x4 Braille matrix line charts.');

  // 4. Config Cycling & Direct Setting
  const mockConfig: BotRuntimeConfig = {
    symbol: 'btc_usdt',
    interval: '5m',
    targetAllocation: 1000,
    fastPeriod: 9,
    slowPeriod: 21,
    rsiPeriod: 14,
    rsiMaxEntry: 75,
    volumePeriod: 20,
    minVolumeRatio: 1.0,
    stopLossPct: 1.5,
    takeProfitPct: 3.0,
    maxDailyLoss: 50.0,
    maxConsecutiveLosses: 3,
    pollSeconds: 15,
    candleLookback: 300,
    filterMode: 'STRICT',
    autoLearn: true,
    exitOnReverseCross: true,
    breakevenTriggerPct: 1.0,
    trailingStopPct: 0.8,
    exchange: 'xt'
  };

  // Cycle interval forward
  cycleConfigValue(mockConfig, 'interval', 1);
  assert.strictEqual(mockConfig.interval, '15m');

  // Cycle allocation forward
  cycleConfigValue(mockConfig, 'cap', 1);
  assert.strictEqual(mockConfig.targetAllocation, 2000);

  // Direct option setting
  setConfigOptionDirect(mockConfig, 'symbol', 'eth_usdt');
  assert.strictEqual(mockConfig.symbol, 'eth_usdt');

  setConfigOptionDirect(mockConfig, 'filter_mode', 'Dry-Run');
  assert.strictEqual(mockConfig.filterMode, 'DRY_RUN');

  setConfigOptionDirect(mockConfig, 'sl', '2.5%');
  assert.strictEqual(mockConfig.stopLossPct, 2.5);
  console.log('  [PASS] cycleConfigValue and setConfigOptionDirect accurately modify runtime parameters.');
}

runTuiUtilTests();
console.log('[OK] All TUI Utils & Config tests passed successfully!\n');
