import { MouseEvent } from '../utils/index.js';
import { OnboardingState } from './onboardingState.js';
import { RenderSymbolPicker } from './renderSymbolPicker.js';
import { RenderParamPicker } from './renderParamPicker.js';
import { RenderStepParams } from './renderStepParams.js';
import { PARAM_OPTIONS_MAP } from './paramPickerOptions.js';
import { handleParamsInput } from './onboardingParamInput.js';

export class OnboardingMouseInput {
  static handle(ev: MouseEvent, state: OnboardingState, render: () => void): void {
    const data = state.data;

    // 1. Mouse Move / Hover Tracking
    if (ev.type === 'move') {
      if (data.currentStep === 'SYMBOL_PICKER') {
        const hit = RenderSymbolPicker.rowHitboxes.find(h => h.row === ev.row);
        if (hit && hit.index !== data.symbolSelectedIndex) {
          data.symbolSelectedIndex = hit.index;
          render();
        }
        return;
      }

      if (data.currentStep === 'PARAM_PICKER') {
        const hit = RenderParamPicker.rowHitboxes.find(h => h.row === ev.row);
        if (hit && hit.index !== data.paramPickerSelectedIndex) {
          data.paramPickerSelectedIndex = hit.index;
          render();
        }
        return;
      }

      if (data.currentStep === 'TRADING_PARAMS') {
        const hit = RenderStepParams.rowHitboxes.find(h => h.row === ev.row);
        if (hit && hit.index !== data.activeTradingParamIndex) {
          data.activeTradingParamIndex = hit.index;
          render();
        }
        return;
      }
    }

    // 2. Mouse Wheel Scroll (64 = Up, 65 = Down)
    if (ev.button === 64) {
      if (data.currentStep === 'SYMBOL_PICKER') {
        data.symbolSelectedIndex = Math.max(0, data.symbolSelectedIndex - 1);
        render();
        return;
      }
      if (data.currentStep === 'PARAM_PICKER') {
        data.paramPickerSelectedIndex = Math.max(0, data.paramPickerSelectedIndex - 1);
        render();
        return;
      }
      if (data.currentStep === 'TRADING_PARAMS') {
        data.activeTradingParamIndex = Math.max(0, data.activeTradingParamIndex - 1);
        render();
        return;
      }
    }

    if (ev.button === 65) {
      if (data.currentStep === 'SYMBOL_PICKER') {
        const maxIdx = Math.max(0, data.availableSymbols.length - 1);
        data.symbolSelectedIndex = Math.min(maxIdx, data.symbolSelectedIndex + 1);
        render();
        return;
      }
      if (data.currentStep === 'PARAM_PICKER') {
        const paramKey = data.activeParamPickerKey;
        const maxIdx = (paramKey && paramKey !== 'symbol' && PARAM_OPTIONS_MAP[paramKey]) ? PARAM_OPTIONS_MAP[paramKey].length - 1 : 0;
        data.paramPickerSelectedIndex = Math.min(maxIdx, data.paramPickerSelectedIndex + 1);
        render();
        return;
      }
      if (data.currentStep === 'TRADING_PARAMS') {
        data.activeTradingParamIndex = Math.min(7, data.activeTradingParamIndex + 1);
        render();
        return;
      }
    }

    // 3. Mouse Click Selection
    if (ev.type === 'press' && (ev.button === 0 || ev.button === 2)) {
      if (data.currentStep === 'SYMBOL_PICKER') {
        const hit = RenderSymbolPicker.rowHitboxes.find(h => h.row === ev.row);
        if (hit) {
          data.tradingParams.symbol = hit.symbol.toLowerCase();
          state.goBack();
          render();
          return;
        }
      }

      if (data.currentStep === 'PARAM_PICKER') {
        const hit = RenderParamPicker.rowHitboxes.find(h => h.row === ev.row);
        const paramKey = data.activeParamPickerKey;
        if (hit && paramKey && paramKey !== 'symbol' && PARAM_OPTIONS_MAP[paramKey]) {
          const opt = PARAM_OPTIONS_MAP[paramKey][hit.index];
          if (opt) {
            (data.tradingParams as unknown as Record<string, unknown>)[paramKey] = opt.value;
          }
          state.goBack();
          render();
          return;
        }
      }

      if (data.currentStep === 'TRADING_PARAMS') {
        const hit = RenderStepParams.rowHitboxes.find(h => h.row === ev.row);
        if (hit) {
          data.activeTradingParamIndex = hit.index;
          handleParamsInput(' ', state, render);
          return;
        }
      }
    }
  }
}
