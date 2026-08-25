import { ThemeManager, ansi } from '../theme/index.js';
import { LedgerEntry } from '../../core/memory/index.js';
import { Box } from '../utils/index.js';

export interface LedgerRowHitbox {
  index: number;
  row: number;
}

function formatFullDate(raw?: string): string {
  if (!raw) return '                   ';
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) {
      return raw.replace('T', ' ').substring(0, 19).padEnd(19, ' ');
    }
    return d.toISOString().replace('T', ' ').substring(0, 19);
  } catch {
    return raw.replace('T', ' ').substring(0, 19).padEnd(19, ' ');
  }
}

export class LedgerView {
  static rowHitboxes: LedgerRowHitbox[] = [];

  static render(entries: LedgerEntry[], width = 88, startTerminalRow = 7, selectedIndex = -1): string[] {
    const t = ThemeManager.theme;
    const lines: string[] = [];
    const boxWidth = Math.min(width, 92);
    this.rowHitboxes = [];

    lines.push(Box.header('SUPABASE TRADE LEDGER (public.trade_ledger)', boxWidth, t.border, t.accent + ansi.bold));

    if (entries.length === 0) {
      lines.push(Box.row(` ${t.dimText}No trade records found in Supabase trade_ledger.`, boxWidth, t.border));
      lines.push(Box.footer('Press ESC or /status to return to Live HUD', boxWidth, t.border));
      return lines;
    }

    const head = ` # │ Date & Time (UTC)   │ Act   │ Price ($) │ Qty (BTC) │ Outcome │ PnL ($)  │ Reason`;
    lines.push(Box.row(`${t.boldText}${head}${ansi.reset}`, boxWidth, t.border));
    lines.push(Box.divider(boxWidth, t.border));

    let currentRowOffset = startTerminalRow + lines.length;
    const maxDisplay = 10;
    const recent = entries.slice(-maxDisplay).reverse();

    recent.forEach((item, idx) => {
      const isSelected = idx === selectedIndex;
      const num = String(idx + 1).padStart(2, ' ');
      const time = formatFullDate(item.timestamp);
      const action = item.action === 'BUY' ? t.badgeBuy + ' BUY  ' + ansi.reset : item.action === 'SELL' ? t.badgeSell + ' SELL ' + ansi.reset : item.action === 'SKIP' ? t.badgeSkip + ' SKIP ' + ansi.reset : t.badgeHold + ' HOLD ' + ansi.reset;
      const price = `$${item.price.toFixed(1)}`.padEnd(9, ' ');
      const qty = String(item.quantity).padEnd(9, ' ');
      const outcome = item.outcome === 'WIN' ? `${t.success}WIN ` : item.outcome === 'LOSS' ? `${t.danger}LOSS` : `${t.dimText}${item.outcome || 'PEND'}`;
      const pnlSign = item.pnl >= 0 ? '+' : '';
      const pnlColor = item.pnl > 0 ? t.success : item.pnl < 0 ? t.danger : t.dimText;
      const pnl = `${pnlColor}${pnlSign}$${item.pnl.toFixed(2)}${ansi.reset}`.padEnd(16, ' ');
      const reason = (item.reason || '').substring(0, Math.max(10, boxWidth - 80));

      this.rowHitboxes.push({
        index: idx,
        row: currentRowOffset
      });
      currentRowOffset++;

      let row = '';
      if (isSelected) {
        row = `${t.selectedBg} ${num} │ ${time} │ ${action} │ ${price} │ ${qty} │ ${outcome}${ansi.reset} │ ${pnl}│ ${t.text}${reason} ${ansi.reset}`;
      } else {
        row = ` ${num} │ ${time} │ ${action} │ ${price} │ ${qty} │ ${outcome}${ansi.reset} │ ${pnl}│ ${t.dimText}${reason}${ansi.reset}`;
      }

      lines.push(Box.row(row, boxWidth, t.border));
    });

    lines.push(Box.footer(`Showing ${recent.length} of ${entries.length} records · Press ESC or /status to return`, boxWidth, t.border));
    return lines;
  }
}
