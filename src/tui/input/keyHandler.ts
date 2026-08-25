import { CommandPalette } from '../components/commandPalette.js';
import { ThemeManager } from '../theme/index.js';
import { CommandExecutor, CommandExecutorContext } from './commandExecutor.js';
import { handleViewNavigationKeys } from './viewKeyNav.js';
import { handleExportKeys } from './exportKeyHandler.js';

export class KeyHandler {
  static async handle(key: string, ctx: CommandExecutorContext): Promise<void> {
    const { state } = ctx;

    // 0. Ctrl+C or /quit
    if (key === '\u0003') {
      ctx.quit();
      return;
    }

    // 1. Export Modal & Prompt Interception
    const handledExport = await handleExportKeys(key, ctx);
    if (handledExport) return;

    // 2. View-specific Navigation when input buffer is empty (includes theme, config modal, etc.)
    if (!state.inputBuffer) {
      const handled = await handleViewNavigationKeys(key, ctx);
      if (handled) return;
    }

    // 3. Spacebar shortcut to pause/resume on Dashboard
    if (key === ' ' && !state.inputBuffer && state.activeView === 'dashboard') {
      await CommandExecutor.execute(state.isTradingPaused ? 'resume' : 'pause', ctx);
      return;
    }

    // 4. Tab navigation shortcuts (1-8) when input buffer is empty
    if (!state.inputBuffer) {
      const switchView = (targetView: typeof state.activeView) => {
        if (state.activeView === 'theme' && targetView !== 'theme') {
          ThemeManager.revert();
        }
        state.activeView = targetView;
        ctx.render();
      };

      if (key === '1') { switchView('dashboard'); return; }
      if (key === '2') { switchView('coins'); return; }
      if (key === '3') { switchView('stocks'); return; }
      if (key === '4') { switchView('ledger'); return; }
      if (key === '5') { switchView('learnings'); return; }
      if (key === '6') { switchView('theme'); return; }
      if (key === '7') { switchView('config'); return; }
      if (key === '8') { switchView('help'); return; }
    }

    // 5. General Dropdown & Input Buffer Keys
    if (state.inputBuffer) {
      const matches = CommandPalette.search(state.inputBuffer, state.isTradingPaused, state.topCoins, state.topStocks);

      if (key === '\u001b[A') {
        state.selectedDropdownIndex = Math.max(0, state.selectedDropdownIndex - 1);
        ctx.render();
        return;
      }
      if (key === '\u001b[B') {
        state.selectedDropdownIndex = Math.min(matches.length - 1, state.selectedDropdownIndex + 1);
        ctx.render();
        return;
      }
      if (key === '\t') {
        const item = matches[state.selectedDropdownIndex];
        if (item) {
          state.inputBuffer = item.name.startsWith('/') ? item.name : `/${item.name}`;
          state.selectedDropdownIndex = 0;
          ctx.render();
        }
        return;
      }
      if (key === '\r') {
        const item = matches[state.selectedDropdownIndex];
        const entered = state.inputBuffer;
        state.inputBuffer = '';
        state.selectedDropdownIndex = 0;

        if (item) {
          await CommandExecutor.executeSearchItem(item, ctx);
        } else {
          await CommandExecutor.execute(entered, ctx);
        }
        ctx.render();
        return;
      }
    }

    // 6. Escape Key (Dismiss / Clear / Revert)
    if (key === '\u001b') {
      if (state.inputBuffer) {
        state.inputBuffer = '';
        state.selectedDropdownIndex = 0;
      } else if (state.configModalState.active) {
        state.configModalState.active = false;
      } else if (state.activeView !== 'dashboard') {
        if (state.activeView === 'theme') {
          ThemeManager.revert();
        }
        state.activeView = 'dashboard';
      }
      ctx.render();
      return;
    }

    // 7. Backspace
    if (key === '\x7f' || key === '\b') {
      state.inputBuffer = state.inputBuffer.slice(0, -1);
      state.selectedDropdownIndex = 0;
      ctx.render();
      return;
    }

    // 8. Normal Character Typing
    if (key.length === 1 && key >= ' ' && key <= '~') {
      state.inputBuffer += key;
      state.selectedDropdownIndex = 0;
      ctx.render();
      return;
    }
  }
}
