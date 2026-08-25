import { TradingBot } from './bot.js';
import { TuiApp } from './tui/tuiApp.js';
import { OnboardingApp } from './tui/onboarding/onboardingApp.js';
import { EnvValidator } from './core/config/envValidator.js';
import dotenv from 'dotenv';

dotenv.config();

export * from './bot.js';
export * from './types.js';
export * from './strategy.js';
export * from './risk.js';
export * from './market.js';
export * from './memory.js';
export * from './replay.js';
export * from './logger.js';
export * from './execution.js';
export * from './core/config/index.js';
export * from './tui/tuiApp.js';
export * from './tui/onboarding/index.js';

function extractExchangeArg(args: string[]): string | undefined {
  const exIdx = args.findIndex(a => a === '--exchange' || a === '-e');
  if (exIdx >= 0 && args[exIdx + 1]) {
    return args[exIdx + 1].toLowerCase();
  }
  return undefined;
}

export async function runCli(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] && !args[0].startsWith('-') ? args[0] : 'start';
  const cliExchange = extractExchangeArg(args);
  if (cliExchange) {
    process.env.EXCHANGE = cliExchange;
  }

  const bot = new TradingBot(cliExchange);

  try {
    switch (command) {
      case 'start':
      case 'tui':
      case 'zenth':
      case 'loop':
      case 'auto': {
        if (EnvValidator.isOnboardingRequired()) {
          const onboarding = new OnboardingApp();
          await onboarding.run();
        }
        const app = new TuiApp();
        await app.start();
        break;
      }

      case 'onboard':
      case 'setup': {
        const onboarding = new OnboardingApp();
        await onboarding.run();
        console.log('\n[OK] Onboarding configuration completed successfully!\n');
        break;
      }

      case 'scan': {
        const symbol = process.env.DEFAULT_SYMBOL || 'btc_usdt';
        const interval = process.env.DEFAULT_INTERVAL || '5m';
        const quantity = parseFloat(process.env.DEFAULT_QUANTITY || '0.01');
        await bot.scan(symbol, interval, quantity);
        break;
      }

      case 'replay:raw': {
        const symbol = process.env.DEFAULT_SYMBOL || 'btc_usdt';
        const interval = process.env.DEFAULT_INTERVAL || '5m';
        const lookback = parseInt(process.env.CANDLE_LOOKBACK || '300', 10);
        await bot.replayRaw(symbol, interval, lookback);
        break;
      }

      case 'replay:memory': {
        const symbol = process.env.DEFAULT_SYMBOL || 'btc_usdt';
        const interval = process.env.DEFAULT_INTERVAL || '5m';
        const lookback = parseInt(process.env.CANDLE_LOOKBACK || '300', 10);
        await bot.replayMemory(symbol, interval, lookback);
        break;
      }

      case 'memory:reset':
      case 'db:reset': {
        const symbol = args[1] && !args[1].startsWith('-') ? args[1] : process.env.DEFAULT_SYMBOL;
        await bot.memoryReset(symbol);
        break;
      }

      default:
        console.log(`\nUsage: zenth [start | onboard | scan | replay:raw | replay:memory | memory:reset] [--exchange <venue>]`);
        console.log(`  zenth                   - Launch interactive Zenth TUI Terminal`);
        console.log(`  onboard                 - Re-run the step-by-step Onboarding wizard`);
        console.log(`  scan [--exchange <v>]   - Single-pass real-time scan (binance, coinbase, okx, upbit, bitget, xt)`);
        console.log(`  replay:raw              - Baseline historical backtest without memory`);
        console.log(`  replay:memory           - Replay comparison with Supabase adaptive filter`);
        console.log(`  memory:reset            - Clear Supabase / local memory tables\n`);
        break;
    }
  } catch (err) {
    console.error(`\n[ERROR] Error during execution: ${(err as Error).message}\n`);
    process.exit(1);
  }
}

const isDirectExecution = process.argv[1] && (
  process.argv[1].endsWith('index.ts') ||
  process.argv[1].endsWith('index.js')
);
if (isDirectExecution) {
  runCli();
}
