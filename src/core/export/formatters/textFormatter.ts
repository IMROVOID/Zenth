import { ExportDataPayload } from '../types.js';
import { stripAnsi } from './utils.js';

export function formatPlainText(p: ExportDataPayload): string {
  const width = 88;
  const divider = '-'.repeat(width);
  const lines: string[] = [];

  lines.push('='.repeat(width));
  lines.push(`  ZENTH TRADING BOT - SESSION & TRADE EXPORT LOG`);
  lines.push(`  Generated: ${p.exportedAt} | Session ID: ${p.sessionId}`);
  lines.push('='.repeat(width));
  lines.push('');

  // 1. Session Overview
  lines.push(`[1] SESSION OVERVIEW`);
  lines.push(divider);
  lines.push(`  Session Started  : ${p.sessionStartedAt}`);
  lines.push(`  Active Symbol    : ${p.activeSymbol.toUpperCase()}`);
  lines.push(`  Current Price    : $${p.currentPrice.toFixed(2)}`);
  lines.push(`  Trading Status   : ${p.isTradingPaused ? 'PAUSED' : 'ACTIVE / LIVE'}`);
  lines.push(`  Total Cycles     : ${p.cycleCount}`);
  lines.push(`  Total Entries    : ${p.totalEntries}`);
  lines.push(`  Session Record   : ${p.sessionWins} Wins / ${p.sessionLosses} Losses (Win Rate: ${p.winRate.toFixed(1)}%)`);
  lines.push(`  Realized PnL     : $${p.sessionRealizedPnL.toFixed(2)}`);
  lines.push(`  Total Closed Val : $${p.totalClosedMoney.toFixed(2)}`);
  if (p.activePosition) {
    lines.push(`  Active Position  : Open (${p.activePosition.quantity} @ $${p.activePosition.entryPrice.toFixed(2)}, SL: $${p.activePosition.stopLossPrice.toFixed(2)}, TP: $${p.activePosition.takeProfitPrice.toFixed(2)})`);
  } else {
    lines.push(`  Active Position  : FLAT (No Open Position)`);
  }
  lines.push('');

  // 2. Parameters
  lines.push(`[2] BOT PARAMETERS & LIMITS`);
  lines.push(divider);
  lines.push(`  Allocation       : $${p.config.targetAllocation} (${p.config.interval} timeframe)`);
  lines.push(`  Fast/Slow MA     : ${p.config.fastPeriod} / ${p.config.slowPeriod} periods`);
  lines.push(`  RSI Setting      : ${p.config.rsiPeriod} periods (Max Entry RSI: ${p.config.rsiMaxEntry})`);
  lines.push(`  Stop Loss / TP   : ${p.config.stopLossPct}% SL / ${p.config.takeProfitPct}% TP`);
  lines.push(`  Trailing Stop    : ${p.config.trailingStopPct > 0 ? `${p.config.trailingStopPct}%` : 'Disabled'}`);
  lines.push(`  Breakeven Trigger: ${p.config.breakevenTriggerPct > 0 ? `${p.config.breakevenTriggerPct}%` : 'Disabled'}`);
  lines.push(`  Adaptive Filter  : Mode=${p.config.filterMode}, AutoLearn=${p.config.autoLearn}`);
  lines.push('');

  // 3. Active Rules
  if (p.activeRules.length > 0) {
    lines.push(`[3] ACTIVE SELF-LEARNED FAILURE RULES (${p.activeRules.length})`);
    lines.push(divider);
    p.activeRules.forEach((rule, idx) => {
      lines.push(`  ${idx + 1}. [${rule.pattern_condition}] (Triggers: ${rule.trigger_count || 0})`);
      lines.push(`     Loss Reason: ${rule.loss_reason}`);
      lines.push(`     Rule: ${rule.trading_rule}`);
    });
    lines.push('');
  }

  // 4. Trade Ledger
  lines.push(`[4] SUPABASE TRADE LEDGER (${p.ledgerEntries.length} Records)`);
  lines.push(divider);
  if (p.ledgerEntries.length === 0) {
    lines.push(`  No trade records logged in ledger.`);
  } else {
    lines.push(`  #  | Time (UTC)          | Action | Price ($)   | Qty         | Outcome | PnL ($)    | Reason`);
    lines.push(`  ${'-'.repeat(84)}`);
    p.ledgerEntries.forEach((entry, idx) => {
      const num = String(idx + 1).padStart(2, ' ');
      const time = (entry.timestamp || '').replace('T', ' ').substring(0, 19).padEnd(19, ' ');
      const action = (entry.action || '').padEnd(6, ' ');
      const price = `$${entry.price.toFixed(2)}`.padEnd(11, ' ');
      const qty = String(entry.quantity).padEnd(11, ' ');
      const outcome = (entry.outcome || 'PENDING').padEnd(7, ' ');
      const pnl = `${entry.pnl >= 0 ? '+' : ''}$${entry.pnl.toFixed(2)}`.padEnd(10, ' ');
      const reason = stripAnsi(entry.reason || '');
      lines.push(`  ${num} | ${time} | ${action} | ${price} | ${qty} | ${outcome} | ${pnl} | ${reason}`);
    });
  }
  lines.push('');

  // 5. Tick Stream
  lines.push(`[5] TICK LOG STREAM (${p.tickLogs.length} Ticks)`);
  lines.push(divider);
  if (p.tickLogs.length === 0) {
    lines.push(`  No tick logs recorded.`);
  } else {
    p.tickLogs.forEach((t) => {
      const time = `[${t.timestamp}]`;
      const cycle = `TICK #${String(t.cycle).padStart(3, ' ')}`;
      if (t.message) {
        lines.push(`  ${time} ${cycle} | ${stripAnsi(t.message)}`);
      } else {
        const maCross = t.fastMA > t.slowMA ? 'BULL' : 'BEAR';
        const pnlSign = t.pnl >= 0 ? '+' : '';
        lines.push(
          `  ${time} ${cycle} | ${t.symbol.toUpperCase()}: $${t.price.toFixed(2)} | ${maCross} | RSI: ${t.rsi.toFixed(1)} | In: $${t.enteredMoney.toFixed(2)} | Out: $${t.closedMoney.toFixed(2)} | Score: ${t.sessionWin}W/${t.sessionLoss}L | PnL: ${pnlSign}$${t.pnl.toFixed(2)}`
        );
      }
    });
  }

  lines.push('');
  lines.push('='.repeat(width));
  lines.push(`  END OF EXPORT LOG`);
  lines.push('='.repeat(width));

  return lines.join('\n');
}
