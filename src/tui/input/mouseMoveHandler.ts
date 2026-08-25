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
import { CommandExecutorContext } from './commandExecutor.js';

export class MouseMoveHandler {
  static handleMove(ev: MouseEvent, ctx: CommandExecutorContext): boolean {
    const { state } = ctx;
    let stateChanged = false;
    let hovered: string | undefined = undefined;

    // 1. Top HUD Tabs and Pause/Resume Hover
    const toggle = DockedHUD.toggleButtonHitbox;
    if (toggle && ev.row === toggle.row && ev.col >= toggle.colStart && ev.col <= toggle.colEnd) {
      hovered = 'pause_resume';
    } else {
      const hitTab = DockedHUD.tabHitboxes.find(
        tb => tb.row === ev.row && ev.col >= tb.colStart && ev.col <= tb.colEnd
      );
      if (hitTab) hovered = hitTab.name;
    }

    if (state.hoverTab !== hovered) {
      state.hoverTab = hovered;
      stateChanged = true;
    }

    // 2. View Item Selection Hover
    if (state.activeView === 'coins') {
      const hit = CoinsView.rowHitboxes.find(h => h.row === ev.row);
      if (hit && state.selectedCoinIndex !== hit.index) {
        state.selectedCoinIndex = hit.index;
        stateChanged = true;
      }
    } else if (state.activeView === 'stocks') {
      const hit = StocksView.rowHitboxes.find(h => h.row === ev.row);
      if (hit && state.selectedStockIndex !== hit.index) {
        state.selectedStockIndex = hit.index;
        stateChanged = true;
      }
    } else if (state.activeView === 'theme') {
      const hit = ThemeView.rowHitboxes.find(h => h.row === ev.row);
      if (hit && state.selectedThemeIndex !== hit.index) {
        state.selectedThemeIndex = hit.index;
        ThemeManager.preview(hit.themeName);
        stateChanged = true;
      }
    } else if (state.activeView === 'config') {
      if (state.configModalState.active) {
        const hit = ConfigPickerModal.rowHitboxes.find(h => h.row === ev.row);
        if (hit && state.configModalState.selectedIndex !== hit.index) {
          state.configModalState.selectedIndex = hit.index;
          stateChanged = true;
        }
      } else {
        const hit = ConfigView.rowHitboxes.find(h => h.row === ev.row);
        if (hit && state.selectedConfigIndex !== hit.index) {
          state.selectedConfigIndex = hit.index;
          stateChanged = true;
        }
      }
    } else if (state.activeView === 'ledger') {
      const hit = LedgerView.rowHitboxes.find(h => h.row === ev.row);
      const newIdx = hit ? hit.index : -1;
      if (state.selectedLedgerIndex !== newIdx) {
        state.selectedLedgerIndex = newIdx;
        stateChanged = true;
      }
    } else if (state.activeView === 'learnings') {
      const hit = LearningsView.rowHitboxes.find(h => ev.row >= h.rowStart && ev.row <= h.rowEnd);
      const newIdx = hit ? hit.index : -1;
      if (state.selectedRuleIndex !== newIdx) {
        state.selectedRuleIndex = newIdx;
        stateChanged = true;
      }
    }

    return stateChanged;
  }
}
