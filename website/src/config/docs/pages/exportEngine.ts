import type { DocPage } from '../types';

export const exportEngineDocPage: DocPage = {
  slug: 'export-engine',
  title: 'Multi-Format Report Export Subsystem',
  subtitle:
    'Zero-dependency report compilation into Plain Text, CSV, GitHub Markdown, Word DOCX, and Vector PDF 1.4 with OS clipboard integration.',
  category: 'Terminal Interface',
  categorySlug: 'terminal-interface',
  statusTag: '[ZERO EXTERNAL BINARIES]',
  badges: ['[TXT]', '[CSV]', '[MARKDOWN]', '[DOCX_XML]', '[VECTOR_PDF_1.4]', '[CLIPBOARD]'],
  lastUpdated: 'August 2026',
  prevPage: { title: 'TUI Terminal', slug: 'tui-terminal' },
  nextPage: { title: 'CLI Reference', slug: 'cli-reference' },
  sections: [
    {
      id: 'supported-export-formats',
      title: 'Supported Document Formats',
      content:
        'The `ExportEngine` compiles full session summaries without external binaries or Puppeteer dependencies:',
      matrixTable: {
        headers: ['Format', 'File Extension', 'Encoding Architecture', 'Key Visual Features'],
        rows: [
          ['Plain Text', '.txt', 'Fixed-width ASCII table', 'Clean tabular output for terminal viewing & log archival'],
          ['Dual-Table CSV', '.csv', 'RFC-4180 Delimited Text', 'Separate tables for TradeLedger orders and TickLog telemetry'],
          ['GitHub Markdown', '.md', 'GitHub Flavored Markdown', 'Formatted tables with outcome badges ([WIN], [LOSS]) and rules'],
          ['Office Open XML', '.docx', 'Native ZIP XML Package', 'Word document with formatted tables, headers, and callout styles'],
          ['Native Vector PDF', '.pdf', 'Pure TypeScript PDF 1.4 Builder', 'Helvetica fonts, vector metrics cards, and multi-page tables'],
          ['OS Clipboard', 'System', 'Platform Native API', 'PowerShell Set-Clipboard, macOS pbcopy, Linux xclip / wl-copy'],
        ],
      },
    },
    {
      id: 'export-dialog-workflow',
      title: 'Interactive Format Selection Modal',
      content:
        'Type `/export` or click Export in the terminal to trigger the format selection modal:',
      codeBlock: {
        language: 'text',
        filename: 'Interactive Export Dialog',
        code: '┌───────────────────────────────────────────────────────────┐\n│ SELECT EXPORT FORMAT & DESTINATION                        │\n├───────────────────────────────────────────────────────────┤\n│ [1] Plain Text Report (.txt)                              │\n│ [2] Dual-Table CSV Data (.csv)                            │\n│ [3] GitHub Markdown Report (.md)                          │\n│ [4] Microsoft Word Document (.docx)                       │\n│ [5] Vector PDF 1.4 Report (.pdf)                          │\n│ [6] Copy Formatted Logs to OS Clipboard                   │\n├───────────────────────────────────────────────────────────┤\n│ Enter destination path [./exports/session_report.pdf]:    │\n│ Press [ENTER] to confirm • [ESC] to cancel                │\n└───────────────────────────────────────────────────────────┘',
      },
    },
  ],
};
