import assert from 'node:assert';
import { TuiState } from '../src/tui/state/tuiState.js';
import { KeyHandler } from '../src/tui/input/keyHandler.js';
import { MouseHandler } from '../src/tui/input/mouseHandler.js';
import { MouseMoveHandler } from '../src/tui/input/mouseMoveHandler.js';
import { ThemeManager } from '../src/tui/theme/index.js';
import { ThemeView } from '../src/tui/views/themeView.js';
import { ConfigView } from '../src/tui/views/configView.js';
import { ConfigPickerModal } from '../src/tui/views/configPickerModal.js';
import { CommandExecutorContext } from '../src/tui/input/commandExecutor.js';

async function runConfigThemeTests() {
  console.log('[TEST] Starting Config Option Modal & Theme Preview/Apply Test Suite...');

  const state = new TuiState();
  let renderCount = 0;
  const ctx: CommandExecutorContext = {
    state,
    render: () => { renderCount++; },
    runTick: async () => {},
    applyDraftConfig: async () => {},
    resetDraftConfig: () => {},
    executeScan: async () => {},
    executeReplay: async () => {},
    executeReset: async () => {},
    executeResetDb: async () => {},
    quit: () => {}
  };

  // --- PART 1: Config Page Option Picker Listbox ---
  state.activeView = 'config';
  state.selectedConfigIndex = 0; // Exchange setting

  // 1. Press Enter on Exchange row -> Opens Config Option Picker Modal
  await KeyHandler.handle('\r', ctx);
  assert(state.configModalState.active === true, 'Config modal opened on Enter');
  assert(state.configModalState.paramKey === 'exchange', 'Modal is for exchange parameter');
  assert(state.configModalState.options.length === 6, 'Exchange options loaded (6 venues)');

  // 2. Navigate modal options up/down
  state.configModalState.selectedIndex = 1;
  await KeyHandler.handle('\u001b[B', ctx); // Down to 2
  assert(state.configModalState.selectedIndex === 2, 'Modal navigated down 1 option');
  await KeyHandler.handle('\u001b[A', ctx); // Up to 1
  assert(state.configModalState.selectedIndex === 1, 'Modal navigated up 1 option');

  // 3. Pick the option with Enter
  const chosenOption = state.configModalState.options[1]; // COINBASE
  await KeyHandler.handle('\r', ctx);
  assert(state.configModalState.active === false, 'Config modal closed after picking option');
  assert(state.draftConfig.exchange === chosenOption.toLowerCase(), `draftConfig updated to ${chosenOption}`);
  console.log('  [PASS] Config Option Picker modal open, navigation, and option selection verified.');

  // 4. Test Cancel Modal with ESC
  state.selectedConfigIndex = 2; // Interval
  const prevInterval = state.draftConfig.interval;
  await KeyHandler.handle('\r', ctx);
  assert(state.configModalState.active === true, 'Modal opened for interval');
  await KeyHandler.handle('\u001b[B', ctx); // Move down
  await KeyHandler.handle('\u001b', ctx); // ESC cancel
  assert(state.configModalState.active === false, 'Modal closed on ESC');
  assert(state.draftConfig.interval === prevInterval, 'Config was not modified on ESC cancel');
  console.log('  [PASS] Config modal ESC cancel verified.');

  // 5. Test Mouse Selection on Config Modal
  state.selectedConfigIndex = 0;
  await KeyHandler.handle('\r', ctx);
  assert(state.configModalState.active === true, 'Modal open for mouse test');
  // Render modal to populate hitboxes
  ConfigView.render(state.selectedConfigIndex, state.getConfigParams(), false, 80, 7, 20, state.configModalState);
  const firstHit = ConfigPickerModal.rowHitboxes[0];
  assert(firstHit !== undefined, 'Modal hitboxes registered');
  MouseHandler.handle({ type: 'press', button: 0, row: firstHit.row, col: 10 }, ctx);
  assert(state.configModalState.active === false, 'Modal closed via mouse click');
  assert(state.draftConfig.exchange === firstHit.option.toLowerCase(), 'Draft config updated via mouse click');
  console.log('  [PASS] Mouse click on Config Option Modal verified.');

  // --- PART 2: Theme Preview vs Apply & Navigation ---
  state.activeView = 'theme';
  state.selectedThemeIndex = 0;
  ThemeManager.apply('matrix-terminal');
  const baseTheme = ThemeManager.currentName;

  // 1. Move/preview another theme
  await KeyHandler.handle('\u001b[B', ctx); // Move to theme index 1 (Cyberpunk Neon)
  assert(ThemeManager.activePreviewName !== null, 'Preview is active when moving cursor');
  assert(ThemeManager.activePreviewName !== baseTheme, 'Preview is different from base theme');
  assert(ThemeManager.currentName === baseTheme, 'Saved theme remains unchanged during preview');

  // 2. Switch away from theme page with hotkey '1' (Dashboard)
  await KeyHandler.handle('1', ctx);
  assert(state.activeView === 'dashboard', 'Switched to dashboard view');
  assert(ThemeManager.activePreviewName === null, 'ThemeManager reverted preview on leaving theme page');
  assert(ThemeManager.currentName === baseTheme, 'Saved theme is preserved');
  console.log('  [PASS] Theme preview revert on view exit (hotkey 1) verified.');

  // 3. Return to theme page, navigate, and APPLY theme with Enter
  state.activeView = 'theme';
  state.selectedThemeIndex = 2; // Synthwave 84
  const targetTheme = ThemeManager.listThemes()[2].name;
  ThemeManager.preview(targetTheme);
  await KeyHandler.handle('\r', ctx);
  assert(state.activeView === 'theme', 'Bot remains on Theme page after applying theme');
  assert(ThemeManager.currentName === targetTheme, 'Theme successfully applied globally');
  assert(ThemeManager.activePreviewName === null, 'Active preview cleared after apply');
  console.log('  [PASS] Theme Apply with Enter stays on Theme page and persists globally.');

  // 4. Test Theme listbox height increase
  const themeLines = ThemeView.render(0, 80, 24, 7);
  // Verify that more than 8 themes are rendered in the visible lines
  assert(ThemeView.rowHitboxes.length >= 10, `ThemeView visible rows count is ${ThemeView.rowHitboxes.length} (expected >= 10)`);
  console.log(`  [PASS] Theme listbox height expansion verified (${ThemeView.rowHitboxes.length} themes visible).`);

  console.log('\n[OK] All Config & Theme unit tests passed successfully!\n');
}

runConfigThemeTests().catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
