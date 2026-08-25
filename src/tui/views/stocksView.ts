import { ThemeManager, ansi } from '../theme/index.js';
import { StockInfo } from '../../core/market/index.js';
import { padRight, Box, renderBrailleSparkline } from '../utils/index.js';

export interface StockRowHitbox {
  index: number;
  symbol: string;
  row: number;
}

export class StocksView {
  static rowHitboxes: StockRowHitbox[] = [];

  static render(
    allStocks: StockInfo[],
    selectedIndex: number,
    currentSymbol: string,
    width = 84,
    startTerminalRow = 7,
    searchQuery = ''
  ): { lines: string[]; filteredCount: number } {
    const t = ThemeManager.theme;
    const boxWidth = Math.min(width, 88);
    const lines: string[] = [];
    this.rowHitboxes = [];

    const q = searchQuery.trim().toLowerCase().replace(/^\//, '');
    const stocks = q
      ? allStocks.filter(s =>
          s.ticker.toLowerCase().includes(q) ||
          s.companyName.toLowerCase().includes(q) ||
          s.symbol.toLowerCase().includes(q)
        )
      : allStocks;

    const titleTag = q
      ? `XT.COM STOCKS & TRADFI (FILTER: "${searchQuery}" - ${stocks.length} MATCHES)`
      : `XT.COM STOCK & TRADFI PERPETUALS (${stocks.length} STOCKS)`;
    lines.push(Box.header(titleTag, boxWidth, t.border, t.accent + ansi.bold));

    const subtitle = q
      ? `${t.dimText}Type to filter · [ENTER] Switch Asset · [ESC] Clear Search${ansi.reset}`
      : `${t.dimText}Navigate with ARROWS · Press [ENTER] or CLICK to select stock · [ESC] Return${ansi.reset}`;
    lines.push(Box.row(` ${subtitle}`, boxWidth, t.border));
    lines.push(Box.divider(boxWidth, t.border));

    if (stocks.length === 0) {
      lines.push(Box.row(`  ${t.dimText}No stocks found matching "${searchQuery}". Type / for commands.${ansi.reset}`, boxWidth, t.border));
      lines.push(Box.footer('', boxWidth, t.border));
      return { lines, filteredCount: 0 };
    }

    const maxVisible = 8;
    const total = stocks.length;
    const safeSelectedIdx = Math.max(0, Math.min(selectedIndex, total - 1));
    let startIndex = Math.max(0, safeSelectedIdx - Math.floor(maxVisible / 2));
    if (startIndex + maxVisible > total) {
      startIndex = Math.max(0, total - maxVisible);
    }
    const visibleStocks = stocks.slice(startIndex, startIndex + maxVisible);

    if (startIndex > 0) {
      const upIndicator = `${t.dimText}▲ (${startIndex} more above)...${ansi.reset}`;
      lines.push(Box.row(`  ${upIndicator}`, boxWidth, t.border));
    } else {
      lines.push(Box.row('', boxWidth, t.border));
    }

    let currentRowOffset = startTerminalRow + lines.length;

    visibleStocks.forEach((s, relIdx) => {
      const absIdx = startIndex + relIdx;
      const isSelected = absIdx === safeSelectedIdx;
      const isCurrent = s.symbol.toLowerCase() === currentSymbol.toLowerCase();

      const marker = isSelected ? `${t.accent}■${ansi.reset}` : ' ';
      const symStr = padRight(s.ticker, 7, ' ');
      const nameStr = padRight(s.companyName.substring(0, 15), 16, ' ');
      const priceFormatted = s.price >= 1 ? `$${s.price.toFixed(2)}` : `$${s.price.toFixed(4)}`;
      const priceStr = padRight(priceFormatted, 12, ' ');

      const changeSign = s.change24hPct >= 0 ? '+' : '';
      const changeColor = s.change24hPct >= 0 ? t.success : t.danger;
      const changeText = `${changeColor}${changeSign}${s.change24hPct.toFixed(2)}%${ansi.reset}`;
      const changeFormatted = padRight(changeText, 10, ' ');

      const sparklineRaw = renderBrailleSparkline(s.sparkline || [1, 2, 3, 2, 4, 5, 4, 6], 8);
      const sparklineColored = `   ${changeColor}${sparklineRaw}${ansi.reset}  `;
      const activeBadge = isCurrent ? `${t.success}[ACTIVE]${ansi.reset}` : '        ';

      let row = '';
      if (isSelected) {
        row = `${t.selectedBg} ${marker} ${symStr} ${nameStr} ${priceStr} ${changeFormatted}${sparklineColored}${activeBadge} ${ansi.reset}`;
      } else {
        row = ` ${marker} ${t.accent}${symStr}${ansi.reset} ${t.boldText}${nameStr}${ansi.reset} ${t.accentSecondary}${priceStr}${ansi.reset} ${changeFormatted}${sparklineColored}${activeBadge}`;
      }

      this.rowHitboxes.push({
        index: absIdx,
        symbol: s.symbol,
        row: currentRowOffset
      });
      currentRowOffset++;

      lines.push(Box.row(row, boxWidth, t.border));
    });

    const remaining = total - (startIndex + visibleStocks.length);
    if (remaining > 0) {
      const downIndicator = `${t.dimText}▼ (${remaining} more below)...${ansi.reset}`;
      lines.push(Box.row(`  ${downIndicator}`, boxWidth, t.border));
    } else {
      lines.push(Box.row('', boxWidth, t.border));
    }

    lines.push(Box.divider(boxWidth, t.border));
    const helpBar = `${t.dimText}[ENTER] Switch Bot to Selected Stock · [CLICK] Select · [ESC] Live HUD${ansi.reset}`;
    lines.push(Box.row(` ${helpBar}`, boxWidth, t.border));
    lines.push(Box.footer('', boxWidth, t.border));

    return { lines, filteredCount: stocks.length };
  }
}
