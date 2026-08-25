import { Candle } from '../types.js';
import { StrategyEngine } from '../strategy/strategyEngine.js';
import { RiskManager } from '../risk/riskManager.js';
import { ReplayEngine } from '../replay/replayEngine.js';
import { MemoryService } from '../memory/memoryService.js';
import { AdaptiveFilter } from '../memory/adaptiveFilter.js';
import { Logger, c } from '../logger/index.js';
import { ActivePosition } from './types.js';
import { SessionTracker } from './sessionTracker.js';

export async function evaluateLoopEntry(
  cycleCount: number,
  symbol: string,
  candles: Candle[],
  currentPrice: number,
  activeLearningsCount: number,
  stopLossPct: number,
  takeProfitPct: number,
  targetAllocation: number,
  strategy: StrategyEngine,
  risk: RiskManager,
  replay: ReplayEngine,
  memory: MemoryService,
  adaptiveFilter: AdaptiveFilter,
  session: SessionTracker
): Promise<ActivePosition | null> {
  const strategyResult = strategy.evaluate(candles);
  const pattern = replay.classifyPattern(strategyResult.indicators);

  if (strategyResult.signal === 'BUY') {
    console.log(`\n[SIGNAL] ${c.bold}${c.brightGreen}CANDIDATE BUY SIGNAL DETECTED${c.reset} for ${c.bold}${c.brightWhite}${symbol.toUpperCase()}${c.reset} @ ${c.brightYellow}$${currentPrice.toFixed(2)}${c.reset}`);
    console.log(`   Pattern: ${c.magenta}${pattern}${c.reset} | RSI: ${c.yellow}${strategyResult.rsi.toFixed(1)}${c.reset}`);

    const qty = parseFloat((targetAllocation / currentPrice).toFixed(6));
    const riskResult = risk.evaluate('BUY', currentPrice, qty, session.sessionRealizedPnL, session.consecutiveLosses);

    if (!riskResult.approved) {
      Logger.risk(`Rejected: ${riskResult.reason}`);
      return null;
    }

    Logger.memory(`Querying Supabase Adaptive Memory...`);
    const filterResult = await adaptiveFilter.evaluate(symbol, pattern, {
      fastMA: strategyResult.indicators.fastMA,
      slowMA: strategyResult.indicators.slowMA,
      rsi: strategyResult.indicators.rsi,
      volumeRatio: strategyResult.indicators.volume / (strategyResult.indicators.volumeSMA || 1)
    }, 'STRICT');

    if (filterResult.shouldSkip) {
      Logger.signal('SKIP', `${c.brightRed}BLOCKED BY ADAPTIVE MEMORY:${c.reset} ${filterResult.reason}`);
      await memory.logTrade({
        timestamp: new Date().toISOString(),
        symbol,
        action: 'SKIP',
        price: currentPrice,
        quantity: qty,
        notional_value: 0,
        entry_value: 0,
        exit_value: 0,
        pnl_percentage: 0,
        session_id: session.sessionId,
        reason: filterResult.reason || 'Blocked by Adaptive Memory Rule',
        mode: 'PAPER',
        outcome: 'SKIPPED',
        pnl: 0
      });
      console.log(`   ${c.green}[FILTERED] Capital protected. Bad setup filtered out.${c.reset}\n`);
      return null;
    }

    const slPrice = currentPrice * (1 - stopLossPct / 100);
    const tpPrice = currentPrice * (1 + takeProfitPct / 100);
    const enteredCap = currentPrice * qty;

    session.totalEntries++;
    const newPosition: ActivePosition = {
      id: `LIVE-${Date.now()}`,
      symbol,
      entryPrice: currentPrice,
      quantity: qty,
      enteredCapital: enteredCap,
      entryTime: new Date().toISOString(),
      stopLossPrice: slPrice,
      takeProfitPrice: tpPrice,
      patternCondition: pattern,
      indicatorsAtEntry: strategyResult.indicators
    };

    console.log(`   ${c.bold}${c.brightGreen}[BUY ORDER]${c.reset} Buy ${c.brightWhite}${qty} ${symbol.toUpperCase()}${c.reset} @ ${c.brightYellow}$${currentPrice.toFixed(2)}${c.reset} ($${enteredCap.toFixed(2)} USDT)`);
    console.log(`   Take-Profit: ${c.green}$${tpPrice.toFixed(2)} (+${takeProfitPct}%)${c.reset} | Stop-Loss: ${c.red}$${slPrice.toFixed(2)} (-${stopLossPct}%)${c.reset}\n`);

    await memory.logTrade({
      timestamp: new Date().toISOString(),
      symbol,
      action: 'BUY',
      price: currentPrice,
      quantity: qty,
      notional_value: enteredCap,
      entry_value: enteredCap,
      exit_value: 0,
      pnl_percentage: 0,
      session_id: session.sessionId,
      reason: `Entered on 9/21 MA crossover: ${strategyResult.reason}`,
      mode: 'PAPER',
      outcome: 'PENDING',
      pnl: 0
    });

    await session.sync(memory, symbol, newPosition, targetAllocation, enteredCap, 0, 0);
    return newPosition;
  } else {
    if (cycleCount % 10 === 0 || cycleCount === 1) {
      Logger.renderDockedHud({
        symbol,
        currentPrice,
        totalEntries: session.totalEntries,
        activeEntries: 0,
        totalWins: session.sessionWins,
        totalLosses: session.sessionLosses,
        winRate: session.winRate,
        enteredMoney: 0,
        closedMoney: session.totalClosedMoney,
        realizedPnL: session.sessionRealizedPnL,
        realizedPnLPct: session.getRealizedPct(targetAllocation),
        activeRulesCount: activeLearningsCount
      });
    }

    Logger.tick(
      cycleCount,
      symbol,
      currentPrice,
      strategyResult.fastMA,
      strategyResult.slowMA,
      strategyResult.rsi,
      0,
      session.totalClosedMoney,
      activeLearningsCount,
      session.sessionWins,
      session.sessionLosses,
      session.sessionRealizedPnL
    );

    await session.sync(memory, symbol, null, targetAllocation);
    return null;
  }
}
