import { ExportDataPayload } from '../types.js';
import { escapeCsvField } from './utils.js';

export function formatCsv(p: ExportDataPayload): string {
  const lines: string[] = [];

  // Metadata section
  lines.push('Section,Key,Value');
  lines.push(`Metadata,SessionID,${escapeCsvField(p.sessionId)}`);
  lines.push(`Metadata,StartedAt,${escapeCsvField(p.sessionStartedAt)}`);
  lines.push(`Metadata,ExportedAt,${escapeCsvField(p.exportedAt)}`);
  lines.push(`Metadata,Symbol,${escapeCsvField(p.activeSymbol)}`);
  lines.push(`Metadata,Status,${p.isTradingPaused ? 'PAUSED' : 'LIVE'}`);
  lines.push(`Metadata,CurrentPrice,${p.currentPrice}`);
  lines.push(`Metadata,TotalCycles,${p.cycleCount}`);
  lines.push(`Metadata,TotalEntries,${p.totalEntries}`);
  lines.push(`Metadata,Wins,${p.sessionWins}`);
  lines.push(`Metadata,Losses,${p.sessionLosses}`);
  lines.push(`Metadata,WinRatePct,${p.winRate.toFixed(2)}`);
  lines.push(`Metadata,RealizedPnL,${p.sessionRealizedPnL.toFixed(2)}`);
  lines.push(`Metadata,TotalClosedVal,${p.totalClosedMoney.toFixed(2)}`);
  lines.push('');

  // Trade Ledger Table
  lines.push('TradeLedger,Index,Timestamp,Symbol,Action,Price,Quantity,NotionalValue,Outcome,PnL,Reason');
  p.ledgerEntries.forEach((e, idx) => {
    lines.push(
      [
        'Trade',
        idx + 1,
        escapeCsvField(e.timestamp),
        escapeCsvField(e.symbol),
        escapeCsvField(e.action),
        e.price,
        e.quantity,
        e.notional_value,
        escapeCsvField(e.outcome),
        e.pnl,
        escapeCsvField(e.reason)
      ].join(',')
    );
  });
  lines.push('');

  // Tick Logs Table
  lines.push('TickLog,Cycle,Timestamp,Symbol,Price,FastMA,SlowMA,RSI,EnteredMoney,ClosedMoney,Wins,Losses,PnL,Message');
  p.tickLogs.forEach((t) => {
    lines.push(
      [
        'Tick',
        t.cycle,
        escapeCsvField(t.timestamp),
        escapeCsvField(t.symbol),
        t.price,
        t.fastMA,
        t.slowMA,
        t.rsi,
        t.enteredMoney,
        t.closedMoney,
        t.sessionWin,
        t.sessionLoss,
        t.pnl,
        escapeCsvField(t.message || '')
      ].join(',')
    );
  });

  return lines.join('\n');
}
