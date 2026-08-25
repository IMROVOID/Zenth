import { TuiState } from './state/tuiState.js';
import { ThemeManager, ansi } from './theme/index.js';
import { Screen, padRight, Box } from './utils/index.js';
import { DockedHUD } from './components/dockedHud.js';
import { CommandPalette } from './components/commandPalette.js';
import { ExportModal } from './components/exportModal.js';
import {
  DashboardView,
  CoinsView,
  StocksView,
  LedgerView,
  LearningsView,
  ThemeView,
  ConfigView,
  HelpView
} from './views/index.js';

export class TuiRenderer {
  static render(state: TuiState): void {
    const termWidth = process.stdout.columns || 100;
    const termHeight = process.stdout.rows || 30;

    // 1. Render Top Docked HUD
    const hudLines = DockedHUD.render({
      symbol: state.activeConfig.symbol,
      currentPrice: state.currentPrice,
      fastMA: state.currentFastMA,
      slowMA: state.currentSlowMA,
      rsi: state.currentRSI,
      activeRulesCount: state.activeRules.length,
      totalEntries: state.totalEntries,
      activeEntries: state.activePosition ? 1 : 0,
      totalWins: state.sessionWins,
      totalLosses: state.sessionLosses,
      winRate: state.totalEntries > 0 ? (state.sessionWins / (state.sessionWins + state.sessionLosses || 1)) * 100 : 0,
      enteredCapital: state.activePosition ? state.activePosition.enteredCapital : 0,
      closedCapital: state.totalClosedMoney,
      realizedPnL: state.sessionRealizedPnL,
      realizedPnLPct: state.activeConfig.targetAllocation > 0 ? (state.sessionRealizedPnL / state.activeConfig.targetAllocation) * 100 : 0,
      isTradingPaused: state.isTradingPaused,
      activePositionValue: state.activePosition ? state.currentPrice * state.activePosition.quantity : undefined,
      activePositionPnL: state.activePosition ? (state.currentPrice - state.activePosition.entryPrice) * state.activePosition.quantity : undefined,
      activePositionPct: state.activePosition ? ((state.currentPrice - state.activePosition.entryPrice) / state.activePosition.entryPrice) * 100 : undefined,
      activeTab: state.activeView,
      hoverTab: state.hoverTab
    }, termWidth);

    // 2. Render Active View Content
    const contentStartRow = hudLines.length + 1;
    const promptRow = Math.max(12, termHeight - 2);
    const maxViewLines = Math.max(5, promptRow - contentStartRow - 1);

    let viewLines: string[] = [];
    if (state.exportPromptState.active) {
      const t = ThemeManager.theme;
      const boxWidth = Math.min(termWidth, 84);
      const fmt = state.exportPromptState.format.toUpperCase();
      viewLines.push(Box.header(`EXPORT LOGS - ENTER FILE PATH`, boxWidth, t.border, t.accent + ansi.bold));
      viewLines.push(Box.row(` ${t.boldText}Selected Format  :${ansi.reset} ${t.accentSecondary}.${state.exportPromptState.format} (${fmt})${ansi.reset}`, boxWidth, t.border));
      viewLines.push(Box.row(` ${t.boldText}Target File Path :${ansi.reset} ${t.text}${state.exportPromptState.inputPath}${t.accentSecondary}.${state.exportPromptState.format}${ansi.reset}`, boxWidth, t.border));
      viewLines.push(Box.row(` ${t.dimText}File format extension is locked. Type custom folder/filename in the CommandBar.${ansi.reset}`, boxWidth, t.border));
      viewLines.push(Box.divider(boxWidth, t.border));
      viewLines.push(Box.footer('[ENTER] Export to Disk · [ESC] Cancel', boxWidth, t.border));
    } else if (state.activeView === 'dashboard') {
      viewLines = DashboardView.render(state.tickLogs, maxViewLines, termWidth, state.logScrollOffset);
    } else if (state.activeView === 'coins') {
      const cRes = CoinsView.render(state.topCoins, state.selectedCoinIndex, state.activeConfig.symbol, termWidth, contentStartRow + 1, state.inputBuffer);
      viewLines = cRes.lines;
    } else if (state.activeView === 'stocks') {
      const sRes = StocksView.render(state.topStocks, state.selectedStockIndex, state.activeConfig.symbol, termWidth, contentStartRow + 1, state.inputBuffer);
      viewLines = sRes.lines;
    } else if (state.activeView === 'ledger') {
      viewLines = LedgerView.render(state.ledgerEntries, termWidth, contentStartRow + 1, state.selectedLedgerIndex);
    } else if (state.activeView === 'learnings') {
      viewLines = LearningsView.render(state.activeRules, termWidth, contentStartRow + 1, state.selectedRuleIndex);
    } else if (state.activeView === 'theme') {
      viewLines = ThemeView.render(state.selectedThemeIndex, termWidth, termHeight, contentStartRow + 1);
    } else if (state.activeView === 'config') {
      viewLines = ConfigView.render(state.selectedConfigIndex, state.getConfigParams(), state.hasUnsavedConfigChanges(), termWidth, contentStartRow + 1, maxViewLines, state.configModalState);
    } else if (state.activeView === 'help') {
      viewLines = HelpView.render(termWidth);
    }

    // 3. Render Autocomplete Dropdown or Export Modal
    let overlayLines: string[] = [];
    if (state.exportModalState.active) {
      overlayLines = ExportModal.render(state.exportModalState.selectedIndex, termWidth);
    } else if (state.inputBuffer) {
      overlayLines = CommandPalette.renderDropdown(
        state.inputBuffer,
        state.selectedDropdownIndex,
        termWidth,
        state.isTradingPaused,
        state.topCoins,
        state.topStocks
      );
    }

    // 4. Assemble Fixed Grid Buffer
    const buffer: string[] = new Array(promptRow + 1).fill('');

    // Place HUD
    for (let i = 0; i < hudLines.length; i++) {
      buffer[i] = hudLines[i];
    }

    // Place View Content
    for (let i = 0; i < viewLines.length && (contentStartRow + i) < promptRow; i++) {
      buffer[contentStartRow + i] = viewLines[i];
    }

    // Place Overlay (Export Modal or Dropdown) pinned above bottom prompt
    if (overlayLines.length > 0) {
      const overlayStart = Math.max(contentStartRow, promptRow - overlayLines.length);
      for (let i = 0; i < overlayLines.length && (overlayStart + i) < promptRow; i++) {
        buffer[overlayStart + i] = overlayLines[i];
      }
    }

    // Place Pinned Bottom Prompt Line
    buffer[promptRow] = this.renderPromptLine(state, termWidth);

    // Write full frame in-place with line-clearing escape codes
    const frame = '\x1b[H' + buffer.map(line => line + '\x1b[K').join('\n');
    process.stdout.write(frame);
  }

  private static renderPromptLine(state: TuiState, width: number): string {
    const t = ThemeManager.theme;

    if (state.exportPromptState.active) {
      const fmt = state.exportPromptState.format.toUpperCase();
      const badge = `${t.badgeInfo} EXPORT (.${fmt}) ${ansi.reset} `;
      const promptIcon = `${t.accent}${ansi.bold}Target Path:${ansi.reset} `;
      const inputPath = state.exportPromptState.inputPath;
      const cursorPos = Math.max(0, Math.min(inputPath.length, state.exportPromptState.cursorPosition));
      const extSuffix = `.${state.exportPromptState.format}`;

      let pathWithCursor = '';
      if (cursorPos < inputPath.length) {
        const before = inputPath.slice(0, cursorPos);
        const at = inputPath[cursorPos];
        const after = inputPath.slice(cursorPos + 1);
        pathWithCursor = `${t.boldText}${before}${ansi.reset}${t.selectedBg}${at}${ansi.reset}${t.boldText}${after}${ansi.reset}`;
      } else {
        pathWithCursor = `${t.boldText}${inputPath}${ansi.reset}${t.accent}█${ansi.reset}`;
      }

      const bufferText = `${pathWithCursor}${t.accentSecondary}${extSuffix}${ansi.reset} ${t.dimText}[ENTER to save, ESC to cancel]${ansi.reset}`;
      const inner = ` ${badge}${promptIcon}${bufferText}`;
      return `${t.border}└─${ansi.reset}${inner}`;
    }

    const isPausedTag = state.isTradingPaused ? `${t.badgeWarning} PAUSED ${ansi.reset} ` : `${t.badgeSuccess} LIVE ${ansi.reset} `;
    const promptIcon = `${t.accent}${ansi.bold}>${ansi.reset} `;
    const bufferText = state.inputBuffer
      ? `${t.boldText}${state.inputBuffer}${ansi.reset}${t.accent}█${ansi.reset}`
      : `${t.dimText}Type command, coin, stock or / for menu (e.g. /coins, /export, /copy, /help)...${ansi.reset}`;

    const inner = ` ${isPausedTag}${promptIcon}${bufferText}`;
    return `${t.border}└─${ansi.reset}${inner}`;
  }
}

