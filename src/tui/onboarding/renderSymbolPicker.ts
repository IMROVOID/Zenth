import { OnboardingStateData, SymbolPickerItem } from './onboardingTypes.js';
import { ThemeManager, ansi } from '../theme/index.js';
import { padRight, Box, renderBrailleSparkline } from '../utils/index.js';

const BLACK_TEXT = '\x1b[22m\x1b[38;2;0;0;0m';

export interface SymbolPickerHitbox {
  index: number;
  symbol: string;
  row: number;
}

export class RenderSymbolPicker {
  static rowHitboxes: SymbolPickerHitbox[] = [];

  static render(data: OnboardingStateData, boxWidth: number, startRow = 6): string[] {
    const t = ThemeManager.theme;
    const lines: string[] = [];
    this.rowHitboxes = [];

    const q = (data.symbolSearchQuery || '').trim().toLowerCase();
    const cat = data.symbolCategoryFilter || 'ALL';
    let allSymbols = data.availableSymbols;

    if (cat === 'CRYPTO') {
      allSymbols = allSymbols.filter(s => s.type === 'crypto');
    } else if (cat === 'STOCK') {
      allSymbols = allSymbols.filter(s => s.type === 'stock');
    }

    const filtered = q
      ? allSymbols.filter(s =>
          s.ticker.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.symbol.toLowerCase().includes(q)
        )
      : allSymbols;

    const catBadge = cat === 'ALL'
      ? `${t.accent}[ALL]${ansi.reset} [CRYPTO] [STOCK]`
      : cat === 'CRYPTO'
      ? `[ALL] ${t.success}[CRYPTO]${ansi.reset} [STOCK]`
      : `[ALL] [CRYPTO] ${t.accentSecondary}[STOCK]${ansi.reset}`;

    const headerTitle = q
      ? `SELECT ASSET (SEARCH: "${data.symbolSearchQuery}" · ${filtered.length} MATCHES)`
      : `SELECT ASSET / SYMBOL (XT.COM LIVE EXCHANGE FEED)`;

    lines.push(Box.row(` ${t.boldText}${headerTitle}${ansi.reset}`, boxWidth, t.border));

    // Search bar and Category filter switcher
    const queryDisplay = data.symbolSearchQuery || `${t.dimText}Type to search coins & stocks...${ansi.reset}`;
    lines.push(Box.row(` ${t.accent}Search :${ansi.reset} [ ${queryDisplay} ]   ${t.dimText}Filter:${ansi.reset} ${catBadge} ${t.dimText}[TAB/F]${ansi.reset}`, boxWidth, t.border));
    lines.push(Box.divider(boxWidth, t.border));

    if (data.isLoadingSymbols && allSymbols.length === 0) {
      lines.push(Box.row(` ${t.warning}[LOADING] Fetching live crypto and token stock feeds from XT.com...${ansi.reset}`, boxWidth, t.border));
      lines.push(Box.divider(boxWidth, t.border));
      lines.push(Box.row(` ${t.dimText}[ESC] Cancel & Back${ansi.reset}`, boxWidth, t.border));
      return lines;
    }

    if (filtered.length === 0) {
      lines.push(Box.row(`  ${t.dimText}No assets found matching "${data.symbolSearchQuery}" in ${cat}. Press [Backspace] to clear.${ansi.reset}`, boxWidth, t.border));
      lines.push(Box.divider(boxWidth, t.border));
      lines.push(Box.row(` ${t.dimText}[Backspace] Edit Search · [TAB/F] Switch Filter · [ESC] Back${ansi.reset}`, boxWidth, t.border));
      return lines;
    }

    const maxVisible = 10;
    const total = filtered.length;
    const safeIdx = Math.max(0, Math.min(data.symbolSelectedIndex, total - 1));
    let startIndex = Math.max(0, safeIdx - Math.floor(maxVisible / 2));
    if (startIndex + maxVisible > total) {
      startIndex = Math.max(0, total - maxVisible);
    }
    const visibleItems = filtered.slice(startIndex, startIndex + maxVisible);

    if (startIndex > 0) {
      lines.push(Box.row(`  ${t.dimText}▲ (${startIndex} more above)...${ansi.reset}`, boxWidth, t.border));
    } else {
      lines.push(Box.row('', boxWidth, t.border));
    }

    visibleItems.forEach((item: SymbolPickerItem, relIdx: number) => {
      const absIdx = startIndex + relIdx;
      const isSelected = absIdx === safeIdx;
      const isCurrent = item.symbol.toLowerCase() === (data.tradingParams.symbol || '').toLowerCase();
      const curTerminalRow = startRow + lines.length;

      this.rowHitboxes.push({
        index: absIdx,
        symbol: item.symbol,
        row: curTerminalRow
      });

      const marker = isSelected ? '▶' : ' ';
      const tickerStr = padRight(item.ticker, 6, ' ');
      const nameStr = padRight(item.name.substring(0, 13), 14, ' ');
      const priceFormatted = item.price >= 1 ? `$${item.price.toFixed(2)}` : `$${item.price.toFixed(5)}`;
      const priceStr = padRight(priceFormatted, 11, ' ');

      const sign = item.change24hPct >= 0 ? '+' : '';
      const chgColor = item.change24hPct >= 0 ? t.success : t.danger;
      const chgText = `${sign}${item.change24hPct.toFixed(2)}%`;
      const chgFormatted = padRight(chgText, 8, ' ');

      const sparklineRaw = renderBrailleSparkline(item.sparkline || [1, 2, 3, 2, 4, 5, 4, 6], 8);
      const sparklineCol = isSelected ? `  ${sparklineRaw}  ` : `  ${chgColor}${sparklineRaw}${ansi.reset}  `;

      const typeBadge = item.type === 'crypto' ? '[CRYPTO]' : '[STOCK] ';
      const activeBadge = isCurrent ? '[ACTIVE]' : '        ';

      if (isSelected) {
        lines.push(Box.row(`${t.selectedBg}${BLACK_TEXT} ${marker} ${tickerStr} ${nameStr} ${priceStr} ${chgFormatted}${sparklineCol}${typeBadge} ${activeBadge} ${ansi.reset}`, boxWidth, t.border));
      } else {
        const activeColor = isCurrent ? `${t.success}[ACTIVE]${ansi.reset}` : '        ';
        lines.push(Box.row(` ${marker} ${t.accent}${tickerStr}${ansi.reset} ${t.boldText}${nameStr}${ansi.reset} ${t.accentSecondary}${priceStr}${ansi.reset} ${chgColor}${chgFormatted}${ansi.reset}${sparklineCol}${t.dimText}${typeBadge}${ansi.reset} ${activeColor}`, boxWidth, t.border));
      }
    });

    const remaining = total - (startIndex + visibleItems.length);
    if (remaining > 0) {
      lines.push(Box.row(`  ${t.dimText}▼ (${remaining} more below)...${ansi.reset}`, boxWidth, t.border));
    } else {
      lines.push(Box.row('', boxWidth, t.border));
    }

    lines.push(Box.divider(boxWidth, t.border));
    lines.push(Box.row(` ${t.dimText}[Type] Search · [TAB/F] Filter (${cat}) · [↑/↓/Wheel] Scroll · [ENTER/Click] Pick · [ESC] Back${ansi.reset}`, boxWidth, t.border));

    return lines;
  }
}
