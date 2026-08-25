import { MarketService } from '../market/marketService.js';
import { StrategyEngine } from '../strategy/strategyEngine.js';
import { RiskManager } from '../risk/riskManager.js';
import { ReplayEngine } from '../replay/replayEngine.js';
import { MemoryService } from '../memory/memoryService.js';
import { AdaptiveFilter } from '../memory/adaptiveFilter.js';
import { Logger, c } from '../logger/index.js';
import { ActivePosition } from './types.js';
import { SessionTracker } from './sessionTracker.js';
import { executeLoopIteration } from './loopIteration.js';

export class ContinuousLoopRunner {
  static async start(
    symbol = 'btc_usdt',
    interval = '5m',
    pollSeconds = 15,
    market: MarketService,
    strategy: StrategyEngine,
    risk: RiskManager,
    replay: ReplayEngine,
    memory: MemoryService,
    adaptiveFilter: AdaptiveFilter,
    session: SessionTracker
  ): Promise<void> {
    Logger.banner(
      `AUTONOMOUS SELF-LEARNING PAPER TRADING LOOP`,
      `Symbol: ${symbol.toUpperCase()} | Interval: ${interval} | Poll: ${pollSeconds}s | Supabase RLS Sync Enabled`
    );

    const stopLossPct = parseFloat(process.env.STOP_LOSS_PCT || '1.5');
    const takeProfitPct = parseFloat(process.env.TAKE_PROFIT_PCT || '3.0');
    const targetAllocation = 500.0;

    let cycleCount = 0;
    let activePosition: ActivePosition | null = null;

    const runCycle = async () => {
      cycleCount++;
      try {
        activePosition = await executeLoopIteration(
          cycleCount,
          symbol,
          interval,
          stopLossPct,
          takeProfitPct,
          targetAllocation,
          activePosition,
          market,
          strategy,
          risk,
          replay,
          memory,
          adaptiveFilter,
          session
        );
      } catch (err) {
        Logger.warn(`Loop tick warning: ${(err as Error).message}`);
      }
    };

    await runCycle();
    const intervalHandle = setInterval(runCycle, pollSeconds * 1000);

    process.on('SIGINT', async () => {
      clearInterval(intervalHandle);
      await session.sync(memory, symbol, activePosition, targetAllocation);
      console.log(`\n\n${c.yellow}[STOPPED] Bot stopped by user.${c.reset}`);
      console.log(`${c.bold}${c.cyan}FINAL SESSION SUMMARY:${c.reset}`);
      console.log(`   • Total Entries Opened   : ${session.totalEntries}`);
      console.log(`   • Total Wins / Losses    : ${c.green}${session.sessionWins}W${c.reset} / ${c.red}${session.sessionLosses}L${c.reset}`);
      console.log(`   • Win Rate               : ${session.winRate.toFixed(1)}%`);
      console.log(`   • Total Closed Capital   : $${session.totalClosedMoney.toFixed(2)} USDT`);
      console.log(`   • Total Realized PnL     : ${session.sessionRealizedPnL >= 0 ? c.green : c.red}${session.sessionRealizedPnL >= 0 ? '+' : ''}$${session.sessionRealizedPnL.toFixed(2)} USDT${c.reset}\n`);
      process.exit(0);
    });
  }
}
