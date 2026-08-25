import { OnboardingTradingParams } from '../../core/config/types.js';

export interface ParamOptionItem {
  value: string | number;
  label: string;
  desc: string;
}

export const PARAM_OPTIONS_MAP: Record<keyof Omit<OnboardingTradingParams, 'symbol'>, ParamOptionItem[]> = {
  exchange: [
    { value: 'binance', label: 'Binance', desc: 'Quota: 1,200 req/min · Global Spot & Futures' },
    { value: 'coinbase', label: 'Coinbase', desc: 'Quota: 10 req/sec · US Spot & CDP AgentKit' },
    { value: 'okx', label: 'OKX', desc: 'Quota: 20 req/2s · Unified Spot & Derivatives' },
    { value: 'upbit', label: 'Upbit', desc: 'Quota: 10 req/sec · KRW & USDT Pairs' },
    { value: 'bitget', label: 'Bitget', desc: 'Quota: 20 req/sec · Spot & Futures with MCP' },
    { value: 'xt', label: 'XT.com', desc: 'Quota: 10 req/sec (1,000/min) · Spot & Stocks' }
  ],
  interval: [
    { value: '1m', label: '1m', desc: '1 Minute (Scalping / High-Frequency Momentum)' },
    { value: '5m', label: '5m', desc: '5 Minutes (Default Bot Recommended Profile)' },
    { value: '15m', label: '15m', desc: '15 Minutes (Short-Term Trend Following)' },
    { value: '30m', label: '30m', desc: '30 Minutes (Medium-Term Swing Cycle)' },
    { value: '1h', label: '1h', desc: '1 Hour (Hourly Trend Anchor)' },
    { value: '4h', label: '4h', desc: '4 Hours (Macro Position Structure)' },
    { value: '1d', label: '1d', desc: '1 Day (Daily Candlestick Horizon)' }
  ],
  quantity: [
    { value: 0.001, label: '0.001', desc: 'Micro Order (0.001 units per signal)' },
    { value: 0.005, label: '0.005', desc: 'Small Order (0.005 units per signal)' },
    { value: 0.01, label: '0.01', desc: 'Standard Order (0.01 units - Default)' },
    { value: 0.02, label: '0.02', desc: 'Double Standard (0.02 units per signal)' },
    { value: 0.05, label: '0.05', desc: 'Medium Position (0.05 units per signal)' },
    { value: 0.1, label: '0.10', desc: 'Aggressive Position (0.10 units per signal)' },
    { value: 0.5, label: '0.50', desc: 'Heavy Position (0.50 units per signal)' },
    { value: 1.0, label: '1.00', desc: 'Full Unit (1.00 unit per signal)' }
  ],
  maxPositionNotionalCap: [
    { value: 100.0, label: '$100', desc: 'Micro Cap ($100 max active exposure)' },
    { value: 250.0, label: '$250', desc: 'Conservative Cap ($250 max active exposure)' },
    { value: 500.0, label: '$500', desc: 'Moderate Cap ($500 max active exposure)' },
    { value: 750.0, label: '$750', desc: 'Elevated Cap ($750 max active exposure)' },
    { value: 1000.0, label: '$1000', desc: 'Maximum Hard Safety Cap ($1,000 max exposure - Default)' }
  ],
  stopLossPct: [
    { value: 0.5, label: '0.5%', desc: 'Ultra-Tight Bracket (0.5% max risk)' },
    { value: 1.0, label: '1.0%', desc: 'Tight Scalp Bracket (1.0% max risk)' },
    { value: 1.5, label: '1.5%', desc: 'Standard Bracket (1.5% max risk - Default)' },
    { value: 2.0, label: '2.0%', desc: 'Swing Bracket (2.0% volatility buffer)' },
    { value: 2.5, label: '2.5%', desc: 'Wide Buffer (2.5% volatility buffer)' },
    { value: 3.0, label: '3.0%', desc: 'Wide Trend Bracket (3.0% max risk)' },
    { value: 5.0, label: '5.0%', desc: 'Deep Trend Safety (5.0% max risk)' }
  ],
  takeProfitPct: [
    { value: 1.0, label: '1.0%', desc: 'Quick Scalp Target (+1.0% reward)' },
    { value: 2.0, label: '2.0%', desc: 'Conservative Target (+2.0% reward)' },
    { value: 3.0, label: '3.0%', desc: 'Standard 2:1 R:R Target (+3.0% - Default)' },
    { value: 4.5, label: '4.5%', desc: 'Aggressive 3:1 R:R Target (+4.5% reward)' },
    { value: 6.0, label: '6.0%', desc: 'Extended Runner Target (+6.0% reward)' },
    { value: 10.0, label: '10.0%', desc: 'Macro Swing Target (+10.0% reward)' }
  ],
  candleLookback: [
    { value: 100, label: '100', desc: '100 Candles (Fast initial scan & boot)' },
    { value: 200, label: '200', desc: '200 Candles (Standard indicator window)' },
    { value: 300, label: '300', desc: '300 Candles (Recommended indicator stability - Default)' },
    { value: 500, label: '500', desc: '500 Candles (Extended MA lookback)' },
    { value: 1000, label: '1000', desc: '1,000 Candles (Maximum historical context)' }
  ]
};
