import { visibleWidth, padRight, truncateAnsi } from './ansi.js';

/**
 * Pixel-Perfect Mathematical Box Drawing Helper
 * Guarantees every row, header, divider, and footer has 100% identical visible width.
 */
export class Box {
  static header(title: string, width: number, borderAnsi: string, titleAnsi = ''): string {
    const titleVis = visibleWidth(title);
    const prefix = `${borderAnsi}┌─[ ${titleAnsi}${title}\x1b[0m${borderAnsi} ]`;
    const prefixVis = titleVis + 6;
    const fillerLen = Math.max(0, width - prefixVis - 1);
    return `${prefix}${'─'.repeat(fillerLen)}┐\x1b[0m`;
  }

  static row(content: string, width: number, borderAnsi: string, bgAnsi = ''): string {
    const targetInner = Math.max(0, width - 4);
    const safeContent = truncateAnsi(content, targetInner);
    const padded = padRight(safeContent, targetInner, ' ');
    return `${bgAnsi}${borderAnsi}│\x1b[0m${bgAnsi} ${padded} ${borderAnsi}│\x1b[0m`;
  }

  static divider(width: number, borderAnsi: string, title = ''): string {
    if (!title) {
      return `${borderAnsi}├${'─'.repeat(Math.max(0, width - 2))}┤\x1b[0m`;
    }
    const titleVis = visibleWidth(title);
    const prefix = `${borderAnsi}├─[ ${title} ]`;
    const prefixVis = titleVis + 6;
    const fillerLen = Math.max(0, width - prefixVis - 1);
    return `${prefix}${'─'.repeat(fillerLen)}┤\x1b[0m`;
  }

  static footer(helpText: string, width: number, borderAnsi: string): string {
    if (!helpText) {
      return `${borderAnsi}└──${'─'.repeat(Math.max(0, width - 6))}──┘\x1b[0m`;
    }
    const textVis = visibleWidth(helpText);
    const prefix = `${borderAnsi}└─[ ${helpText} ]`;
    const prefixVis = textVis + 6;
    const fillerLen = Math.max(0, width - prefixVis - 1);
    return `${prefix}${'─'.repeat(fillerLen)}┘\x1b[0m`;
  }
}
