import { TuiState } from '../state/tuiState.js';
import { CommandItem } from '../components/commandPalette.js';
import { ThemeManager, ansi } from '../theme/index.js';
import { ActiveView } from '../types.js';
import { DataFormatter, ClipboardService } from '../../core/export/index.js';

export interface CommandExecutorContext {
  state: TuiState;
  render: () => void;
  runTick: () => Promise<void>;
  applyDraftConfig: () => Promise<void>;
  resetDraftConfig: () => void;
  reconfigureEngines?: () => void;
  executeScan: () => Promise<void>;
  executeReplay: () => Promise<void>;
  executeReset: () => Promise<void>;
  executeResetDb: () => Promise<void>;
  executeOnboard?: () => Promise<void>;
  quit: () => void;
}

export class CommandExecutor {
  static async execute(cmd: string, ctx: CommandExecutorContext): Promise<void> {
    const raw = cmd.trim().toLowerCase().replace(/^\//, '');
    const { state } = ctx;

    if (raw === 'pause') {
      state.isTradingPaused = true;
      this.pushTickLog(state, `${ThemeManager.theme.warning}[PAUSE] Autonomous paper trading paused.${ansi.reset}`);
      ctx.render();
      return;
    }

    if (raw === 'resume' || raw === 'start' || raw === 'unpause') {
      state.isTradingPaused = false;
      this.pushTickLog(state, `${ThemeManager.theme.success}[RESUME] Autonomous paper trading resumed.${ansi.reset}`);
      ctx.render();
      return;
    }

    if (raw === 'exchange' || raw.startsWith('exchange ') || raw.startsWith('venue ') || raw === 'venue') {
      const parts = raw.split(' ');
      if (parts.length > 1) {
        const targetEx = parts[1].toLowerCase();
        const validExs = ['binance', 'coinbase', 'okx', 'upbit', 'bitget', 'xt'];
        if (validExs.includes(targetEx)) {
          state.activeConfig.exchange = targetEx as any;
          state.draftConfig.exchange = targetEx as any;
          if (ctx.reconfigureEngines) ctx.reconfigureEngines();
          this.pushTickLog(state, `${ThemeManager.theme.accent}[EXCHANGE] Switched market venue to ${targetEx.toUpperCase()}${ansi.reset}`);
          await ctx.runTick();
          ctx.render();
          return;
        }
      }
      state.activeView = 'config';
      ctx.render();
      return;
    }

    const viewMap: Record<string, ActiveView> = {
      dashboard: 'dashboard', status: 'dashboard', live: 'dashboard',
      coins: 'coins', pairs: 'coins', stocks: 'stocks', shares: 'stocks',
      tradfi: 'stocks', ledger: 'ledger', trades: 'ledger', rules: 'learnings',
      learnings: 'learnings', memory: 'learnings', theme: 'theme',
      config: 'config', settings: 'config', help: 'help'
    };

    if (viewMap[raw]) {
      if (state.activeView === 'theme' && viewMap[raw] !== 'theme') {
        ThemeManager.revert();
      }
      state.activeView = viewMap[raw];
      ctx.render();
      return;
    }

    if (raw === 'copy' || raw === 'clipboard' || raw === 'cp') {
      const payload = state.toExportPayload();
      const text = DataFormatter.toPlainText(payload);
      const ok = await ClipboardService.copy(text);
      const t = ThemeManager.theme;
      const msg = ok
        ? `${t.badgeSuccess}[COPY]${ansi.reset} Copied ${payload.ledgerEntries.length} trades & ${payload.tickLogs.length} ticks.`
        : `${t.badgeWarning}[COPY]${ansi.reset} Failed to access system clipboard.`;
      this.pushTickLog(state, msg);
      ctx.render();
      return;
    }

    if (raw === 'export' || raw === 'save' || raw === 'dump') {
      state.exportModalState.active = true;
      state.exportModalState.selectedIndex = 0;
      ctx.render();
      return;
    }

    if (raw === 'scan') { await ctx.executeScan(); return; }
    if (raw === 'replay') { await ctx.executeReplay(); return; }
    if (raw === 'reset') { await ctx.executeReset(); return; }
    if (raw === 'resetdb' || raw === 'wipe' || raw === 'wipedb') { await ctx.executeResetDb(); return; }
    if (raw === 'onboard' || raw === 'setup') {
      if (ctx.executeOnboard) await ctx.executeOnboard();
      return;
    }
    if (raw === 'quit' || raw === 'exit' || raw === 'q') { ctx.quit(); return; }
  }

  private static pushTickLog(state: TuiState, message: string): void {
    state.tickLogs.push({
      timestamp: new Date().toTimeString().substring(0, 8),
      cycle: state.cycleCount,
      symbol: state.activeConfig.symbol,
      price: state.currentPrice,
      fastMA: state.currentFastMA,
      slowMA: state.currentSlowMA,
      rsi: state.currentRSI,
      enteredMoney: state.activePosition ? state.activePosition.enteredCapital : 0,
      closedMoney: state.totalClosedMoney,
      rulesCount: state.activeRules.length,
      sessionWin: state.sessionWins,
      sessionLoss: state.sessionLosses,
      pnl: state.sessionRealizedPnL,
      message
    });
  }

  static async executeSearchItem(item: CommandItem, ctx: CommandExecutorContext): Promise<void> {
    const { state } = ctx;
    if (item.actionType === 'view' && item.payload) {
      state.activeView = item.payload as ActiveView;
    } else if (item.actionType === 'set_symbol' && item.payload) {
      state.draftConfig.symbol = item.payload;
      state.activeConfig.symbol = item.payload;
      state.activeView = 'dashboard';
      await ctx.runTick();
    } else if (item.actionType === 'set_theme' && item.payload) {
      ThemeManager.apply(item.payload);
      state.activeView = 'dashboard';
    } else if (item.actionType === 'command' && item.payload) {
      await this.execute(item.payload, ctx);
    }
    ctx.render();
  }
}
