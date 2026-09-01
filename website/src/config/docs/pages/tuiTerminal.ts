import type { DocPage } from '../types';

export const tuiTerminalDocPage: DocPage = {
  slug: 'tui-terminal',
  title: 'Touch & Click Interactive TUI Terminal',
  subtitle:
    'Developer-focused fullscreen terminal user interface with permanently docked HUD, 14 high-contrast color themes, and interactive slash command palette.',
  category: 'Terminal Interface',
  categorySlug: 'terminal-interface',
  statusTag: '[FULL MOUSE & TOUCH SUPPORT]',
  badges: ['[DOCKED_HUD_3ROW]', '[14_THEMES]', '[SLASH_PALETTE_/]', '[SPARKLINES]'],
  lastUpdated: 'August 2026',
  prevPage: { title: 'Adaptive Learning', slug: 'adaptive-learning' },
  nextPage: { title: 'Export Subsystem', slug: 'export-engine' },
  sections: [
    {
      id: 'pinned-docked-hud',
      title: 'Pinned 3-Row Docked Viewport HUD',
      content:
        'The top 3 rows of the terminal viewport are permanently pinned and render real-time market metrics, position telemetry, and scoreboard win rates without screen tearing:',
      codeBlock: {
        language: 'text',
        filename: 'Pinned HUD Viewport',
        code: '┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐\n│ ZENTH TERMINAL v1.0.1 │ BTC/USDT $96,420.50 ▲ +3.24% │ SMA9: $96,380.00 │ SMA21: $96,120.00 │ RSI: 58.4│\n├───────────────────────────────────────────────────────────────────────────────────────────────────────┤\n│ POSITION: [LONG 0.01 BTC] │ Entry: $96,150.00 │ PnL: +$2.70 (+0.28%) │ TP: $99,034.50 │ SL: $94,707.75│\n├───────────────────────────────────────────────────────────────────────────────────────────────────────┤\n│ SCOREBOARD: Wins: 14 | Losses: 3 (82.35% WR) │ Realized: +$142.80 │ Closed: $8,420.00 │ [PAPER_ONLINE]│\n└───────────────────────────────────────────────────────────────────────────────────────────────────────┘',
      },
    },
    {
      id: 'slash-commands-palette',
      title: 'Interactive Slash Commands Palette (/)',
      content:
        'Press `/` anywhere in the running terminal to open the fuzzy search command palette:',
      matrixTable: {
        headers: ['Slash Command', 'Operation & Direct View Switch'],
        rows: [
          ['/status', 'Switch view to live trading tick stream and real-time sparkline'],
          ['/ledger', 'Open scrollable historical trade ledger table from database'],
          ['/learnings', 'Browse active adaptive failure rules and trigger counts'],
          ['/theme', 'Open interactive color theme selector with real-time preview'],
          ['/config', 'Edit bot trading parameters and risk ceilings live in memory'],
          ['/scan', 'Trigger immediate single-pass real-time market analysis'],
          ['/replay', 'Run historical backtest comparison (Raw Baseline vs Adaptive Memory)'],
          ['/resetdb', 'Perform 1-click database truncation and table re-initialization'],
          ['/export', 'Open multi-format export dialog (TXT, CSV, MD, DOCX, PDF)'],
          ['/copy', 'Copy recent tick telemetry and trade logs to OS clipboard'],
        ],
      },
    },
    {
      id: 'color-theme-presets',
      title: '14 High-Contrast Theme Presets',
      content:
        'Switch themes dynamically via `/theme` or tab `[4: THEME]`: `matrix-terminal`, `cyberpunk`, `synthwave-84`, `pure-dark`, `amber-charcoal`, `tokyo-night`, `solarized-dark`, `monokai-pro`, `catppuccin-mocha`, `dracula`, `one-dark`, `gruvbox-dark`, `nord-dark`, and `oxide-cloud`.',
    },
  ],
};
