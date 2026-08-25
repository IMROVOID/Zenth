import { OnboardingStateData } from './onboardingTypes.js';
import { ThemeManager, ansi } from '../theme/index.js';
import { padRight, Box } from '../utils/index.js';

const BLACK_TEXT = '\x1b[22m\x1b[38;2;0;0;0m';

export interface ParamRowHitbox {
  index: number;
  row: number;
}

export class RenderStepParams {
  static rowHitboxes: ParamRowHitbox[] = [];

  static render(data: OnboardingStateData, boxWidth: number, startRow = 6): string[] {
    const t = ThemeManager.theme;
    const lines: string[] = [];
    this.rowHitboxes = [];

    lines.push(Box.row(` ${t.boldText}STEP 3: BOT TRADING PARAMETERS (PAPER TRADING)${ansi.reset}`, boxWidth, t.border));
    lines.push(Box.row(` ${t.dimText}Select any parameter with [SPACE] or [ENTER] to pick values or search symbols.${ansi.reset}`, boxWidth, t.border));
    lines.push(Box.divider(boxWidth, t.border));

    const p = data.tradingParams;
    const fields = [
      { key: 'exchange', label: 'EXCHANGE', val: (p.exchange || 'binance').toUpperCase(), desc: 'Active market data & trade venue' },
      { key: 'symbol', label: 'SYMBOL', val: p.symbol.toUpperCase(), desc: 'Trading pair / asset on exchange feed' },
      { key: 'interval', label: 'INTERVAL', val: p.interval, desc: 'Candle timeframe (e.g. 1m, 5m, 15m, 1h)' },
      { key: 'quantity', label: 'QUANTITY', val: String(p.quantity), desc: 'Order quantity per signal' },
      { key: 'maxPositionNotionalCap', label: 'MAX_POSITION_CAP', val: `$${p.maxPositionNotionalCap}`, desc: 'Hard notional safety ceiling in USD/USDT' },
      { key: 'stopLossPct', label: 'STOP_LOSS_PCT', val: `${p.stopLossPct}%`, desc: 'Downside bracket stop loss percentage' },
      { key: 'takeProfitPct', label: 'TAKE_PROFIT_PCT', val: `${p.takeProfitPct}%`, desc: 'Upside bracket take profit percentage' },
      { key: 'candleLookback', label: 'CANDLE_LOOKBACK', val: String(p.candleLookback), desc: 'Historical candles fetched for indicator stability' }
    ];

    fields.forEach((f, idx) => {
      const isFocused = data.activeTradingParamIndex === idx;
      const marker = isFocused ? '▶' : ' ';
      const labelStr = padRight(f.label, 18, ' ');
      const valStr = padRight(f.val, 14, ' ');
      const descStr = f.desc.substring(0, Math.max(10, boxWidth - 42));
      const curTerminalRow = startRow + lines.length;

      this.rowHitboxes.push({ index: idx, row: curTerminalRow });

      if (isFocused) {
        lines.push(Box.row(`${t.selectedBg}${BLACK_TEXT} ${marker} ${labelStr} ${valStr} ${descStr} ${ansi.reset}`, boxWidth, t.border));
      } else {
        lines.push(Box.row(` ${marker} ${t.boldText}${labelStr}${ansi.reset} ${t.accentSecondary}${valStr}${ansi.reset} ${t.dimText}${descStr}${ansi.reset}`, boxWidth, t.border));
      }
    });

    // Single line space before Confirm button
    lines.push(Box.row('', boxWidth, t.border));

    // Action Button Row: Confirm & Continue
    const isConfirmFocused = data.activeTradingParamIndex === fields.length;
    const confirmMarker = isConfirmFocused ? '▶' : ' ';
    const confirmText = '▶ [CONFIRM & CONTINUE TO LAUNCH SUMMARY]';
    const confirmRow = startRow + lines.length;
    this.rowHitboxes.push({ index: fields.length, row: confirmRow });

    if (isConfirmFocused) {
      lines.push(Box.row(`${t.selectedBg}${BLACK_TEXT} ${confirmMarker} ${confirmText} ${ansi.reset}`, boxWidth, t.border));
    } else {
      lines.push(Box.row(` ${confirmMarker} ${t.success}${confirmText}${ansi.reset}`, boxWidth, t.border));
    }

    lines.push(Box.divider(boxWidth, t.border));
    lines.push(Box.row(` ${t.dimText}[↑/↓/TAB] Select · [SPACE / ENTER] Pick Value / Continue · [ESC] Back${ansi.reset}`, boxWidth, t.border));

    return lines;
  }
}

export function renderCompleteStep(data: OnboardingStateData, boxWidth: number): string[] {
  const t = ThemeManager.theme;
  const lines: string[] = [];

  lines.push(Box.row(` ${t.boldText}STEP 4: CONFIGURATION SUMMARY & LAUNCH CONFIRMATION${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}Review parameters before saving to .env and starting terminal.${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));

  const storageLabel = data.storageBackend === 'supabase' ? `${t.success}Supabase Cloud PostgreSQL${ansi.reset}` : `${t.warning}Local Offline In-Memory${ansi.reset}`;
  lines.push(Box.row(` ${t.boldText}Storage Backend  :${ansi.reset} ${storageLabel}`, boxWidth, t.border));

  if (data.storageBackend === 'supabase') {
    lines.push(Box.row(` ${t.boldText}Supabase URL     :${ansi.reset} ${t.text}${data.supabaseUrl}${ansi.reset}`, boxWidth, t.border));
  }

  const p = data.tradingParams;
  lines.push(Box.row(` ${t.boldText}Selected Exchange:${ansi.reset} ${t.accent}${(p.exchange || 'binance').toUpperCase()}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.boldText}Default Symbol   :${ansi.reset} ${t.accentSecondary}${p.symbol.toUpperCase()}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.boldText}Candle Interval  :${ansi.reset} ${t.text}${p.interval} (${p.candleLookback} lookback)${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.boldText}Order Quantity   :${ansi.reset} ${t.text}${p.quantity} (Cap: $${p.maxPositionNotionalCap})${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.boldText}Risk Brackets    :${ansi.reset} ${t.danger}-${p.stopLossPct}% SL${ansi.reset} / ${t.success}+${p.takeProfitPct}% TP${ansi.reset}`, boxWidth, t.border));

  lines.push(Box.divider(boxWidth, t.border));
  lines.push(Box.row(` ${t.badgeSuccess} READY ${ansi.reset} Press ${t.boldText}[ENTER]${ansi.reset} to save .env and boot into Zenth TUI Terminal!`, boxWidth, t.border));
  lines.push(Box.row(` ${t.dimText}[ENTER] Save & Launch Terminal · [ESC] Go Back & Edit${ansi.reset}`, boxWidth, t.border));

  return lines;
}
