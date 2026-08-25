import { TuiState } from './state/tuiState.js';
import { MarketService } from '../core/market/marketService.js';
import { StrategyEngine } from '../core/strategy/strategyEngine.js';
import { RiskManager } from '../core/risk/riskManager.js';
import { ReplayEngine } from '../core/replay/replayEngine.js';
import { MemoryService } from '../core/memory/memoryService.js';
import { AdaptiveFilter } from '../core/memory/adaptiveFilter.js';
import { SessionTracker } from '../core/bot/sessionTracker.js';
import { loadInitialTuiData } from './runner/initialLoader.js';
import { monitorActivePosition } from './runner/positionMonitor.js';
import { evaluateNewEntry } from './runner/entryEvaluator.js';

export class TuiRunner {
  static async loadInitialData(
    state: TuiState,
    market: MarketService,
    memory: MemoryService,
    render: () => void
  ): Promise<void> {
    return loadInitialTuiData(state, market, memory, render);
  }

  static async runTradingTick(
    state: TuiState,
    market: MarketService,
    strategy: StrategyEngine,
    risk: RiskManager,
    replay: ReplayEngine,
    memory: MemoryService,
    adaptiveFilter: AdaptiveFilter,
    session: SessionTracker,
    render: () => void
  ): Promise<void> {
    if (state.isTradingPaused) {
      render();
      return;
    }

    state.cycleCount++;
    const sym = state.activeConfig.symbol;
    const interval = state.activeConfig.interval;

    try {
      const candles = await market.fetchKlines(sym, interval, 300);
      const currentCandle = candles[candles.length - 1];
      state.currentPrice = currentCandle.close;

      const stratResult = strategy.evaluate(candles);
      state.currentFastMA = stratResult.fastMA;
      state.currentSlowMA = stratResult.slowMA;
      state.currentRSI = stratResult.rsi;

      if (state.activePosition) {
        await monitorActivePosition(state, candles, stratResult, memory, session);
      } else {
        await evaluateNewEntry(state, stratResult, risk, replay, memory, adaptiveFilter);
      }

      state.tickLogs.push({
        timestamp: new Date().toTimeString().substring(0, 8),
        cycle: state.cycleCount,
        symbol: sym,
        price: state.currentPrice,
        fastMA: state.currentFastMA,
        slowMA: state.currentSlowMA,
        rsi: state.currentRSI,
        enteredMoney: state.activePosition ? state.activePosition.enteredCapital : 0,
        closedMoney: state.totalClosedMoney,
        rulesCount: state.activeRules.length,
        sessionWin: state.sessionWins,
        sessionLoss: state.sessionLosses,
        pnl: state.sessionRealizedPnL
      });

      if (state.tickLogs.length > 200) {
        state.tickLogs = state.tickLogs.slice(-200);
      }
    } catch {
      // resilient tick
    }

    render();
  }
}
