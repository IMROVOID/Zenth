import { c } from './ansiColors.js';

export interface DockedHudOptions {
  symbol: string;
  currentPrice: number;
  totalEntries: number;
  activeEntries: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  enteredMoney: number;
  closedMoney: number;
  realizedPnL: number;
  realizedPnLPct: number;
  activePositionPnL?: number;
  activePositionPct?: number;
  activePositionValue?: number;
  activeRulesCount: number;
}

export class Logger {
  static time(): string {
    const d = new Date();
    return `${c.gray}[${d.toTimeString().substring(0, 8)}]${c.reset}`;
  }

  static badge(text: string, bgColor: string, textColor = c.bold + c.white): string {
    return `${bgColor}${textColor} ${text} ${c.reset}`;
  }

  static info(msg: string): void {
    console.log(`${this.time()} ${this.badge('INFO', c.bgBlue)} ${msg}`);
  }

  static success(msg: string): void {
    console.log(`${this.time()} ${this.badge('SUCCESS', c.bgGreen)} ${c.brightGreen}${msg}${c.reset}`);
  }

  static warn(msg: string): void {
    console.log(`${this.time()} ${this.badge('WARN', c.bgYellow, c.bold + c.black)} ${c.yellow}${msg}${c.reset}`);
  }

  static error(msg: string): void {
    console.log(`${this.time()} ${this.badge('ERROR', c.bgRed)} ${c.brightRed}${msg}${c.reset}`);
  }

  static signal(signal: 'BUY' | 'SELL' | 'HOLD' | 'SKIP', msg: string): void {
    let badgeStr = '';
    switch (signal) {
      case 'BUY':
        badgeStr = this.badge('BUY', c.bgGreen);
        break;
      case 'SELL':
        badgeStr = this.badge('SELL', c.bgRed);
        break;
      case 'SKIP':
        badgeStr = this.badge('SKIP', c.bgYellow, c.bold + c.black);
        break;
      case 'HOLD':
        badgeStr = this.badge('HOLD', c.bgDarkGray);
        break;
    }
    console.log(`${this.time()} ${badgeStr} ${msg}`);
  }

  static memory(msg: string): void {
    console.log(`${this.time()} ${this.badge('MEMORY', c.bgMagenta)} ${c.magenta}${msg}${c.reset}`);
  }

  static risk(msg: string): void {
    console.log(`${this.time()} ${this.badge('RISK', c.bgCyan, c.bold + c.black)} ${c.cyan}${msg}${c.reset}`);
  }

  static renderDockedHud(opts: DockedHudOptions): void {
    const width = 94;
    const pnlSign = opts.realizedPnL >= 0 ? '+' : '';
    const pnlColor = opts.realizedPnL > 0 ? c.brightGreen : opts.realizedPnL < 0 ? c.brightRed : c.white;
    const wrColor = opts.winRate >= 50 ? c.brightGreen : opts.totalWins + opts.totalLosses === 0 ? c.white : c.yellow;

    console.log(`${c.brightCyan}╔${'═'.repeat(width)}╗${c.reset}`);
    console.log(`${c.brightCyan}║${c.reset}  ${c.bold}${c.brightWhite}LIVE DOCKED SESSION HUD${c.reset} │ ${c.bold}${opts.symbol.toUpperCase()}${c.reset}: ${c.brightYellow}$${opts.currentPrice.toFixed(2)}${c.reset} │ Active Rules: ${c.magenta}${opts.activeRulesCount}${c.reset}${' '.repeat(Math.max(1, width - 64 - opts.symbol.length - opts.currentPrice.toFixed(2).length))}${c.brightCyan}║${c.reset}`);
    console.log(`${c.brightCyan}╠${'═'.repeat(width)}╣${c.reset}`);

    const entriesStr = `Entries: ${c.bold}${opts.totalEntries}${c.reset} (${opts.activeEntries > 0 ? c.green + '1 Open' : c.gray + '0 Open'}${c.reset})`;
    const wlStr = `W/L: ${c.green}${opts.totalWins}W${c.reset}/${c.red}${opts.totalLosses}L${c.reset} (Rate: ${wrColor}${opts.winRate.toFixed(1)}%${c.reset})`;
    const pnlStr = `Realized: ${pnlColor}${pnlSign}$${opts.realizedPnL.toFixed(2)} (${pnlSign}${opts.realizedPnLPct.toFixed(2)}%)${c.reset}`;

    console.log(`${c.brightCyan}║${c.reset}  ${entriesStr} │ ${wlStr} │ ${pnlStr}${' '.repeat(16)}${c.brightCyan}║${c.reset}`);

    const inMoneyStr = `Entered: ${c.yellow}$${opts.enteredMoney.toFixed(2)}${c.reset}`;
    const outMoneyStr = `Closed: ${c.cyan}$${opts.closedMoney.toFixed(2)}${c.reset}`;

    let posStr = '';
    if (opts.activeEntries > 0 && opts.activePositionValue !== undefined && opts.activePositionPnL !== undefined) {
      const posPnlSign = opts.activePositionPnL >= 0 ? '+' : '';
      const posPnlColor = opts.activePositionPnL >= 0 ? c.brightGreen : c.brightRed;
      posStr = `Position Value: ${c.white}$${opts.activePositionValue.toFixed(2)}${c.reset} (${posPnlColor}${posPnlSign}$${opts.activePositionPnL.toFixed(2)} / ${posPnlSign}${(opts.activePositionPct || 0).toFixed(2)}%${c.reset})`;
    } else {
      posStr = `Position: ${c.gray}FLAT (Idle Waiting Setup)${c.reset}`;
    }

    console.log(`${c.brightCyan}║${c.reset}  ${inMoneyStr} │ ${outMoneyStr} │ ${posStr}${' '.repeat(10)}${c.brightCyan}║${c.reset}`);
    console.log(`${c.brightCyan}╚${'═'.repeat(width)}╝${c.reset}`);
  }

  static tick(
    tickNum: number,
    symbol: string,
    price: number,
    fastMA: number,
    slowMA: number,
    rsi: number,
    enteredMoney: number,
    closedMoney: number,
    rulesCount: number,
    sessionWin: number,
    sessionLoss: number,
    pnl: number
  ): void {
    const pnlSign = pnl >= 0 ? '+' : '';
    const pnlColor = pnl > 0 ? c.brightGreen : pnl < 0 ? c.brightRed : c.gray;
    const rsiColor = rsi > 70 ? c.yellow : rsi < 30 ? c.cyan : c.white;
    const maCross = fastMA > slowMA ? `${c.green}▲ BULL${c.reset}` : `${c.red}▼ BEAR${c.reset}`;

    const line = `${this.time()} ${c.bold}${c.brightCyan}TICK #${tickNum}${c.reset} │ ${c.bold}${symbol.toUpperCase()}${c.reset}: ${c.brightYellow}$${price.toFixed(2)}${c.reset} │ ${maCross} │ RSI: ${rsiColor}${rsi.toFixed(1)}${c.reset} │ In: ${c.yellow}$${enteredMoney.toFixed(2)}${c.reset} │ Out: ${c.cyan}$${closedMoney.toFixed(2)}${c.reset} │ Score: ${c.green}${sessionWin}W${c.reset}/${c.red}${sessionLoss}L${c.reset} │ PnL: ${pnlColor}${pnlSign}$${pnl.toFixed(2)}${c.reset}`;
    console.log(line);
  }

  static positionStatus(
    symbol: string,
    entryPrice: number,
    currentPrice: number,
    quantity: number,
    enteredMoney: number,
    currentValue: number,
    pnl: number,
    pnlPct: number,
    tp: number,
    sl: number
  ): void {
    const pnlSign = pnl >= 0 ? '+' : '';
    const pnlColor = pnl >= 0 ? c.brightGreen : c.brightRed;
    const badge = this.badge('POSITION', c.bgGreen);

    console.log(`${this.time()} ${badge} ${c.bold}${symbol.toUpperCase()}${c.reset} │ In: ${c.yellow}$${enteredMoney.toFixed(2)}${c.reset} (${quantity} BTC) │ Val: ${c.white}$${currentValue.toFixed(2)}${c.reset} │ PnL: ${pnlColor}${c.bold}${pnlSign}$${pnl.toFixed(2)} (${pnlSign}${pnlPct.toFixed(2)}%)${c.reset} │ TP: ${c.green}$${tp.toFixed(2)}${c.reset} │ SL: ${c.red}$${sl.toFixed(2)}${c.reset}`);
  }

  static banner(title: string, subtitle?: string): void {
    const width = 78;
    console.log(`\n${c.cyan}┌${'─'.repeat(width)}┐${c.reset}`);
    console.log(`${c.cyan}│${c.reset}  ${c.bold}${c.brightWhite}${title.padEnd(width - 2)}${c.reset}${c.cyan}│${c.reset}`);
    if (subtitle) {
      console.log(`${c.cyan}│${c.reset}  ${c.dim}${subtitle.padEnd(width - 2)}${c.reset}${c.cyan}│${c.reset}`);
    }
    console.log(`${c.cyan}└${'─'.repeat(width)}┘${c.reset}\n`);
  }
}
