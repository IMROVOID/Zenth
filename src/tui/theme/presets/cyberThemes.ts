import { ColorPalette } from '../types.js';
import { ansi } from '../ansi.js';

export const cyberThemes: Record<string, ColorPalette> = {
  // ==========================================
  // Matrix Green Terminal
  // ==========================================
  'matrix-terminal': {
    // --- Metadata ---
    name: 'matrix-terminal',
    displayName: 'Matrix Green Terminal',
    isDark: true,
    category: 'cyber',
    description: 'Phosphor green CRT matrix stream on black background',

    // --- Backgrounds ---
    bg: '',
    headerBg: '',
    cardBg: '',
    inputBg: '',
    selectedBg: ansi.bgHex('#00FF66') + ansi.hex('#000000') + ansi.noBold,

    // --- Foregrounds & Accents ---
    text: ansi.hex('#A3FFAE'),
    dimText: ansi.hex('#478550'),
    boldText: ansi.bold + ansi.hex('#00FF66'),
    accent: ansi.hex('#00FF66'),
    accentSecondary: ansi.hex('#38EF7D'),
    border: ansi.hex('#1C3D22'),
    borderActive: ansi.hex('#00FF66'),

    // --- Functional Status Colors ---
    success: ansi.hex('#00FF66'),
    danger: ansi.hex('#FF3B30'),
    warning: ansi.hex('#FFD60A'),
    info: ansi.hex('#30D158'),

    // --- Badges ---
    badgeBuy: ansi.bgHex('#00FF66') + ansi.hex('#000000') + ansi.bold,
    badgeSell: ansi.bgHex('#FF3B30') + ansi.hex('#FFFFFF') + ansi.bold,
    badgeHold: ansi.bgHex('#1C3D22') + ansi.hex('#A3FFAE') + ansi.bold,
    badgeSkip: ansi.bgHex('#FFD60A') + ansi.hex('#000000') + ansi.bold,
    badgeInfo: ansi.bgHex('#30D158') + ansi.hex('#000000') + ansi.bold,
    badgeSuccess: ansi.bgHex('#00FF66') + ansi.hex('#000000') + ansi.bold,
    badgeWarning: ansi.bgHex('#FFD60A') + ansi.hex('#000000') + ansi.bold,
    badgeError: ansi.bgHex('#FF3B30') + ansi.hex('#FFFFFF') + ansi.bold,
    badgeMemory: ansi.bgHex('#1C3D22') + ansi.hex('#00FF66') + ansi.bold,
    badgeRisk: ansi.bgHex('#142017') + ansi.hex('#38EF7D') + ansi.bold,
  },

  // ==========================================
  // Cyberpunk Neon
  // ==========================================
  'cyberpunk': {
    // --- Metadata ---
    name: 'cyberpunk',
    displayName: 'Cyberpunk Neon',
    isDark: true,
    category: 'cyber',
    description: 'High-voltage electric magenta, cyan, and acid yellow',

    // --- Backgrounds ---
    bg: '',
    headerBg: '',
    cardBg: '',
    inputBg: '',
    selectedBg: ansi.bgHex('#FF0055') + ansi.hex('#FFFFFF') + ansi.bold,

    // --- Foregrounds & Accents ---
    text: ansi.hex('#F0F0FF'),
    dimText: ansi.hex('#60608A'),
    boldText: ansi.bold + ansi.hex('#FFFFFF'),
    accent: ansi.hex('#FF0055'),
    accentSecondary: ansi.hex('#00F0FF'),
    border: ansi.hex('#3A3A60'),
    borderActive: ansi.hex('#00F0FF'),

    // --- Functional Status Colors ---
    success: ansi.hex('#00FF66'),
    danger: ansi.hex('#FF0055'),
    warning: ansi.hex('#FFE600'),
    info: ansi.hex('#00F0FF'),

    // --- Badges ---
    badgeBuy: ansi.bgHex('#00FF66') + ansi.hex('#000000') + ansi.bold,
    badgeSell: ansi.bgHex('#FF0055') + ansi.hex('#FFFFFF') + ansi.bold,
    badgeHold: ansi.bgHex('#202038') + ansi.hex('#A0A0D0') + ansi.bold,
    badgeSkip: ansi.bgHex('#FFE600') + ansi.hex('#000000') + ansi.bold,
    badgeInfo: ansi.bgHex('#00F0FF') + ansi.hex('#000000') + ansi.bold,
    badgeSuccess: ansi.bgHex('#00FF66') + ansi.hex('#000000') + ansi.bold,
    badgeWarning: ansi.bgHex('#FFE600') + ansi.hex('#000000') + ansi.bold,
    badgeError: ansi.bgHex('#FF0055') + ansi.hex('#FFFFFF') + ansi.bold,
    badgeMemory: ansi.bgHex('#BD00FF') + ansi.hex('#FFFFFF') + ansi.bold,
    badgeRisk: ansi.bgHex('#00F0FF') + ansi.hex('#000000') + ansi.bold,
  },

  // ==========================================
  // Synthwave 84
  // ==========================================
  'synthwave-84': {
    // --- Metadata ---
    name: 'synthwave-84',
    displayName: 'Synthwave 84',
    isDark: true,
    category: 'cyber',
    description: 'Retro 80s neon grid sunset with hot pink, teal, and glow yellow',

    // --- Backgrounds ---
    bg: '',
    headerBg: '',
    cardBg: '',
    inputBg: '',
    selectedBg: ansi.bgHex('#FF7EDB') + ansi.hex('#000000') + ansi.noBold,

    // --- Foregrounds & Accents ---
    text: ansi.hex('#FDFDFD'),
    dimText: ansi.hex('#848BBD'),
    boldText: ansi.bold + ansi.hex('#FFFFFF'),
    accent: ansi.hex('#FF7EDB'),
    accentSecondary: ansi.hex('#36F9F6'),
    border: ansi.hex('#493C68'),
    borderActive: ansi.hex('#FF7EDB'),

    // --- Functional Status Colors ---
    success: ansi.hex('#72F1B8'),
    danger: ansi.hex('#FE4450'),
    warning: ansi.hex('#FFEC5C'),
    info: ansi.hex('#36F9F6'),

    // --- Badges ---
    badgeBuy: ansi.bgHex('#1B4734') + ansi.hex('#72F1B8') + ansi.bold,
    badgeSell: ansi.bgHex('#4C171C') + ansi.hex('#FE4450') + ansi.bold,
    badgeHold: ansi.bgHex('#34294F') + ansi.hex('#FDFDFD') + ansi.bold,
    badgeSkip: ansi.bgHex('#4D4719') + ansi.hex('#FFEC5C') + ansi.bold,
    badgeInfo: ansi.bgHex('#124546') + ansi.hex('#36F9F6') + ansi.bold,
    badgeSuccess: ansi.bgHex('#1B4734') + ansi.hex('#72F1B8') + ansi.bold,
    badgeWarning: ansi.bgHex('#4D4719') + ansi.hex('#FFEC5C') + ansi.bold,
    badgeError: ansi.bgHex('#4C171C') + ansi.hex('#FE4450') + ansi.bold,
    badgeMemory: ansi.bgHex('#441B52') + ansi.hex('#FF7EDB') + ansi.bold,
    badgeRisk: ansi.bgHex('#124546') + ansi.hex('#36F9F6') + ansi.bold,
  }
};
