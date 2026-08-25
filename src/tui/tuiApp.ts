import { TuiState } from './state/tuiState.js';
import { TuiRenderer } from './tuiRenderer.js';
import { TuiRunner } from './tuiRunner.js';
import { KeyHandler } from './input/keyHandler.js';
import { MouseHandler } from './input/mouseHandler.js';
import { CommandExecutorContext } from './input/commandExecutor.js';
import { Screen, extractMouseEvents } from './utils/index.js';
import { printSessionDebrief } from './utils/sessionDebrief.js';
import { createExecutorContext } from './tuiContextFactory.js';
import { MarketService } from '../core/market/marketService.js';
import { StrategyEngine } from '../core/strategy/strategyEngine.js';
import { RiskManager } from '../core/risk/riskManager.js';
import { ExecutionEngine } from '../core/execution/executionEngine.js';
import { ReplayEngine } from '../core/replay/replayEngine.js';
import { MemoryService } from '../core/memory/memoryService.js';
import { AdaptiveFilter } from '../core/memory/adaptiveFilter.js';
import { SessionTracker } from '../core/bot/sessionTracker.js';

export class TuiApp {
  private state = new TuiState();
  private market = new MarketService();
  private strategy = new StrategyEngine(9, 21, 14, 20);
  private risk = new RiskManager(1000.0);
  private execution = new ExecutionEngine();
  private replay = new ReplayEngine();
  private memory = new MemoryService();
  private adaptiveFilter = new AdaptiveFilter(this.memory);
  private session = new SessionTracker();

  private pollIntervalHandle: NodeJS.Timeout | null = null;
  private resizeListener: (() => void) | null = null;
  private dataListener: ((chunk: string | Buffer) => Promise<void>) | null = null;
  private isRunningTick = false;

  private render = (): void => {
    TuiRenderer.render(this.state);
  };

  private restartPollTimer(): void {
    if (this.pollIntervalHandle) clearInterval(this.pollIntervalHandle);
    this.pollIntervalHandle = setInterval(() => {
      this.runTick();
    }, Math.max(2, this.state.activeConfig.pollSeconds) * 1000);
  }

  private reconfigureEngines(): void {
    const cfg = this.state.activeConfig;
    if (cfg.exchange) {
      this.market.setExchange(cfg.exchange);
    }
    this.strategy = new StrategyEngine(
      cfg.fastPeriod, cfg.slowPeriod, cfg.rsiPeriod,
      cfg.volumePeriod, cfg.rsiMaxEntry, cfg.minVolumeRatio
    );
    this.risk = new RiskManager(
      Math.max(1000.0, cfg.targetAllocation * 2),
      cfg.maxDailyLoss, cfg.maxConsecutiveLosses
    );
    this.restartPollTimer();
  }

  private getExecutorContext(): CommandExecutorContext {
    return createExecutorContext({
      state: this.state,
      render: this.render,
      runTick: () => this.runTick(),
      reconfigureEngines: () => this.reconfigureEngines(),
      getMemory: () => this.memory,
      setMemory: (m: MemoryService) => { this.memory = m; },
      setAdaptiveFilter: (af: AdaptiveFilter) => { this.adaptiveFilter = af; },
      clearPollTimer: () => {
        if (this.pollIntervalHandle) clearInterval(this.pollIntervalHandle);
      },
      restartPollTimer: () => this.restartPollTimer(),
      detachListeners: () => {
        if (this.dataListener) process.stdin.off('data', this.dataListener);
        if (this.resizeListener) process.stdout.off('resize', this.resizeListener);
      },
      reattachListeners: () => {
        if (this.dataListener) process.stdin.on('data', this.dataListener);
        if (this.resizeListener) process.stdout.on('resize', this.resizeListener);
      },
      stop: () => this.stop()
    });
  }

  private async runTick(): Promise<void> {
    if (this.isRunningTick) return;
    this.isRunningTick = true;
    try {
      await TuiRunner.runTradingTick(
        this.state, this.market, this.strategy,
        this.risk, this.replay, this.memory,
        this.adaptiveFilter, this.session, this.render
      );
    } finally {
      this.isRunningTick = false;
    }
  }

  async start(): Promise<void> {
    this.state.isRunning = true;
    this.reconfigureEngines();
    process.stdout.write(Screen.enterAltBuffer + Screen.hideCursor);

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf-8');
    }

    this.dataListener = async (chunk: string | Buffer) => {
      const input = chunk.toString();
      const { events, remainingText } = extractMouseEvents(input);

      for (const ev of events) {
        MouseHandler.handle(ev, this.getExecutorContext());
      }

      if (remainingText) {
        await KeyHandler.handle(remainingText, this.getExecutorContext());
      }
    };
    process.stdin.on('data', this.dataListener);

    this.resizeListener = () => this.render();
    process.stdout.on('resize', this.resizeListener);

    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());

    await TuiRunner.loadInitialData(this.state, this.market, this.memory, this.render);
    await this.runTick();
    this.restartPollTimer();
  }

  stop(): void {
    if (this.pollIntervalHandle) clearInterval(this.pollIntervalHandle);
    if (this.resizeListener) process.stdout.off('resize', this.resizeListener);
    if (this.dataListener) process.stdin.off('data', this.dataListener);

    process.stdout.write(Screen.exitAltBuffer + Screen.showCursor);
    printSessionDebrief(this.state);
    process.exit(0);
  }
}
