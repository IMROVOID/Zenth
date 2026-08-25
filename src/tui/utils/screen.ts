/**
 * Terminal Screen and Cursor Controls
 */
export const Screen = {
  enterAltBuffer: '\x1b[?1049h\x1b[2J\x1b[H\x1b[?1000h\x1b[?1002h\x1b[?1003h\x1b[?1006h',
  exitAltBuffer: '\x1b[?1006l\x1b[?1003l\x1b[?1002l\x1b[?1000l\x1b[?1049l\x1b[?25h',
  enableMouse: '\x1b[?1000h\x1b[?1002h\x1b[?1003h\x1b[?1006h',
  disableMouse: '\x1b[?1006l\x1b[?1003l\x1b[?1002l\x1b[?1000l',
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h',
  clear: '\x1b[2J\x1b[H',
  moveTo: (row: number, col: number) => `\x1b[${row};${col}H`,
  clearLine: '\x1b[2K',
  clearLineFromCursor: '\x1b[K',
};
