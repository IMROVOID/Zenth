import { ConfigParam } from '../views/configView.js';
import { BotRuntimeConfig } from '../../core/types.js';
import { buildMarketAndStrategyParams, buildRiskAndAlertParams } from './configParamGroups.js';

export function buildConfigParams(
  draft: BotRuntimeConfig,
  active: BotRuntimeConfig
): ConfigParam[] {
  return [
    ...buildMarketAndStrategyParams(draft, active),
    ...buildRiskAndAlertParams(draft, active),
    {
      key: 'action_save',
      label: 'SAVE_CHANGES',
      val: 'SAVE',
      desc: 'Apply and save all staged parameter modifications',
      isAction: true,
      actionType: 'save'
    },
    {
      key: 'action_reset',
      label: 'RESET_DEFAULTS',
      val: 'RESET',
      desc: 'Restore all bot settings to standard defaults',
      isAction: true,
      actionType: 'reset'
    },
    {
      key: 'action_reset_db',
      label: 'RESET_DATABASE',
      val: 'WIPE_DB',
      desc: 'Wipe all trades, learnings & metrics from local/Supabase database',
      isAction: true,
      actionType: 'reset_db'
    }
  ];
}
