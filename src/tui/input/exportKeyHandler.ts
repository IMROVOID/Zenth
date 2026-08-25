import { ThemeManager, ansi } from '../theme/index.js';
import { CommandExecutorContext } from './commandExecutor.js';
import { EXPORT_OPTIONS } from '../components/exportModal.js';
import { LogExporter } from '../../core/export/index.js';

export async function handleExportKeys(key: string, ctx: CommandExecutorContext): Promise<boolean> {
  const { state } = ctx;

  // 1. Export Format Selection Modal Keys
  if (state.exportModalState.active) {
    if (key === '\u001b') {
      state.exportModalState.active = false;
      ctx.render();
      return true;
    }
    if (key >= '1' && key <= String(EXPORT_OPTIONS.length)) {
      const idx = parseInt(key, 10) - 1;
      const fmt = EXPORT_OPTIONS[idx].format;
      const defaultPath = LogExporter.getDefaultFilename(fmt);
      state.exportModalState.active = false;
      state.exportPromptState = {
        active: true,
        format: fmt,
        inputPath: defaultPath,
        cursorPosition: defaultPath.length
      };
      ctx.render();
      return true;
    }
    if (key === '\u001b[A' || key === 'w' || key === 'k') {
      state.exportModalState.selectedIndex = Math.max(0, state.exportModalState.selectedIndex - 1);
      ctx.render();
      return true;
    }
    if (key === '\u001b[B' || key === 's' || key === 'j') {
      state.exportModalState.selectedIndex = Math.min(EXPORT_OPTIONS.length - 1, state.exportModalState.selectedIndex + 1);
      ctx.render();
      return true;
    }
    if (key === '\r' || key === ' ') {
      const fmt = EXPORT_OPTIONS[state.exportModalState.selectedIndex].format;
      const defaultPath = LogExporter.getDefaultFilename(fmt);
      state.exportModalState.active = false;
      state.exportPromptState = {
        active: true,
        format: fmt,
        inputPath: defaultPath,
        cursorPosition: defaultPath.length
      };
      ctx.render();
      return true;
    }
    return true;
  }

  // 2. Export Path Input CommandBar Keys (Locked Extension with Free Cursor Navigation)
  if (state.exportPromptState.active) {
    const prompt = state.exportPromptState;

    if (key === '\u001b') {
      state.exportPromptState.active = false;
      ctx.render();
      return true;
    }

    if (key === '\u001b[D') {
      prompt.cursorPosition = Math.max(0, prompt.cursorPosition - 1);
      ctx.render();
      return true;
    }

    if (key === '\u001b[C') {
      prompt.cursorPosition = Math.min(prompt.inputPath.length, prompt.cursorPosition + 1);
      ctx.render();
      return true;
    }

    if (key === '\u001b[H' || key === '\u001b[1~' || key === '\u001bOH') {
      prompt.cursorPosition = 0;
      ctx.render();
      return true;
    }

    if (key === '\u001b[F' || key === '\u001b[4~' || key === '\u001bOF') {
      prompt.cursorPosition = prompt.inputPath.length;
      ctx.render();
      return true;
    }

    if (key === '\x7f' || key === '\b') {
      if (prompt.cursorPosition > 0) {
        prompt.inputPath = prompt.inputPath.slice(0, prompt.cursorPosition - 1) + prompt.inputPath.slice(prompt.cursorPosition);
        prompt.cursorPosition--;
        ctx.render();
      }
      return true;
    }

    if (key === '\u001b[3~') {
      if (prompt.cursorPosition < prompt.inputPath.length) {
        prompt.inputPath = prompt.inputPath.slice(0, prompt.cursorPosition) + prompt.inputPath.slice(prompt.cursorPosition + 1);
        ctx.render();
      }
      return true;
    }

    if (key === '\r') {
      const format = prompt.format;
      const inputPath = prompt.inputPath;
      state.exportPromptState.active = false;

      const res = await LogExporter.exportToFile(state.toExportPayload(), format, inputPath);
      const t = ThemeManager.theme;
      const msg = res.success
        ? `${t.badgeSuccess}[EXPORT]${ansi.reset} Exported ${res.tradeCount} trades & ${res.tickCount} ticks to ${res.filePath}`
        : `${t.badgeError}[EXPORT ERROR]${ansi.reset} ${res.error || 'Failed to export log file'}`;

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
        message: msg
      });
      ctx.render();
      return true;
    }

    if (key.length === 1 && key >= ' ' && key <= '~') {
      prompt.inputPath = prompt.inputPath.slice(0, prompt.cursorPosition) + key + prompt.inputPath.slice(prompt.cursorPosition);
      prompt.cursorPosition++;
      ctx.render();
      return true;
    }
    return true;
  }

  return false;
}
