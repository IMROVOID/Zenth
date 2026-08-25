import assert from 'node:assert';
import { THEMES } from '../src/tui/theme/presets/index.js';
import { ThemeManager } from '../src/tui/theme/themeManager.js';
import { ColorPalette } from '../src/tui/theme/types.js';
import { THEME_TEMPLATE, defineTheme } from '../src/tui/theme/template.js';

const REQUIRED_THEMES = [
  'matrix-terminal',
  'cyberpunk',
  'synthwave-84',
  'pure-dark',
  'amber-charcoal',
  'tokyo-night',
  'solarized-dark',
  'monokai-pro',
  'catppuccin-mocha',
  'dracula',
  'one-dark',
  'gruvbox-dark',
  'nord-dark',
  'oxide-cloud'
];

const REQUIRED_FIELDS: (keyof ColorPalette)[] = [
  'name',
  'displayName',
  'isDark',
  'category',
  'description',
  'bg',
  'headerBg',
  'cardBg',
  'inputBg',
  'selectedBg',
  'text',
  'dimText',
  'boldText',
  'accent',
  'accentSecondary',
  'border',
  'borderActive',
  'success',
  'danger',
  'warning',
  'info',
  'badgeBuy',
  'badgeSell',
  'badgeHold',
  'badgeSkip',
  'badgeInfo',
  'badgeSuccess',
  'badgeWarning',
  'badgeError',
  'badgeMemory',
  'badgeRisk'
];

async function runThemePresetTests() {
  console.log('[TEST] Starting Theme Presets & Template verification tests...');

  // Test 1: Verify all 14 required themes exist in THEMES map
  for (const themeKey of REQUIRED_THEMES) {
    assert(THEMES[themeKey] !== undefined, `Theme "${themeKey}" must be registered in THEMES`);
    assert.strictEqual(THEMES[themeKey].name, themeKey, `Theme name "${THEMES[themeKey].name}" must match key "${themeKey}"`);
  }
  console.log(`✓ All ${REQUIRED_THEMES.length} core themes registered in THEMES map`);

  // Test 2: Verify each theme has all required fields populated
  for (const [key, palette] of Object.entries(THEMES)) {
    for (const field of REQUIRED_FIELDS) {
      assert(palette[field] !== undefined, `Theme "${key}" is missing required field "${field}"`);
      if (typeof palette[field] === 'string' && !['bg', 'headerBg', 'cardBg', 'inputBg'].includes(field)) {
        assert(
          (palette[field] as string).length > 0,
          `Theme "${key}" has empty string for mandatory color field "${field}"`
        );
      }
    }
    assert(typeof palette.isDark === 'boolean', `Theme "${key}" isDark must be boolean`);
    assert(
      ['dark', 'cyber', 'minimal', 'retro', 'nordic'].includes(palette.category),
      `Theme "${key}" has invalid category "${palette.category}"`
    );
  }
  console.log('✓ All registered themes satisfy the complete ColorPalette schema');

  // Test 3: Verify ThemeManager methods
  const list = ThemeManager.listThemes();
  assert.strictEqual(list.length, Object.keys(THEMES).length, 'ThemeManager.listThemes() returns all themes');

  // Test 4: Preview and Apply cycle
  const original = ThemeManager.currentName;
  const testTheme = 'dracula';
  
  assert.strictEqual(ThemeManager.preview(testTheme), true, 'ThemeManager.preview succeeds');
  assert.strictEqual(ThemeManager.activePreviewName, testTheme, 'Active preview matches');
  assert.strictEqual(ThemeManager.theme.name, testTheme, 'ThemeManager.theme resolves preview theme');

  ThemeManager.revert();
  assert.strictEqual(ThemeManager.activePreviewName, null, 'Active preview is null after revert');
  assert.strictEqual(ThemeManager.theme.name, original, 'ThemeManager.theme restored to original');

  assert.strictEqual(ThemeManager.apply('cyberpunk'), true, 'ThemeManager.apply succeeds');
  assert.strictEqual(ThemeManager.currentName, 'cyberpunk', 'Current theme updated to cyberpunk');

  // Restore original
  ThemeManager.apply(original);
  console.log('✓ ThemeManager preview / apply / revert lifecycle verified');

  // Test 5: Verify Template and defineTheme helper
  assert(THEME_TEMPLATE !== undefined, 'THEME_TEMPLATE must be exported');
  for (const field of REQUIRED_FIELDS) {
    assert(THEME_TEMPLATE[field] !== undefined, `THEME_TEMPLATE is missing "${field}"`);
  }

  const customTheme = defineTheme({
    name: 'custom-gold',
    displayName: 'Custom Gold',
    isDark: true,
    category: 'retro',
    description: 'Custom test theme',
    bg: '',
    headerBg: '',
    cardBg: '',
    inputBg: '',
    selectedBg: '\x1b[43m',
    text: '\x1b[33m',
    dimText: '\x1b[2;33m',
    boldText: '\x1b[1;33m',
    accent: '\x1b[33m',
    accentSecondary: '\x1b[35m',
    border: '\x1b[33m',
    borderActive: '\x1b[1;33m',
    success: '\x1b[32m',
    danger: '\x1b[31m',
    warning: '\x1b[33m',
    info: '\x1b[36m',
    badgeBuy: '\x1b[42m',
    badgeSell: '\x1b[41m',
    badgeHold: '\x1b[40m',
    badgeSkip: '\x1b[43m',
    badgeInfo: '\x1b[46m',
    badgeSuccess: '\x1b[42m',
    badgeWarning: '\x1b[43m',
    badgeError: '\x1b[41m',
    badgeMemory: '\x1b[45m',
    badgeRisk: '\x1b[46m'
  });

  assert.strictEqual(customTheme.name, 'custom-gold');
  assert.strictEqual(customTheme.category, 'retro');
  console.log('✓ defineTheme template helper verified');

  console.log('\n[SUCCESS] All theme preset tests passed successfully!\n');
}

runThemePresetTests().catch((err) => {
  console.error('[ERROR] Theme preset tests failed:', err);
  process.exit(1);
});
