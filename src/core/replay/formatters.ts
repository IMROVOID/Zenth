import { ReplayTrade, ReplaySummary, AdaptiveLearning } from '../types.js';
import { SkippedSetup } from './types.js';
import { c } from '../logger/ansiColors.js';

export function formatRawReplayOutput(
  trades: ReplayTrade[],
  summary: ReplaySummary,
  title = 'RAW BASELINE REPLAY (NO MEMORY)'
): string {
  const lines: string[] = [];
  const width = 84;
  lines.push(`\n${c.cyan}┌${'─'.repeat(width)}┐${c.reset}`);
  lines.push(`${c.cyan}│${c.reset}  ${c.bold}${c.brightWhite}${title.padEnd(width - 2)}${c.reset}${c.cyan}│${c.reset}`);
  lines.push(`${c.cyan}│${c.reset}  ${c.dim}Symbol: ${summary.symbol.toUpperCase()} | Timeframe: ${summary.timeframe} | Evaluated Candles: ${summary.totalCandles}`.padEnd(width + 7) + `${c.cyan}│${c.reset}`);
  lines.push(`${c.cyan}└${'─'.repeat(width)}┘${c.reset}\n`);

  if (trades.length === 0) {
    lines.push(`  ${c.yellow}No completed crossover trade setups found in current lookback window.${c.reset}\n`);
    return lines.join('\n');
  }

  lines.push(`  ${c.bold}#  │ Entry Time    │ Entry $   │ Exit $    │ Outcome │ PnL ($)  │ PnL (%) │ Pattern Setup${c.reset}`);
  lines.push(`  ───┼───────────────┼───────────┼───────────┼─────────┼──────────┼─────────┼─────────────────────────────`);

  trades.forEach((t, idx) => {
    const num = String(idx + 1).padStart(2, ' ');
    const entryT = t.entryTime.substring(5, 16);
    const enP = `$${t.entryPrice.toFixed(2)}`.padEnd(9, ' ');
    const exP = `$${t.exitPrice.toFixed(2)}`.padEnd(9, ' ');
    const outcomeStr = t.outcome === 'WIN' ? `${c.bgGreen}${c.bold} WIN  ${c.reset}` : t.outcome === 'LOSS' ? `${c.bgRed}${c.bold} LOSS ${c.reset}` : `${c.bgDarkGray} FLAT ${c.reset}`;
    const pnlSign = t.pnl >= 0 ? '+' : '';
    const pnlColor = t.pnl > 0 ? c.green : t.pnl < 0 ? c.red : c.gray;
    const pnlStr = `${pnlColor}${pnlSign}$${t.pnl.toFixed(2)}${c.reset}`.padEnd(17, ' ');
    const pnlPctStr = `${pnlColor}${pnlSign}${t.pnlPct.toFixed(2)}%${c.reset}`.padEnd(16, ' ');
    const pattern = `${c.magenta}${t.patternCondition.padEnd(27, ' ')}${c.reset}`;

    lines.push(`  ${num} │ ${entryT} │ ${enP} │ ${exP} │ ${outcomeStr} │ ${pnlStr}│ ${pnlPctStr}│ ${pattern}`);
  });

  lines.push(`  ───┴───────────────┴───────────┴───────────┴─────────┴──────────┴─────────┴─────────────────────────────`);

  const pnlSign = summary.totalPnL >= 0 ? '+' : '';
  const pnlColor = summary.totalPnL >= 0 ? c.brightGreen : c.brightRed;

  lines.push(`\n${c.bold}${c.cyan}SUMMARY METRICS:${c.reset}`);
  lines.push(`  • Total Setups Executed : ${c.bold}${summary.totalSetups}${c.reset}`);
  lines.push(`  • Wins / Losses         : ${c.green}${summary.wins} Wins${c.reset} / ${c.red}${summary.losses} Losses${c.reset}`);
  lines.push(`  • Win Rate              : ${c.bold}${summary.winRate.toFixed(1)}%${c.reset}`);
  lines.push(`  • Total Net PnL         : ${pnlColor}${c.bold}${pnlSign}$${summary.totalPnL.toFixed(2)} USDT${c.reset}`);
  lines.push(`  • Average PnL per Trade : ${pnlColor}${pnlSign}$${summary.averagePnL.toFixed(2)} USDT${c.reset}`);
  lines.push(`  • Best / Worst Trade    : ${c.green}+$${summary.bestTrade.toFixed(2)}${c.reset} / ${c.red}$${summary.worstTrade.toFixed(2)}${c.reset}`);
  lines.push(`  • Profit Factor         : ${c.bold}${summary.profitFactor.toFixed(2)}${c.reset}`);
  lines.push(`  • Max Drawdown (est.)   : ${c.yellow}${summary.maxDrawdownPct.toFixed(2)}%${c.reset}\n`);

  return lines.join('\n');
}

export function formatComparisonOutput(
  raw: ReplaySummary,
  mem: ReplaySummary,
  skipped: SkippedSetup[],
  activeRules: AdaptiveLearning[]
): string {
  const lines: string[] = [];
  const width = 84;
  lines.push(`\n${c.cyan}┌${'─'.repeat(width)}┐${c.reset}`);
  lines.push(`${c.cyan}│${c.reset}  ${c.bold}${c.brightWhite}RAW BASELINE vs. ADAPTIVE MEMORY COMPARISON${c.reset}${' '.repeat(41)}${c.cyan}│${c.reset}`);
  lines.push(`${c.cyan}│${c.reset}  ${c.dim}Symbol: ${raw.symbol.toUpperCase()} | Timeframe: ${raw.timeframe} | Historical Candles: ${raw.totalCandles}`.padEnd(width + 7) + `${c.cyan}│${c.reset}`);
  lines.push(`${c.cyan}└${'─'.repeat(width)}┘${c.reset}\n`);

  lines.push(`${c.bold}${c.magenta}ACTIVE SUPABASE LEARNING RULES APPLIED (${activeRules.length}):${c.reset}`);
  if (activeRules.length === 0) {
    lines.push(`  ${c.gray}(None active yet — run replay:raw to seed initial historical learnings)${c.reset}\n`);
  } else {
    activeRules.forEach((r, idx) => {
      lines.push(`  ${c.cyan}${idx + 1}.${c.reset} [${c.magenta}${r.pattern_condition}${c.reset}] → "${c.white}${r.trading_rule}${c.reset}" (Triggered: ${c.yellow}${r.trigger_count || 0}${c.reset} times)`);
    });
    lines.push('');
  }

  if (skipped.length > 0) {
    lines.push(`${c.bold}${c.yellow}TRADES FILTERED OUT BY ADAPTIVE MEMORY (${skipped.length}):${c.reset}`);
    skipped.forEach((s, idx) => {
      lines.push(`  ${c.yellow}${idx + 1}.${c.reset} ${s.time} @ $${s.price.toFixed(2)} │ Setup: ${c.magenta}${s.patternCondition}${c.reset}`);
      lines.push(`     ↳ ${c.gray}${s.reason}${c.reset}`);
    });
    lines.push('');
  }

  lines.push(`${c.bold}${c.cyan}SIDE-BY-SIDE PERFORMANCE COMPARISON:${c.reset}`);
  lines.push(`  ┌────────────────────────────┬──────────────────────────┬──────────────────────────┐`);
  lines.push(`  │ Metric                     │ Raw Baseline (No Memory) │ Memory-Enabled (Adaptive)│`);
  lines.push(`  ├────────────────────────────┼──────────────────────────┼──────────────────────────┤`);

  const pnlDiff = mem.totalPnL - raw.totalPnL;
  const wrDiff = mem.winRate - raw.winRate;

  lines.push(`  │ Total Trades Executed      │ ${String(raw.totalSetups).padEnd(24, ' ')} │ ${String(mem.totalSetups).padEnd(24, ' ')}│`);
  lines.push(`  │ Wins / Losses              │ ${`${raw.wins}W / ${raw.losses}L`.padEnd(24, ' ')} │ ${`${mem.wins}W / ${mem.losses}L`.padEnd(24, ' ')}│`);
  lines.push(`  │ Win Rate                   │ ${`${raw.winRate.toFixed(1)}%`.padEnd(24, ' ')} │ ${c.brightGreen}${`${mem.winRate.toFixed(1)}% (${wrDiff >= 0 ? '+' : ''}${wrDiff.toFixed(1)}%)`.padEnd(24, ' ')}${c.reset}│`);
  lines.push(`  │ Total Net PnL              │ ${`${raw.totalPnL >= 0 ? '+' : ''}$${raw.totalPnL.toFixed(2)}`.padEnd(24, ' ')} │ ${c.brightGreen}${`${mem.totalPnL >= 0 ? '+' : ''}$${mem.totalPnL.toFixed(2)} (${pnlDiff >= 0 ? '+' : ''}$${pnlDiff.toFixed(2)})`.padEnd(24, ' ')}${c.reset}│`);
  lines.push(`  │ Average PnL per Trade      │ ${`${raw.averagePnL >= 0 ? '+' : ''}$${raw.averagePnL.toFixed(2)}`.padEnd(24, ' ')} │ ${`${mem.averagePnL >= 0 ? '+' : ''}$${mem.averagePnL.toFixed(2)}`.padEnd(24, ' ')}│`);
  lines.push(`  │ Profit Factor              │ ${String(raw.profitFactor.toFixed(2)).padEnd(24, ' ')} │ ${String(mem.profitFactor.toFixed(2)).padEnd(24, ' ')}│`);
  lines.push(`  │ Max Drawdown               │ ${`${raw.maxDrawdownPct.toFixed(2)}%`.padEnd(24, ' ')} │ ${`${mem.maxDrawdownPct.toFixed(2)}%`.padEnd(24, ' ')}│`);
  lines.push(`  └────────────────────────────┴──────────────────────────┴──────────────────────────┘\n`);

  return lines.join('\n');
}
