import { ExportDataPayload } from '../types.js';
import { stripAnsi } from './utils.js';

export function formatMarkdown(p: ExportDataPayload): string {
  const lines: string[] = [];

  lines.push(`# Zenth Trading Bot - Export Report`);
  lines.push(`> **Session ID:** \`${p.sessionId}\`  `);
  lines.push(`> **Exported:** \`${p.exportedAt}\`  `);
  lines.push(`> **Status:** \`${p.isTradingPaused ? 'PAUSED' : 'ACTIVE / LIVE'}\`  `);
  lines.push('');

  lines.push(`## Session Summary`);
  lines.push(`| Metric | Value |`);
  lines.push(`| :--- | :--- |`);
  lines.push(`| **Active Symbol** | \`${p.activeSymbol.toUpperCase()}\` |`);
  lines.push(`| **Current Price** | $${p.currentPrice.toFixed(2)} |`);
  lines.push(`| **Total Cycles** | ${p.cycleCount} |`);
  lines.push(`| **Total Position Entries** | ${p.totalEntries} |`);
  lines.push(`| **Win / Loss Record** | ${p.sessionWins}W / ${p.sessionLosses}L |`);
  lines.push(`| **Win Rate** | ${p.winRate.toFixed(1)}% |`);
  lines.push(`| **Realized PnL** | $${p.sessionRealizedPnL.toFixed(2)} |`);
  lines.push(`| **Closed Capital** | $${p.totalClosedMoney.toFixed(2)} |`);
  lines.push('');

  lines.push(`## Configuration & Strategy`);
  lines.push(`| Parameter | Value | Description |`);
  lines.push(`| :--- | :--- | :--- |`);
  lines.push(`| **Target Allocation** | $${p.config.targetAllocation} | Position size per trade |`);
  lines.push(`| **Timeframe** | ${p.config.interval} | Candle interval |`);
  lines.push(`| **Fast / Slow MA** | ${p.config.fastPeriod} / ${p.config.slowPeriod} | Moving average periods |`);
  lines.push(`| **RSI Period / Max** | ${p.config.rsiPeriod} / ${p.config.rsiMaxEntry} | RSI filter limits |`);
  lines.push(`| **Stop Loss / Take Profit** | ${p.config.stopLossPct}% / ${p.config.takeProfitPct}% | Risk limits |`);
  lines.push(`| **Adaptive Filter Mode** | ${p.config.filterMode} | Adaptive learning state |`);
  lines.push('');

  if (p.activeRules.length > 0) {
    lines.push(`## Active Self-Learned Rules`);
    lines.push(`| # | Pattern Condition | Loss Reason | Triggers | Rule Description |`);
    lines.push(`| :- | :--- | :--- | :- | :--- |`);
    p.activeRules.forEach((r, idx) => {
      lines.push(`| ${idx + 1} | \`${r.pattern_condition}\` | ${r.loss_reason} | ${r.trigger_count || 0} | ${r.trading_rule} |`);
    });
    lines.push('');
  }

  lines.push(`## Trade Ledger Records (${p.ledgerEntries.length})`);
  if (p.ledgerEntries.length === 0) {
    lines.push(`*No trade records logged in ledger.*`);
  } else {
    lines.push(`| # | Time (UTC) | Action | Price ($) | Qty | Outcome | PnL ($) | Reason |`);
    lines.push(`| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |`);
    p.ledgerEntries.forEach((e, idx) => {
      const time = (e.timestamp || '').replace('T', ' ').substring(0, 19);
      const pnl = `${e.pnl >= 0 ? '+' : ''}$${e.pnl.toFixed(2)}`;
      lines.push(`| ${idx + 1} | ${time} | **${e.action}** | $${e.price.toFixed(2)} | ${e.quantity} | \`${e.outcome}\` | ${pnl} | ${stripAnsi(e.reason || '')} |`);
    });
  }
  lines.push('');

  lines.push(`## Tick Log Stream (${p.tickLogs.length})`);
  if (p.tickLogs.length === 0) {
    lines.push(`*No tick logs recorded.*`);
  } else {
    lines.push('```text');
    p.tickLogs.forEach((t) => {
      const time = `[${t.timestamp}]`;
      const cycle = `TICK #${String(t.cycle).padStart(3, ' ')}`;
      if (t.message) {
        lines.push(`${time} ${cycle} | ${stripAnsi(t.message)}`);
      } else {
        const maCross = t.fastMA > t.slowMA ? 'BULL' : 'BEAR';
        const pnlSign = t.pnl >= 0 ? '+' : '';
        lines.push(
          `${time} ${cycle} | ${t.symbol.toUpperCase()}: $${t.price.toFixed(2)} | ${maCross} | RSI: ${t.rsi.toFixed(1)} | In: $${t.enteredMoney.toFixed(2)} | Out: $${t.closedMoney.toFixed(2)} | Score: ${t.sessionWin}W/${t.sessionLoss}L | PnL: ${pnlSign}$${t.pnl.toFixed(2)}`
        );
      }
    });
    lines.push('```');
  }
  lines.push('');

  return lines.join('\n');
}
