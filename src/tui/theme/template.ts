import { ColorPalette } from './types.js';
import { ansi } from './ansi.js';

/**
 * Standard Color Theme Definition Template
 *
 * Every theme preset follows this exact modular structure:
 * 1. Metadata: Slug, display name, dark flag, category, and visual description.
 * 2. Backgrounds: Optional background tints and cursor selection highlight.
 * 3. Foregrounds: Main typography, dimmed labels, bold highlights, borders, and primary/secondary accents.
 * 4. Status Colors: Semantic state colors (success, danger, warning, info).
 * 5. Badges: Inverted pill badge styles for logs, trading signals, and HUD metrics.
 */
export const THEME_TEMPLATE: ColorPalette = {
  // --- Metadata ---
  name: 'custom-theme-template',
  displayName: 'Custom Theme Template',
  isDark: true,
  category: 'dark',
  description: 'Clean template for building custom TUI color schemes',

  // --- Backgrounds ---
  bg: '',
  headerBg: '',
  cardBg: '',
  inputBg: '',
  selectedBg: ansi.bgHex('#3B82F6') + ansi.hex('#FFFFFF') + ansi.bold,

  // --- Foregrounds & Accents ---
  text: ansi.hex('#F4F4F5'),
  dimText: ansi.hex('#71717A'),
  boldText: ansi.bold + ansi.hex('#FAFAFA'),
  accent: ansi.hex('#3B82F6'),
  accentSecondary: ansi.hex('#60A5FA'),
  border: ansi.hex('#3F3F46'),
  borderActive: ansi.hex('#3B82F6'),

  // --- Functional Status Colors ---
  success: ansi.hex('#10B981'),
  danger: ansi.hex('#EF4444'),
  warning: ansi.hex('#F59E0B'),
  info: ansi.hex('#3B82F6'),

  // --- Badges ---
  badgeBuy: ansi.bgHex('#065F46') + ansi.hex('#A7F3D0') + ansi.bold,
  badgeSell: ansi.bgHex('#7F1D1D') + ansi.hex('#FECACA') + ansi.bold,
  badgeHold: ansi.bgHex('#27272A') + ansi.hex('#A1A1AA') + ansi.bold,
  badgeSkip: ansi.bgHex('#78350F') + ansi.hex('#FDE68A') + ansi.bold,
  badgeInfo: ansi.bgHex('#1E3A8A') + ansi.hex('#BFDBFE') + ansi.bold,
  badgeSuccess: ansi.bgHex('#065F46') + ansi.hex('#A7F3D0') + ansi.bold,
  badgeWarning: ansi.bgHex('#78350F') + ansi.hex('#FDE68A') + ansi.bold,
  badgeError: ansi.bgHex('#7F1D1D') + ansi.hex('#FECACA') + ansi.bold,
  badgeMemory: ansi.bgHex('#581C87') + ansi.hex('#E9D5FF') + ansi.bold,
  badgeRisk: ansi.bgHex('#164E63') + ansi.hex('#A5F3FC') + ansi.bold,
};

/**
 * Type-safe helper function to define a theme adhering to the ColorPalette interface.
 */
export function defineTheme(theme: ColorPalette): ColorPalette {
  return theme;
}
