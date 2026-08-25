import { ReplayTrade, ReplaySummary, TradeOutcome } from '../types.js';
import { StrategyEngine } from '../strategy/strategyEngine.js';
import { RiskManager } from '../risk/riskManager.js';
import { ReplayOptions } from './types.js';
import { classifyPattern } from './patternClassifier.js';
import { calculateSummary } from './metrics.js';

export function executeRawReplay(
  options: ReplayOptions,
  strategy: StrategyEngine,
  risk: RiskManager
): { trades: ReplayTrade[]; summary: ReplaySummary } {
  const {
    symbol = 'btc_usdt',
    timeframe = '5m',
    candles,
    stopLossPct = 1.5,
    takeProfitPct = 3.0,
    allocationUsd = 500.0
  } = options;

  const minWarmup = 25;
  if (candles.length < minWarmup + 10) {
    throw new Error(`Insufficient candles for replay. Provided ${candles.length}, require at least ${minWarmup + 10}`);
  }

  const trades: ReplayTrade[] = [];
  let inPosition = false;
  let entryCandleIdx = -1;
  let entryPrice = 0;
  let tradeQuantity = 0;
  let tradeNotional = 0;
  let entryIndicators = { fastMA: 0, slowMA: 0, rsi: 0, volumeRatio: 0 };
  let patternCondition = '';

  for (let i = minWarmup; i < candles.length; i++) {
    const slice = candles.slice(0, i + 1);
    const currentCandle = candles[i];

    if (!inPosition) {
      const result = strategy.evaluate(slice);

      if (result.signal === 'BUY') {
        const qty = parseFloat((allocationUsd / currentCandle.close).toFixed(6));
        const riskResult = risk.evaluate('BUY', currentCandle.close, qty);

        if (riskResult.approved) {
          inPosition = true;
          entryCandleIdx = i;
          entryPrice = currentCandle.close;
          tradeQuantity = qty;
          tradeNotional = riskResult.notionalValue;
          patternCondition = classifyPattern(result.indicators);
          entryIndicators = {
            fastMA: result.indicators.fastMA,
            slowMA: result.indicators.slowMA,
            rsi: result.indicators.rsi,
            volumeRatio: result.indicators.volume / (result.indicators.volumeSMA || 1)
          };
        }
      }
    } else {
      const highPrice = currentCandle.high;
      const lowPrice = currentCandle.low;
      const closePrice = currentCandle.close;

      const slPrice = entryPrice * (1 - stopLossPct / 100);
      const tpPrice = entryPrice * (1 + takeProfitPct / 100);

      let exitPrice = 0;
      let exitReason = '';
      let outcome: TradeOutcome = 'PENDING';

      if (lowPrice <= slPrice) {
        exitPrice = slPrice;
        exitReason = `Stop-Loss triggered (-${stopLossPct}%) at $${exitPrice.toFixed(2)}`;
        outcome = 'LOSS';
      } else if (highPrice >= tpPrice) {
        exitPrice = tpPrice;
        exitReason = `Take-Profit triggered (+${takeProfitPct}%) at $${exitPrice.toFixed(2)}`;
        outcome = 'WIN';
      } else {
        const result = strategy.evaluate(slice);
        if (result.signal === 'SELL') {
          exitPrice = closePrice;
          const diffPct = ((exitPrice - entryPrice) / entryPrice) * 100;
          exitReason = `Bearish MA crossover exit at $${exitPrice.toFixed(2)} (${diffPct >= 0 ? '+' : ''}${diffPct.toFixed(2)}%)`;
          outcome = diffPct > 0.1 ? 'WIN' : diffPct < -0.1 ? 'LOSS' : 'BREAKEVEN';
        }
      }

      const isLastCandle = i === candles.length - 1;
      if (outcome !== 'PENDING' || isLastCandle) {
        if (outcome === 'PENDING' && isLastCandle) {
          exitPrice = closePrice;
          const diffPct = ((exitPrice - entryPrice) / entryPrice) * 100;
          exitReason = `End of replay window at $${exitPrice.toFixed(2)} (${diffPct >= 0 ? '+' : ''}${diffPct.toFixed(2)}%)`;
          outcome = diffPct > 0.1 ? 'WIN' : diffPct < -0.1 ? 'LOSS' : 'BREAKEVEN';
        }

        const pnlPct = ((exitPrice - entryPrice) / entryPrice) * 100;
        const pnl = (exitPrice - entryPrice) * tradeQuantity;

        trades.push({
          entryIndex: entryCandleIdx,
          entryTime: new Date(candles[entryCandleIdx].timestamp).toISOString().replace('T', ' ').substring(0, 19),
          exitTime: new Date(currentCandle.timestamp).toISOString().replace('T', ' ').substring(0, 19),
          symbol,
          action: 'BUY',
          entryPrice,
          exitPrice,
          quantity: tradeQuantity,
          notionalValue: tradeNotional,
          entryValue: entryPrice * tradeQuantity,
          exitValue: exitPrice * tradeQuantity,
          outcome,
          pnl,
          pnlPct,
          reason: `Fast MA(9) [${entryIndicators.fastMA.toFixed(2)}] crossed above Slow MA(21) [${entryIndicators.slowMA.toFixed(2)}]`,
          exitReason,
          patternCondition,
          indicatorsAtEntry: entryIndicators
        });

        inPosition = false;
      }
    }
  }

  const summary = calculateSummary(symbol, timeframe, candles.length, trades);
  return { trades, summary };
}
