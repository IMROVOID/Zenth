import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { LogExporter } from '../src/core/export/logExporter.js';
import { SqliteAutoSetup } from '../src/core/config/sqliteSetup.js';
import { EnvValidator } from '../src/core/config/envValidator.js';
import { EnvWriter } from '../src/core/config/envWriter.js';
import { resolvePath, toRelativePath, toRelativeConfigPath, workingDir } from '../src/core/paths/index.js';
import type { ExportDataPayload, ExportFormat } from '../src/core/export/types.js';

console.log('[TEST] Running Relative Path contract suite...');

const ABSOLUTE_PATH_PATTERN = /[A-Za-z]:[\\/]|^\\\\/;

function assertNotAbsolute(value: string, label: string): void {
  assert.ok(
    !ABSOLUTE_PATH_PATTERN.test(value),
    `${label} must not contain an absolute path, got: ${value}`
  );
}

function assertNoWorkingDirLeak(value: string, label: string): void {
  assert.ok(
    !value.includes(workingDir()),
    `${label} must not contain the working directory, got: ${value}`
  );
}

async function runTests() {
  // 1. Path helper contract
  assert.strictEqual(toRelativePath('data/zenth.db'), path.join('data', 'zenth.db'));
  assert.strictEqual(toRelativePath('.env'), '.env');
  assert.strictEqual(toRelativeConfigPath('data/zenth.db'), 'data/zenth.db');
  assert.strictEqual(toRelativeConfigPath(path.join('data', 'zenth.db')), 'data/zenth.db');
  assert.ok(path.isAbsolute(resolvePath('data', 'zenth.db')), 'resolvePath must stay absolute for file I/O');
  console.log('  [PASS] Test 1: Path helper contract verified.');

  // 1b. A config path must always resolve back to the same file
  for (const target of ['exported-logs/roundtrip.pdf', 'data/roundtrip.db', '../outside/roundtrip.pdf']) {
    const absolute = resolvePath(target);
    assert.strictEqual(
      resolvePath(toRelativeConfigPath(absolute)),
      absolute,
      `toRelativeConfigPath must round-trip for ${target}`
    );
  }
  console.log('  [PASS] Test 1b: Config paths round-trip to the same location.');

  // 1c. A displayed path is never absolute, whatever the host platform is
  const displayTargets = [
    resolvePath('exported-logs/r.pdf'),
    resolvePath('../outside/r.pdf'),
    'C:\\Users\\me\\out.pdf',
    'D:\\other\\out.pdf',
    '\\\\server\\share\\out.pdf',
    '\\\\?\\C:\\long\\out.pdf',
    '/mnt/other/out.pdf'
  ];
  for (const target of displayTargets) {
    assertNotAbsolute(toRelativePath(target), `toRelativePath(${target})`);
  }
  assert.ok(
    toRelativePath('C:\\Users\\me\\out.pdf').endsWith('out.pdf'),
    'A path from another drive must keep its leaf name'
  );
  console.log('  [PASS] Test 1c: Displayed paths are never absolute on any host platform.');

  // 2. Export paths are reported relative
  const exported = LogExporter.normalizeFilePath('exported-logs/contract_check', 'pdf');
  assertNotAbsolute(exported, 'LogExporter.normalizeFilePath result');
  assert.ok(exported.endsWith('.pdf'), 'Export path must carry the format extension');
  console.log('  [PASS] Test 2: Export file path is relative.');

  // 3. SQLite setup reports a relative db path
  const setup = await SqliteAutoSetup.provision('data/contract_check.db');
  assert.ok(setup.success, 'SQLite provisioning should succeed');
  assertNotAbsolute(setup.dbPath, 'SqliteSetupResult.dbPath');
  assertNoWorkingDirLeak(setup.message, 'SqliteSetupResult.message');
  assert.ok(!/[A-Za-z]:[\\/]/.test(setup.message), 'SqliteSetupResult.message must not embed an absolute path');
  fs.rmSync(resolvePath('data', 'contract_check.db'), { force: true });
  console.log('  [PASS] Test 3: SQLite setup reports relative db path.');

  // 4. Env file path stays relative in written configuration
  const envOverride = 'data/contract_check.env';
  const previousOverride = process.env.ZENTH_ENV_PATH;
  const previousEnv = { ...process.env };
  process.env.ZENTH_ENV_PATH = envOverride;
  try {
    EnvWriter.writeEnv({
      storageBackend: 'sqlite',
      sqlitePath: 'data/custom_db.db',
      tradingParams: {
        symbol: 'btc_usdt',
        interval: '5m',
        quantity: 0.01,
        maxPositionNotionalCap: 1000,
        stopLossPct: 1.5,
        takeProfitPct: 3,
        candleLookback: 300
      }
    });

    const written = fs.readFileSync(resolvePath(envOverride), 'utf-8');
    const dbPathLine = written.split('\n').find(l => l.startsWith('SQLITE_DB_PATH='));
    assert.ok(dbPathLine, 'SQLITE_DB_PATH must be written to the env file');
    const persisted = dbPathLine.split('=').slice(1).join('=');
    assertNotAbsolute(persisted, 'Persisted SQLITE_DB_PATH');
    assert.strictEqual(persisted, 'data/custom_db.db', 'A user-supplied path must be persisted relative');
    assert.strictEqual(
      process.env.SQLITE_DB_PATH,
      persisted,
      'The in-memory value must match the persisted value'
    );

    // A newline in the path must not inject an extra variable
    EnvWriter.writeEnv({
      storageBackend: 'sqlite',
      sqlitePath: 'data/x.db\nINJECTED=yes',
      tradingParams: {
        symbol: 'btc_usdt',
        interval: '5m',
        quantity: 0.01,
        maxPositionNotionalCap: 1000,
        stopLossPct: 1.5,
        takeProfitPct: 3,
        candleLookback: 300
      }
    });
    const injected = fs.readFileSync(resolvePath(envOverride), 'utf-8');
    assert.ok(!/^INJECTED=/m.test(injected), 'A newline in the path must not inject an extra env variable');
    console.log('  [PASS] Test 4: Persisted SQLITE_DB_PATH is relative and sanitized.');
  } finally {
    fs.rmSync(resolvePath(envOverride), { force: true });
    if (previousOverride === undefined) delete process.env.ZENTH_ENV_PATH;
    else process.env.ZENTH_ENV_PATH = previousOverride;
    for (const key of Object.keys(process.env)) {
      if (!(key in previousEnv)) delete process.env[key];
    }
    Object.assign(process.env, previousEnv);
  }

  // 5. Exported artifacts contain no absolute path, in every format
  const payload: ExportDataPayload = {
    sessionId: 'contract-check',
    sessionStartedAt: new Date().toISOString(),
    exportedAt: new Date().toISOString(),
    activeSymbol: 'btc_usdt',
    isTradingPaused: false,
    currentPrice: 65000,
    cycleCount: 1,
    totalEntries: 1,
    sessionWins: 1,
    sessionLosses: 0,
    winRate: 100,
    sessionRealizedPnL: 10,
    totalClosedMoney: 660,
    config: {
      symbol: 'btc_usdt',
      interval: '5m',
      exchange: 'binance',
      targetAllocation: 650,
      fastPeriod: 9,
      slowPeriod: 21,
      rsiPeriod: 14,
      rsiMaxEntry: 70,
      stopLossPct: 1.5,
      takeProfitPct: 3,
      trailingStopPct: 0,
      breakevenTriggerPct: 0,
      filterMode: 'adaptive',
      autoLearn: true
    } as any,
    activePosition: null,
    ledgerEntries: [],
    tickLogs: [
      {
        timestamp: '00:00:00',
        cycle: 1,
        symbol: 'btc_usdt',
        price: 65000,
        fastMA: 64900,
        slowMA: 64800,
        rsi: 55,
        enteredMoney: 650,
        closedMoney: 0,
        rulesCount: 0,
        sessionWin: 1,
        sessionLoss: 0,
        pnl: 10,
        message: `[EXPORT] Exported 0 trades & 0 ticks to ${exported}`
      }
    ],
    activeRules: []
  };

  const formats: ExportFormat[] = ['txt', 'csv', 'md', 'docx', 'pdf'];
  for (const format of formats) {
    const relativeTarget = `exported-logs/contract_check.${format}`;
    const res = await LogExporter.exportToFile(payload, format, relativeTarget);
    assert.ok(res.success, `Contract export should succeed for ${format}`);
    assertNotAbsolute(res.filePath!, `ExportResult.filePath (${format})`);
    assert.ok(
      fs.existsSync(resolvePath('exported-logs', `contract_check.${format}`)),
      `The ${format} export must exist on disk`
    );
    if (format !== 'docx' && format !== 'pdf') {
      const artifact = fs.readFileSync(resolvePath('exported-logs', `contract_check.${format}`), 'utf-8');
      assert.ok(
        !/[A-Za-z]:[\\/]/.test(artifact),
        `The ${format} artifact must not contain an absolute path`
      );
    }
    fs.rmSync(resolvePath('exported-logs', `contract_check.${format}`), { force: true });
  }
  console.log('  [PASS] Test 5: Exported artifacts contain no absolute path in any format.');

  console.log('[OK] All Relative Path contract tests passed successfully!\n');
}

runTests().catch((err) => {
  console.error('[FAIL]', err);
  process.exit(1);
});
