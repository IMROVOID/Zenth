import { OnboardingStateData } from './onboardingTypes.js';
import { PARAM_OPTIONS_MAP } from './paramPickerOptions.js';
import { ThemeManager, ansi } from '../theme/index.js';
import { padRight, Box } from '../utils/index.js';

const BLACK_TEXT = '\x1b[22m\x1b[38;2;0;0;0m';

export interface ParamPickerHitbox {
  index: number;
  row: number;
}

export class RenderParamPicker {
  static rowHitboxes: ParamPickerHitbox[] = [];

  static render(data: OnboardingStateData, boxWidth: number, startRow = 6): string[] {
    const t = ThemeManager.theme;
    const lines: string[] = [];
    this.rowHitboxes = [];
    const paramKey = data.activeParamPickerKey;

    if (!paramKey || paramKey === 'symbol' || !PARAM_OPTIONS_MAP[paramKey]) {
      lines.push(Box.row(` ${t.danger}[ERROR] Invalid parameter selected.${ansi.reset}`, boxWidth, t.border));
      return lines;
    }

    const options = PARAM_OPTIONS_MAP[paramKey];
    const currentValue = data.tradingParams[paramKey];
    const paramTitles: Record<string, string> = {
      interval: 'CANDLE TIMEFRAME INTERVAL',
      quantity: 'ORDER QUANTITY PER SIGNAL',
      maxPositionNotionalCap: 'MAX POSITION SAFETY CAP ($)',
      stopLossPct: 'STOP LOSS BRACKET PERCENTAGE (%)',
      takeProfitPct: 'TAKE PROFIT BRACKET PERCENTAGE (%)',
      candleLookback: 'HISTORICAL CANDLE LOOKBACK COUNT'
    };

    const title = paramTitles[paramKey] || 'SELECT PARAMETER VALUE';
    lines.push(Box.row(` ${t.boldText}SELECT ${title}${ansi.reset}`, boxWidth, t.border));
    lines.push(Box.row(` ${t.dimText}Navigate with [↑/↓] or Mouse · [SPACE / ENTER] Pick Value · [ESC] Cancel${ansi.reset}`, boxWidth, t.border));
    lines.push(Box.divider(boxWidth, t.border));

    options.forEach((opt, idx) => {
      const isSelected = data.paramPickerSelectedIndex === idx;
      const isCurrent = opt.value === currentValue;
      const marker = isSelected ? '▶' : ' ';
      const valLabel = padRight(opt.label, 8, ' ');
      const descText = opt.desc.substring(0, Math.max(10, boxWidth - 30));
      const activeBadge = isCurrent ? ' [ACTIVE]' : '         ';
      const curTerminalRow = startRow + lines.length;

      this.rowHitboxes.push({ index: idx, row: curTerminalRow });

      if (isSelected) {
        lines.push(Box.row(`${t.selectedBg}${BLACK_TEXT} ${marker} ${valLabel} ${descText}${activeBadge} ${ansi.reset}`, boxWidth, t.border));
      } else {
        const activeColor = isCurrent ? ` ${t.success}[ACTIVE]${ansi.reset}` : '         ';
        lines.push(Box.row(` ${marker} ${t.accent}${valLabel}${ansi.reset} ${t.dimText}${descText}${ansi.reset}${activeColor}`, boxWidth, t.border));
      }
    });

    lines.push(Box.divider(boxWidth, t.border));
    lines.push(Box.row(` ${t.dimText}[↑/↓/Wheel] Navigate · [SPACE / ENTER / Click] Pick Value · [ESC] Cancel${ansi.reset}`, boxWidth, t.border));

    return lines;
  }
}
