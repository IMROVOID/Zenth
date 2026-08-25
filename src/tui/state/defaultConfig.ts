import { BotRuntimeConfig, AdaptiveFilterMode } from '../../core/types.js';

export function getDefaultDraftConfig(): BotRuntimeConfig {
  const exchange = ((process.env.EXCHANGE || 'xt').toLowerCase()) as any;
  const symbol = process.env.DEFAULT_SYMBOL || 'btc_usdt';
  const interval = process.env.DEFAULT_INTERVAL || '5m';
  const pollSeconds = parseInt(process.env.POLL_INTERVAL_SECONDS || '15', 10);
  const stopLossPct = parseFloat(process.env.STOP_LOSS_PCT || '1.5');
  const takeProfitPct = parseFloat(process.env.TAKE_PROFIT_PCT || '3.0');

  return {
    exchange,
    symbol,
    interval,
    targetAllocation: 500.0,
    stopLossPct,
    takeProfitPct,
    pollSeconds,
    fastPeriod: 9,
    slowPeriod: 21,
    rsiPeriod: 14,
    volumePeriod: 20,
    rsiMaxEntry: 75,
    minVolumeRatio: 0,
    filterMode: 'STRICT' as AdaptiveFilterMode,
    autoLearn: true,
    exitOnReverseCross: true,
    breakevenTriggerPct: 1.5,
    trailingStopPct: 0,
    maxDailyLoss: 0,
    maxConsecutiveLosses: 0,
    terminalBellAlert: false,
    logVerbosity: 'NORMAL'
  };
}
