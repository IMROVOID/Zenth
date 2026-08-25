import { MouseEvent } from '../utils/index.js';
import { DockedHUD } from '../components/dockedHud.js';
import { CoinsView } from '../views/coinsView.js';
import { StocksView } from '../views/stocksView.js';
import { ThemeView } from '../views/themeView.js';
import { ConfigView } from '../views/configView.js';
import { ConfigPickerModal } from '../views/configPickerModal.js';
import { LedgerView } from '../views/ledgerView.js';
import { LearningsView } from '../views/learningsView.js';
import { ThemeManager } from '../theme/index.js';
import { setConfigOptionDirect } from '../state/configCycle.js';
import { ActiveView } from '../types.js';
import { CommandExecutor, CommandExecutorContext } from './commandExecutor.js';
import { MouseMoveHandler } from './mouseMoveHandler.js';

export class MouseHandler {
  static handle(ev: MouseEvent, ctx: CommandExecutorContext): void {
    const { state } = ctx;

    // 1. Hover Tracking
    if (ev.type === 'move') {
      const changed = MouseMoveHandler.handleMove(ev, ctx);
      if (changed) ctx.render();
      return;
    }

    // 2. Scroll Wheel Handling
    if (ev.button === 64) {
      if (state.activeView === 'dashboard') state.logScrollOffset = Math.min(state.logScrollOffset + 3, state.tickLogs.length - 1);
      else if (state.activeView === 'coins') state.selectedCoinIndex = Math.max(0, state.selectedCoinIndex - 1);
      else if (state.activeView === 'stocks') state.selectedStockIndex = Math.max(0, state.selectedStockIndex - 1);
      else if (state.activeView === 'theme') {
        state.selectedThemeIndex = Math.max(0, state.selectedThemeIndex - 1);
        const th = ThemeManager.listThemes()[state.selectedThemeIndex];
        if (th) ThemeManager.preview(th.name);
      } else if (state.activeView === 'config') {
        if (state.configModalState.active) {
          state.configModalState.selectedIndex = Math.max(0, state.configModalState.selectedIndex - 1);
        } else {
          state.selectedConfigIndex = Math.max(0, state.selectedConfigIndex - 1);
        }
      }
      ctx.render();
      return;
    }

    if (ev.button === 65) {
      if (state.activeView === 'dashboard') state.logScrollOffset = Math.max(0, state.logScrollOffset - 3);
      else if (state.activeView === 'coins') state.selectedCoinIndex = Math.min(state.topCoins.length - 1, state.selectedCoinIndex + 1);
      else if (state.activeView === 'stocks') state.selectedStockIndex = Math.min(state.topStocks.length - 1, state.selectedStockIndex + 1);
      else if (state.activeView === 'theme') {
        const themes = ThemeManager.listThemes();
        state.selectedThemeIndex = Math.min(themes.length - 1, state.selectedThemeIndex + 1);
        const th = themes[state.selectedThemeIndex];
        if (th) ThemeManager.preview(th.name);
      } else if (state.activeView === 'config') {
        if (state.configModalState.active) {
          state.configModalState.selectedIndex = Math.min(state.configModalState.options.length - 1, state.configModalState.selectedIndex + 1);
        } else {
          const params = state.getConfigParams();
          state.selectedConfigIndex = Math.min(params.length - 1, state.selectedConfigIndex + 1);
        }
      }
      ctx.render();
      return;
    }

    // 3. Left Click Handling
    if (ev.type === 'press' && (ev.button === 0 || ev.button === 2)) {
      const toggle = DockedHUD.toggleButtonHitbox;
      if (toggle && ev.row === toggle.row && ev.col >= toggle.colStart && ev.col <= toggle.colEnd) {
        CommandExecutor.execute(state.isTradingPaused ? 'resume' : 'pause', ctx);
        return;
      }

      const hitTab = DockedHUD.tabHitboxes.find(
        tb => tb.row === ev.row && ev.col >= tb.colStart && ev.col <= tb.colEnd
      );
      if (hitTab) {
        if (state.activeView === 'theme' && hitTab.name !== 'theme') {
          ThemeManager.revert();
        }
        state.activeView = hitTab.name as ActiveView;
        ctx.render();
        return;
      }

      if (state.activeView === 'coins') {
        const hitCoin = CoinsView.rowHitboxes.find(h => h.row === ev.row);
        if (hitCoin) {
          state.draftConfig.symbol = hitCoin.symbol;
          state.activeConfig.symbol = hitCoin.symbol;
          state.activeView = 'dashboard';
          ctx.runTick();
          ctx.render();
          return;
        }
      }

      if (state.activeView === 'stocks') {
        const hitStock = StocksView.rowHitboxes.find(h => h.row === ev.row);
        if (hitStock) {
          state.draftConfig.symbol = hitStock.symbol;
          state.activeConfig.symbol = hitStock.symbol;
          state.activeView = 'dashboard';
          ctx.runTick();
          ctx.render();
          return;
        }
      }

      if (state.activeView === 'theme') {
        const hitTheme = ThemeView.rowHitboxes.find(h => h.row === ev.row);
        if (hitTheme) {
          ThemeManager.apply(hitTheme.themeName);
          state.selectedThemeIndex = hitTheme.index;
          ctx.render();
          return;
        }
      }

      if (state.activeView === 'ledger') {
        const hitLedger = LedgerView.rowHitboxes.find(h => h.row === ev.row);
        if (hitLedger) {
          state.selectedLedgerIndex = hitLedger.index;
          ctx.render();
          return;
        }
      }

      if (state.activeView === 'learnings') {
        const hitRule = LearningsView.rowHitboxes.find(h => ev.row >= h.rowStart && ev.row <= h.rowEnd);
        if (hitRule) {
          state.selectedRuleIndex = hitRule.index;
          ctx.render();
          return;
        }
      }

      if (state.activeView === 'config') {
        if (state.configModalState.active) {
          const hitOpt = ConfigPickerModal.rowHitboxes.find(h => h.row === ev.row);
          if (hitOpt) {
            setConfigOptionDirect(state.draftConfig, state.configModalState.paramKey, hitOpt.option);
            state.configModalState.active = false;
            ctx.render();
            return;
          }
        } else {
          const hitRow = ConfigView.rowHitboxes.find(h => h.row === ev.row);
          if (hitRow) {
            state.selectedConfigIndex = hitRow.index;
            if (hitRow.isAction) {
              if (hitRow.actionType === 'save') ctx.applyDraftConfig();
              else if (hitRow.actionType === 'reset_db') ctx.executeResetDb();
              else ctx.resetDraftConfig();
              ctx.render();
              return;
            }

            const params = state.getConfigParams();
            const targetParam = params[hitRow.index];
            if (targetParam && targetParam.options && targetParam.options.length > 0) {
              state.configModalState = {
                active: true,
                paramKey: targetParam.key,
                paramLabel: targetParam.label,
                paramCategory: targetParam.category,
                paramDesc: targetParam.desc,
                options: targetParam.options,
                selectedIndex: Math.max(0, targetParam.options.indexOf(targetParam.val))
              };
            }
            ctx.render();
            return;
          }
        }
      }
    }
  }
}
