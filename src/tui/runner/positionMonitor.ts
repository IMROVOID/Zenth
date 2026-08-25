import { Candle, StrategyResult } from '../../core/types.js';
import { TuiState } from '../state/tuiState.js';
import { MemoryService } from '../../core/memory/memoryService.js';
import { SessionTracker } from '../../core/bot/sessionTracker.js';
import { PositionManager } from '../../core/bot/positionManager.js';
import { ThemeManager, ansi } from '../theme/index.js';

export async function monitorActivePosition(
  state: TuiState,
  candles: Candle[],
  stratResult: StrategyResult,
  memory: MemoryService,
  session: SessionTracker
): Promise<void> {
  if (!state.activePosition) return;

  const t = ThemeManager.theme;
  const sym = state.activeConfig.symbol;
  if (state.activePosition.symbol.toLowerCase() !== sym.toLowerCase()) {
    return;
  }

  const evalResult = PositionManager.evaluatePosition(
    state.activePosition,
    state.currentPrice,
    candles,
    stratResult,
    state.activeConfig.stopLossPct,
    state.activeConfig.takeProfitPct,
    state.activeConfig.exitOnReverseCross,
    state.activeConfig.breakevenTriggerPct,
    state.activeConfig.trailingStopPct
  );

  if (evalResult.shouldClose) {
    await PositionManager.closePosition(
      state.activePosition,
      state.currentPrice,
      evalResult.exitReason,
      evalResult.outcome,
      evalResult.unrealizedPnL,
      evalResult.pnlPct,
      evalResult.currentVal,
      memory,
      session,
      sym,
      state.activeConfig.autoLearn
    );

    if (evalResult.outcome === 'WIN') {
      state.sessionWins++;
      state.consecutiveLosses = 0;
    } else if (evalResult.outcome === 'LOSS') {
      state.sessionLosses++;
      state.consecutiveLosses++;
    }

    state.totalClosedMoney += evalResult.currentVal;
    state.sessionRealizedPnL += evalResult.unrealizedPnL;
    state.activePosition = null;

    const outcomeBadge = evalResult.outcome === 'WIN'
      ? `${t.badgeSuccess} WIN ${ansi.reset}`
      : evalResult.outcome === 'LOSS'
      ? `${t.badgeSell} LOSS ${ansi.reset}`
      : `${t.badgeHold} BE ${ansi.reset}`;
    const symText = `${t.boldText}${sym.toUpperCase()}${ansi.reset}`;
    const priceText = `${t.dimText}Closed @${ansi.reset} ${t.accentSecondary}$${state.currentPrice.toFixed(2)}${ansi.reset}`;
    const pnlSign = evalResult.unrealizedPnL >= 0 ? '+' : '';
    const pnlColor = evalResult.outcome === 'WIN' ? t.success : t.danger;
    const pnlText = `(${pnlColor}${pnlSign}$${evalResult.unrealizedPnL.toFixed(2)} / ${pnlSign}${evalResult.pnlPct.toFixed(2)}%${ansi.reset})`;
    const reasonText = `${t.dimText}[${evalResult.exitReason}]${ansi.reset}`;

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
      message: `${outcomeBadge} ${symText} ${priceText} ${pnlText} ${reasonText}`
    });

    await session.sync(memory, sym, null, state.activeConfig.targetAllocation);
  } else {
    await session.sync(
      memory,
      sym,
      state.activePosition,
      state.activeConfig.targetAllocation,
      evalResult.currentVal,
      evalResult.unrealizedPnL,
      evalResult.pnlPct
    );
  }
}
