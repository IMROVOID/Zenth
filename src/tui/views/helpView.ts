import { ThemeManager, ansi } from '../theme/index.js';
import { padRight, Box } from '../utils/index.js';

export class HelpView {
  static render(width = 84): string[] {
    const t = ThemeManager.theme;
    const boxWidth = Math.min(width, 88);
    const lines: string[] = [];

    lines.push(Box.header('ZENTH COMMAND & KEYBOARD REFERENCE', boxWidth, t.border, t.accent + ansi.bold));

    const items = [
      { cmd: 'status', desc: 'Return to live real-time trading HUD and tick stream' },
      { cmd: 'pause / resume', desc: 'Pause or resume autonomous paper trading loop' },
      { cmd: 'coins', desc: 'Browse XT.com coin pairs with live prices & trend charts' },
      { cmd: 'stocks', desc: 'Browse XT.com stock & TradFi pairs with live trend charts' },
      { cmd: 'ledger', desc: 'Browse trade ledger records from Supabase database' },
      { cmd: 'rules', desc: 'Inspect active self-learned failure rules in Supabase' },
      { cmd: 'theme', desc: 'Switch color theme (14 Dark & Neon themes)' },
      { cmd: 'config', desc: 'View and adjust bot parameters with Save & Reset buttons' },
      { cmd: 'copy', desc: 'Copy all trade and tick logs to system clipboard' },
      { cmd: 'export', desc: 'Export trade & tick logs to file (TXT, CSV, MD, DOCX, PDF)' },
      { cmd: 'scan', desc: 'Trigger an immediate single-pass live market scan' },
      { cmd: 'replay', desc: 'Run historical replay backtest comparison' },
      { cmd: 'reset', desc: 'Clear Supabase trade ledger and memory rules' },
      { cmd: 'quit', desc: 'Cleanly shut down Zenth and print session summary' }
    ];

    items.forEach(it => {
      const cmdStr = padRight(it.cmd, 18, ' ');
      const descStr = it.desc;
      lines.push(Box.row(`  ${t.accent}${cmdStr}${ansi.reset} ${t.dimText}${descStr}${ansi.reset}`, boxWidth, t.border));
    });

    lines.push(Box.divider(boxWidth, t.border));
    lines.push(Box.row(` ${t.dimText}Hotkeys: Spacebar (Pause/Resume) · 1-8 (Navigation) · Arrows/WASD (Config)${ansi.reset}`, boxWidth, t.border));
    lines.push(Box.footer('', boxWidth, t.border));

    return lines;
  }
}
