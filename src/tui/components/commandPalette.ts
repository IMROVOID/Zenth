import { ThemeManager, ansi } from '../theme/index.js';
import { padRight, Box } from '../utils/index.js';
import { COIN_FULL_NAMES, CoinInfo, STOCK_COMPANY_NAMES, StockInfo } from '../../core/market/index.js';

export interface CommandItem {
  name: string;
  aliases?: string[];
  description: string;
  category: 'views' | 'actions' | 'settings' | 'system';
  actionType?: 'view' | 'command' | 'set_symbol' | 'set_theme' | 'set_config';
  payload?: string;
}

export class CommandPalette {
  static getBaseCommands(isTradingPaused = false): CommandItem[] {
    const pauseOrResumeCmd: CommandItem = isTradingPaused
      ? { name: 'resume', aliases: ['start', 'unpause', '/resume', '/start', '/unpause'], description: 'Resume autonomous paper trading loop', category: 'actions', actionType: 'command', payload: 'resume' }
      : { name: 'pause', aliases: ['stop', '/pause', '/stop'], description: 'Pause autonomous paper trading loop', category: 'actions', actionType: 'command', payload: 'pause' };

    return [
      { name: 'status', aliases: ['dashboard', 'live', '/status', '/dashboard', '/live'], description: 'Live real-time trading HUD & tick stream', category: 'views', actionType: 'view', payload: 'dashboard' },
      pauseOrResumeCmd,
      { name: 'coins', aliases: ['pairs', 'markets', '/coins', '/pairs', '/markets'], description: 'Browse XT.com coin pairs with live prices & trend charts', category: 'views', actionType: 'view', payload: 'coins' },
      { name: 'stocks', aliases: ['shares', 'equities', 'tradfi', '/stocks', '/shares', '/equities', '/tradfi'], description: 'Browse XT.com stocks & TradFi pairs with live prices & trend charts', category: 'views', actionType: 'view', payload: 'stocks' },
      { name: 'ledger', aliases: ['trades', 'history', '/ledger', '/trades', '/history'], description: 'Browse trade ledger records from Supabase database', category: 'views', actionType: 'view', payload: 'ledger' },
      { name: 'rules', aliases: ['learnings', 'memory', '/rules', '/learnings', '/memory'], description: 'Inspect active self-learned failure rules in Supabase', category: 'views', actionType: 'view', payload: 'learnings' },
      { name: 'theme', aliases: ['colors', 'style', '/theme', '/colors', '/style'], description: 'Switch color theme (14 Dark & Neon themes)', category: 'views', actionType: 'view', payload: 'theme' },
      { name: 'config', aliases: ['settings', '/config', '/settings'], description: 'View and adjust bot trading parameters and allocation limits', category: 'views', actionType: 'view', payload: 'config' },
      { name: 'copy', aliases: ['clipboard', 'cp', '/copy', '/clipboard', '/cp'], description: 'Copy all trade and tick logs to system clipboard', category: 'actions', actionType: 'command', payload: 'copy' },
      { name: 'export', aliases: ['save', 'dump', '/export', '/save', '/dump'], description: 'Export all trade & tick logs to TXT, CSV, MD, DOCX or PDF', category: 'actions', actionType: 'command', payload: 'export' },
      { name: 'scan', aliases: ['/scan'], description: 'Trigger an immediate single-pass live market scan', category: 'actions', actionType: 'command', payload: 'scan' },
      { name: 'replay', aliases: ['/replay'], description: 'Run historical replay backtest comparison', category: 'actions', actionType: 'command', payload: 'replay' },
      { name: 'reset', aliases: ['/reset'], description: 'Clear active symbol memory rules and ledger', category: 'actions', actionType: 'command', payload: 'reset' },
      { name: 'resetdb', aliases: ['wipe', 'wipedb', '/resetdb', '/wipe'], description: 'Wipe all records from local and remote Supabase database', category: 'actions', actionType: 'command', payload: 'resetdb' },
      { name: 'onboard', aliases: ['setup', 'wizard', '/onboard', '/setup'], description: 'Launch initial setup and database onboarding wizard', category: 'system', actionType: 'command', payload: 'onboard' },
      { name: 'help', aliases: ['info', '/help', '/?', '/info'], description: 'Display command reference and keyboard shortcuts', category: 'views', actionType: 'view', payload: 'help' },
      { name: 'quit', aliases: ['exit', 'q', '/quit', '/exit', '/q'], description: 'Cleanly shut down Zenth and print session debrief', category: 'system', actionType: 'command', payload: 'quit' }
    ];
  }

  static search(query: string, isTradingPaused = false, coinsList: CoinInfo[] = [], stocksList: StockInfo[] = []): CommandItem[] {
    const trimmed = query.trim();
    const isSlashMode = trimmed.startsWith('/');
    const raw = trimmed.toLowerCase().replace(/^\//, '');
    const baseList = this.getBaseCommands(isTradingPaused);

    if (isSlashMode) {
      if (!raw) return baseList.map(c => ({ ...c, name: `/${c.name}` }));
      return baseList
        .filter(cmd =>
          cmd.name.toLowerCase().includes(raw) ||
          cmd.aliases?.some(a => a.toLowerCase().replace(/^\//, '').includes(raw)) ||
          cmd.description.toLowerCase().includes(raw)
        )
        .map(c => ({ ...c, name: `/${c.name}` }));
    }

    if (!raw) return baseList;
    const results: CommandItem[] = [];

    const matchingBase = baseList.filter(cmd =>
      cmd.name.toLowerCase().includes(raw) ||
      cmd.aliases?.some(a => a.toLowerCase().replace(/^\//, '').includes(raw)) ||
      cmd.description.toLowerCase().includes(raw)
    );
    results.push(...matchingBase);

    const availableCoins = coinsList.length > 0 ? coinsList : Object.entries(COIN_FULL_NAMES).map(([sym, name]) => ({
      symbol: `${sym}_usdt`,
      baseCoin: sym.toUpperCase(),
      fullName: name,
      price: 0,
      change24hPct: 0,
      volume24h: 0
    }));

    const matchingCoins = availableCoins.filter(c =>
      c.baseCoin.toLowerCase().includes(raw) ||
      c.fullName.toLowerCase().includes(raw) ||
      c.symbol.toLowerCase().includes(raw)
    );

    matchingCoins.slice(0, 5).forEach(c => {
      const priceTag = c.price > 0 ? ` ($${c.price >= 1 ? c.price.toFixed(2) : c.price.toFixed(4)})` : '';
      if (!results.some(r => r.payload === c.symbol)) {
        results.push({
          name: `coin ${c.baseCoin}`,
          aliases: [c.symbol, c.baseCoin.toLowerCase(), c.fullName.toLowerCase()],
          description: `Switch to ${c.fullName} [${c.baseCoin}_USDT]${priceTag}`,
          category: 'settings',
          actionType: 'set_symbol',
          payload: c.symbol
        });
      }
    });

    const availableStocks = stocksList.length > 0 ? stocksList : Object.entries(STOCK_COMPANY_NAMES).map(([sym, name]) => ({
      symbol: `${sym}_usdt`,
      ticker: sym.toUpperCase(),
      companyName: name,
      price: 0,
      change24hPct: 0,
      volume24h: 0
    }));

    const matchingStocks = availableStocks.filter(s =>
      s.ticker.toLowerCase().includes(raw) ||
      s.companyName.toLowerCase().includes(raw) ||
      s.symbol.toLowerCase().includes(raw)
    );

    matchingStocks.slice(0, 5).forEach(s => {
      const priceTag = s.price > 0 ? ` ($${s.price >= 1 ? s.price.toFixed(2) : s.price.toFixed(4)})` : '';
      if (!results.some(r => r.payload === s.symbol)) {
        results.push({
          name: `stock ${s.ticker}`,
          aliases: [s.symbol, s.ticker.toLowerCase(), s.companyName.toLowerCase()],
          description: `Switch to ${s.companyName} [${s.ticker}]${priceTag}`,
          category: 'settings',
          actionType: 'set_symbol',
          payload: s.symbol
        });
      }
    });

    const themes = ThemeManager.listThemes();
    const matchingThemes = themes.filter(th =>
      th.name.includes(raw) || th.displayName.toLowerCase().includes(raw)
    );
    matchingThemes.slice(0, 3).forEach(th => {
      if (!results.some(r => r.payload === th.name)) {
        results.push({
          name: `theme ${th.displayName}`,
          aliases: [th.name],
          description: `Switch UI theme to ${th.displayName}`,
          category: 'settings',
          actionType: 'set_theme',
          payload: th.name
        });
      }
    });

    return results;
  }

  static renderDropdown(query: string, selectedIndex: number, width = 80, isTradingPaused = false, coinsList: CoinInfo[] = [], stocksList: StockInfo[] = []): string[] {
    const t = ThemeManager.theme;
    const matches = this.search(query, isTradingPaused, coinsList, stocksList);
    if (matches.length === 0) return [];

    const safeIndex = Math.max(0, Math.min(matches.length - 1, selectedIndex));
    const lines: string[] = [];
    const maxItems = 5;
    const total = matches.length;

    let startIndex = Math.max(0, safeIndex - Math.floor(maxItems / 2));
    if (startIndex + maxItems > total) {
      startIndex = Math.max(0, total - maxItems);
    }
    const visibleMatches = matches.slice(startIndex, startIndex + maxItems);
    const boxWidth = Math.min(width, 84);

    const isSlash = query.trim().startsWith('/');
    const titleTag = isSlash ? 'COMMANDS' : 'SEARCH & COMMANDS';
    const scrollTag = total > maxItems ? ` (${selectedIndex + 1}/${total})` : '';
    lines.push(Box.header(`${titleTag}${scrollTag}`, boxWidth, t.border, t.accent + ansi.bold));

    visibleMatches.forEach((cmd, relIdx) => {
      const absIdx = startIndex + relIdx;
      const isSelected = absIdx === selectedIndex;
      const cmdName = padRight(cmd.name, 18, ' ');
      const desc = cmd.description.substring(0, Math.max(10, boxWidth - 27));

      const row = isSelected
        ? `${t.selectedBg} > ${cmdName} ${desc} ${ansi.reset}`
        : `   ${t.accent}${cmdName}${ansi.reset} ${t.dimText}${desc}${ansi.reset}`;

      lines.push(Box.row(row, boxWidth, t.border));
    });

    lines.push(Box.footer('[ENTER] Select · [TAB] Complete · [ESC] Clear', boxWidth, t.border));
    return lines;
  }
}
