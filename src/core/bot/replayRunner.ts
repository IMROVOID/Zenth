import { MarketService } from '../market/marketService.js';
import { ReplayEngine } from '../replay/replayEngine.js';
import { MemoryService } from '../memory/memoryService.js';
import { Logger, c } from '../logger/index.js';

export async function runBotReplayRaw(
  symbol: string,
  interval: string,
  limit: number,
  market: MarketService,
  replay: ReplayEngine,
  memory: MemoryService,
  sessionId: string
): Promise<void> {
  Logger.banner(`RAW BASELINE HISTORICAL REPLAY: ${symbol.toUpperCase()} (${interval})`, `Evaluating ${limit} real candles without memory to establish baseline`);

  Logger.info(`Fetching ${limit} historical candles from XT.com API...`);
  const candles = await market.fetchKlines(symbol, interval, limit);
  Logger.success(`Loaded ${candles.length} real market candles from XT.com.`);

  const { trades, summary } = replay.runRawReplay({
    symbol,
    timeframe: interval,
    candles,
    stopLossPct: 1.5,
    takeProfitPct: 3.0,
    allocationUsd: 500.0
  });

  const output = replay.formatOutput(trades, summary, 'RAW BASELINE REPLAY (NO MEMORY)');
  console.log(output);

  Logger.memory(`Syncing ${trades.length} trade records into Supabase trade_ledger...`);
  for (const trade of trades) {
    await memory.logTrade({
      timestamp: new Date(trade.entryTime).toISOString(),
      symbol,
      action: trade.action,
      price: trade.entryPrice,
      quantity: trade.quantity,
      notional_value: trade.notionalValue,
      entry_value: trade.entryValue,
      exit_value: trade.exitValue,
      pnl_percentage: trade.pnlPct,
      session_id: sessionId,
      reason: trade.reason,
      mode: 'REPLAY_RAW',
      outcome: trade.outcome,
      pnl: trade.pnl
    });
  }

  const lossTrades = trades.filter(t => t.outcome === 'LOSS');
  if (lossTrades.length > 0) {
    Logger.memory(`Synthesizing failure patterns into Supabase adaptive_learnings...`);
    for (const lossTrade of lossTrades) {
      let ruleText = `Skip ${symbol.toUpperCase()} crossover when setup exhibits ${lossTrade.patternCondition}`;
      if (lossTrade.patternCondition === 'MA_CROSSOVER_LOW_VOLUME') {
        ruleText = `Avoid buying ${symbol.toUpperCase()} 9/21 MA crossovers on below-average candle volume (<75% of 20 SMA) to prevent fakeout whipsaws.`;
      } else if (lossTrade.patternCondition === 'STANDARD_MA_CROSSOVER') {
        ruleText = `Require secondary volume or momentum breakout before confirming standard ${symbol.toUpperCase()} 9/21 MA crossovers.`;
      }

      await memory.recordLearning({
        symbol,
        pattern_condition: lossTrade.patternCondition,
        loss_reason: lossTrade.exitReason,
        trading_rule: ruleText,
        status: 'ACTIVE',
        metadata: {
          sampleLossPnl: lossTrade.pnl,
          lossTime: lossTrade.entryTime,
          indicators: lossTrade.indicatorsAtEntry
        }
      });
    }
    Logger.success(`Recorded ${lossTrades.length} adaptive learning rule(s) to Supabase.`);
  }

  console.log(`\n${c.brightGreen}[COMPLETED] Baseline replay finished. Next run: 'npm run replay:memory' to test adaptive filtering.${c.reset}\n`);
}

export async function runBotReplayMemory(
  symbol: string,
  interval: string,
  limit: number,
  market: MarketService,
  replay: ReplayEngine,
  memory: MemoryService,
  sessionId: string,
  rawFallback: () => Promise<void>
): Promise<void> {
  Logger.banner(`ADAPTIVE MEMORY COMPARISON: ${symbol.toUpperCase()} (${interval})`, `Comparing Raw Baseline vs. Memory-Filtered Execution on ${limit} candles`);

  Logger.info(`Fetching historical candles from XT.com API...`);
  const candles = await market.fetchKlines(symbol, interval, limit);

  Logger.memory(`Querying active rules from Supabase adaptive_learnings...`);
  let activeLearnings = await memory.getActiveLearnings(symbol);

  if (activeLearnings.length === 0) {
    Logger.warn(`No active failure patterns found in Supabase. Seeding from raw replay first...`);
    await rawFallback();
    activeLearnings = await memory.getActiveLearnings(symbol);
  }

  const rawResult = replay.runRawReplay({
    symbol,
    timeframe: interval,
    candles,
    stopLossPct: 1.5,
    takeProfitPct: 3.0,
    allocationUsd: 500.0
  });

  const memResult = replay.runMemoryReplay(
    {
      symbol,
      timeframe: interval,
      candles,
      stopLossPct: 1.5,
      takeProfitPct: 3.0,
      allocationUsd: 500.0
    },
    activeLearnings
  );

  for (const skip of memResult.skippedSetups) {
    await memory.logTrade({
      timestamp: new Date().toISOString(),
      symbol,
      action: 'SKIP',
      price: skip.price,
      quantity: 0,
      notional_value: 0,
      entry_value: 0,
      exit_value: 0,
      pnl_percentage: 0,
      session_id: sessionId,
      reason: skip.reason,
      mode: 'REPLAY_MEMORY',
      outcome: 'SKIPPED',
      pnl: 0
    });
  }

  const comparisonOutput = replay.formatComparison(
    rawResult.summary,
    memResult.summary,
    memResult.skippedSetups,
    activeLearnings
  );
  console.log(comparisonOutput);

  const latestLedger = await memory.getLatestLedgerEntry(symbol);
  const latestLearning = await memory.getLatestLearning(symbol);

  console.log(`${c.bold}${c.cyan}LATEST SUPABASE DATABASE RECORDS:${c.reset}`);
  if (latestLedger) {
    console.log(`  • ${c.bold}trade_ledger:${c.reset} [${c.yellow}${latestLedger.action}${c.reset}] ${latestLedger.symbol.toUpperCase()} | Outcome: ${c.white}${latestLedger.outcome}${c.reset} | PnL: ${latestLedger.pnl >= 0 ? c.green : c.red}$${latestLedger.pnl}${c.reset} | Reason: "${c.gray}${latestLedger.reason}${c.reset}"`);
  }
  if (latestLearning) {
    console.log(`  • ${c.bold}adaptive_learnings:${c.reset} [${c.magenta}${latestLearning.pattern_condition}${c.reset}] → "${c.white}${latestLearning.trading_rule}${c.reset}" (Triggers: ${c.yellow}${latestLearning.trigger_count || 0}${c.reset})`);
  }
  console.log('');
}
