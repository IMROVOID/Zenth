import { ExportDataPayload } from '../types.js';
import { stripAnsi } from '../formatters/utils.js';
import { escapePdfText, PdfPageContent, compilePdfDocument } from './pdfWriter.js';

export function generatePdfReport(p: ExportDataPayload): Buffer {
  const pages: PdfPageContent[] = [];
  let curStream = '';
  let curY = 750;
  const leftX = 40;
  const rightX = 572;
  const bottomY = 45;

  function newPage() {
    if (curStream.length > 0) {
      pages.push({ stream: curStream });
    }
    curStream = '';
    curY = 750;

    curStream += `0.8 0.8 0.8 RG 1 w ${leftX} 765 m ${rightX} 765 l S\n`;
    curStream += `BT /F2 8 Tf 0.5 0.5 0.5 rg ${leftX} 770 Td (ZENTH TRADING BOT - SYSTEM REPORT) Tj ET\n`;
    curStream += `BT /F1 8 Tf 0.5 0.5 0.5 rg 420 770 Td (Session: ${escapePdfText(p.sessionId)}) Tj ET\n`;
  }

  function checkY(needed: number) {
    if (curY - needed < bottomY) {
      newPage();
    }
  }

  function writeHeading(title: string) {
    checkY(30);
    curStream += `BT /F2 12 Tf 0.1 0.4 0.8 rg ${leftX} ${curY} Td (${escapePdfText(title)}) Tj ET\n`;
    curY -= 16;
    curStream += `0.8 0.8 0.8 RG 0.5 w ${leftX} ${curY + 4} m ${rightX} ${curY + 4} l S\n`;
    curY -= 6;
  }

  function writeRow(label: string, value: string) {
    checkY(14);
    curStream += `BT /F2 9 Tf 0.2 0.2 0.2 rg ${leftX + 10} ${curY} Td (${escapePdfText(label)}:) Tj ET\n`;
    curStream += `BT /F1 9 Tf 0.1 0.1 0.1 rg ${leftX + 160} ${curY} Td (${escapePdfText(value)}) Tj ET\n`;
    curY -= 13;
  }

  function writeMonoLine(text: string) {
    checkY(11);
    const safe = escapePdfText(stripAnsi(text));
    curStream += `BT /F3 7.5 Tf 0.15 0.15 0.15 rg ${leftX} ${curY} Td (${safe}) Tj ET\n`;
    curY -= 10;
  }

  // Page 1
  newPage();

  // Banner
  curStream += `0.95 0.97 1.0 rg ${leftX} ${curY - 35} 532 45 re f\n`;
  curStream += `0.1 0.4 0.8 RG 1.5 w ${leftX} ${curY - 35} 532 45 re S\n`;
  curStream += `BT /F2 16 Tf 0.05 0.3 0.7 rg ${leftX + 15} ${curY - 14} Td (ZENTH AUTONOMOUS TRADING BOT) Tj ET\n`;
  curStream += `BT /F1 9 Tf 0.4 0.4 0.4 rg ${leftX + 15} ${curY - 28} Td (Exported: ${escapePdfText(p.exportedAt)} | Session: ${escapePdfText(p.sessionId)}) Tj ET\n`;
  curY -= 55;

  // 1. Session Overview
  writeHeading('1. SESSION OVERVIEW');
  writeRow('Session Started', p.sessionStartedAt);
  writeRow('Active Symbol / Price', `${p.activeSymbol.toUpperCase()} ($${p.currentPrice.toFixed(2)})`);
  writeRow('Trading Status', p.isTradingPaused ? 'PAUSED' : 'ACTIVE / LIVE');
  writeRow('Cycles / Total Entries', `${p.cycleCount} ticks / ${p.totalEntries} entries`);
  writeRow('Win/Loss Record', `${p.sessionWins} Wins / ${p.sessionLosses} Losses (${p.winRate.toFixed(1)}% Win Rate)`);
  writeRow('Realized Session PnL', `${p.sessionRealizedPnL >= 0 ? '+' : ''}$${p.sessionRealizedPnL.toFixed(2)}`);
  writeRow('Total Closed Value', `$${p.totalClosedMoney.toFixed(2)}`);
  if (p.activePosition) {
    writeRow('Active Position', `OPEN (${p.activePosition.quantity} @ $${p.activePosition.entryPrice.toFixed(2)}, SL: $${p.activePosition.stopLossPrice.toFixed(2)}, TP: $${p.activePosition.takeProfitPrice.toFixed(2)})`);
  } else {
    writeRow('Active Position', 'FLAT (No Open Position)');
  }
  curY -= 10;

  // 2. Parameters
  writeHeading('2. BOT & RISK PARAMETERS');
  writeRow('Target Allocation', `$${p.config.targetAllocation} (${p.config.interval} timeframe)`);
  writeRow('Moving Averages', `Fast: ${p.config.fastPeriod} / Slow: ${p.config.slowPeriod}`);
  writeRow('RSI Settings', `${p.config.rsiPeriod} periods (Max Entry: ${p.config.rsiMaxEntry})`);
  writeRow('Stop Loss / Take Profit', `${p.config.stopLossPct}% SL / ${p.config.takeProfitPct}% TP`);
  writeRow('Trailing Stop / Breakeven', `${p.config.trailingStopPct}% Trailing / ${p.config.breakevenTriggerPct}% BE Trigger`);
  writeRow('Adaptive Filter', `Mode: ${p.config.filterMode} (AutoLearn: ${p.config.autoLearn})`);
  curY -= 10;

  // 3. Active Rules
  if (p.activeRules.length > 0) {
    writeHeading(`3. ACTIVE SELF-LEARNED RULES (${p.activeRules.length})`);
    p.activeRules.forEach((r, idx) => {
      writeRow(`${idx + 1}. [${r.pattern_condition}]`, `(${r.trigger_count || 0}x) ${r.loss_reason} - ${r.trading_rule}`);
    });
    curY -= 10;
  }

  // 4. Trade Ledger Records Table
  writeHeading(`4. TRADE LEDGER RECORDS (${p.ledgerEntries.length} Records)`);
  if (p.ledgerEntries.length === 0) {
    writeRow('Status', 'No trade records logged in Supabase trade_ledger.');
  } else {
    checkY(20);
    curStream += `0.92 0.94 0.98 rg ${leftX} ${curY - 12} 532 14 re f\n`;
    curStream += `BT /F2 8 Tf 0.1 0.1 0.1 rg\n`;
    curStream += `${leftX + 4} ${curY - 9} Td (#) Tj\n`;
    curStream += `${leftX + 22} ${curY - 9} Td (Time (UTC)) Tj\n`;
    curStream += `${leftX + 115} ${curY - 9} Td (Action) Tj\n`;
    curStream += `${leftX + 155} ${curY - 9} Td (Price) Tj\n`;
    curStream += `${leftX + 205} ${curY - 9} Td (Qty) Tj\n`;
    curStream += `${leftX + 250} ${curY - 9} Td (Outcome) Tj\n`;
    curStream += `${leftX + 300} ${curY - 9} Td (PnL ($)) Tj\n`;
    curStream += `${leftX + 350} ${curY - 9} Td (Reason) Tj\n`;
    curStream += `ET\n`;
    curY -= 16;

    p.ledgerEntries.forEach((e, idx) => {
      checkY(13);
      const time = (e.timestamp || '').replace('T', ' ').substring(0, 16);
      const outcome = e.outcome || 'PENDING';
      const pnl = `${e.pnl >= 0 ? '+' : ''}$${e.pnl.toFixed(2)}`;
      const reason = stripAnsi(e.reason || '').substring(0, 32);

      curStream += `BT /F1 7.5 Tf 0.2 0.2 0.2 rg\n`;
      curStream += `${leftX + 4} ${curY} Td (${idx + 1}) Tj\n`;
      curStream += `${leftX + 22} ${curY} Td (${escapePdfText(time)}) Tj\n`;
      curStream += `${leftX + 115} ${curY} Td (${escapePdfText(e.action)}) Tj\n`;
      curStream += `${leftX + 155} ${curY} Td ($${e.price.toFixed(1)}) Tj\n`;
      curStream += `${leftX + 205} ${curY} Td (${e.quantity}) Tj\n`;
      curStream += `${leftX + 250} ${curY} Td (${escapePdfText(outcome)}) Tj\n`;
      curStream += `${leftX + 300} ${curY} Td (${escapePdfText(pnl)}) Tj\n`;
      curStream += `${leftX + 350} ${curY} Td (${escapePdfText(reason)}) Tj\n`;
      curStream += `ET\n`;
      curY -= 12;
    });
  }
  curY -= 10;

  // 5. Tick Stream
  writeHeading(`5. TICK LOG STREAM (${p.tickLogs.length} Ticks)`);
  if (p.tickLogs.length === 0) {
    writeMonoLine('No tick logs recorded.');
  } else {
    p.tickLogs.forEach((t) => {
      const time = `[${t.timestamp}]`;
      const cycle = `TICK #${String(t.cycle).padStart(3, ' ')}`;
      if (t.message) {
        writeMonoLine(`${time} ${cycle} | ${stripAnsi(t.message)}`);
      } else {
        const maCross = t.fastMA > t.slowMA ? 'BULL' : 'BEAR';
        const pnlSign = t.pnl >= 0 ? '+' : '';
        writeMonoLine(
          `${time} ${cycle} | ${t.symbol.toUpperCase()}: $${t.price.toFixed(2)} | ${maCross} | RSI: ${t.rsi.toFixed(1)} | In: $${t.enteredMoney.toFixed(2)} | Out: $${t.closedMoney.toFixed(2)} | Score: ${t.sessionWin}W/${t.sessionLoss}L | PnL: ${pnlSign}$${t.pnl.toFixed(2)}`
        );
      }
    });
  }

  if (curStream.length > 0) {
    pages.push({ stream: curStream });
  }

  return compilePdfDocument(pages);
}
