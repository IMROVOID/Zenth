export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  quoteVolume: number;
}

export type Signal = 'BUY' | 'SELL' | 'HOLD';
export type Decision = 'BUY' | 'SELL' | 'HOLD' | 'SKIP';
export type TradeOutcome = 'WIN' | 'LOSS' | 'BREAKEVEN' | 'PENDING' | 'SKIPPED';
export type BotMode = 'PAPER' | 'REPLAY_RAW' | 'REPLAY_MEMORY';
export type StorageBackendType = 'sqlite' | 'postgres' | 'mongodb' | 'supabase' | 'local' | 'memory';

export interface StrategyResult {
  signal: Signal;
  fastMA: number;
  slowMA: number;
  rsi: number;
  volumeSMA: number;
  currentPrice: number;
  reason: string;
  timestamp: number;
  indicators: {
    fastMA: number;
    slowMA: number;
    prevFastMA: number;
    prevSlowMA: number;
    rsi: number;
    volume: number;
    volumeSMA: number;
  };
}

export interface RiskCheckResult {
  approved: boolean;
  decision: Decision;
  reason: string;
  notionalValue: number;
  quantity: number;
}

export interface PaperOrder {
  id: string;
  symbol: string;
  action: Decision;
  price: number;
  quantity: number;
  notionalValue: number;
  entryValue?: number;
  exitValue?: number;
  reason: string;
  timestamp: string;
  mode: BotMode;
  outcome?: TradeOutcome;
  pnl?: number;
  pnlPercentage?: number;
}

export interface ReplayTrade {
  entryIndex: number;
  entryTime: string;
  exitTime: string;
  symbol: string;
  action: 'BUY';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  notionalValue: number;
  entryValue: number;
  exitValue: number;
  outcome: TradeOutcome;
  pnl: number;
  pnlPct: number;
  reason: string;
  exitReason: string;
  patternCondition: string;
  indicatorsAtEntry: {
    fastMA: number;
    slowMA: number;
    rsi: number;
    volumeRatio: number;
  };
}

export interface ReplaySummary {
  symbol: string;
  timeframe: string;
  totalCandles: number;
  totalSetups: number;
  wins: number;
  losses: number;
  winRate: number;
  totalPnL: number;
  averagePnL: number;
  bestTrade: number;
  worstTrade: number;
  profitFactor: number;
  maxDrawdownPct: number;
}

export interface AdaptiveLearning {
  id?: string;
  created_at?: string;
  symbol: string;
  pattern_condition: string;
  loss_reason: string;
  trading_rule: string;
  status: 'ACTIVE' | 'ARCHIVED';
  trigger_count?: number;
  last_triggered_at?: string;
  metadata?: Record<string, unknown>;
}

export interface SessionMetrics {
  id?: string;
  session_id: string;
  symbol: string;
  started_at: string;
  last_updated_at: string;
  total_entries: number;
  total_wins: number;
  total_losses: number;
  win_rate: number;
  entered_capital: number;
  closed_capital: number;
  realized_pnl: number;
  realized_pnl_percentage: number;
  peak_unrealized_pnl: number;
  peak_unrealized_pct: number;
  active_position?: Record<string, any> | null;
}

export type AdaptiveFilterMode = 'STRICT' | 'REPEAT_LOSSES' | 'DRY_RUN' | 'DISABLED';
export type SupportedExchange = 'xt' | 'binance' | 'coinbase' | 'okx' | 'upbit' | 'bitget';

export interface BotRuntimeConfig {
  exchange?: SupportedExchange;
  symbol: string;
  interval: string;
  targetAllocation: number;
  stopLossPct: number;
  takeProfitPct: number;
  pollSeconds: number;
  // Strategy
  fastPeriod: number;
  slowPeriod: number;
  rsiPeriod: number;
  volumePeriod: number;
  rsiMaxEntry: number;
  minVolumeRatio: number;
  // Memory & Risk
  filterMode: AdaptiveFilterMode;
  autoLearn: boolean;
  // Exits
  exitOnReverseCross: boolean;
  breakevenTriggerPct: number;
  trailingStopPct: number;
  maxDailyLoss: number;
  maxConsecutiveLosses: number;
  // Alerts & UI
  terminalBellAlert: boolean;
  logVerbosity: 'NORMAL' | 'DETAILED' | 'MINIMAL';
}
