import { Candle, StrategyResult, TradeOutcome } from '../types.js';
import { MemoryService } from '../memory/memoryService.js';
import { ActivePosition } from './types.js';
import { SessionTracker } from './sessionTracker.js';
import { Logger, c } from '../logger/index.js';

export class PositionManager {
  static evaluatePosition(
    pos: ActivePosition,
    currentPrice: number,
    candles: Candle[],
    strategyResult: StrategyResult,
    stopLossPct: number,
    takeProfitPct: number,
    exitOnReverseCross = true,
    breakevenTriggerPct = 0,
    trailingStopPct = 0
  ): {
    shouldClose: boolean;
    exitReason: string;
    outcome: TradeOutcome;
    unrealizedPnL: number;
    pnlPct: number;
    currentVal: number;
  } {
    const currentVal = currentPrice * pos.quantity;
    const priceDiff = currentPrice - pos.entryPrice;
    const pnlPct = (priceDiff / pos.entryPrice) * 100;
    const unrealizedPnL = priceDiff * pos.quantity;

    // Track highest price for trailing stops
    if (!pos.highestPrice || currentPrice > pos.highestPrice) {
      pos.highestPrice = currentPrice;
    }

    // Breakeven Stop Trigger
    if (breakevenTriggerPct > 0 && !pos.breakevenApplied && pnlPct >= breakevenTriggerPct) {
      pos.stopLossPrice = Math.max(pos.stopLossPrice, pos.entryPrice);
      pos.breakevenApplied = true;
    }

    // Trailing Stop Adjustment
    if (trailingStopPct > 0 && pos.highestPrice) {
      const trailStop = pos.highestPrice * (1 - trailingStopPct / 100);
      if (trailStop > pos.stopLossPrice) {
        pos.stopLossPrice = trailStop;
      }
    }

    const slHit = currentPrice <= pos.stopLossPrice;
    const tpHit = currentPrice >= pos.takeProfitPrice;
    const bearExit = exitOnReverseCross && strategyResult.signal === 'SELL';

    let shouldClose = false;
    let exitReason = '';
    let outcome: TradeOutcome = 'PENDING';

    if (slHit) {
      shouldClose = true;
      exitReason = pos.breakevenApplied && pos.stopLossPrice >= pos.entryPrice
        ? `Breakeven Stop triggered at $${currentPrice.toFixed(2)}`
        : `Stop-Loss hit (-${stopLossPct}%) at $${currentPrice.toFixed(2)}`;
      outcome = pnlPct >= 0 ? 'BREAKEVEN' : 'LOSS';
    } else if (tpHit) {
      shouldClose = true;
      exitReason = `Take-Profit hit (+${takeProfitPct}%) at $${currentPrice.toFixed(2)}`;
      outcome = 'WIN';
    } else if (bearExit) {
      shouldClose = true;
      exitReason = `Bearish MA crossover exit at $${currentPrice.toFixed(2)}`;
      outcome = pnlPct > 0.1 ? 'WIN' : pnlPct < -0.1 ? 'LOSS' : 'BREAKEVEN';
    }

    return { shouldClose, exitReason, outcome, unrealizedPnL, pnlPct, currentVal };
  }

  static async closePosition(
    pos: ActivePosition,
    currentPrice: number,
    exitReason: string,
    outcome: TradeOutcome,
    unrealizedPnL: number,
    pnlPct: number,
    currentVal: number,
    memory: MemoryService,
    session: SessionTracker,
    symbol: string,
    autoLearn = true
  ): Promise<void> {
    if (outcome === 'WIN') {
      session.sessionWins++;
      session.consecutiveLosses = 0;
    } else if (outcome === 'LOSS') {
      session.sessionLosses++;
      session.consecutiveLosses++;
    }

    session.totalClosedMoney += currentVal;
    session.sessionRealizedPnL += unrealizedPnL;

    const pnlSign = unrealizedPnL >= 0 ? '+' : '';
    const pnlColor = outcome === 'WIN' ? c.brightGreen : c.brightRed;

    const outcomeText = outcome === 'WIN' ? `${c.brightGreen}[WIN]` : `${c.brightRed}[LOSS]`;
    console.log(`\n${c.cyan}┌────────────────────────────────────────────────────────────┐${c.reset}`);
    console.log(`${c.cyan}│${c.reset}  ${c.bold}POSITION CLOSED: ${outcomeText}${c.reset}${' '.repeat(39)}${c.cyan}│${c.reset}`);
    console.log(`${c.cyan}├────────────────────────────────────────────────────────────┤${c.reset}`);
    console.log(`${c.cyan}│${c.reset}  Symbol         : ${c.bold}${c.white}${pos.symbol.toUpperCase().padEnd(41)}${c.reset}${c.cyan}│${c.reset}`);
    console.log(`${c.cyan}│${c.reset}  Entered Capital: ${c.yellow}$${pos.enteredCapital.toFixed(2).padEnd(40)}${c.reset}${c.cyan}│${c.reset}`);
    console.log(`${c.cyan}│${c.reset}  Closed Capital : ${c.brightCyan}$${currentVal.toFixed(2).padEnd(40)}${c.reset}${c.cyan}│${c.reset}`);
    console.log(`${c.cyan}│${c.reset}  Realized PnL   : ${pnlColor}${c.bold}${pnlSign}$${unrealizedPnL.toFixed(2)} (${pnlSign}${pnlPct.toFixed(2)}%)${c.reset}${' '.repeat(Math.max(0, 41 - String(unrealizedPnL.toFixed(2)).length - String(pnlPct.toFixed(2)).length - 6))}${c.cyan}│${c.reset}`);
    console.log(`${c.cyan}│${c.reset}  Reason         : ${c.gray}${exitReason.substring(0, 41).padEnd(41)}${c.reset}${c.cyan}│${c.reset}`);
    console.log(`${c.cyan}└────────────────────────────────────────────────────────────┘${c.reset}\n`);

    await memory.logTrade({
      timestamp: new Date().toISOString(),
      symbol: pos.symbol,
      action: 'SELL',
      price: currentPrice,
      quantity: pos.quantity,
      notional_value: currentVal,
      entry_value: pos.enteredCapital,
      exit_value: currentVal,
      pnl_percentage: pnlPct,
      session_id: session.sessionId,
      reason: exitReason,
      mode: 'PAPER',
      outcome,
      pnl: unrealizedPnL
    });

    if (outcome === 'LOSS' && autoLearn) {
      Logger.memory(`Synthesizing failure pattern into Supabase adaptive_learnings...`);
      let newRule = `Avoid ${symbol.toUpperCase()} entries during ${pos.patternCondition} setups.`;
      if (pos.patternCondition === 'MA_CROSSOVER_LOW_VOLUME') {
        newRule = `Skip ${symbol.toUpperCase()} 9/21 MA crossovers on low volume (<75% 20 SMA) to prevent fakeouts.`;
      } else if (pos.patternCondition === 'STANDARD_MA_CROSSOVER') {
        newRule = `Require secondary volume confirmation before confirming standard ${symbol.toUpperCase()} MA crossovers.`;
      }

      await memory.recordLearning({
        symbol: pos.symbol,
        pattern_condition: pos.patternCondition,
        loss_reason: exitReason,
        trading_rule: newRule,
        status: 'ACTIVE',
        metadata: {
          lossPnl: unrealizedPnL,
          entryPrice: pos.entryPrice,
          exitPrice: currentPrice,
          indicators: pos.indicatorsAtEntry
        }
      });
      Logger.success(`New adaptive rule recorded to Supabase.`);
    }
  }
}
