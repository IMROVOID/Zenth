import { Candle } from '../types.js';
import { StrategyEngine } from '../strategy/strategyEngine.js';
import { MemoryService } from '../memory/memoryService.js';
import { Logger } from '../logger/index.js';
import { ActivePosition } from './types.js';
import { SessionTracker } from './sessionTracker.js';
import { PositionManager } from './positionManager.js';

export async function monitorLoopPosition(
  cycleCount: number,
  symbol: string,
  candles: Candle[],
  currentPrice: number,
  activeLearningsCount: number,
  stopLossPct: number,
  takeProfitPct: number,
  targetAllocation: number,
  activePosition: ActivePosition,
  strategy: StrategyEngine,
  memory: MemoryService,
  session: SessionTracker,
  exitOnReverseCross = true,
  breakevenTriggerPct = 1.5,
  trailingStopPct = 0
): Promise<ActivePosition | null> {
  const strat = strategy.evaluate(candles);
  const evalResult = PositionManager.evaluatePosition(
    activePosition,
    currentPrice,
    candles,
    strat,
    stopLossPct,
    takeProfitPct,
    exitOnReverseCross,
    breakevenTriggerPct,
    trailingStopPct
  );

  if (evalResult.shouldClose) {
    await PositionManager.closePosition(
      activePosition,
      currentPrice,
      evalResult.exitReason,
      evalResult.outcome,
      evalResult.unrealizedPnL,
      evalResult.pnlPct,
      evalResult.currentVal,
      memory,
      session,
      symbol
    );
    await session.sync(memory, symbol, null, targetAllocation);
    return null;
  }

  if (cycleCount % 10 === 0 || cycleCount === 1) {
    Logger.renderDockedHud({
      symbol,
      currentPrice,
      totalEntries: session.totalEntries,
      activeEntries: 1,
      totalWins: session.sessionWins,
      totalLosses: session.sessionLosses,
      winRate: session.winRate,
      enteredMoney: activePosition.enteredCapital,
      closedMoney: session.totalClosedMoney,
      realizedPnL: session.sessionRealizedPnL,
      realizedPnLPct: session.getRealizedPct(targetAllocation),
      activePositionValue: evalResult.currentVal,
      activePositionPnL: evalResult.unrealizedPnL,
      activePositionPct: evalResult.pnlPct,
      activeRulesCount: activeLearningsCount
    });
  }

  Logger.positionStatus(
    activePosition.symbol,
    activePosition.entryPrice,
    currentPrice,
    activePosition.quantity,
    activePosition.enteredCapital,
    evalResult.currentVal,
    evalResult.unrealizedPnL,
    evalResult.pnlPct,
    activePosition.takeProfitPrice,
    activePosition.stopLossPrice
  );

  await session.sync(
    memory,
    symbol,
    activePosition,
    targetAllocation,
    evalResult.currentVal,
    evalResult.unrealizedPnL,
    evalResult.pnlPct
  );
  return activePosition;
}
