import assert from 'node:assert';
import { generateSparkline, generateSyntheticCandles } from '../src/core/market/synthetic.js';
import { findCoinItem, findStockItem } from '../src/core/market/search.js';
import { MarketService } from '../src/core/market/marketService.js';
import { CoinInfo, StockInfo } from '../src/core/market/types.js';

console.log('[TEST] Running Market Service & Synthetic Data test suite...');

async function runMarketTests() {
  // 1. generateSparkline calculations and bounds
  const sparkline = generateSparkline(100, 10, 115, 85, 16);
  assert.strictEqual(sparkline.length, 16);
  assert.ok(Math.abs(sparkline[0] - (100 / 1.1)) < 0.001); // Open price
  assert.strictEqual(sparkline[15], 100); // Current price
  sparkline.forEach(pt => {
    assert.ok(pt >= 85 && pt <= 115, `Sparkline point ${pt} within [85, 115]`);
  });

  // Edge cases
  const singlePt = generateSparkline(100, 10, 110, 90, 1);
  assert.strictEqual(singlePt.length, 1);
  const zeroPrice = generateSparkline(0, 0, 0, 0, 16);
  assert.strictEqual(zeroPrice.length, 16);
  assert.strictEqual(zeroPrice[0], 0);
  console.log('  [PASS] generateSparkline generates valid micro-trajectories within bounds.');

  // 2. generateSyntheticCandles structure and timestamps
  const candles5m = generateSyntheticCandles(50000, '5m', 20);
  assert.strictEqual(candles5m.length, 21); // limit + 1
  for (let i = 0; i < candles5m.length; i++) {
    const c = candles5m[i];
    assert.ok(typeof c.timestamp === 'number');
    assert.ok(c.open > 0 && c.close > 0 && c.high >= Math.max(c.open, c.close));
    assert.ok(c.low <= Math.min(c.open, c.close));
    assert.ok(c.volume > 0);
    assert.strictEqual(c.quoteVolume, c.volume * c.close);
  }
  // Check 5m interval delta
  const delta5m = candles5m[1].timestamp - candles5m[0].timestamp;
  assert.strictEqual(delta5m, 300000); // 5 minutes in ms

  // Check 1m interval delta
  const candles1m = generateSyntheticCandles(100, '1m', 5);
  const delta1m = candles1m[1].timestamp - candles1m[0].timestamp;
  assert.strictEqual(delta1m, 60000); // 1 minute in ms
  console.log('  [PASS] generateSyntheticCandles produces well-formed OHLCV series.');

  // 3. Search functions: findCoinItem & findStockItem
  const mockCoins: CoinInfo[] = [
    { symbol: 'btc_usdt', baseCoin: 'BTC', fullName: 'Bitcoin', price: 95000, change24hPct: 2.5, volume24h: 1e9, sparkline: [] },
    { symbol: 'eth_usdt', baseCoin: 'ETH', fullName: 'Ethereum', price: 3200, change24hPct: -1.2, volume24h: 5e8, sparkline: [] },
    { symbol: 'sol_usdt', baseCoin: 'SOL', fullName: 'Solana', price: 210, change24hPct: 5.0, volume24h: 3e8, sparkline: [] }
  ];

  const mockTickerFetcher = async (sym: string) => ({
    price: 1.5, changePct: 0.5, volume: 1000, low: 1.4, high: 1.6
  });

  // Exact symbol search
  const foundExact = await findCoinItem('btc', async () => mockCoins, mockTickerFetcher);
  assert.strictEqual(foundExact?.baseCoin, 'BTC');

  // Exact full name search
  const foundName = await findCoinItem('ethereum', async () => mockCoins, mockTickerFetcher);
  assert.strictEqual(foundName?.symbol, 'eth_usdt');

  // Partial search
  const foundPartial = await findCoinItem('sol', async () => mockCoins, mockTickerFetcher);
  assert.strictEqual(foundPartial?.symbol, 'sol_usdt');

  // Fallback search
  const foundFallback = await findCoinItem('unknown_token', async () => mockCoins, mockTickerFetcher);
  assert.strictEqual(foundFallback?.symbol, 'unknown_token_usdt');
  console.log('  [PASS] findCoinItem matches exact, full name, partial, and ticker fallbacks.');

  // Stock search
  const mockStocks: StockInfo[] = [
    { symbol: 'aaplx_usdt', ticker: 'AAPLX', companyName: 'Apple Inc', price: 230, change24hPct: 1.1, volume24h: 1e7, sparkline: [] },
    { symbol: 'tslax_usdt', ticker: 'TSLAX', companyName: 'Tesla Inc', price: 210, change24hPct: -2.3, volume24h: 8e6, sparkline: [] }
  ];

  const stockExact = await findStockItem('aapl', async () => mockStocks);
  assert.strictEqual(stockExact?.ticker, 'AAPLX');
  const stockName = await findStockItem('Tesla', async () => mockStocks);
  assert.strictEqual(stockName?.ticker, 'TSLAX');
  const stockNone = await findStockItem('nonexistent', async () => mockStocks);
  assert.strictEqual(stockNone, null);
  console.log('  [PASS] findStockItem matches ticker symbols and company names.');

  // 4. MarketService instantiation and exchange configuration
  const market = new MarketService('xt');
  assert.strictEqual(market.getExchange(), 'xt');
  assert.ok(market.getDisplayName().length > 0);

  // Switch exchange
  market.setExchange('binance');
  assert.strictEqual(market.getExchange(), 'binance');
  console.log('  [PASS] MarketService sets and switches exchange adapters cleanly.');
}

runMarketTests().then(() => {
  console.log('[OK] All Market Service & Synthetic Data tests passed successfully!\n');
}).catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
