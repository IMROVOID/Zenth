import { ThemeManager, ansi } from '../theme/index.js';
import { padRight } from '../utils/index.js';

export interface MenuItem {
  id: string;
  num: string;
  title: string;
  description: string;
  shortcut: string;
}

export const MAIN_MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', num: '1', title: 'LIVE DASHBOARD', description: 'Real-time market ticks, MA crossover & RSI telemetry', shortcut: 'Press 1 or /status' },
  { id: 'ledger', num: '2', title: 'TRADE LEDGER', description: 'Browse executed paper trades & outcomes from Supabase', shortcut: 'Press 2 or /ledger' },
  { id: 'learnings', num: '3', title: 'ADAPTIVE RULES', description: 'Inspect active self-learned failure prevention rules', shortcut: 'Press 3 or /rules' },
  { id: 'theme', num: '4', title: 'COLOR THEMES', description: 'Browse & preview 20+ Dark, Light & Neon color themes', shortcut: 'Press 4 or /theme' },
  { id: 'config', num: '5', title: 'BOT CONFIGURATION', description: 'Inspect & modify trading interval, SL/TP brackets & limits', shortcut: 'Press 5 or /config' },
  { id: 'help', num: '6', title: 'COMMAND REFERENCE', description: 'Full keyboard shortcuts and slash command guide', shortcut: 'Press 6 or /help' },
  { id: 'scan', num: '7', title: 'INSTANT MARKET SCAN', description: 'Trigger an immediate single-pass scan against XT.com', shortcut: 'Press 7 or /scan' },
  { id: 'quit', num: '8', title: 'SHUTDOWN & SUMMARY', description: 'Cleanly exit Zenth and display final session debrief', shortcut: 'Press 8 or /quit' }
];

export class MenuView {
  static render(selectedIndex: number, width = 84): string[] {
    const t = ThemeManager.theme;
    const boxWidth = Math.min(width, 88);
    const lines: string[] = [];

    lines.push(`${t.accent}${ansi.bold}┌─[ ZENTH MAIN MENU & CONTROL CENTER ]${'─'.repeat(Math.max(0, boxWidth - 39))}┐${ansi.reset}`);
    lines.push(`${t.border}│${ansi.reset}  ${t.dimText}Select an option using UP/DOWN arrows or click directly:${' '.repeat(Math.max(0, boxWidth - 60))}${t.border}│${ansi.reset}`);
    lines.push(`${t.border}├${'─'.repeat(Math.max(0, boxWidth - 2))}┤${ansi.reset}`);

    MAIN_MENU_ITEMS.forEach((item, idx) => {
      const isSelected = idx === selectedIndex;
      const marker = isSelected ? `${t.accent}>${ansi.reset}` : ' ';
      const tag = `[${item.num}]`;
      const title = padRight(item.title, 22, ' ');
      const desc = padRight(item.description, boxWidth - 48, ' ');

      let row = '';
      if (isSelected) {
        row = `${t.selectedBg}  ${marker} ${tag} ${title} ${desc} ${ansi.reset}`;
      } else {
        row = `  ${marker} ${t.accent}${tag}${ansi.reset} ${t.boldText}${title}${ansi.reset} ${t.dimText}${desc}${ansi.reset}`;
      }

      const padded = padRight(row, boxWidth - 4, ' ');
      lines.push(`${t.border}│${ansi.reset} ${padded} ${t.border}│${ansi.reset}`);
    });

    lines.push(`${t.border}├${'─'.repeat(Math.max(0, boxWidth - 2))}┤${ansi.reset}`);
    lines.push(`${t.border}│${ansi.reset}  ${t.dimText}[ENTER] Open · [CLICK/TAP] Select · [1-8] Jump directly · [ESC] Live HUD${' '.repeat(Math.max(0, boxWidth - 75))}${t.border}│${ansi.reset}`);
    lines.push(`${t.accent}└──${'─'.repeat(Math.max(0, boxWidth - 6))}──┘${ansi.reset}`);

    return lines;
  }
}
