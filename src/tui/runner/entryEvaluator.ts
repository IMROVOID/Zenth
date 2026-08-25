import { StrategyResult } from '../../core/types.js';
import { TuiState } from '../state/tuiState.js';
import { RiskManager } from '../../core/risk/riskManager.js';
import { ReplayEngine } from '../../core/replay/replayEngine.js';
import { MemoryService } from '../../core/memory/memoryService.js';
import { AdaptiveFilter } from '../../core/memory/adaptiveFilter.js';
import { ThemeManager, ansi } from '../theme/index.js';

export async function evaluateNewEntry(
  state: TuiState,
  stratResult: StrategyResult,
  risk: RiskManager,
  replay: ReplayEngine,
  memory: MemoryService,
  adaptiveFilter: AdaptiveFilter
): Promise<void> {
  if (state.activePosition) return;

  const t = ThemeManager.theme;
  const sym = state.activeConfig.symbol;
  const pattern = replay.classifyPattern(stratResult.indicators);

  if (stratResult.signal === 'BUY') {
    const qty = parseFloat((state.activeConfig.targetAllocation / state.currentPrice).toFixed(6));
    const riskResult = risk.evaluate(
      'BUY',
      state.currentPrice,
      qty,
      state.sessionRealizedPnL,
      state.consecutiveLosses
    );

    if (riskResult.approved) {
      const filterResult = await adaptiveFilter.evaluate(
        sym,
        pattern,
        {
          fastMA: stratResult.indicators.fastMA,
          slowMA: stratResult.indicators.slowMA,
          rsi: stratResult.indicators.rsi,
          volumeRatio: stratResult.indicators.volume / (stratResult.indicators.volumeSMA || 1)
        },
        state.activeConfig.filterMode
      );

      if (filterResult.shouldSkip) {
        await memory.logTrade({
          timestamp: new Date().toISOString(),
          symbol: sym,
          action: 'SKIP',
          price: state.currentPrice,
          quantity: qty,
          notional_value: 0,
          entry_value: 0,
          exit_value: 0,
          pnl_percentage: 0,
          session_id: state.sessionId,
          reason: filterResult.reason || 'Blocked by Adaptive Memory Rule',
          mode: 'PAPER',
          outcome: 'SKIPPED',
          pnl: 0
        });

        const skipBadge = `${t.badgeSkip} SKIP ${ansi.reset}`;
        const patStr = `${t.boldText}[${pattern}]${ansi.reset}`;
        const ruleStr = `${t.dimText}via Memory Rule: "${ansi.reset}${t.warning}${filterResult.matchedRule?.trading_rule || 'Adaptive Rule'}${ansi.reset}${t.dimText}"${ansi.reset}`;

        state.tickLogs.push({
          timestamp: new Date().toTimeString().substring(0, 8),
          cycle: state.cycleCount,
          symbol: sym,
          price: state.currentPrice,
          fastMA: state.currentFastMA,
          slowMA: state.currentSlowMA,
          rsi: state.currentRSI,
          enteredMoney: 0,
          closedMoney: state.totalClosedMoney,
          rulesCount: state.activeRules.length,
          sessionWin: state.sessionWins,
          sessionLoss: state.sessionLosses,
          pnl: state.sessionRealizedPnL,
          message: `${skipBadge} ${patStr} ${ruleStr}`
        });
      } else {
        const slPrice = state.currentPrice * (1 - state.activeConfig.stopLossPct / 100);
        const tpPrice = state.currentPrice * (1 + state.activeConfig.takeProfitPct / 100);
        const enteredCap = state.currentPrice * qty;

        state.totalEntries++;
        state.activePosition = {
          id: `POS-${Date.now()}`,
          symbol: sym,
          entryPrice: state.currentPrice,
          quantity: qty,
          enteredCapital: enteredCap,
          entryTime: new Date().toISOString(),
          stopLossPrice: slPrice,
          takeProfitPrice: tpPrice,
          patternCondition: pattern,
          indicatorsAtEntry: stratResult.indicators
        };

        await memory.logTrade({
          timestamp: new Date().toISOString(),
          symbol: sym,
          action: 'BUY',
          price: state.currentPrice,
          quantity: qty,
          notional_value: enteredCap,
          entry_value: enteredCap,
          exit_value: 0,
          pnl_percentage: 0,
          session_id: state.sessionId,
          reason: `Entered on 9/21 MA crossover: ${stratResult.reason}`,
          mode: 'PAPER',
          outcome: 'PENDING',
          pnl: 0
        });

        const buyBadge = `${t.badgeBuy} BUY ${ansi.reset}`;
        const qtySym = `${t.boldText}${qty} ${sym.toUpperCase()}${ansi.reset}`;
        const atPrice = `${t.dimText}@${ansi.reset} ${t.accentSecondary}$${state.currentPrice.toFixed(2)}${ansi.reset}`;
        const slStr = `${t.dimText}SL:${ansi.reset} ${t.danger}$${slPrice.toFixed(2)}${ansi.reset}`;
        const tpStr = `${t.dimText}TP:${ansi.reset} ${t.success}$${tpPrice.toFixed(2)}${ansi.reset}`;
        const limits = `(${slStr}, ${tpStr})`;

        state.tickLogs.push({
          timestamp: new Date().toTimeString().substring(0, 8),
          cycle: state.cycleCount,
          symbol: sym,
          price: state.currentPrice,
          fastMA: state.currentFastMA,
          slowMA: state.currentSlowMA,
          rsi: state.currentRSI,
          enteredMoney: enteredCap,
          closedMoney: state.totalClosedMoney,
          rulesCount: state.activeRules.length,
          sessionWin: state.sessionWins,
          sessionLoss: state.sessionLosses,
          pnl: state.sessionRealizedPnL,
          message: `${buyBadge} ${qtySym} ${atPrice} ${limits}`
        });
      }
    } else {
      const riskBadge = `${t.badgeRisk} RISK ${ansi.reset}`;
      const reasonStr = `${t.danger}Rejected:${ansi.reset} ${t.boldText}${riskResult.reason}${ansi.reset}`;

      state.tickLogs.push({
        timestamp: new Date().toTimeString().substring(0, 8),
        cycle: state.cycleCount,
        symbol: sym,
        price: state.currentPrice,
        fastMA: state.currentFastMA,
        slowMA: state.currentSlowMA,
        rsi: state.currentRSI,
        enteredMoney: 0,
        closedMoney: state.totalClosedMoney,
        rulesCount: state.activeRules.length,
        sessionWin: state.sessionWins,
        sessionLoss: state.sessionLosses,
        pnl: state.sessionRealizedPnL,
        message: `${riskBadge} ${reasonStr}`
      });
    }
  }
}
