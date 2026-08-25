import { ThemeManager, ansi } from '../theme/index.js';
import { Box, padRight } from '../utils/index.js';
import { ExportFormat } from '../../core/export/types.js';

export interface ExportOption {
  format: ExportFormat;
  label: string;
  ext: string;
  desc: string;
}

export const EXPORT_OPTIONS: ExportOption[] = [
  { format: 'txt', label: 'TXT', ext: '.txt', desc: 'Plain Text Log Report & Summary' },
  { format: 'csv', label: 'CSV', ext: '.csv', desc: 'Comma-Separated Values for Excel/Data' },
  { format: 'md', label: 'MD', ext: '.md', desc: 'Markdown Report with Formatted Tables' },
  { format: 'docx', label: 'DOCX', ext: '.docx', desc: 'Microsoft Word Document Package' },
  { format: 'pdf', label: 'PDF', ext: '.pdf', desc: 'Printable Formatted PDF Document' }
];

export class ExportModal {
  static render(selectedIndex: number, width = 84): string[] {
    const t = ThemeManager.theme;
    const boxWidth = Math.min(width, 84);
    const lines: string[] = [];

    lines.push(Box.header('EXPORT TRADE & TICK LOGS', boxWidth, t.border, t.accent + ansi.bold));
    lines.push(Box.row(` ${t.boldText}Choose output file format for logs and session metrics:${ansi.reset}`, boxWidth, t.border));
    lines.push(Box.divider(boxWidth, t.border));

    EXPORT_OPTIONS.forEach((opt, idx) => {
      const isSelected = idx === selectedIndex;
      const numTag = `[${idx + 1}]`;
      const formatTag = padRight(`${opt.label} (${opt.ext})`, 14, ' ');
      const descTag = opt.desc;

      let rowContent = '';
      if (isSelected) {
        rowContent = `${t.selectedBg} > ${numTag} ${formatTag} - ${descTag} ${ansi.reset}`;
      } else {
        rowContent = `   ${t.accent}${numTag}${ansi.reset} ${t.boldText}${formatTag}${ansi.reset} ${t.dimText}- ${descTag}${ansi.reset}`;
      }

      lines.push(Box.row(rowContent, boxWidth, t.border));
    });

    lines.push(Box.divider(boxWidth, t.border));
    lines.push(Box.footer('[1-5 / Arrows] Select · [ENTER] Next: Set Path · [ESC] Cancel', boxWidth, t.border));

    return lines;
  }
}
