import { OnboardingState } from './onboardingState.js';
import { PostgresAutoSetup } from '../../core/config/postgresSetup.js';
import { CredentialGenerator } from '../../core/config/credentialGenerator.js';

export class OnboardingPostgresInput {
  static async handleChoice(key: string, state: OnboardingState, render: () => void): Promise<boolean> {
    const data = state.data;
    if (key === '\u001b') {
      state.goBack();
      render();
      return false;
    }
    if (key === '\u001b[A' || key === 'w' || key === '1') {
      data.selectedOptionIndex = 0;
      data.postgresSetupMode = 'auto';
      render();
      return false;
    }
    if (key === '\u001b[B' || key === 's' || key === '2') {
      data.selectedOptionIndex = 1;
      data.postgresSetupMode = 'manual';
      render();
      return false;
    }
    if (key === '\r') {
      if (data.postgresSetupMode === 'auto') {
        data.isAutoProvisioning = true;
        render();
        const res = await PostgresAutoSetup.provision({
          host: data.postgresHost,
          port: parseInt(data.postgresPort || '5432', 10),
          user: data.postgresUser,
          password: data.postgresPassword,
          database: data.postgresDatabase
        });
        data.isAutoProvisioning = false;
        if (res.success) {
          state.goToStep('TRADING_PARAMS');
        } else {
          state.setStatusMessage(res.message, render);
          state.goToStep('POSTGRES_CREDENTIALS');
        }
        render();
        return false;
      } else {
        state.goToStep('POSTGRES_CREDENTIALS');
        render();
        return false;
      }
    }
    return false;
  }

  static async handleCredentials(key: string, state: OnboardingState, render: () => void): Promise<boolean> {
    const data = state.data;
    if (key === '\u001b') {
      state.goBack();
      render();
      return false;
    }
    if (key === 'g' || key === 'G') {
      const creds = CredentialGenerator.generatePostgres();
      data.postgresUser = creds.user;
      data.postgresPassword = creds.password;
      state.setNotice(`Generated credentials (User: ${creds.user}, Pass: ${creds.password})`, render);
      render();
      return false;
    }
    const fields: Array<typeof data.activePostgresField> = ['host', 'port', 'user', 'password', 'database'];
    if (key === '\t' || key === '\u001b[B') {
      const idx = fields.indexOf(data.activePostgresField);
      data.activePostgresField = fields[(idx + 1) % fields.length];
      render();
      return false;
    }
    if (key === '\u001b[A') {
      const idx = fields.indexOf(data.activePostgresField);
      data.activePostgresField = fields[(idx - 1 + fields.length) % fields.length];
      render();
      return false;
    }
    if (key === '\r' && !data.isValidating) {
      data.isValidating = true;
      render();
      const res = await PostgresAutoSetup.provision({
        host: data.postgresHost,
        port: parseInt(data.postgresPort || '5432', 10),
        user: data.postgresUser,
        password: data.postgresPassword,
        database: data.postgresDatabase
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
      if (data.activePostgresField === 'host') data.postgresHost = data.postgresHost.slice(0, -1);
      else if (data.activePostgresField === 'port') data.postgresPort = data.postgresPort.slice(0, -1);
      else if (data.activePostgresField === 'user') data.postgresUser = data.postgresUser.slice(0, -1);
      else if (data.activePostgresField === 'password') data.postgresPassword = data.postgresPassword.slice(0, -1);
      else if (data.activePostgresField === 'database') data.postgresDatabase = data.postgresDatabase.slice(0, -1);
      render();
      return false;
    }
    if (key.length === 1 && key >= ' ' && key <= '~') {
      if (data.activePostgresField === 'host') data.postgresHost += key;
      else if (data.activePostgresField === 'port') data.postgresPort += key;
      else if (data.activePostgresField === 'user') data.postgresUser += key;
      else if (data.activePostgresField === 'password') data.postgresPassword += key;
      else if (data.activePostgresField === 'database') data.postgresDatabase += key;
      render();
      return false;
    }
    return false;
  }
}
