import { OnboardingState } from './onboardingState.js';
import { PARAM_OPTIONS_MAP } from './paramPickerOptions.js';
import { OnboardingTradingParams } from '../../core/config/types.js';

const PARAM_KEYS: Array<keyof OnboardingTradingParams> = [
  'exchange',
  'symbol',
  'interval',
  'quantity',
  'maxPositionNotionalCap',
  'stopLossPct',
  'takeProfitPct',
  'candleLookback'
];

export function handleParamsInput(key: string, state: OnboardingState, render: () => void): boolean {
  const data = state.data;

  // 1. Handling Main TRADING_PARAMS View
  if (data.currentStep === 'TRADING_PARAMS') {
    const maxIdx = PARAM_KEYS.length; // 8 parameters + 1 confirm row = 9 total (0 to 8)

    if (key === '\u001b') {
      state.goBack();
      render();
      return false;
    }

    if (key === '\u001b[A' || key === 'w') {
      data.activeTradingParamIndex = (data.activeTradingParamIndex - 1 + maxIdx + 1) % (maxIdx + 1);
      render();
      return false;
    }

    if (key === '\u001b[B' || key === 's' || key === '\t') {
      data.activeTradingParamIndex = (data.activeTradingParamIndex + 1) % (maxIdx + 1);
      render();
      return false;
    }

    // Space or Enter opens picker / proceeds
    if (key === ' ' || key === '\r') {
      if (data.activeTradingParamIndex === maxIdx) {
        state.goToStep('COMPLETE');
        render();
        return false;
      }

      const paramKey = PARAM_KEYS[data.activeTradingParamIndex];
      if (paramKey === 'symbol') {
        data.symbolSearchQuery = '';
        data.symbolCategoryFilter = 'ALL';
        data.symbolSelectedIndex = 0;
        state.goToStep('SYMBOL_PICKER');
        state.loadSymbols(render);
        render();
        return false;
      }

      // Open Param Picker
      data.activeParamPickerKey = paramKey;
      const opts = PARAM_OPTIONS_MAP[paramKey as keyof typeof PARAM_OPTIONS_MAP] || [];
      const currentVal = data.tradingParams[paramKey];
      const matchIdx = opts.findIndex(o => o.value === currentVal);
      data.paramPickerSelectedIndex = matchIdx >= 0 ? matchIdx : 0;
      state.goToStep('PARAM_PICKER');
      render();
      return false;
    }
  }

  // 2. Handling PARAM_PICKER Sub-View
  if (data.currentStep === 'PARAM_PICKER') {
    const paramKey = data.activeParamPickerKey;
    if (!paramKey || paramKey === 'symbol' || !PARAM_OPTIONS_MAP[paramKey]) {
      state.goBack();
      render();
      return false;
    }

    const opts = PARAM_OPTIONS_MAP[paramKey];

    if (key === '\u001b') {
      state.goBack();
      render();
      return false;
    }

    if (key === '\u001b[A' || key === 'w') {
      data.paramPickerSelectedIndex = (data.paramPickerSelectedIndex - 1 + opts.length) % opts.length;
      render();
      return false;
    }

    if (key === '\u001b[B' || key === 's') {
      data.paramPickerSelectedIndex = (data.paramPickerSelectedIndex + 1) % opts.length;
      render();
      return false;
    }

    if (key === ' ' || key === '\r') {
      const chosen = opts[data.paramPickerSelectedIndex];
      if (chosen) {
        (data.tradingParams as unknown as Record<string, unknown>)[paramKey] = chosen.value;
        if (paramKey === 'exchange') {
          state.marketService.setExchange(chosen.value as any);
          data.availableSymbols = [];
        }
      }
      state.goBack();
      render();
      return false;
    }
  }

  // 3. Handling SYMBOL_PICKER Sub-View
  if (data.currentStep === 'SYMBOL_PICKER') {
    const q = (data.symbolSearchQuery || '').trim().toLowerCase();
    const cat = data.symbolCategoryFilter || 'ALL';
    let allSymbols = data.availableSymbols;

    if (cat === 'CRYPTO') allSymbols = allSymbols.filter(s => s.type === 'crypto');
    else if (cat === 'STOCK') allSymbols = allSymbols.filter(s => s.type === 'stock');

    const filtered = q
      ? allSymbols.filter(s =>
          s.ticker.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.symbol.toLowerCase().includes(q)
        )
      : allSymbols;

    if (key === '\u001b') {
      state.goBack();
      render();
      return false;
    }

    if (key === '\t') {
      if (data.symbolCategoryFilter === 'ALL') data.symbolCategoryFilter = 'CRYPTO';
      else if (data.symbolCategoryFilter === 'CRYPTO') data.symbolCategoryFilter = 'STOCK';
      else data.symbolCategoryFilter = 'ALL';
      data.symbolSelectedIndex = 0;
      render();
      return false;
    }

    if (key === '\u001b[A') {
      if (filtered.length > 0) {
        data.symbolSelectedIndex = (data.symbolSelectedIndex - 1 + filtered.length) % filtered.length;
      }
      render();
      return false;
    }

    if (key === '\u001b[B') {
      if (filtered.length > 0) {
        data.symbolSelectedIndex = (data.symbolSelectedIndex + 1) % filtered.length;
      }
      render();
      return false;
    }

    if (key === '\r') {
      if (filtered.length > 0) {
        const item = filtered[Math.max(0, Math.min(data.symbolSelectedIndex, filtered.length - 1))];
        if (item) {
          data.tradingParams.symbol = item.symbol.toLowerCase();
        }
      }
      state.goBack();
      render();
      return false;
    }

    if (key === '\x7f' || key === '\b') {
      if (data.symbolSearchQuery.length > 0) {
        data.symbolSearchQuery = data.symbolSearchQuery.slice(0, -1);
        data.symbolSelectedIndex = 0;
        render();
      }
      return false;
    }

    if (key.length === 1 && key >= ' ' && key <= '~') {
      data.symbolSearchQuery += key;
      data.symbolSelectedIndex = 0;
      render();
      return false;
    }
  }

  return false;
}
