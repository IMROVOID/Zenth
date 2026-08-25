import { ConfigModalState } from '../state/tuiState.js';
import { ThemeManager, ansi } from '../theme/index.js';
import { padRight, Box } from '../utils/index.js';

const BLACK_TEXT = '\x1b[22m\x1b[38;2;0;0;0m';

const EXCHANGE_METADATA: Record<string, string> = {
  binance: 'Quota: 1,200 req/min · Global Spot & Futures',
  coinbase: 'Quota: 10 req/sec · US Spot & CDP AgentKit',
  okx: 'Quota: 20 req/2s · Unified Spot & Derivatives',
  upbit: 'Quota: 10 req/sec · KRW & USDT Pairs',
  bitget: 'Quota: 20 req/sec · Spot & Futures with MCP',
  xt: 'Quota: 10 req/sec (1,000/min) · Spot & Stocks'
};

export interface ConfigPickerHitbox {
  index: number;
  option: string;
  row: number;
}

export class ConfigPickerModal {
  static rowHitboxes: ConfigPickerHitbox[] = [];

  static render(modal: ConfigModalState, currentVal: string, boxWidth: number, startRow = 7): string[] {
    const t = ThemeManager.theme;
    const lines: string[] = [];
    this.rowHitboxes = [];

    const label = modal.paramLabel || modal.paramKey.toUpperCase();
    const cat = modal.paramCategory ? `[${modal.paramCategory.toUpperCase()}] ` : '';
    lines.push(Box.header(`SELECT OPTION: ${cat}${label}`, boxWidth, t.border, t.accent + ansi.bold));

    const desc = modal.paramDesc || 'Choose desired value from options list below.';
    lines.push(Box.row(` ${t.dimText}${desc}${ansi.reset}`, boxWidth, t.border));
    lines.push(Box.divider(boxWidth, t.border));

    const options = modal.options || [];

    options.forEach((opt, idx) => {
      const isSelected = modal.selectedIndex === idx;
      const isCurrent = opt.toLowerCase() === currentVal.toLowerCase() || opt === currentVal;
      const marker = isSelected ? '▶' : ' ';
      const optStr = padRight(opt, 12, ' ');
      const extraDesc = modal.paramKey === 'exchange'
        ? (EXCHANGE_METADATA[opt.toLowerCase()] || '')
        : '';
      const descStr = extraDesc ? padRight(extraDesc, Math.max(10, boxWidth - 36), ' ') : '';
      const activeBadge = isCurrent ? ` ${t.success}[ACTIVE]${ansi.reset}` : '         ';
      const curTerminalRow = startRow + lines.length;

      this.rowHitboxes.push({ index: idx, option: opt, row: curTerminalRow });

      if (isSelected) {
        lines.push(Box.row(`${t.selectedBg}${BLACK_TEXT} ${marker} ${optStr} ${descStr}${activeBadge} ${ansi.reset}`, boxWidth, t.border));
      } else {
        lines.push(Box.row(` ${marker} ${t.accentSecondary}${optStr}${ansi.reset} ${t.dimText}${descStr}${ansi.reset}${activeBadge}`, boxWidth, t.border));
      }
    });

    lines.push(Box.divider(boxWidth, t.border));
    lines.push(Box.footer('[↑/↓/Wheel] Navigate · [SPACE/ENTER/Click] Select · [ESC] Cancel', boxWidth, t.border));

    return lines;
  }
}
