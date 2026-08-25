import { OnboardingState } from './onboardingState.js';
import { OnboardingRenderer } from './onboardingRenderer.js';
import { OnboardingInput } from './onboardingInput.js';
import { OnboardingMouseInput } from './onboardingMouseInput.js';
import { EnvWriter } from '../../core/config/envWriter.js';
import { Screen, extractMouseEvents } from '../utils/index.js';

export class OnboardingApp {
  private _state = new OnboardingState();

  get state(): OnboardingState {
    return this._state;
  }

  private render = (): void => {
    OnboardingRenderer.render(this._state);
  };

  async run(): Promise<boolean> {
    process.stdout.write(Screen.enterAltBuffer + Screen.hideCursor);

    const isTTY = process.stdin.isTTY;
    if (isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf-8');
    }

    this.render();

    return new Promise((resolve) => {
      let isCleanedUp = false;
      const onResize = () => this.render();
      process.stdout.on('resize', onResize);

      const cleanup = () => {
        if (isCleanedUp) return;
        isCleanedUp = true;
        process.stdin.off('data', onData);
        process.stdout.off('resize', onResize);
        process.removeListener('SIGINT', onSigInt);
        process.stdout.write(Screen.exitAltBuffer + Screen.showCursor);
      };

      const onSigInt = () => {
        cleanup();
        if (isTTY) process.stdin.setRawMode(false);
        process.exit(0);
      };
      process.on('SIGINT', onSigInt);

      const onData = async (chunk: string | Buffer) => {
        const input = chunk.toString();
        const { events, remainingText } = extractMouseEvents(input);

        for (const ev of events) {
          OnboardingMouseInput.handle(ev, this._state, this.render);
        }

        if (remainingText) {
          const finished = await OnboardingInput.handle(remainingText, this._state, this.render);
          if (finished) {
            cleanup();

            if (this._state.data.isCancelled) {
              resolve(false);
              return;
            }

            try {
              const d = this._state.data;
              EnvWriter.writeEnv({
                storageBackend: d.storageBackend,
                sqlitePath: d.sqlitePath,
                postgresUrl: d.postgresUrl,
                postgresHost: d.postgresHost,
                postgresPort: parseInt(d.postgresPort || '5432', 10),
                postgresUser: d.postgresUser,
                postgresPassword: d.postgresPassword,
                postgresDatabase: d.postgresDatabase,
                mongoUri: d.mongoUri,
                mongoDatabase: d.mongoDatabase,
                supabaseUrl: d.supabaseUrl,
                supabaseKey: d.supabaseKey,
                tradingParams: d.tradingParams
              });
              resolve(true);
            } catch {
              resolve(false);
            }
          }
        }
      };

      process.stdin.on('data', onData);
    });
  }
}
