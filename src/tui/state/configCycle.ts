import { BotRuntimeConfig, AdaptiveFilterMode } from '../../core/types.js';

export function cycleConfigValue(
  draft: BotRuntimeConfig,
  key: string,
  direction: 1 | -1
): void {
  switch (key) {
    case 'storage_backend': {
      const dbs = ['sqlite', 'postgres', 'mongodb', 'supabase', 'local'];
      const cur = (process.env.STORAGE_BACKEND || 'sqlite').toLowerCase();
      const idx = dbs.indexOf(cur) >= 0 ? dbs.indexOf(cur) : 0;
      const next = (idx + direction + dbs.length) % dbs.length;
      process.env.STORAGE_BACKEND = dbs[next];
      break;
    }
    case 'exchange': {
      const exchs = ['binance', 'coinbase', 'okx', 'upbit', 'bitget', 'xt'] as const;
      const cur = (draft.exchange || 'xt').toLowerCase();
      const idx = exchs.indexOf(cur as any) >= 0 ? exchs.indexOf(cur as any) : 0;
      const next = (idx + direction + exchs.length) % exchs.length;
      draft.exchange = exchs[next];
      break;
    }
    case 'symbol': {
      const syms = ['btc_usdt', 'eth_usdt', 'sol_usdt', 'aaplx_usdt', 'tslax_usdt', 'nvdax_usdt', 'spy_usdt', 'mstr_usdt', 'doge_usdt'];
      const idx = syms.indexOf(draft.symbol.toLowerCase());
      const next = (idx + direction + syms.length) % syms.length;
      draft.symbol = syms[next];
      break;
    }
    case 'interval': {
      const intervals = ['1m', '5m', '15m', '1h', '4h'];
      const idx = intervals.indexOf(draft.interval);
      const next = (idx + direction + intervals.length) % intervals.length;
      draft.interval = intervals[next];
      break;
    }
    case 'cap': {
      const caps = [250, 500, 1000, 2000];
      const idx = caps.indexOf(draft.targetAllocation);
      const next = (idx + direction + caps.length) % caps.length;
      draft.targetAllocation = caps[next];
      break;
    }
    case 'poll': {
      const polls = [5, 10, 15, 30, 60];
      const idx = polls.indexOf(draft.pollSeconds);
      const next = (idx + direction + polls.length) % polls.length;
      draft.pollSeconds = polls[next];
      break;
    }
    case 'fast_ma': {
      const fas = [5, 7, 9, 12, 15, 20];
      const idx = fas.indexOf(draft.fastPeriod);
      const next = (idx + direction + fas.length) % fas.length;
      draft.fastPeriod = fas[next];
      break;
    }
    case 'slow_ma': {
      const sls = [14, 21, 26, 50, 100];
      const idx = sls.indexOf(draft.slowPeriod);
      const next = (idx + direction + sls.length) % sls.length;
      draft.slowPeriod = sls[next];
      break;
    }
    case 'rsi_max': {
      const rsis = [65, 70, 75, 80, 85];
      const idx = rsis.indexOf(draft.rsiMaxEntry);
      const next = (idx + direction + rsis.length) % rsis.length;
      draft.rsiMaxEntry = rsis[next];
      break;
    }
    case 'min_vol': {
      const vols = [0, 0.75, 1.0, 1.25, 1.5];
      const idx = vols.indexOf(draft.minVolumeRatio);
      const next = (idx + direction + vols.length) % vols.length;
      draft.minVolumeRatio = vols[next];
      break;
    }
    case 'filter_mode': {
      const modes: AdaptiveFilterMode[] = ['STRICT', 'REPEAT_LOSSES', 'DRY_RUN', 'DISABLED'];
      const idx = modes.indexOf(draft.filterMode);
      const next = (idx + direction + modes.length) % modes.length;
      draft.filterMode = modes[next];
      break;
    }
    case 'auto_learn':
      draft.autoLearn = !draft.autoLearn;
      break;
    case 'sl': {
      const sls = [1.0, 1.5, 2.0, 2.5, 3.0];
      const idx = sls.indexOf(draft.stopLossPct);
      const next = (idx + direction + sls.length) % sls.length;
      draft.stopLossPct = sls[next];
      break;
    }
    case 'tp': {
      const tps = [2.0, 3.0, 4.0, 5.0, 8.0];
      const idx = tps.indexOf(draft.takeProfitPct);
      const next = (idx + direction + tps.length) % tps.length;
      draft.takeProfitPct = tps[next];
      break;
    }
    case 'be_stop': {
      const bes = [0, 1.0, 1.5, 2.0];
      const idx = bes.indexOf(draft.breakevenTriggerPct);
      const next = (idx + direction + bes.length) % bes.length;
      draft.breakevenTriggerPct = bes[next];
      break;
    }
    case 'trailing_stop': {
      const trails = [0, 0.5, 1.0, 1.5, 2.0];
      const idx = trails.indexOf(draft.trailingStopPct);
      const next = (idx + direction + trails.length) % trails.length;
      draft.trailingStopPct = trails[next];
      break;
    }
    case 'exit_ma_cross':
      draft.exitOnReverseCross = !draft.exitOnReverseCross;
      break;
    case 'max_daily_loss': {
      const losses = [0, 25, 50, 100, 250];
      const idx = losses.indexOf(draft.maxDailyLoss);
      const next = (idx + direction + losses.length) % losses.length;
      draft.maxDailyLoss = losses[next];
      break;
    }
    case 'max_consec_loss': {
      const streaks = [0, 2, 3, 5];
      const idx = streaks.indexOf(draft.maxConsecutiveLosses);
      const next = (idx + direction + streaks.length) % streaks.length;
      draft.maxConsecutiveLosses = streaks[next];
      break;
    }
    case 'bell_alert':
      draft.terminalBellAlert = !draft.terminalBellAlert;
      break;
    case 'log_verbosity': {
      const v: ('NORMAL' | 'DETAILED' | 'MINIMAL')[] = ['NORMAL', 'DETAILED', 'MINIMAL'];
      const idx = v.indexOf(draft.logVerbosity);
      const next = (idx + direction + v.length) % v.length;
      draft.logVerbosity = v[next];
      break;
    }
  }
}

export function setConfigOptionDirect(
  draft: BotRuntimeConfig,
  key: string,
  opt: string
): void {
  switch (key) {
    case 'storage_backend': process.env.STORAGE_BACKEND = opt.toLowerCase(); break;
    case 'exchange': draft.exchange = opt.toLowerCase() as any; break;
    case 'symbol': draft.symbol = opt.toLowerCase(); break;
    case 'interval': draft.interval = opt; break;
    case 'cap': draft.targetAllocation = parseFloat(opt.replace(/[^0-9.]/g, '')) || 500; break;
    case 'poll': draft.pollSeconds = parseInt(opt.replace(/[^0-9]/g, ''), 10) || 15; break;
    case 'fast_ma': draft.fastPeriod = parseInt(opt, 10) || 9; break;
    case 'slow_ma': draft.slowPeriod = parseInt(opt, 10) || 21; break;
    case 'rsi_max': draft.rsiMaxEntry = parseInt(opt, 10) || 75; break;
    case 'min_vol': draft.minVolumeRatio = opt === 'Off' ? 0 : parseFloat(opt.replace('x', '')) || 0; break;
    case 'filter_mode':
      draft.filterMode = opt === 'Strict' ? 'STRICT' : opt.startsWith('Repeat') ? 'REPEAT_LOSSES' : opt === 'Dry-Run' ? 'DRY_RUN' : 'DISABLED';
      break;
    case 'auto_learn': draft.autoLearn = opt === 'Enabled'; break;
    case 'sl': draft.stopLossPct = parseFloat(opt.replace('%', '')) || 1.5; break;
    case 'tp': draft.takeProfitPct = parseFloat(opt.replace('%', '')) || 3.0; break;
    case 'be_stop': draft.breakevenTriggerPct = opt === 'Disabled' ? 0 : parseFloat(opt.replace(/[^0-9.]/g, '')) || 0; break;
    case 'trailing_stop': draft.trailingStopPct = opt === 'Disabled' ? 0 : parseFloat(opt.replace(/[^0-9.]/g, '')) || 0; break;
    case 'exit_ma_cross': draft.exitOnReverseCross = opt === 'Enabled'; break;
    case 'max_daily_loss': draft.maxDailyLoss = opt === 'Unlimited' ? 0 : parseFloat(opt.replace(/[^0-9.]/g, '')) || 0; break;
    case 'max_consec_loss': draft.maxConsecutiveLosses = opt === 'Unlimited' ? 0 : parseInt(opt.replace(/[^0-9]/g, ''), 10) || 0; break;
    case 'bell_alert': draft.terminalBellAlert = opt === 'Enabled'; break;
    case 'log_verbosity': draft.logVerbosity = opt.toUpperCase() as any; break;
  }
}
