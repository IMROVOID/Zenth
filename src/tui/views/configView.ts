import { ThemeManager, ansi } from '../theme/index.js';
import { padRight, Box } from '../utils/index.js';
import { ConfigModalState } from '../state/tuiState.js';
import { ConfigPickerModal } from './configPickerModal.js';

export interface ConfigParam {
  key: string;
  label: string;
  val: string;
  desc: string;
  category?: string;
  options?: string[];
  isDirty?: boolean;
  isAction?: boolean;
  actionType?: 'save' | 'reset' | 'reset_db';
}

export interface ConfigRowHitbox {
  index: number;
  row: number;
  isAction?: boolean;
  actionType?: 'save' | 'reset' | 'reset_db';
}

export class ConfigView {
  static rowHitboxes: ConfigRowHitbox[] = [];

  static render(
    selectedIndex = 0,
    params: ConfigParam[] = [],
    hasUnsavedChanges = false,
    width = 86,
    startTerminalRow = 7,
    maxHeight = 18,
    modalState?: ConfigModalState
  ): string[] {
    const boxWidth = Math.min(width, 90);

    if (modalState && modalState.active) {
      this.rowHitboxes = [];
      const curParam = params.find(p => p.key === modalState.paramKey);
      const currentVal = curParam ? curParam.val : '';
      return ConfigPickerModal.render(modalState, currentVal, boxWidth, startTerminalRow);
    }

    const t = ThemeManager.theme;
    const lines: string[] = [];
    this.rowHitboxes = [];

    const statusNote = hasUnsavedChanges ? ` (${t.warning}* UNSAVED CHANGES PENDING${ansi.reset}${t.accent})` : '';
    lines.push(Box.header(`BOT CONFIGURATION & PARAMETERS${statusNote}`, boxWidth, t.border, t.accent + ansi.bold));
    lines.push(Box.row(` ${t.dimText}Navigate: [↑/↓] · Select Option: [ENTER / SPACE / Click] · Action: [ENTER]${ansi.reset}`, boxWidth, t.border));
    lines.push(Box.divider(boxWidth, t.border));

    let currentRowOffset = startTerminalRow + lines.length;
    const itemParams = params.filter(p => !p.isAction);
    const actionParams = params.filter(p => p.isAction);

    const fixedOverhead = 12;
    const maxVisible = Math.max(3, Math.min(itemParams.length, maxHeight - fixedOverhead));
    const totalItems = itemParams.length;

    let startIndex = Math.max(0, selectedIndex - Math.floor(maxVisible / 2));
    if (selectedIndex >= totalItems || startIndex + maxVisible > totalItems) {
      startIndex = Math.max(0, totalItems - maxVisible);
    }
    const visibleItems = itemParams.slice(startIndex, startIndex + maxVisible);

    const upInd = startIndex > 0 ? `${t.dimText}▲ (${startIndex} more settings above · Scroll ↑)${ansi.reset}` : '';
    lines.push(Box.row(`  ${upInd}`, boxWidth, t.border));
    currentRowOffset++;

    visibleItems.forEach((p) => {
      const globalIdx = params.indexOf(p);
      const isSelected = globalIdx === selectedIndex;
      const marker = isSelected ? `${t.accent}■${ansi.reset}` : ' ';

      let catShort = 'CONFIG';
      if (p.category?.includes('Market')) catShort = 'MARKET';
      else if (p.category?.includes('Strategy')) catShort = 'STRATEGY';
      else if (p.category?.includes('Memory')) catShort = 'MEMORY';
      else if (p.category?.includes('Exit')) catShort = 'EXITS';
      else if (p.category?.includes('Risk')) catShort = 'RISK';
      else if (p.category?.includes('Alert')) catShort = 'ALERTS';
      const catBadge = `${t.accentSecondary}${padRight(`[${catShort}]`, 12, ' ')}${ansi.reset}`;

      const dirtyTag = p.isDirty ? `${t.warning}*${ansi.reset}` : ' ';
      const keyStr = padRight(`${p.label} ${dirtyTag}`, 20, ' ');
      const valStr = padRight(`[ ${padRight(p.val, 15, ' ')} ]`, 19, ' ');
      const descStr = p.desc.substring(0, Math.max(10, boxWidth - 58));

      this.rowHitboxes.push({
        index: globalIdx,
        row: currentRowOffset,
        isAction: false
      });
      currentRowOffset++;

      const row = isSelected
        ? `${t.selectedBg} ${marker} ${catBadge} ${keyStr} ${valStr} ${descStr} ${ansi.reset}`
        : ` ${marker} ${catBadge} ${t.boldText}${keyStr}${ansi.reset} ${p.isDirty ? t.warning : t.accentSecondary}${valStr}${ansi.reset} ${t.dimText}${descStr}${ansi.reset}`;
      lines.push(Box.row(row, boxWidth, t.border));
    });

    const rem = totalItems - (startIndex + visibleItems.length);
    const downInd = rem > 0 ? `${t.dimText}▼ (${rem} more settings below · Scroll ↓)${ansi.reset}` : '';
    lines.push(Box.row(`  ${downInd}`, boxWidth, t.border));
    currentRowOffset++;

    lines.push(Box.divider(boxWidth, t.border));
    currentRowOffset++;

    actionParams.forEach(p => {
      const globalIdx = params.indexOf(p);
      const isSelected = globalIdx === selectedIndex;
      const marker = isSelected ? `${t.accent}■${ansi.reset}` : ' ';

      let actionContent = '';
      if (p.actionType === 'save') {
        const saveColor = hasUnsavedChanges ? t.success : t.dimText;
        const saveTag = hasUnsavedChanges ? '[SAVE & APPLY CHANGES *]' : '[SAVE & APPLY CHANGES]';
        actionContent = isSelected ? `${t.selectedBg} ${marker} ${saveTag} ${ansi.reset}` : ` ${marker} ${saveColor}${saveTag}${ansi.reset}`;
      } else if (p.actionType === 'reset') {
        actionContent = isSelected ? `${t.selectedBg} ${marker} [RESET ALL PARAMETERS TO DEFAULTS] ${ansi.reset}` : ` ${marker} ${t.danger}[RESET ALL PARAMETERS TO DEFAULTS]${ansi.reset}`;
      } else if (p.actionType === 'reset_db') {
        actionContent = isSelected ? `${t.selectedBg} ${marker} ${t.danger}${ansi.bold}[RESET MEMORY / TRADING DATABASE]${ansi.reset}` : ` ${marker} ${t.danger}[RESET MEMORY / TRADING DATABASE]${ansi.reset}`;
      }

      this.rowHitboxes.push({ index: globalIdx, row: currentRowOffset, isAction: true, actionType: p.actionType });
      currentRowOffset++;
      lines.push(Box.row(actionContent, boxWidth, t.border));
    });

    lines.push(Box.divider(boxWidth, t.border));
    lines.push(Box.row(` ${t.dimText}[ENTER / SPACE / Click] Open Options Listbox · [ESC] Dashboard${ansi.reset}`, boxWidth, t.border));
    lines.push(Box.footer('', boxWidth, t.border));

    return lines;
  }
}
