import { OnboardingState } from './onboardingState.js';
import { SupabaseAutoSetup } from '../../core/config/supabaseAutoSetup.js';
import { SUPABASE_SCHEMA_SQL } from '../../core/config/schemaSql.js';
import { ClipboardService } from '../../core/export/clipboardService.js';
import { handleParamsInput } from './onboardingParamInput.js';
import { handleCredentialInput } from './onboardingCredentialInput.js';
import { OnboardingDbInput } from './onboardingDbInput.js';
import { Screen } from '../utils/index.js';

export class OnboardingInput {
  static async handle(key: string, state: OnboardingState, render: () => void): Promise<boolean> {
    const data = state.data;

    // Global Cancel / Exit
    if (key === '\u0003') {
      process.stdout.write(Screen.exitAltBuffer + Screen.showCursor);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      process.exit(0);
    }

    // Step 1: Storage Selection
    if (data.currentStep === 'STORAGE_CHOICE') {
      if (key === '\u001b') {
        data.isCancelled = true;
        return true;
      }
      const backends = ['sqlite', 'postgres', 'mongodb', 'supabase', 'local'] as const;
      if (key === '\u001b[A' || key === 'w') {
        data.selectedOptionIndex = (data.selectedOptionIndex - 1 + 5) % 5;
        data.storageBackend = backends[data.selectedOptionIndex];
        render();
        return false;
      }
      if (key === '\u001b[B' || key === 's') {
        data.selectedOptionIndex = (data.selectedOptionIndex + 1) % 5;
        data.storageBackend = backends[data.selectedOptionIndex];
        render();
        return false;
      }
      if (['1', '2', '3', '4', '5'].includes(key)) {
        const idx = parseInt(key, 10) - 1;
        data.selectedOptionIndex = idx;
        data.storageBackend = backends[idx];
        render();
        return false;
      }
      if (key === '\r') {
        if (data.storageBackend === 'sqlite') state.goToStep('SQLITE_SETUP');
        else if (data.storageBackend === 'postgres') state.goToStep('POSTGRES_SETUP_CHOICE');
        else if (data.storageBackend === 'mongodb') state.goToStep('MONGO_SETUP_CHOICE');
        else if (data.storageBackend === 'supabase') state.goToStep('SUPABASE_SETUP_CHOICE');
        else state.goToStep('TRADING_PARAMS');
        render();
        return false;
      }
    }

    // Local DB steps
    if (data.currentStep === 'SQLITE_SETUP') return OnboardingDbInput.handleSqlite(key, state, render);
    if (data.currentStep === 'POSTGRES_SETUP_CHOICE') return OnboardingDbInput.handlePostgresChoice(key, state, render);
    if (data.currentStep === 'POSTGRES_CREDENTIALS') return OnboardingDbInput.handlePostgresCredentials(key, state, render);
    if (data.currentStep === 'MONGO_SETUP_CHOICE') return OnboardingDbInput.handleMongoChoice(key, state, render);
    if (data.currentStep === 'MONGO_CREDENTIALS') return OnboardingDbInput.handleMongoCredentials(key, state, render);

    // Supabase steps
    if (data.currentStep === 'SUPABASE_SETUP_CHOICE') {
      if (key === '\u001b[A' || key === 'w' || key === '1') {
        data.selectedOptionIndex = 0;
        data.supabaseSetupMode = 'auto';
        render();
        return false;
      }
      if (key === '\u001b[B' || key === 's' || key === '2') {
        data.selectedOptionIndex = 1;
        data.supabaseSetupMode = 'manual';
        render();
        return false;
      }
      if (key === '\u001b') {
        state.goBack();
        render();
        return false;
      }
      if (key === '\r') {
        if (data.supabaseSetupMode === 'auto') state.goToStep('SUPABASE_AUTO_TOKEN');
        else state.goToStep('SUPABASE_MANUAL_GUIDE');
        render();
        return false;
      }
    }

    if (data.currentStep === 'SUPABASE_AUTO_TOKEN') {
      if (key === '\u001b') {
        state.goBack();
        render();
        return false;
      }
      if (key === '\x7f' || key === '\b') {
        data.supabasePatToken = data.supabasePatToken.slice(0, -1);
        render();
        return false;
      }
      if (key.length === 1 && key >= ' ' && key <= '~') {
        data.supabasePatToken += key;
        render();
        return false;
      }
      if (key === '\r' && data.supabasePatToken.trim() && !data.isAutoProvisioning) {
        data.isAutoProvisioning = true;
        render();
        try {
          const autoRes = await SupabaseAutoSetup.provisionWithToken(data.supabasePatToken);
          if (autoRes.success && autoRes.url && autoRes.key) {
            data.supabaseUrl = autoRes.url;
            data.supabaseKey = autoRes.key;
            state.goToStep('TRADING_PARAMS');
          } else {
            state.setStatusMessage(autoRes.message, render);
          }
        } catch (err: any) {
          state.setStatusMessage(`Auto setup failed: ${err.message}`, render);
        } finally {
          data.isAutoProvisioning = false;
          render();
        }
        return false;
      }
    }

    if (data.currentStep === 'SUPABASE_MANUAL_GUIDE') {
      if (key === '\u001b') {
        state.goBack();
        render();
        return false;
      }
      if (key === 'c' || key === 'C') {
        await ClipboardService.copy(SUPABASE_SCHEMA_SQL);
        state.setNotice('SQL Schema copied to clipboard!', render);
        render();
        return false;
      }
      if (key === '\r') {
        state.goToStep('SUPABASE_CREDENTIALS');
        render();
        return false;
      }
    }

    if (data.currentStep === 'SUPABASE_CREDENTIALS') return handleCredentialInput(key, state, render);

    // Trading Params & Sub-Views
    if (['TRADING_PARAMS', 'PARAM_PICKER', 'SYMBOL_PICKER'].includes(data.currentStep)) {
      return handleParamsInput(key, state, render);
    }

    // Complete Confirmation
    if (data.currentStep === 'COMPLETE') {
      if (key === '\u001b') {
        state.goBack();
        render();
        return false;
      }
      if (key === '\r') return true;
    }

    return false;
  }
}
