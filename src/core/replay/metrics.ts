import { ReplayTrade, ReplaySummary } from '../types.js';

export function calculateSummary(
  symbol: string,
  timeframe: string,
  totalCandles: number,
  trades: ReplayTrade[]
): ReplaySummary {
  const totalSetups = trades.length;
  let wins = 0;
  let losses = 0;
  let totalPnL = 0;
  let bestTrade = trades[0]?.pnl ?? 0;
  let worstTrade = trades[0]?.pnl ?? 0;
  let grossProfit = 0;
  let grossLoss = 0;

  let peakEquity = 0;
  let runningEquity = 0;
  let maxDrawdown = 0;

  for (const trade of trades) {
    totalPnL += trade.pnl;
    runningEquity += trade.pnl;

    if (runningEquity > peakEquity) peakEquity = runningEquity;
    const dd = peakEquity - runningEquity;
    if (dd > maxDrawdown) maxDrawdown = dd;

    if (trade.pnl > bestTrade) bestTrade = trade.pnl;
    if (trade.pnl < worstTrade) worstTrade = trade.pnl;

    if (trade.pnl > 0) {
      wins++;
      grossProfit += trade.pnl;
    } else if (trade.pnl < 0) {
      losses++;
      grossLoss += Math.abs(trade.pnl);
    }
  }

  const winRate = totalSetups > 0 ? (wins / totalSetups) * 100 : 0;
  const averagePnL = totalSetups > 0 ? totalPnL / totalSetups : 0;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99.9 : 0;
  const initialCapital = 500.0;
  const maxDrawdownPct = (maxDrawdown / initialCapital) * 100;

  return {
    symbol,
    timeframe,
    totalCandles,
    totalSetups,
    wins,
    losses,
    winRate,
    totalPnL,
    averagePnL,
    bestTrade,
    worstTrade,
    profitFactor,
    maxDrawdownPct
  };
}
