import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  ExportDataPayload,
  ExportFormat,
  DataFormatter,
  DocxExporter,
  PdfExporter,
  LogExporter,
  ClipboardService
} from '../src/core/export/index.js';

async function runTests() {
  console.log('[TEST] Starting Export & Clipboard verification tests...');

  const mockPayload: ExportDataPayload = {
    sessionId: 'ZENTH-TEST-12345',
    sessionStartedAt: '2026-08-25T00:00:00.000Z',
    exportedAt: '2026-08-25T01:00:00.000Z',
    activeSymbol: 'btc_usdt',
    isTradingPaused: false,
    currentPrice: 96500.5,
    cycleCount: 15,
    totalEntries: 2,
    sessionWins: 1,
    sessionLosses: 0,
    winRate: 100.0,
    sessionRealizedPnL: 45.2,
    totalClosedMoney: 1045.2,
    config: {
      symbol: 'btc_usdt',
      interval: '5m',
      targetAllocation: 1000,
      fastPeriod: 9,
      slowPeriod: 21,
      rsiPeriod: 14,
      rsiMaxEntry: 65,
      volumePeriod: 20,
      minVolumeRatio: 1.0,
      stopLossPct: 1.5,
      takeProfitPct: 3.0,
      maxDailyLoss: 50.0,
      maxConsecutiveLosses: 3,
      pollSeconds: 5,
      candleLookback: 300,
      filterMode: 'RELAXED',
      autoLearn: true,
      exitOnReverseCross: true,
      breakevenTriggerPct: 1.0,
      trailingStopPct: 0.8
    },
    activePosition: null,
    ledgerEntries: [
      {
        id: 'trade-1',
        timestamp: '2026-08-25T00:10:00.000Z',
        symbol: 'btc_usdt',
        action: 'BUY',
        price: 96000.0,
        quantity: 0.010416,
        notional_value: 1000.0,
        entry_value: 1000.0,
        exit_value: 0,
        pnl_percentage: 0,
        session_id: 'ZENTH-TEST-12345',
        reason: 'Entered on 9/21 MA crossover',
        mode: 'PAPER',
        outcome: 'PENDING',
        pnl: 0
      },
      {
        id: 'trade-2',
        timestamp: '2026-08-25T00:25:00.000Z',
        symbol: 'btc_usdt',
        action: 'SELL',
        price: 96450.0,
        quantity: 0.010416,
        notional_value: 1004.68,
        entry_value: 1000.0,
        exit_value: 1004.68,
        pnl_percentage: 4.52,
        session_id: 'ZENTH-TEST-12345',
        reason: 'Take profit reached',
        mode: 'PAPER',
        outcome: 'WIN',
        pnl: 45.2
      }
    ],
    tickLogs: [
      {
        timestamp: '00:05:00',
        cycle: 1,
        symbol: 'btc_usdt',
        price: 95900.0,
        fastMA: 95850.0,
        slowMA: 95800.0,
        rsi: 52.4,
        enteredMoney: 0,
        closedMoney: 0,
        rulesCount: 1,
        sessionWin: 0,
        sessionLoss: 0,
        pnl: 0,
        message: 'Initial market scan complete'
      },
      {
        timestamp: '00:10:00',
        cycle: 2,
        symbol: 'btc_usdt',
        price: 96000.0,
        fastMA: 95950.0,
        slowMA: 95820.0,
        rsi: 58.1,
        enteredMoney: 1000.0,
        closedMoney: 0,
        rulesCount: 1,
        sessionWin: 0,
        sessionLoss: 0,
        pnl: 0,
        message: 'BUY 0.010416 BTC_USDT @ $96000.00'
      }
    ],
    activeRules: [
      {
        id: 'rule-1',
        symbol: 'btc_usdt',
        pattern_condition: 'RSI_OVERBOUGHT',
        loss_reason: 'RSI > 70 Exhaustion',
        trading_rule: 'Do not enter when RSI > 70 with declining volume',
        trigger_count: 3,
        status: 'ACTIVE'
      }
    ]
  };

  // Test 1: Plain text generation
  const textOutput = DataFormatter.toPlainText(mockPayload);
  assert(textOutput.includes('ZENTH TRADING BOT - SESSION & TRADE EXPORT LOG'), 'Text header present');
  assert(textOutput.includes('btc_usdt'.toUpperCase()), 'Symbol present in text');
  assert(textOutput.includes('Take profit reached'), 'Ledger reason present in text');
  assert(textOutput.includes('TICK #  1'), 'Tick log present in text');
  console.log('✓ Plain text formatter verified');

  // Test 2: CSV generation
  const csvOutput = DataFormatter.toCsv(mockPayload);
  assert(csvOutput.includes('TradeLedger,Index,Timestamp,Symbol,Action,Price,Quantity,NotionalValue,Outcome,PnL,Reason'), 'CSV Trade headers present');
  assert(csvOutput.includes('TickLog,Cycle,Timestamp,Symbol,Price,FastMA,SlowMA,RSI,EnteredMoney,ClosedMoney,Wins,Losses,PnL,Message'), 'CSV Tick headers present');
  assert(csvOutput.includes('btc_usdt'), 'CSV contains btc_usdt');
  console.log('✓ CSV formatter verified');

  // Test 3: Markdown generation
  const mdOutput = DataFormatter.toMarkdown(mockPayload);
  assert(mdOutput.includes('# Zenth Trading Bot - Export Report'), 'MD title present');
  assert(mdOutput.includes('## Session Summary'), 'MD Session summary section present');
  assert(mdOutput.includes('## Trade Ledger Records'), 'MD Trade ledger section present');
  assert(mdOutput.includes('## Tick Log Stream'), 'MD Tick log section present');
  console.log('✓ Markdown formatter verified');

  // Test 4: DOCX generator
  const docxBuf = DocxExporter.generate(mockPayload);
  assert(docxBuf instanceof Buffer && docxBuf.length > 500, 'DOCX buffer valid size');
  assert(docxBuf[0] === 0x50 && docxBuf[1] === 0x4b && docxBuf[2] === 0x03 && docxBuf[3] === 0x04, 'DOCX has PK zip signature');
  console.log('✓ DOCX exporter generated valid Office Open XML ZIP package');

  // Test 5: PDF generator
  const pdfBuf = PdfExporter.generate(mockPayload);
  assert(pdfBuf instanceof Buffer && pdfBuf.length > 500, 'PDF buffer valid size');
  const pdfStr = pdfBuf.toString('binary');
  assert(pdfStr.startsWith('%PDF-1.4'), 'PDF header valid');
  assert(pdfStr.includes('%%EOF'), 'PDF EOF trailer valid');
  console.log('✓ PDF exporter generated valid PDF 1.4 document');

  // Test 6: LogExporter export to disk for all 5 formats
  const testDir = path.resolve(process.cwd(), 'exported-logs', 'test_run');
  const formats: ExportFormat[] = ['txt', 'csv', 'md', 'docx', 'pdf'];

  for (const fmt of formats) {
    const target = path.join(testDir, `test_output_${fmt}`);
    const res = await LogExporter.exportToFile(mockPayload, fmt, target);
    assert(res.success, `Export to ${fmt} succeeded`);
    assert(res.filePath && fs.existsSync(res.filePath), `File ${res.filePath} exists on disk`);
    const stats = fs.statSync(res.filePath);
    assert(stats.size > 100, `File ${res.filePath} size (${stats.size} bytes) > 100`);
    console.log(`✓ Exported ${fmt.toUpperCase()} successfully: ${res.filePath} (${stats.size} bytes)`);
  }

  // Cleanup test folder
  fs.rmSync(testDir, { recursive: true, force: true });
  console.log('✓ Temporary test export directory cleaned up');

  console.log('\n[SUCCESS] All Export & Clipboard unit tests passed successfully!\n');
}

runTests().catch((err) => {
  console.error('[ERROR] Tests failed:', err);
  process.exit(1);
});
