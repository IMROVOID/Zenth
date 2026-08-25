import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { TuiState } from '../src/tui/state/tuiState.js';
import { CommandExecutor, CommandExecutorContext } from '../src/tui/input/commandExecutor.js';
import { KeyHandler } from '../src/tui/input/keyHandler.js';
import { TuiRenderer } from '../src/tui/tuiRenderer.js';

async function runTuiCommandFlowTests() {
  console.log('[TEST] Starting TUI command flow e2e simulation...');

  const state = new TuiState();
  state.cycleCount = 10;
  state.currentPrice = 96200.0;
  state.currentFastMA = 96100.0;
  state.currentSlowMA = 96000.0;
  state.currentRSI = 55.4;
  state.sessionWins = 3;
  state.sessionLosses = 1;
  state.sessionRealizedPnL = 125.5;
  state.totalClosedMoney = 4125.5;

  state.ledgerEntries.push({
    id: 'e2e-trade-1',
    timestamp: new Date().toISOString(),
    symbol: 'btc_usdt',
    action: 'BUY',
    price: 95500.0,
    quantity: 0.01,
    notional_value: 955.0,
    entry_value: 955.0,
    exit_value: 0,
    pnl_percentage: 0,
    session_id: state.sessionId,
    reason: 'MA crossover entry',
    mode: 'PAPER',
    outcome: 'PENDING',
    pnl: 0
  });

  state.tickLogs.push({
    timestamp: '01:00:00',
    cycle: 1,
    symbol: 'btc_usdt',
    price: 96200.0,
    fastMA: 96100.0,
    slowMA: 96000.0,
    rsi: 55.4,
    enteredMoney: 955.0,
    closedMoney: 0,
    rulesCount: 0,
    sessionWin: 0,
    sessionLoss: 0,
    pnl: 0,
    message: 'Live market tick'
  });

  let renderCount = 0;
  const dummyContext: CommandExecutorContext = {
    state,
    render: () => {
      renderCount++;
    },
    runTick: async () => {},
    applyDraftConfig: async () => {},
    resetDraftConfig: () => {},
    executeScan: async () => {},
    executeReplay: async () => {},
    executeReset: async () => {},
    quit: () => {}
  };

  // Test 1: Execute 'copy' command
  const tickCountBeforeCopy = state.tickLogs.length;
  await CommandExecutor.execute('copy', dummyContext);
  assert(state.tickLogs.length === tickCountBeforeCopy + 1, 'Tick log added for copy action');
  const copyMsg = state.tickLogs[state.tickLogs.length - 1].message;
  assert(copyMsg && copyMsg.includes('COPY'), 'Copy notification message in tick log');
  console.log('✓ /copy command execution verified');

  // Test 2: Execute 'export' command -> opens format selection modal
  await CommandExecutor.execute('export', dummyContext);
  assert(state.exportModalState.active === true, 'exportModalState.active is true');
  assert(state.exportModalState.selectedIndex === 0, 'selectedIndex is 0 (TXT)');
  console.log('✓ /export command triggered format selection modal');

  // Test 3: Navigate modal with keys (Down arrow, Up arrow)
  await KeyHandler.handle('\u001b[B', dummyContext); // Down arrow -> CSV (1)
  assert(state.exportModalState.selectedIndex === 1, 'selectedIndex moved to 1');
  await KeyHandler.handle('\u001b[A', dummyContext); // Up arrow -> TXT (0)
  assert(state.exportModalState.selectedIndex === 0, 'selectedIndex moved to 0');
  console.log('✓ Export modal arrow navigation verified');

  // Test 4: Select PDF directly with key '5'
  await KeyHandler.handle('5', dummyContext);
  assert(state.exportModalState.active === false, 'Modal closed after selection');
  assert(state.exportPromptState.active === true, 'Prompt state activated');
  assert(state.exportPromptState.format === 'pdf', 'Format set to pdf');
  assert(state.exportPromptState.inputPath.includes('exported-logs'), 'Default path pre-filled');
  console.log('✓ Format direct selection [5] -> PDF verified');

  // Test 5: Edit path in locked extension prompt with free cursor navigation
  state.exportPromptState.inputPath = 'exported-logs/test';
  state.exportPromptState.cursorPosition = state.exportPromptState.inputPath.length;

  // Move cursor Left 4 times (to before 'test')
  await KeyHandler.handle('\u001b[D', dummyContext);
  await KeyHandler.handle('\u001b[D', dummyContext);
  await KeyHandler.handle('\u001b[D', dummyContext);
  await KeyHandler.handle('\u001b[D', dummyContext);
  assert(state.exportPromptState.cursorPosition === 'exported-logs/'.length, 'Cursor moved left before test');

  // Insert 'e2e_' at cursor -> 'exported-logs/e2e_test'
  await KeyHandler.handle('e', dummyContext);
  await KeyHandler.handle('2', dummyContext);
  await KeyHandler.handle('e', dummyContext);
  await KeyHandler.handle('_', dummyContext);
  assert(state.exportPromptState.inputPath === 'exported-logs/e2e_test', 'Mid-string insertion verified');

  // Home key -> moves cursor to 0
  await KeyHandler.handle('\u001b[H', dummyContext);
  assert(state.exportPromptState.cursorPosition === 0, 'Home key moved cursor to 0');

  // End key -> moves cursor to end of inputPath
  await KeyHandler.handle('\u001b[F', dummyContext);
  assert(state.exportPromptState.cursorPosition === state.exportPromptState.inputPath.length, 'End key moved cursor to end');

  // Append '_pdf' -> 'exported-logs/e2e_test_pdf'
  await KeyHandler.handle('_', dummyContext);
  await KeyHandler.handle('p', dummyContext);
  await KeyHandler.handle('d', dummyContext);
  await KeyHandler.handle('f', dummyContext);
  assert(state.exportPromptState.inputPath === 'exported-logs/e2e_test_pdf', 'End typing verified');

  // Backspace 4 times -> 'exported-logs/e2e_test'
  await KeyHandler.handle('\x7f', dummyContext);
  await KeyHandler.handle('\x7f', dummyContext);
  await KeyHandler.handle('\x7f', dummyContext);
  await KeyHandler.handle('\x7f', dummyContext);
  assert(state.exportPromptState.inputPath === 'exported-logs/e2e_test', 'Backspace verified');
  console.log('✓ Locked extension CommandBar free cursor navigation & editing verified');

  // Test 6: Press Enter to export file to disk
  await KeyHandler.handle('\r', dummyContext);
  assert(state.exportPromptState.active === false, 'Prompt closed after export');

  const expectedPdfFile = path.resolve(process.cwd(), 'exported-logs', 'e2e_test.pdf');
  assert(fs.existsSync(expectedPdfFile), `Exported PDF exists: ${expectedPdfFile}`);
  const pdfStat = fs.statSync(expectedPdfFile);
  assert(pdfStat.size > 200, `PDF size is valid (${pdfStat.size} bytes)`);

  const lastLog = state.tickLogs[state.tickLogs.length - 1];
  assert(lastLog.message && lastLog.message.includes('EXPORT'), 'Export success message in tick logs');
  console.log(`✓ Exported PDF verified on disk: ${expectedPdfFile} (${pdfStat.size} bytes)`);

  // Cleanup test file
  fs.unlinkSync(expectedPdfFile);
  console.log('✓ Cleaned up e2e test artifact');

  console.log('\n[SUCCESS] TUI Command Flow E2E Simulation passed perfectly!\n');
}

runTuiCommandFlowTests().catch((err) => {
  console.error('[ERROR] E2E Simulation failed:', err);
  process.exit(1);
});
