// ANSI Escape Sequences Regex for true visible width calculation
const ANSI_REGEX = new RegExp(
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))',
  'g'
);

/**
 * Strips all ANSI escape codes from a string to get raw text.
 */
export function stripAnsi(str: string): string {
  return str.replace(ANSI_REGEX, '');
}

/**
 * Returns the visible character width of a string (ignoring ANSI styling).
 */
export function visibleWidth(str: string): number {
  return stripAnsi(str).length;
}

/**
 * Pads a string with ANSI escape codes to a target visible width.
 */
export function padRight(str: string, targetWidth: number, padChar = ' '): string {
  const currentWidth = visibleWidth(str);
  if (currentWidth >= targetWidth) return str;
  return str + padChar.repeat(targetWidth - currentWidth);
}

export function padLeft(str: string, targetWidth: number, padChar = ' '): string {
  const currentWidth = visibleWidth(str);
  if (currentWidth >= targetWidth) return str;
  return padChar.repeat(targetWidth - currentWidth) + str;
}

export function padCenter(str: string, targetWidth: number, padChar = ' '): string {
  const currentWidth = visibleWidth(str);
  if (currentWidth >= targetWidth) return str;
  const leftPadding = Math.floor((targetWidth - currentWidth) / 2);
  const rightPadding = targetWidth - currentWidth - leftPadding;
  return padChar.repeat(leftPadding) + str + padChar.repeat(rightPadding);
}

/**
 * Truncates a string to a max visible width, preserving ANSI formatting reset.
 */
export function truncateVisible(str: string, maxWidth: number): string {
  const raw = stripAnsi(str);
  if (raw.length <= maxWidth) return str;
  return raw.substring(0, Math.max(0, maxWidth - 3)) + '...';
}

/**
 * Truncates a string containing ANSI escape codes to a max visible width,
 * preserving ANSI formatting reset so colors don't bleed.
 */
export function truncateAnsi(str: string, maxWidth: number): string {
  if (visibleWidth(str) <= maxWidth) return str;

  let visibleCount = 0;
  let result = '';
  let i = 0;

  while (i < str.length && visibleCount < maxWidth) {
    if (str[i] === '\x1b') {
      const match = str.slice(i).match(/^(\x1b\[[0-9;?]*[a-zA-Z]|\x1b\][^\x07]*\x07)/);
      if (match) {
        result += match[0];
        i += match[0].length;
        continue;
      }
    }
    result += str[i];
    visibleCount++;
    i++;
  }

  return result + '\x1b[0m';
}
