import { TuiState } from './state/tuiState.js';
import { CommandExecutorContext } from './input/commandExecutor.js';
import { ThemeManager, ansi } from './theme/index.js';
import { OnboardingApp } from './onboarding/onboardingApp.js';
import { MemoryService } from '../core/memory/memoryService.js';
import { AdaptiveFilter } from '../core/memory/adaptiveFilter.js';
import { Screen } from './utils/index.js';

export interface TuiContextDeps {
  state: TuiState;
  render: () => void;
  runTick: () => Promise<void>;
  reconfigureEngines: () => void;
  getMemory: () => MemoryService;
  setMemory: (m: MemoryService) => void;
  setAdaptiveFilter: (af: AdaptiveFilter) => void;
  clearPollTimer: () => void;
  restartPollTimer: () => void;
  detachListeners: () => void;
  reattachListeners: () => void;
  stop: () => void;
}

export function createExecutorContext(deps: TuiContextDeps): CommandExecutorContext {
  const { state, render, runTick, reconfigureEngines, getMemory, setMemory, setAdaptiveFilter, clearPollTimer, restartPollTimer, detachListeners, reattachListeners, stop } = deps;

  return {
    state,
    render,
    runTick,
    reconfigureEngines,
    applyDraftConfig: async () => {
      state.activeConfig = { ...state.draftConfig };
      reconfigureEngines();
      state.activeView = 'dashboard';
      await runTick();
    },
    resetDraftConfig: () => {
      state.draftConfig = { ...state.activeConfig };
    },
    executeScan: async () => {
      await runTick();
    },
    executeReplay: async () => {
      state.activeView = 'dashboard';
      await runTick();
    },
    executeReset: async () => {
      await getMemory().resetMemory(state.activeConfig.symbol);
      state.activeRules = [];
      state.ledgerEntries = [];
      render();
    },
    executeResetDb: async () => {
      const res = await getMemory().resetAllDatabase();
      state.activeRules = [];
      state.ledgerEntries = [];
      state.sessionWins = 0;
      state.sessionLosses = 0;
      state.totalEntries = 0;
      state.totalClosedMoney = 0;
      state.sessionRealizedPnL = 0;
      state.tickLogs.push({
        timestamp: new Date().toTimeString().substring(0, 8),
        cycle: state.cycleCount,
        symbol: state.activeConfig.symbol,
        price: state.currentPrice,
        fastMA: state.currentFastMA,
        slowMA: state.currentSlowMA,
        rsi: state.currentRSI,
        enteredMoney: 0,
        closedMoney: 0,
        rulesCount: 0,
        sessionWin: 0,
        sessionLoss: 0,
        pnl: 0,
        message: `${ThemeManager.theme.danger}[DB_RESET] Database wiped: ${res.message}${ansi.reset}`
      });
      render();
    },
    executeOnboard: async () => {
      clearPollTimer();
      detachListeners();

      state.inputBuffer = '';
      state.selectedDropdownIndex = 0;

      try {
        const onboarding = new OnboardingApp();
        const success = await onboarding.run();
        if (success) {
          const p = onboarding.state.data.tradingParams;
          if (p.exchange) state.activeConfig.exchange = p.exchange;
          state.activeConfig.symbol = p.symbol;
          state.activeConfig.interval = p.interval;
          state.activeConfig.targetAllocation = p.maxPositionNotionalCap;
          state.activeConfig.stopLossPct = p.stopLossPct;
          state.activeConfig.takeProfitPct = p.takeProfitPct;
          state.draftConfig = { ...state.activeConfig };
          const newMem = new MemoryService();
          setMemory(newMem);
          setAdaptiveFilter(new AdaptiveFilter(newMem));
          reconfigureEngines();
          await runTick();
        }
      } finally {
        reattachListeners();
        process.stdout.write(Screen.enterAltBuffer + Screen.hideCursor);
        render();
        restartPollTimer();
      }
    },
    quit: () => stop()
  };
}
