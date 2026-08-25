import { ThemeManager } from '../theme/index.js';
import { setConfigOptionDirect } from '../state/configCycle.js';
import { CommandExecutorContext } from './commandExecutor.js';

export async function handleViewNavigationKeys(key: string, ctx: CommandExecutorContext): Promise<boolean> {
  const { state } = ctx;

  if (state.activeView === 'coins') {
    if (key === '\u001b[A' || key === 'w' || key === 'k') {
      state.selectedCoinIndex = Math.max(0, state.selectedCoinIndex - 1);
      ctx.render();
      return true;
    }
    if (key === '\u001b[B' || key === 's' || key === 'j') {
      state.selectedCoinIndex = Math.min(state.topCoins.length - 1, state.selectedCoinIndex + 1);
      ctx.render();
      return true;
    }
    if (key === '\r') {
      const coin = state.topCoins[state.selectedCoinIndex];
      if (coin) {
        state.draftConfig.symbol = coin.symbol;
        state.activeConfig.symbol = coin.symbol;
        state.activeView = 'dashboard';
        await ctx.runTick();
      }
      ctx.render();
      return true;
    }
  }

  if (state.activeView === 'stocks') {
    if (key === '\u001b[A' || key === 'w' || key === 'k') {
      state.selectedStockIndex = Math.max(0, state.selectedStockIndex - 1);
      ctx.render();
      return true;
    }
    if (key === '\u001b[B' || key === 's' || key === 'j') {
      state.selectedStockIndex = Math.min(state.topStocks.length - 1, state.selectedStockIndex + 1);
      ctx.render();
      return true;
    }
    if (key === '\r') {
      const stock = state.topStocks[state.selectedStockIndex];
      if (stock) {
        state.draftConfig.symbol = stock.symbol;
        state.activeConfig.symbol = stock.symbol;
        state.activeView = 'dashboard';
        await ctx.runTick();
      }
      ctx.render();
      return true;
    }
  }

  if (state.activeView === 'theme') {
    const themes = ThemeManager.listThemes();
    if (key === '\u001b[A' || key === 'w' || key === 'k') {
      state.selectedThemeIndex = Math.max(0, state.selectedThemeIndex - 1);
      const th = themes[state.selectedThemeIndex];
      if (th) ThemeManager.preview(th.name);
      ctx.render();
      return true;
    }
    if (key === '\u001b[B' || key === 's' || key === 'j') {
      state.selectedThemeIndex = Math.min(themes.length - 1, state.selectedThemeIndex + 1);
      const th = themes[state.selectedThemeIndex];
      if (th) ThemeManager.preview(th.name);
      ctx.render();
      return true;
    }
    if (key === '\r' || key === ' ') {
      const th = themes[state.selectedThemeIndex];
      if (th) {
        ThemeManager.apply(th.name);
      }
      ctx.render();
      return true;
    }
  }

  if (state.activeView === 'ledger') {
    if (key === '\u001b[A' || key === 'w' || key === 'k') {
      state.selectedLedgerIndex = Math.max(0, state.selectedLedgerIndex - 1);
      ctx.render();
      return true;
    }
    if (key === '\u001b[B' || key === 's' || key === 'j') {
      state.selectedLedgerIndex = Math.min(Math.min(10, state.ledgerEntries.length) - 1, state.selectedLedgerIndex + 1);
      ctx.render();
      return true;
    }
  }

  if (state.activeView === 'learnings') {
    if (key === '\u001b[A' || key === 'w' || key === 'k') {
      state.selectedRuleIndex = Math.max(0, state.selectedRuleIndex - 1);
      ctx.render();
      return true;
    }
    if (key === '\u001b[B' || key === 's' || key === 'j') {
      state.selectedRuleIndex = Math.min(state.activeRules.length - 1, state.selectedRuleIndex + 1);
      ctx.render();
      return true;
    }
  }

  if (state.activeView === 'config') {
    if (state.configModalState.active) {
      const opts = state.configModalState.options;
      if (key === '\u001b[A' || key === 'w' || key === 'k') {
        state.configModalState.selectedIndex = Math.max(0, state.configModalState.selectedIndex - 1);
        ctx.render();
        return true;
      }
      if (key === '\u001b[B' || key === 's' || key === 'j') {
        state.configModalState.selectedIndex = Math.min(opts.length - 1, state.configModalState.selectedIndex + 1);
        ctx.render();
        return true;
      }
      if (key === '\r' || key === ' ') {
        const chosen = opts[state.configModalState.selectedIndex];
        if (chosen) {
          setConfigOptionDirect(state.draftConfig, state.configModalState.paramKey, chosen);
        }
        state.configModalState.active = false;
        ctx.render();
        return true;
      }
      if (key === '\u001b') {
        state.configModalState.active = false;
        ctx.render();
        return true;
      }
      return true;
    }

    const params = state.getConfigParams();
    if (key === '\u001b[A' || key === 'w' || key === 'k') {
      state.selectedConfigIndex = Math.max(0, state.selectedConfigIndex - 1);
      ctx.render();
      return true;
    }
    if (key === '\u001b[B' || key === 's' || key === 'j') {
      state.selectedConfigIndex = Math.min(params.length - 1, state.selectedConfigIndex + 1);
      ctx.render();
      return true;
    }
    if (key === '\r' || key === ' ') {
      const target = params[state.selectedConfigIndex];
      if (target) {
        if (target.isAction) {
          if (target.actionType === 'save') await ctx.applyDraftConfig();
          else if (target.actionType === 'reset_db') await ctx.executeResetDb();
          else ctx.resetDraftConfig();
        } else if (target.options && target.options.length > 0) {
          state.configModalState = {
            active: true,
            paramKey: target.key,
            paramLabel: target.label,
            paramCategory: target.category,
            paramDesc: target.desc,
            options: target.options,
            selectedIndex: Math.max(0, target.options.indexOf(target.val))
          };
        }
        ctx.render();
      }
      return true;
    }
  }

  return false;
}
