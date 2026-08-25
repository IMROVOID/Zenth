import { OnboardingStateData } from './onboardingTypes.js';
import { ThemeManager, ansi } from '../theme/index.js';
import { Box } from '../utils/box.js';

const BLACK_TEXT = '\x1b[22m\x1b[38;2;0;0;0m';

export function renderStorageStep(data: OnboardingStateData, boxWidth: number): string[] {
  const t = ThemeManager.theme;
  const lines: string[] = [];

  lines.push(Box.row(` ${t.boldText}STEP 1: SELECT DATABASE & MEMORY STORAGE BACKEND${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Choose how paper trade records and adaptive failure rules are persisted.${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  const options = [
    `[1] SQLite (Local File - Recommended) — Instant embedded local database (Zero Setup)`,
    `[2] PostgreSQL (Local Server / Docker) — Full relational DB with auto-creation`,
    `[3] MongoDB (Local Server / Docker)    — High-performance document DB with auto-creation`,
    `[4] Supabase Cloud (Remote DB)        — Cloud PostgreSQL with RLS & sync`,
    `[5] In-Memory (Offline / Ephemeral)   — Fast RAM-only store (No disk/DB footprint)`
  ];

  options.forEach((optText, idx) => {
    const isSelected = data.selectedOptionIndex === idx;
    if (isSelected) {
      lines.push(Box.row(`${t.selectedBg}${BLACK_TEXT} ▶ ${optText} ${ansi.reset}`, boxWidth, t.border));
    } else {
      const color = idx === 0 ? t.boldText : t.dimText;
      lines.push(Box.row(`   ${color}${optText}${ansi.reset}`, boxWidth, t.border));
    }
  });

  lines.push(Box.divider(boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Navigate: [↑/↓] or press [1]–[5] · Confirm: [ENTER] · Exit: [ESC]${ansi.reset}`, boxWidth, t.border));

  return lines;
}

export function renderSupabaseSetupChoiceStep(data: OnboardingStateData, boxWidth: number): string[] {
  const t = ThemeManager.theme;
  const lines: string[] = [];

  lines.push(Box.row(` ${t.boldText}STEP 2: SUPABASE PROJECT PROVISIONING METHOD${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Do you want automated 1-click provisioning or manual configuration?${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  const opt1Selected = data.selectedOptionIndex === 0;
  const opt2Selected = data.selectedOptionIndex === 1;

  const r1Text = `[1] Automated Setup via Access Token — Auto-creates/links project & deploys schema`;
  const r2Text = `[2] Manual Configuration / Existing DB — Enter Project URL & API Key directly`;

  lines.push(Box.row(opt1Selected ? `${t.selectedBg}${BLACK_TEXT} ▶ ${r1Text} ${ansi.reset}` : `   ${t.boldText}${r1Text}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(opt2Selected ? `${t.selectedBg}${BLACK_TEXT} ▶ ${r2Text} ${ansi.reset}` : `   ${t.dimText}${r2Text}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Navigate: [↑/↓] or press [1] / [2] · Confirm: [ENTER] · Back: [ESC]${ansi.reset}`, boxWidth, t.border));

  return lines;
}
