import { MarketService } from '../market/marketService.js';
import { StrategyEngine } from '../strategy/strategyEngine.js';
import { RiskManager } from '../risk/riskManager.js';
import { ExecutionEngine } from '../execution/executionEngine.js';
import { ReplayEngine } from '../replay/replayEngine.js';
import { MemoryService } from '../memory/memoryService.js';
import { AdaptiveFilter } from '../memory/adaptiveFilter.js';
import { Logger, c } from '../logger/index.js';
import { ScanResult } from './types.js';

export class Scanner {
  static async executeScan(
    symbol: string,
    interval: string,
    requestedQuantity: number,
    market: MarketService,
    strategy: StrategyEngine,
    risk: RiskManager,
    execution: ExecutionEngine,
    replay: ReplayEngine,
    memory: MemoryService,
    adaptiveFilter: AdaptiveFilter,
    sessionId: string
  ): Promise<ScanResult> {
    Logger.banner(`LIVE MARKET SCAN: ${symbol.toUpperCase()} (${interval})`, `Real-time data from ${market.getDisplayName()} API & Supabase Memory Check`);

    Logger.info(`Fetching latest 300 candles from ${market.getDisplayName()} public feed...`);
    const candles = await market.fetchKlines(symbol, interval, 300);
    const latestCandle = candles[candles.length - 1];
    Logger.success(`Fetched 300 candles. Last Close: ${c.bold}${c.brightYellow}$${latestCandle.close.toFixed(2)}${c.reset} | Vol: ${c.white}${latestCandle.volume.toFixed(4)}${c.reset}`);

    const strategyResult = strategy.evaluate(candles);
    const maStatus = strategyResult.fastMA > strategyResult.slowMA ? `${c.green}BULLISH CROSSOVER${c.reset}` : `${c.red}BEARISH ALIGNMENT${c.reset}`;
    Logger.info(`Indicators: Fast MA(9) = ${c.cyan}$${strategyResult.fastMA.toFixed(2)}${c.reset} | Slow MA(21) = ${c.blue}$${strategyResult.slowMA.toFixed(2)}${c.reset} (${maStatus}) | RSI(14) = ${c.yellow}${strategyResult.rsi.toFixed(1)}${c.reset}`);
    Logger.signal(strategyResult.signal, `${c.bold}${strategyResult.signal}${c.reset} — ${strategyResult.reason}`);

    Logger.risk(`Evaluating risk constraints ($1,000 Hard Cap)...`);
    const riskResult = risk.evaluate(strategyResult.signal, strategyResult.currentPrice, requestedQuantity);
    Logger.risk(`Decision: ${c.bold}${riskResult.decision}${c.reset} — ${riskResult.reason}`);

    if (!riskResult.approved || riskResult.decision !== 'BUY') {
      console.log(`\n${c.gray}[HOLD] Final Outcome: ${c.bold}${riskResult.decision}${c.reset}${c.gray} (No paper order executed)${c.reset}\n`);
      return { decision: riskResult.decision, reason: riskResult.reason };
    }

    Logger.memory(`Checking active failure patterns in Supabase...`);
    const patternCondition = replay.classifyPattern(strategyResult.indicators);
    const filterResult = await adaptiveFilter.evaluate(symbol, patternCondition, {
      fastMA: strategyResult.indicators.fastMA,
      slowMA: strategyResult.indicators.slowMA,
      rsi: strategyResult.indicators.rsi,
      volumeRatio: strategyResult.indicators.volume / (strategyResult.indicators.volumeSMA || 1)
    });

    if (filterResult.shouldSkip) {
      Logger.signal('SKIP', `${c.brightRed}BLOCKED BY ADAPTIVE MEMORY:${c.reset} ${filterResult.reason}`);
      await memory.logTrade({
        timestamp: new Date().toISOString(),
        symbol,
        action: 'SKIP',
        price: strategyResult.currentPrice,
        quantity: requestedQuantity,
        notional_value: 0,
        entry_value: 0,
        exit_value: 0,
        pnl_percentage: 0,
        session_id: sessionId,
        reason: filterResult.reason || 'Blocked by Adaptive Memory Rule',
        mode: 'PAPER',
        outcome: 'SKIPPED',
        pnl: 0
      });

      console.log(`\n${c.yellow}[FILTERED] Final Outcome: SKIP (Capital protected by self-learned rule)${c.reset}\n`);
      return { decision: 'SKIP', reason: filterResult.reason || 'Blocked by memory filter' };
    }

    const order = execution.executePaperOrder(
      symbol,
      'BUY',
      strategyResult.currentPrice,
      riskResult.quantity,
      strategyResult.reason,
      'PAPER'
    );

    await memory.logTrade({
      timestamp: order.timestamp,
      symbol,
      action: 'BUY',
      price: order.price,
      quantity: order.quantity,
      notional_value: order.notionalValue,
      entry_value: order.notionalValue,
      exit_value: 0,
      pnl_percentage: 0,
      session_id: sessionId,
      reason: order.reason,
      mode: 'PAPER',
      outcome: 'PENDING',
      pnl: 0
    });

    console.log(`\n${c.green}┌────────────────────────────────────────────────────────────┐${c.reset}`);
    console.log(`${c.green}│${c.reset}  ${c.bold}${c.brightGreen}[EXECUTED] PAPER ORDER LOGGED TO SUPABASE${c.reset}${' '.repeat(17)}${c.green}│${c.reset}`);
    console.log(`${c.green}├────────────────────────────────────────────────────────────┤${c.reset}`);
    console.log(`${c.green}│${c.reset}  Order ID       : ${c.white}${order.id.padEnd(41)}${c.reset}${c.green}│${c.reset}`);
    console.log(`${c.green}│${c.reset}  Action         : ${c.brightGreen}${order.action.padEnd(41)}${c.reset}${c.green}│${c.reset}`);
    console.log(`${c.green}│${c.reset}  Symbol         : ${c.bold}${c.brightWhite}${order.symbol.toUpperCase().padEnd(41)}${c.reset}${c.green}│${c.reset}`);
    console.log(`${c.green}│${c.reset}  Price          : ${c.brightYellow}$${order.price.toFixed(2).padEnd(40)}${c.reset}${c.green}│${c.reset}`);
    console.log(`${c.green}│${c.reset}  Quantity       : ${c.white}${String(order.quantity).padEnd(41)}${c.reset}${c.green}│${c.reset}`);
    console.log(`${c.green}│${c.reset}  Entered Capital: ${c.brightCyan}$${order.notionalValue.toFixed(2)} USDT${' '.repeat(Math.max(0, 41 - String(order.notionalValue.toFixed(2)).length - 6))}${c.reset}${c.green}│${c.reset}`);
    console.log(`${c.green}└────────────────────────────────────────────────────────────┘${c.reset}\n`);

    return { order, decision: order.action, reason: order.reason };
  }
}
