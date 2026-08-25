import { OnboardingStateData } from './onboardingTypes.js';
import { ThemeManager, ansi } from '../theme/index.js';
import { Box } from '../utils/box.js';

export function renderManualGuideStep(data: OnboardingStateData, boxWidth: number): string[] {
  const t = ThemeManager.theme;
  const lines: string[] = [];

  lines.push(Box.row(` ${t.boldText}MANUAL SETUP GUIDE & DATABASE SCHEMA PROVISIONING${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Follow these simple steps to prepare your Supabase PostgreSQL database:${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  lines.push(Box.row(` ${t.accent}1.${ansi.reset} ${t.boldText}Create Project:${ansi.reset} Go to ${t.accentSecondary}https://database.new${ansi.reset} to create a new free project.`, boxWidth, t.border));
  lines.push(Box.row(` ${t.accent}2.${ansi.reset} ${t.boldText}Open SQL Editor:${ansi.reset} Navigate to ${t.boldText}SQL Editor > New Query${ansi.reset} in Supabase sidebar.`, boxWidth, t.border));
  lines.push(Box.row(` ${t.accent}3.${ansi.reset} ${t.boldText}Execute Schema:${ansi.reset} Press ${t.accent}[C]${ansi.reset} to copy the full SQL DDL schema to clipboard,`, boxWidth, t.border));
  lines.push(Box.row(`    paste it into the SQL Editor, and click ${t.boldText}Run${ansi.reset}.`, boxWidth, t.border));
  lines.push(Box.row(` ${t.accent}4.${ansi.reset} ${t.boldText}Retrieve Keys:${ansi.reset} Copy your ${t.boldText}Project URL${ansi.reset} & ${t.boldText}anon API Key${ansi.reset} from Settings > API.`, boxWidth, t.border));

  lines.push(Box.divider(boxWidth, t.border));

  if (data.copiedNotice) {
    lines.push(Box.row(` ${t.badgeSuccess} COPIED ${ansi.reset} ${t.text}${data.copiedNotice}${ansi.reset}`, boxWidth, t.border));
  } else {
    lines.push(Box.row(` ${t.accentSecondary}Press [C] to copy full SQL Schema to clipboard now${ansi.reset}`, boxWidth, t.border));
  }

  lines.push(Box.divider(boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}[C] Copy SQL Schema · [ENTER] Proceed to Credentials · [ESC] Back${ansi.reset}`, boxWidth, t.border));

  return lines;
}
