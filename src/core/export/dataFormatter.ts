import { ExportDataPayload } from './types.js';
import { formatPlainText } from './formatters/textFormatter.js';
import { formatCsv } from './formatters/csvFormatter.js';
import { formatMarkdown } from './formatters/markdownFormatter.js';
export { stripAnsi, escapeCsvField } from './formatters/utils.js';

export class DataFormatter {
  static toPlainText(p: ExportDataPayload): string {
    return formatPlainText(p);
  }

  static toCsv(p: ExportDataPayload): string {
    return formatCsv(p);
  }

  static toMarkdown(p: ExportDataPayload): string {
    return formatMarkdown(p);
  }
}
