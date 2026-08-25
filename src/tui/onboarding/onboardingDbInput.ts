import { OnboardingState } from './onboardingState.js';
import { SqliteAutoSetup } from '../../core/config/sqliteSetup.js';
import { MongoAutoSetup } from '../../core/config/mongoSetup.js';
import { OnboardingPostgresInput } from './onboardingPostgresInput.js';

export class OnboardingDbInput {
  static async handleSqlite(key: string, state: OnboardingState, render: () => void): Promise<boolean> {
    const data = state.data;
    if (key === '\u001b') {
      state.goBack();
      render();
      return false;
    }
    if (key === '\r' && !data.isAutoProvisioning) {
      data.isAutoProvisioning = true;
      render();
      const res = await SqliteAutoSetup.provision(data.sqlitePath);
      data.isAutoProvisioning = false;
      if (res.success) {
        state.goToStep('TRADING_PARAMS');
      } else {
        state.setStatusMessage(res.message, render);
      }
      render();
      return false;
    }
    return false;
  }

  static async handlePostgresChoice(key: string, state: OnboardingState, render: () => void): Promise<boolean> {
    return OnboardingPostgresInput.handleChoice(key, state, render);
  }

  static async handlePostgresCredentials(key: string, state: OnboardingState, render: () => void): Promise<boolean> {
    return OnboardingPostgresInput.handleCredentials(key, state, render);
  }

  static async handleMongoChoice(key: string, state: OnboardingState, render: () => void): Promise<boolean> {
    const data = state.data;
    if (key === '\u001b') {
      state.goBack();
      render();
      return false;
    }
    if (key === '\u001b[A' || key === 'w' || key === '1') {
      data.selectedOptionIndex = 0;
      data.mongoSetupMode = 'auto';
      render();
      return false;
    }
    if (key === '\u001b[B' || key === 's' || key === '2') {
      data.selectedOptionIndex = 1;
      data.mongoSetupMode = 'manual';
      render();
      return false;
    }
    if (key === '\r') {
      if (data.mongoSetupMode === 'auto') {
        data.isAutoProvisioning = true;
        render();
        const res = await MongoAutoSetup.provision({
          uri: data.mongoUri,
          database: data.mongoDatabase
        });
        data.isAutoProvisioning = false;
        if (res.success) {
          state.goToStep('TRADING_PARAMS');
        } else {
          state.setStatusMessage(res.message, render);
          state.goToStep('MONGO_CREDENTIALS');
        }
        render();
        return false;
      } else {
        state.goToStep('MONGO_CREDENTIALS');
        render();
        return false;
      }
    }
    return false;
  }

  static async handleMongoCredentials(key: string, state: OnboardingState, render: () => void): Promise<boolean> {
    const data = state.data;
    if (key === '\u001b') {
      state.goBack();
      render();
      return false;
    }
    if (key === '\r' && !data.isValidating) {
      data.isValidating = true;
      render();
      const res = await MongoAutoSetup.provision({
        uri: data.mongoUri,
        database: data.mongoDatabase
      });
      data.isValidating = false;
      if (res.success) {
        state.goToStep('TRADING_PARAMS');
      } else {
        state.setStatusMessage(res.message, render);
      }
      render();
      return false;
    }
    if (key === '\x7f' || key === '\b') {
      data.mongoUri = data.mongoUri.slice(0, -1);
      render();
      return false;
    }
    if (key.length === 1 && key >= ' ' && key <= '~') {
      data.mongoUri += key;
      render();
      return false;
    }
    return false;
  }
}
