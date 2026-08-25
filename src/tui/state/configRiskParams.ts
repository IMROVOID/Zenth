import { ConfigParam } from '../views/configView.js';
import { BotRuntimeConfig } from '../../core/types.js';

export function buildRiskAndAlertParams(draft: BotRuntimeConfig, active: BotRuntimeConfig): ConfigParam[] {
  const filterModeStr =
    draft.filterMode === 'STRICT'
      ? 'Strict'
      : draft.filterMode === 'REPEAT_LOSSES'
      ? 'Repeat (≥2x)'
      : draft.filterMode === 'DRY_RUN'
      ? 'Dry-Run'
      : 'Disabled';
  const beStr = draft.breakevenTriggerPct === 0 ? 'Disabled' : `+${draft.breakevenTriggerPct.toFixed(1)}%`;
  const trailStr = draft.trailingStopPct === 0 ? 'Disabled' : `${draft.trailingStopPct.toFixed(1)}%`;
  const dailyLossStr = draft.maxDailyLoss === 0 ? 'Unlimited' : `$${draft.maxDailyLoss.toFixed(1)}`;
  const consecLossStr = draft.maxConsecutiveLosses === 0 ? 'Unlimited' : `${draft.maxConsecutiveLosses} Losses`;
  const verbosityStr = draft.logVerbosity === 'NORMAL' ? 'Normal' : draft.logVerbosity === 'DETAILED' ? 'Detailed' : 'Minimal';
  const currentDb = (process.env.STORAGE_BACKEND || 'sqlite').toUpperCase();

  return [
    {
      key: 'storage_backend',
      category: 'Adaptive Memory & AI',
      label: 'STORAGE_BACKEND',
      val: currentDb,
      desc: 'Active database engine for ledger & learnings',
      options: ['SQLITE', 'POSTGRES', 'MONGODB', 'SUPABASE', 'LOCAL'],
      isDirty: false
    },
    {
      key: 'filter_mode',
      category: 'Adaptive Memory & AI',
      label: 'FILTER_MODE',
      val: filterModeStr,
      desc: 'Adaptive failure-pattern blocking mode',
      options: ['Strict', 'Repeat (≥2x)', 'Dry-Run', 'Disabled'],
      isDirty: draft.filterMode !== active.filterMode
    },
    {
      key: 'auto_learn',
      category: 'Adaptive Memory & AI',
      label: 'AUTO_LEARN',
      val: draft.autoLearn ? 'Enabled' : 'Disabled',
      desc: 'Auto-synthesize rules on loss exits',
      options: ['Enabled', 'Disabled'],
      isDirty: draft.autoLearn !== active.autoLearn
    },
    {
      key: 'sl',
      category: 'Dynamic Exits & Brackets',
      label: 'STOP_LOSS_PCT',
      val: `${draft.stopLossPct.toFixed(1)}%`,
      desc: 'Initial automatic stop-loss bracket',
      options: ['1.0%', '1.5%', '2.0%', '2.5%', '3.0%'],
      isDirty: draft.stopLossPct !== active.stopLossPct
    },
    {
      key: 'tp',
      category: 'Dynamic Exits & Brackets',
      label: 'TAKE_PROFIT_PCT',
      val: `${draft.takeProfitPct.toFixed(1)}%`,
      desc: 'Target take-profit limit bracket',
      options: ['2.0%', '3.0%', '4.0%', '5.0%', '8.0%'],
      isDirty: draft.takeProfitPct !== active.takeProfitPct
    },
    {
      key: 'be_stop',
      category: 'Dynamic Exits & Brackets',
      label: 'BREAKEVEN_STOP',
      val: beStr,
      desc: 'Move SL to entry price at profit target',
      options: ['Disabled', '+1.0%', '+1.5%', '+2.0%'],
      isDirty: draft.breakevenTriggerPct !== active.breakevenTriggerPct
    },
    {
      key: 'trailing_stop',
      category: 'Dynamic Exits & Brackets',
      label: 'TRAILING_STOP',
      val: trailStr,
      desc: 'Trail peak price with floating stop',
      options: ['Disabled', '0.5%', '1.0%', '1.5%', '2.0%'],
      isDirty: draft.trailingStopPct !== active.trailingStopPct
    },
    {
      key: 'exit_ma_cross',
      category: 'Dynamic Exits & Brackets',
      label: 'EXIT_ON_MA_CROSS',
      val: draft.exitOnReverseCross ? 'Enabled' : 'Disabled',
      desc: 'Close trade on opposite bearish MA crossover',
      options: ['Enabled', 'Disabled'],
      isDirty: draft.exitOnReverseCross !== active.exitOnReverseCross
    },
    {
      key: 'max_daily_loss',
      category: 'Risk Guardrails',
      label: 'MAX_DAILY_LOSS',
      val: dailyLossStr,
      desc: 'Circuit breaker: max session realized loss',
      options: ['Unlimited', '$25.0', '$50.0', '$100.0', '$250.0'],
      isDirty: draft.maxDailyLoss !== active.maxDailyLoss
    },
    {
      key: 'max_consec_loss',
      category: 'Risk Guardrails',
      label: 'MAX_CONSEC_LOSS',
      val: consecLossStr,
      desc: 'Circuit breaker: max consecutive loss streak',
      options: ['Unlimited', '2 Losses', '3 Losses', '5 Losses'],
      isDirty: draft.maxConsecutiveLosses !== active.maxConsecutiveLosses
    },
    {
      key: 'bell_alert',
      category: 'Alerts & UI',
      label: 'TERMINAL_BELL',
      val: draft.terminalBellAlert ? 'Enabled' : 'Disabled',
      desc: 'Audible terminal beep on order execution',
      options: ['Disabled', 'Enabled'],
      isDirty: draft.terminalBellAlert !== active.terminalBellAlert
    },
    {
      key: 'log_verbosity',
      category: 'Alerts & UI',
      label: 'LOG_VERBOSITY',
      val: verbosityStr,
      desc: 'HUD tick stream output detail level',
      options: ['Normal', 'Detailed', 'Minimal'],
      isDirty: draft.logVerbosity !== active.logVerbosity
    }
  ];
}
