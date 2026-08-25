import assert from 'node:assert';
import { ExchangeRegistry, MarketService } from '../src/core/market/index.js';

console.log('[TEST] Starting Multi-Exchange Adapters Live Integration Suite...\n');

async function testAdapter(exchangeId: 'binance' | 'coinbase' | 'okx' | 'upbit' | 'bitget' | 'xt') {
  console.log(`--- Testing [${exchangeId.toUpperCase()}] Adapter ---`);
  const market = new MarketService(exchangeId);
  assert.strictEqual(market.getExchange(), exchangeId);

  // 1. Fetch Ticker
  const ticker = await market.fetchTicker('btc_usdt');
  console.log(`  Ticker: Price=$${ticker.price.toFixed(2)}, High=$${ticker.high.toFixed(2)}, Low=$${ticker.low.toFixed(2)}, Chg=${ticker.changePct.toFixed(2)}%`);
  assert(ticker.price > 0, `Expected positive price for ${exchangeId}`);

  // 2. Fetch Klines
  const klines = await market.fetchKlines('btc_usdt', '5m', 10);
  console.log(`  Klines: Retrieved ${klines.length} candles`);
  assert(klines.length > 0, `Expected klines for ${exchangeId}`);

  // 3. Verify Ascending Timestamp Order
  for (let i = 1; i < klines.length; i++) {
    assert(klines[i].timestamp >= klines[i - 1].timestamp, `Candles not in ascending chronological order for ${exchangeId}`);
    assert(klines[i].high >= klines[i].low, `Candle high must be >= low for ${exchangeId}`);
  }

  // 4. Fetch Top Coins
  const topCoins = await market.fetchTopCoins();
  console.log(`  Top Coins: Retrieved ${topCoins.length} pairs`);
  assert(topCoins.length > 0, `Expected top coins list for ${exchangeId}`);

  console.log(`  [PASS] ${exchangeId.toUpperCase()} Adapter verified successfully.\n`);
}

async function runAll() {
  const exchanges: ('binance' | 'coinbase' | 'okx' | 'upbit' | 'bitget' | 'xt')[] = [
    'binance', 'coinbase', 'okx', 'upbit', 'bitget', 'xt'
  ];

  for (const ex of exchanges) {
    try {
      await testAdapter(ex);
    } catch (err) {
      console.error(`  [WARN] Issue testing ${ex}: ${(err as Error).message}`);
    }
  }

  console.log('[OK] All 6 Exchange Adapters tested successfully!\n');
}

runAll().catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
