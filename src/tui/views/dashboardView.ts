import { ThemeManager, ansi } from '../theme/index.js';

export interface TickLogItem {
  timestamp: string;
  cycle: number;
  symbol: string;
  price: number;
  fastMA: number;
  slowMA: number;
  rsi: number;
  enteredMoney: number;
  closedMoney: number;
  rulesCount: number;
  sessionWin: number;
  sessionLoss: number;
  pnl: number;
  badge?: string;
  message?: string;
}

export class DashboardView {
  static render(logs: TickLogItem[], maxLines = 15, width = 100, scrollOffset = 0): string[] {
    const t = ThemeManager.theme;
    const lines: string[] = [];

    if (logs.length === 0) {
      lines.push(`${t.dimText}  Waiting for initial market scan cycle...${ansi.reset}`);
      return lines;
    }

    const totalLogs = logs.length;
    const effectiveOffset = Math.max(0, Math.min(scrollOffset, totalLogs - maxLines));
    const endIndex = totalLogs - effectiveOffset;
    const startIndex = Math.max(0, endIndex - maxLines);
    const visibleLogs = logs.slice(startIndex, endIndex);

    if (effectiveOffset > 0) {
      lines.push(`  ${t.dimText}▲ (${effectiveOffset} newer ticks below - scroll down to follow live)...${ansi.reset}`);
    }

    visibleLogs.forEach((item) => {
      if (item.message) {
        lines.push(`  ${t.dimText}[${item.timestamp}]${ansi.reset} ${item.message}`);
        return;
      }

      const pnlSign = item.pnl >= 0 ? '+' : '';
      const pnlColor = item.pnl > 0 ? t.success : item.pnl < 0 ? t.danger : t.dimText;
      const maCross = item.fastMA > item.slowMA ? `${t.success}▲ BULL${ansi.reset}` : `${t.danger}▼ BEAR${ansi.reset}`;
      const rsiColor = item.rsi > 70 ? t.warning : item.rsi < 30 ? t.info : t.text;

      const timeStr = `${t.dimText}[${item.timestamp}]${ansi.reset}`;
      const cycleNum = String(item.cycle).padStart(3, ' ');
      const cycleStr = `${t.boldText}TICK #${cycleNum}${ansi.reset}`;
      const symStr = `${t.accent}${item.symbol.toUpperCase()}${ansi.reset}: ${t.accentSecondary}$${item.price.toFixed(2)}${ansi.reset}`;
      const inStr = `In: ${t.warning}$${item.enteredMoney.toFixed(2)}${ansi.reset}`;
      const outStr = `Out: ${t.info}$${item.closedMoney.toFixed(2)}${ansi.reset}`;
      const scoreStr = `Score: ${t.success}${item.sessionWin}W${ansi.reset}/${t.danger}${item.sessionLoss}L${ansi.reset}`;
      const pnlStr = `PnL: ${pnlColor}${pnlSign}$${item.pnl.toFixed(2)}${ansi.reset}`;

      const row = `  ${timeStr} ${cycleStr} │ ${symStr} │ ${maCross} │ RSI: ${rsiColor}${item.rsi.toFixed(1)}${ansi.reset} │ ${inStr} │ ${outStr} │ ${scoreStr} │ ${pnlStr}`;
      lines.push(row);
    });

    return lines;
  }
}
