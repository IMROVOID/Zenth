export interface ColorPalette {
  name: string;
  displayName: string;
  isDark: boolean;
  category: 'dark' | 'cyber' | 'minimal' | 'retro' | 'nordic';
  description: string;

  // Backgrounds
  bg: string;
  headerBg: string;
  cardBg: string;
  inputBg: string;
  selectedBg: string;

  // Foregrounds
  text: string;
  dimText: string;
  boldText: string;
  accent: string;
  accentSecondary: string;
  border: string;
  borderActive: string;

  // Functional Status
  success: string;
  danger: string;
  warning: string;
  info: string;

  // Badges
  badgeBuy: string;
  badgeSell: string;
  badgeHold: string;
  badgeSkip: string;
  badgeInfo: string;
  badgeSuccess: string;
  badgeWarning: string;
  badgeError: string;
  badgeMemory: string;
  badgeRisk: string;
}
