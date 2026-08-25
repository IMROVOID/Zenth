import { ConfigParam } from '../views/configView.js';
import { BotRuntimeConfig } from '../../core/types.js';

export function buildMarketAndStrategyParams(draft: BotRuntimeConfig, active: BotRuntimeConfig): ConfigParam[] {
  const minVolStr = draft.minVolumeRatio === 0 ? 'Off' : `${draft.minVolumeRatio.toFixed(2)}x`;

  return [
    {
      key: 'exchange',
      category: 'Market & Execution',
      label: 'ACTIVE_EXCHANGE',
      val: (draft.exchange || 'xt').toUpperCase(),
      desc: 'Active market data & trade venue',
      options: ['BINANCE', 'COINBASE', 'OKX', 'UPBIT', 'BITGET', 'XT'],
      isDirty: (draft.exchange || 'xt') !== (active.exchange || 'xt')
    },
    {
      key: 'symbol',
      category: 'Market & Execution',
      label: 'DEFAULT_SYMBOL',
      val: draft.symbol.toUpperCase(),
      desc: 'Active trading pair on exchange feed',
      options: ['BTC_USDT', 'ETH_USDT', 'SOL_USDT', 'AAPLX_USDT', 'TSLAX_USDT', 'NVDAX_USDT', 'SPY_USDT', 'MSTR_USDT', 'DOGE_USDT'],
      isDirty: draft.symbol !== active.symbol
    },
    {
      key: 'interval',
      category: 'Market & Execution',
      label: 'DEFAULT_INTERVAL',
      val: draft.interval,
      desc: 'Candlestick strategy timeframe',
      options: ['1m', '5m', '15m', '1h', '4h'],
      isDirty: draft.interval !== active.interval
    },
    {
      key: 'cap',
      category: 'Market & Execution',
      label: 'MAX_POSITION_CAP',
      val: `$${draft.targetAllocation.toFixed(1)} USDT`,
      desc: 'Hard risk allocation limit per order',
      options: ['$250.0 USDT', '$500.0 USDT', '$1000.0 USDT', '$2000.0 USDT'],
      isDirty: draft.targetAllocation !== active.targetAllocation
    },
    {
      key: 'poll',
      category: 'Market & Execution',
      label: 'POLL_INTERVAL',
      val: `${draft.pollSeconds}s`,
      desc: 'Autonomous loop tick delay',
      options: ['5s', '10s', '15s', '30s', '60s'],
      isDirty: draft.pollSeconds !== active.pollSeconds
    },
    {
      key: 'fast_ma',
      category: 'Strategy & Indicators',
      label: 'FAST_MA_PERIOD',
      val: `${draft.fastPeriod}`,
      desc: 'Fast Simple Moving Average period',
      options: ['5', '7', '9', '12', '15', '20'],
      isDirty: draft.fastPeriod !== active.fastPeriod
    },
    {
      key: 'slow_ma',
      category: 'Strategy & Indicators',
      label: 'SLOW_MA_PERIOD',
      val: `${draft.slowPeriod}`,
      desc: 'Slow Simple Moving Average period',
      options: ['14', '21', '26', '50', '100'],
      isDirty: draft.slowPeriod !== active.slowPeriod
    },
    {
      key: 'rsi_max',
      category: 'Strategy & Indicators',
      label: 'RSI_MAX_ENTRY',
      val: `${draft.rsiMaxEntry}`,
      desc: 'Overbought ceiling for BUY entries',
      options: ['65', '70', '75', '80', '85'],
      isDirty: draft.rsiMaxEntry !== active.rsiMaxEntry
    },
    {
      key: 'min_vol',
      category: 'Strategy & Indicators',
      label: 'MIN_VOL_RATIO',
      val: minVolStr,
      desc: 'Minimum candle volume ratio vs 20-SMA',
      options: ['Off', '0.75x', '1.00x', '1.25x', '1.50x'],
      isDirty: draft.minVolumeRatio !== active.minVolumeRatio
    }
  ];
}
