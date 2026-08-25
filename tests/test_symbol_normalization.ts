import assert from 'node:assert';
import { SymbolNormalizer, IntervalMapper, ExchangeRegistry } from '../src/core/market/index.js';

console.log('[TEST] Starting Symbol & Interval Normalization Test Suite...');

// 1. Symbol Normalization
{
  const btcPair = SymbolNormalizer.parsePair('btc_usdt');
  assert.strictEqual(btcPair.base, 'BTC');
  assert.strictEqual(btcPair.quote, 'USDT');

  const btcSlash = SymbolNormalizer.parsePair('ETH/USDT');
  assert.strictEqual(btcSlash.base, 'ETH');
  assert.strictEqual(btcSlash.quote, 'USDT');

  const upbitPair = SymbolNormalizer.parsePair('KRW-BTC');
  assert.strictEqual(upbitPair.base, 'BTC');
  assert.strictEqual(upbitPair.quote, 'KRW');

  // Format tests
  assert.strictEqual(SymbolNormalizer.formatForExchange('btc_usdt', 'binance'), 'BTCUSDT');
  assert.strictEqual(SymbolNormalizer.formatForExchange('btc_usdt', 'coinbase'), 'BTC-USD');
  assert.strictEqual(SymbolNormalizer.formatForExchange('btc_usdt', 'okx'), 'BTC-USDT');
  assert.strictEqual(SymbolNormalizer.formatForExchange('btc_usdt', 'upbit'), 'USDT-BTC');
  assert.strictEqual(SymbolNormalizer.formatForExchange('btc_krw', 'upbit'), 'KRW-BTC');
  assert.strictEqual(SymbolNormalizer.formatForExchange('btc_usdt', 'bitget'), 'BTCUSDT');
  assert.strictEqual(SymbolNormalizer.formatForExchange('btc_usdt', 'xt'), 'btc_usdt');

  console.log('  [PASS] SymbolNormalizer format and parse verified across all venues.');
}

// 2. Interval Mapping
{
  assert.strictEqual(IntervalMapper.toExchangeInterval('5m', 'binance'), '5m');
  assert.strictEqual(IntervalMapper.toExchangeInterval('5m', 'coinbase'), '300');
  assert.strictEqual(IntervalMapper.toExchangeInterval('1h', 'coinbase'), '3600');
  assert.strictEqual(IntervalMapper.toExchangeInterval('5m', 'okx'), '5m');
  assert.strictEqual(IntervalMapper.toExchangeInterval('1h', 'okx'), '1H');
  assert.strictEqual(IntervalMapper.toExchangeInterval('5m', 'upbit'), '5');
  assert.strictEqual(IntervalMapper.toExchangeInterval('1h', 'upbit'), '60');
  assert.strictEqual(IntervalMapper.toExchangeInterval('5m', 'bitget'), '5min');
  assert.strictEqual(IntervalMapper.toExchangeInterval('1h', 'bitget'), '1h');
  assert.strictEqual(IntervalMapper.toExchangeInterval('5m', 'xt'), '5m');

  console.log('  [PASS] IntervalMapper timeframes verified across all venues.');
}

// 3. Exchange Registry
{
  const exchanges = ExchangeRegistry.listExchanges();
  assert.strictEqual(exchanges.length, 6);
  assert(exchanges.some(e => e.id === 'binance'));
  assert(exchanges.some(e => e.id === 'coinbase'));
  assert(exchanges.some(e => e.id === 'okx'));
  assert(exchanges.some(e => e.id === 'upbit'));
  assert(exchanges.some(e => e.id === 'bitget'));
  assert(exchanges.some(e => e.id === 'xt'));

  const binanceAdapter = ExchangeRegistry.getAdapter('binance');
  assert.strictEqual(binanceAdapter.exchangeId, 'binance');

  console.log('  [PASS] ExchangeRegistry registration and retrieval verified.');
}

console.log('[OK] All symbol and interval normalization tests passed successfully!\n');
