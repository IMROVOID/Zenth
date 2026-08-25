import { ThemeManager, ansi } from '../theme/index.js';
import { padRight, visibleWidth } from '../utils/index.js';

export interface HudData {
  symbol: string;
  currentPrice: number;
  fastMA: number;
  slowMA: number;
  rsi: number;
  activeRulesCount: number;
  totalEntries: number;
  activeEntries: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  enteredCapital: number;
  closedCapital: number;
  realizedPnL: number;
  realizedPnLPct: number;
  isTradingPaused?: boolean;
  activePositionValue?: number;
  activePositionPnL?: number;
  activePositionPct?: number;
  activeTab?: string;
  hoverTab?: string;
}

export interface TabHitbox {
  name: string;
  row: number;
  colStart: number;
  colEnd: number;
}

export class DockedHUD {
  static tabHitboxes: TabHitbox[] = [];
  static toggleButtonHitbox: { row: number; colStart: number; colEnd: number } | null = null;

  static render(data: HudData, width = 100): string[] {
    const t = ThemeManager.theme;
    const lines: string[] = [];
    this.tabHitboxes = [];
    const hoverTab = data.hoverTab;

    const appTitle = ' ZENTH v1.0.0 ';
    const symPrice = ` ${data.symbol.toUpperCase()}: $${data.currentPrice.toFixed(2)} `;
    const rulesTag = ` RULES: ${data.activeRulesCount} `;

    const headerLeft = `${t.border}┌──${t.accent}${ansi.bold}${appTitle}${ansi.reset}${t.border}─`;
    const headerMid = `─${t.accentSecondary}${ansi.bold}${symPrice}${ansi.reset}${t.border}─`;
    const headerRight = `─${t.accent}${ansi.bold}${rulesTag}${ansi.reset}${t.border}──┐${ansi.reset}`;

    const usedLen = visibleWidth(headerLeft) + visibleWidth(headerMid) + visibleWidth(headerRight);
    const fillerLen = Math.max(0, width - usedLen);
    const topBorder = `${headerLeft}${'─'.repeat(Math.floor(fillerLen / 2))}${headerMid}${'─'.repeat(Math.ceil(fillerLen / 2))}${headerRight}`;
    lines.push(topBorder);

    const isPaused = !!data.isTradingPaused;
    const toggleBtnStr = isPaused ? ` [RESUME TRADING] ` : ` [PAUSE TRADING] `;
    const toggleBtnBg = isPaused ? t.badgeBuy : t.badgeWarning;
    const btnStartCol = width - visibleWidth(toggleBtnStr) - 2;
    const btnEndCol = width - 2;

    this.toggleButtonHitbox = {
      row: 2,
      colStart: btnStartCol,
      colEnd: btnEndCol
    };

    const isHoveredBtn = hoverTab === 'pause_resume';
    const toggleBtnStyle = isHoveredBtn
      ? `${ansi.bold}${ansi.inverse}${toggleBtnBg}${toggleBtnStr}${ansi.reset}`
      : `${toggleBtnBg}${toggleBtnStr}${ansi.reset}`;

    const wrColor = data.winRate >= 50 ? t.success : data.totalWins + data.totalLosses === 0 ? t.dimText : t.warning;
    const pnlVal = data.realizedPnL;
    const pnlFormatted = pnlVal >= 0 ? `+$${pnlVal.toFixed(2)}` : `-$${Math.abs(pnlVal).toFixed(2)}`;
    const pctVal = data.realizedPnLPct;
    const pctFormatted = pctVal >= 0 ? `+${pctVal.toFixed(2)}%` : `-${Math.abs(pctVal).toFixed(2)}%`;
    const pnlColor = pnlVal > 0 ? t.success : pnlVal < 0 ? t.danger : t.dimText;

    const col1 = `Entries: ${t.boldText}${data.totalEntries}${ansi.reset} (${data.activeEntries > 0 ? t.success + '1 Open' : t.dimText + '0 Open'}${ansi.reset})`;
    const col2 = `W/L: ${t.success}${data.totalWins}W${ansi.reset}/${t.danger}${data.totalLosses}L${ansi.reset} (Rate: ${wrColor}${data.winRate.toFixed(1)}%${ansi.reset})`;
    const col3 = `Realized: ${pnlColor}${pnlFormatted} (${pctFormatted})${ansi.reset}`;

    const leftMetrics = ` ${col1} ${t.border}│${ansi.reset} ${col2} ${t.border}│${ansi.reset} ${col3} `;
    const leftMetricsLen = visibleWidth(leftMetrics);
    const btnLen = visibleWidth(toggleBtnStr);
    const innerTarget = Math.max(10, width - 4);
    const spacing = Math.max(1, innerTarget - leftMetricsLen - btnLen);
    const row1Content = `${leftMetrics}${' '.repeat(spacing)}${toggleBtnStyle}`;
    lines.push(this.wrapRow(row1Content, width, t.border));

    const colA = `In: ${t.warning}$${data.enteredCapital.toFixed(2)}${ansi.reset}`;
    const colB = `Out: ${t.info}$${data.closedCapital.toFixed(2)}${ansi.reset}`;

    let colC = '';
    if (data.activeEntries > 0 && data.activePositionValue !== undefined && data.activePositionPnL !== undefined) {
      const posPnlVal = data.activePositionPnL;
      const posPnlFormatted = posPnlVal >= 0 ? `+$${posPnlVal.toFixed(2)}` : `-$${Math.abs(posPnlVal).toFixed(2)}`;
      const posPctVal = data.activePositionPct || 0;
      const posPctFormatted = posPctVal >= 0 ? `+${posPctVal.toFixed(2)}%` : `-${Math.abs(posPctVal).toFixed(2)}%`;
      const posPnlColor = posPnlVal >= 0 ? t.success : t.danger;
      colC = `Val: ${t.boldText}$${data.activePositionValue.toFixed(2)}${ansi.reset} (${posPnlColor}${posPnlFormatted} / ${posPctFormatted}${ansi.reset})`;
    } else {
      colC = `Position: ${t.dimText}FLAT (Scanning for Setups)${ansi.reset}`;
    }

    const row2Content = ` ${colA} ${t.border}│${ansi.reset} ${colB} ${t.border}│${ansi.reset} ${colC} `;
    lines.push(this.wrapRow(row2Content, width, t.border));

    const activeTab = data.activeTab || 'dashboard';
    const tabs = [
      { id: 'dashboard', label: '1:STATUS' },
      { id: 'coins', label: '2:COINS' },
      { id: 'stocks', label: '3:STOCKS' },
      { id: 'ledger', label: '4:LEDGER' },
      { id: 'learnings', label: '5:RULES' },
      { id: 'theme', label: '6:THEME' },
      { id: 'config', label: '7:CONFIG' },
      { id: 'help', label: '8:HELP' }
    ];

    let tabRow = ' ';
    let currentCursorCol = 4;

    tabs.forEach((tab) => {
      const isActive = tab.id === activeTab;
      const isHovered = tab.id === hoverTab;
      const tabStr = ` [${tab.label}] `;
      const startCol = currentCursorCol;
      const endCol = startCol + tabStr.length - 1;

      this.tabHitboxes.push({
        name: tab.id,
        row: 4,
        colStart: startCol,
        colEnd: endCol
      });

      if (isActive) {
        tabRow += `${t.selectedBg}${tabStr}${ansi.reset} `;
      } else if (isHovered) {
        tabRow += `${ansi.bold}${ansi.inverse}${t.accentSecondary}${tabStr}${ansi.reset} `;
      } else {
        tabRow += `${t.accent}${tabStr}${ansi.reset} `;
      }

      currentCursorCol = endCol + 2;
    });

    lines.push(this.wrapRow(tabRow, width, t.border));
    lines.push(`${t.border}└──${'─'.repeat(Math.max(0, width - 6))}──┘${ansi.reset}`);

    return lines;
  }

  private static wrapRow(content: string, totalWidth: number, borderAnsi: string): string {
    const targetInner = Math.max(10, totalWidth - 4);
    const padded = padRight(content, targetInner, ' ');
    return `${borderAnsi}│${ansi.reset} ${padded} ${borderAnsi}│${ansi.reset}`;
  }
}
