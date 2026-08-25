import { MarketService } from '../market/marketService.js';
import { StrategyEngine } from '../strategy/strategyEngine.js';
import { RiskManager } from '../risk/riskManager.js';
import { ExecutionEngine } from '../execution/executionEngine.js';
import { ReplayEngine } from '../replay/replayEngine.js';
import { MemoryService } from '../memory/memoryService.js';
import { AdaptiveFilter } from '../memory/adaptiveFilter.js';
import { SessionTracker } from './sessionTracker.js';
import { Scanner } from './scanner.js';
import { ContinuousLoopRunner } from './continuousLoop.js';
import { ScanResult } from './types.js';
import { Logger } from '../logger/index.js';
import { runBotReplayRaw, runBotReplayMemory } from './replayRunner.js';

export class TradingBot {
  private market: MarketService;
  private strategy: StrategyEngine;
  private risk: RiskManager;
  private execution: ExecutionEngine;
  private replay: ReplayEngine;
  private memory: MemoryService;
  private adaptiveFilter: AdaptiveFilter;
  private session: SessionTracker;

  constructor(exchangeId?: string) {
    this.market = new MarketService(exchangeId);
    this.strategy = new StrategyEngine(9, 21, 14, 20);
    this.risk = new RiskManager(1000.0);
    this.execution = new ExecutionEngine();
    this.replay = new ReplayEngine();
    this.memory = new MemoryService();
    this.adaptiveFilter = new AdaptiveFilter(this.memory);
    this.session = new SessionTracker();
  }

  setExchange(exchangeId: string): void {
    this.market.setExchange(exchangeId);
  }

  async scan(symbol = 'btc_usdt', interval = '5m', requestedQuantity = 0.01): Promise<ScanResult> {
    return Scanner.executeScan(
      symbol,
      interval,
      requestedQuantity,
      this.market,
      this.strategy,
      this.risk,
      this.execution,
      this.replay,
      this.memory,
      this.adaptiveFilter,
      this.session.sessionId
    );
  }

  async replayRaw(symbol = 'btc_usdt', interval = '5m', limit = 300): Promise<void> {
    return runBotReplayRaw(
      symbol,
      interval,
      limit,
      this.market,
      this.replay,
      this.memory,
      this.session.sessionId
    );
  }

  async replayMemory(symbol = 'btc_usdt', interval = '5m', limit = 300): Promise<void> {
    return runBotReplayMemory(
      symbol,
      interval,
      limit,
      this.market,
      this.replay,
      this.memory,
      this.session.sessionId,
      () => this.replayRaw(symbol, interval, limit)
    );
  }

  async startContinuousLoop(symbol = 'btc_usdt', interval = '5m', pollSeconds = 15): Promise<void> {
    return ContinuousLoopRunner.start(
      symbol,
      interval,
      pollSeconds,
      this.market,
      this.strategy,
      this.risk,
      this.replay,
      this.memory,
      this.adaptiveFilter,
      this.session
    );
  }

  async memoryReset(symbol?: string): Promise<void> {
    Logger.banner(`RESETTING SUPABASE MEMORY`, `Clearing trade_ledger, session_metrics and adaptive_learnings records`);
    await this.memory.resetMemory(symbol);
    Logger.success(`Memory reset complete. Cleared Supabase records.`);
  }
}
