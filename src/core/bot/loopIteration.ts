import { MarketService } from '../market/marketService.js';
import { StrategyEngine } from '../strategy/strategyEngine.js';
import { RiskManager } from '../risk/riskManager.js';
import { ReplayEngine } from '../replay/replayEngine.js';
import { MemoryService } from '../memory/memoryService.js';
import { AdaptiveFilter } from '../memory/adaptiveFilter.js';
import { ActivePosition } from './types.js';
import { SessionTracker } from './sessionTracker.js';
import { monitorLoopPosition } from './loopPositionMonitor.js';
import { evaluateLoopEntry } from './loopEntryEvaluator.js';

export async function executeLoopIteration(
  cycleCount: number,
  symbol: string,
  interval: string,
  stopLossPct: number,
  takeProfitPct: number,
  targetAllocation: number,
  activePosition: ActivePosition | null,
  market: MarketService,
  strategy: StrategyEngine,
  risk: RiskManager,
  replay: ReplayEngine,
  memory: MemoryService,
  adaptiveFilter: AdaptiveFilter,
  session: SessionTracker
): Promise<ActivePosition | null> {
  const candles = await market.fetchKlines(symbol, interval, 300);
  const currentCandle = candles[candles.length - 1];
  const currentPrice = currentCandle.close;
  const activeLearnings = await memory.getActiveLearnings(symbol);

  if (activePosition) {
    return monitorLoopPosition(
      cycleCount,
      symbol,
      candles,
      currentPrice,
      activeLearnings.length,
      stopLossPct,
      takeProfitPct,
      targetAllocation,
      activePosition,
      strategy,
      memory,
      session
    );
  } else {
    return evaluateLoopEntry(
      cycleCount,
      symbol,
      candles,
      currentPrice,
      activeLearnings.length,
      stopLossPct,
      takeProfitPct,
      targetAllocation,
      strategy,
      risk,
      replay,
      memory,
      adaptiveFilter,
      session
    );
  }
}
