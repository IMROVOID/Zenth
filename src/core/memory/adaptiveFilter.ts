import { MemoryService } from './memoryService.js';
import { AdaptiveLearning, AdaptiveFilterMode } from '../types.js';

export interface FilterEvaluationResult {
  shouldSkip: boolean;
  matchedRule?: AdaptiveLearning;
  reason?: string;
  patternCondition: string;
}

export class AdaptiveFilter {
  private memory: MemoryService;

  constructor(memory: MemoryService) {
    this.memory = memory;
  }

  /**
   * Evaluates whether a proposed trade setup matches historical loss patterns.
   */
  async evaluate(
    symbol: string,
    patternCondition: string,
    indicators: { fastMA: number; slowMA: number; rsi: number; volumeRatio: number },
    filterMode: AdaptiveFilterMode = 'STRICT'
  ): Promise<FilterEvaluationResult> {
    if (filterMode === 'DISABLED') {
      return {
        shouldSkip: false,
        patternCondition
      };
    }

    const activeLearnings = await this.memory.getActiveLearnings(symbol);

    if (activeLearnings.length === 0) {
      return {
        shouldSkip: false,
        patternCondition
      };
    }

    // Check against learned rules
    for (const rule of activeLearnings) {
      if (rule.pattern_condition === patternCondition) {
        // Increment trigger in Supabase
        if (rule.id) {
          await this.memory.incrementTrigger(rule.id);
        }

        if (filterMode === 'DRY_RUN') {
          return {
            shouldSkip: false,
            matchedRule: rule,
            patternCondition,
            reason: `Adaptive Memory [DRY-RUN]: Detected known pattern [${patternCondition}]. Rule: "${rule.trading_rule}" (Not blocked)`
          };
        }

        if (filterMode === 'REPEAT_LOSSES') {
          const triggers = rule.trigger_count || 0;
          if (triggers < 1) {
            // First time recurrence: warn but allow
            return {
              shouldSkip: false,
              matchedRule: rule,
              patternCondition,
              reason: `Adaptive Memory [REPEAT_MODE]: Pattern [${patternCondition}] has only 1 prior loss. Allowing trade.`
            };
          }
        }

        return {
          shouldSkip: true,
          matchedRule: rule,
          patternCondition,
          reason: `Adaptive Memory Filter: Skipped known losing pattern [${patternCondition}]. Rule: "${rule.trading_rule}"`
        };
      }
    }

    return {
      shouldSkip: false,
      patternCondition
    };
  }
}
