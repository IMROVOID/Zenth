import { TuiState } from '../state/tuiState.js';
import { ThemeManager, ansi } from '../theme/index.js';
import { Box } from './box.js';

export function printSessionDebrief(s: TuiState): void {
  const t = ThemeManager.theme;
  const boxWidth = 72;

  const totalWLDenom = s.sessionWins + s.sessionLosses;
  const wr = totalWLDenom > 0 ? ((s.sessionWins / totalWLDenom) * 100).toFixed(1) : '0.0';
  const pnlSign = s.sessionRealizedPnL >= 0 ? '+' : '';
  const pnlPct = s.activeConfig.targetAllocation > 0 ? (s.sessionRealizedPnL / s.activeConfig.targetAllocation) * 100 : 0;
  const pnlColor = s.sessionRealizedPnL > 0 ? t.success : s.sessionRealizedPnL < 0 ? t.danger : t.text;
  const durationMs = Math.max(0, Date.now() - new Date(s.sessionStartedAt).getTime());
  const durationMins = (durationMs / 60000).toFixed(1);

  const lines: string[] = [];
  lines.push('');
  lines.push(Box.header('ZENTH TRADING BOT — SESSION DEBRIEF', boxWidth, t.border, t.accent + ansi.bold));
  lines.push(Box.row(` ${t.dimText}Session ID: ${s.sessionId}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.divider(boxWidth, t.border));
  lines.push(Box.row(` ${t.boldText}Active Symbol        :${ansi.reset} ${t.accent}${s.activeConfig.symbol.toUpperCase()}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.boldText}Last Price           :${ansi.reset} ${t.text}$${s.currentPrice.toFixed(2)}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.boldText}Session Duration     :${ansi.reset} ${t.text}${durationMins}m (${s.cycleCount} cycles)${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.boldText}Total Entries Opened :${ansi.reset} ${t.text}${s.totalEntries}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.boldText}Win / Loss Record    :${ansi.reset} ${t.success}${s.sessionWins}W${ansi.reset} / ${t.danger}${s.sessionLosses}L${ansi.reset} ${t.dimText}(Win Rate: ${wr}%)${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.boldText}Realized Session PnL :${ansi.reset} ${pnlColor}${ansi.bold}${pnlSign}$${s.sessionRealizedPnL.toFixed(2)} (${pnlSign}${pnlPct.toFixed(2)}%)${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.boldText}Total Closed Value   :${ansi.reset} ${t.accentSecondary}$${s.totalClosedMoney.toFixed(2)}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.row(` ${t.boldText}Active Rules Learned :${ansi.reset} ${t.text}${s.activeRules.length}${ansi.reset}`, boxWidth, t.border));
  lines.push(Box.footer('', boxWidth, t.border));
  lines.push('');

  console.log(lines.join('\n'));
}
