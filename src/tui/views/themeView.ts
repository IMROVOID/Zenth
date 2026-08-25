import { ThemeManager, ansi } from '../theme/index.js';
import { Box } from '../utils/index.js';

export interface ThemeRowHitbox {
  index: number;
  themeName: string;
  row: number;
}

export class ThemeView {
  static rowHitboxes: ThemeRowHitbox[] = [];

  static render(selectedIndex: number, width = 84, height = 20, startTerminalRow = 7): string[] {
    const t = ThemeManager.theme;
    const themes = ThemeManager.listThemes();
    const boxWidth = Math.min(width, 88);
    const lines: string[] = [];
    this.rowHitboxes = [];

    lines.push(Box.header(`COLOR THEME SELECTOR (${themes.length} THEMES)`, boxWidth, t.border, t.accent + ansi.bold));

    const subtitle = `${t.dimText}Navigate to PREVIEW live · Press [ENTER], [SPACE] or CLICK to apply · [ESC] Revert${ansi.reset}`;
    lines.push(Box.row(` ${subtitle}`, boxWidth, t.border));
    lines.push(Box.divider(boxWidth, t.border));

    const maxVisible = 12;
    const total = themes.length;
    let startIndex = Math.max(0, selectedIndex - Math.floor(maxVisible / 2));
    if (startIndex + maxVisible > total) {
      startIndex = Math.max(0, total - maxVisible);
    }
    const visibleThemes = themes.slice(startIndex, startIndex + maxVisible);

    if (startIndex > 0) {
      const upIndicator = `${t.dimText}▲ (${startIndex} more above)...${ansi.reset}`;
      lines.push(Box.row(`  ${upIndicator}`, boxWidth, t.border));
    } else {
      lines.push(Box.row('', boxWidth, t.border));
    }

    let currentRowOffset = startTerminalRow + lines.length;

    visibleThemes.forEach((th, relIdx) => {
      const absIdx = startIndex + relIdx;
      const isSelectedCandidate = absIdx === selectedIndex;
      const isApplied = th.name === ThemeManager.currentName;
      const isPreviewing = th.name === ThemeManager.activePreviewName;

      const marker = isSelectedCandidate ? `${t.accent}■${ansi.reset}` : ' ';
      
      let statusBadge = '        ';
      if (isApplied) {
        statusBadge = `${t.success}[ACTIVE]${ansi.reset}`;
      } else if (isPreviewing || (isSelectedCandidate && ThemeManager.activePreviewName)) {
        statusBadge = `${t.warning}[PREVIEW]${ansi.reset}`;
      }

      const catBadge = `${t.accentSecondary}[${th.category.toUpperCase()}]${ansi.reset}`.padEnd(16, ' ');
      const nameStr = th.displayName.padEnd(21, ' ').substring(0, 21);
      const descStr = th.description.substring(0, Math.max(10, boxWidth - 53));

      let content = '';
      if (isSelectedCandidate) {
        content = `${t.selectedBg} ${marker} ${nameStr} ${catBadge} ${descStr} ${statusBadge} ${ansi.reset}`;
      } else {
        content = ` ${marker} ${t.boldText}${nameStr}${ansi.reset} ${catBadge} ${t.dimText}${descStr}${ansi.reset} ${statusBadge}`;
      }

      this.rowHitboxes.push({
        index: absIdx,
        themeName: th.name,
        row: currentRowOffset
      });
      currentRowOffset++;

      lines.push(Box.row(content, boxWidth, t.border));
    });

    const remaining = total - (startIndex + visibleThemes.length);
    if (remaining > 0) {
      const downIndicator = `${t.dimText}▼ (${remaining} more below)...${ansi.reset}`;
      lines.push(Box.row(`  ${downIndicator}`, boxWidth, t.border));
    } else {
      lines.push(Box.row('', boxWidth, t.border));
    }

    lines.push(Box.divider(boxWidth, t.border));
    const helpBar = `${t.dimText}[ENTER / SPACE] Save & Apply · [CLICK] Select · [ESC] Revert & Close${ansi.reset}`;
    lines.push(Box.row(` ${helpBar}`, boxWidth, t.border));
    lines.push(Box.footer('', boxWidth, t.border));

    return lines;
  }
}
