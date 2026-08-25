import { ExportDataPayload } from './types.js';
import { stripAnsi } from './dataFormatter.js';

export function xmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildDocumentXml(p: ExportDataPayload): string {
  const pnlColor = p.sessionRealizedPnL >= 0 ? '008000' : 'CC0000';
  const pnlSign = p.sessionRealizedPnL >= 0 ? '+' : '';

  let body = '';

  body += `
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:sz w:val="44"/><w:color w:val="0066CC"/><w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI"/></w:rPr>
        <w:t>ZENTH TRADING BOT</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r>
        <w:rPr><w:i/><w:sz w:val="22"/><w:color w:val="666666"/><w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI"/></w:rPr>
        <w:t>Autonomous Trading Report • Exported ${xmlEscape(p.exportedAt)}</w:t>
      </w:r>
    </w:p>
    <w:p/>
  `;

  // 1. Session Summary
  body += `
    <w:p><w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="0066CC"/></w:rPr><w:t>1. Session Summary</w:t></w:r></w:p>
    <w:tbl>
      <w:tblPr><w:tblW w:w="5000" w:type="pct"/></w:tblPr>
      <w:tr><w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Session ID</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>${xmlEscape(p.sessionId)}</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Active Symbol / Price</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>${xmlEscape(p.activeSymbol.toUpperCase())} ($${p.currentPrice.toFixed(2)})</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Status</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>${p.isTradingPaused ? 'PAUSED' : 'ACTIVE / LIVE'}</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Score</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>${p.sessionWins}W / ${p.sessionLosses}L (${p.winRate.toFixed(1)}% WR)</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Realized PnL</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:rPr><w:b/><w:color w:val="${pnlColor}"/></w:rPr><w:t>${pnlSign}$${p.sessionRealizedPnL.toFixed(2)}</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Total Closed Value</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>$${p.totalClosedMoney.toFixed(2)}</w:t></w:r></w:p></w:tc></w:tr>
    </w:tbl>
    <w:p/>
  `;

  // 2. Parameters
  body += `
    <w:p><w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="0066CC"/></w:rPr><w:t>2. Bot Parameters</w:t></w:r></w:p>
    <w:tbl>
      <w:tblPr><w:tblW w:w="5000" w:type="pct"/></w:tblPr>
      <w:tr><w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Allocation / Interval</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>$${p.config.targetAllocation} (${p.config.interval})</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Moving Averages</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>Fast: ${p.config.fastPeriod} / Slow: ${p.config.slowPeriod}</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Stop Loss / Take Profit</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>SL: ${p.config.stopLossPct}% / TP: ${p.config.takeProfitPct}%</w:t></w:r></w:p></w:tc></w:tr>
    </w:tbl>
    <w:p/>
  `;

  // 3. Trade Ledger
  body += `<w:p><w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="0066CC"/></w:rPr><w:t>3. Trade Ledger (${p.ledgerEntries.length} Records)</w:t></w:r></w:p>`;
  if (p.ledgerEntries.length === 0) {
    body += `<w:p><w:r><w:rPr><w:i/></w:rPr><w:t>No trade records found.</w:t></w:r></w:p>`;
  } else {
    body += `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/></w:tblPr>
      <w:tr>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>#</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Time (UTC)</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Action</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Price</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Outcome</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>PnL ($)</w:t></w:r></w:p></w:tc>
      </w:tr>`;

    p.ledgerEntries.forEach((e, idx) => {
      const time = (e.timestamp || '').replace('T', ' ').substring(0, 19);
      const rowPnlColor = e.pnl > 0 ? '008000' : e.pnl < 0 ? 'CC0000' : '666666';
      const rowPnlSign = e.pnl >= 0 ? '+' : '';
      body += `
        <w:tr>
          <w:tc><w:p><w:r><w:t>${idx + 1}</w:t></w:r></w:p></w:tc>
          <w:tc><w:p><w:r><w:t>${xmlEscape(time)}</w:t></w:r></w:p></w:tc>
          <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${xmlEscape(e.action)}</w:t></w:r></w:p></w:tc>
          <w:tc><w:p><w:r><w:t>$${e.price.toFixed(2)}</w:t></w:r></w:p></w:tc>
          <w:tc><w:p><w:r><w:t>${xmlEscape(e.outcome || 'PENDING')}</w:t></w:r></w:p></w:tc>
          <w:tc><w:p><w:r><w:rPr><w:color w:val="${rowPnlColor}"/></w:rPr><w:t>${rowPnlSign}$${e.pnl.toFixed(2)}</w:t></w:r></w:p></w:tc>
        </w:tr>
      `;
    });
    body += `</w:tbl>`;
  }

  body += `<w:p/>`;

  // 4. Tick Logs Stream
  body += `<w:p><w:r><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="0066CC"/></w:rPr><w:t>4. Tick Log Stream (${p.tickLogs.length} Ticks)</w:t></w:r></w:p>`;
  if (p.tickLogs.length === 0) {
    body += `<w:p><w:r><w:rPr><w:i/></w:rPr><w:t>No tick logs recorded.</w:t></w:r></w:p>`;
  } else {
    p.tickLogs.forEach((t) => {
      const time = `[${t.timestamp}]`;
      const cycle = `TICK #${String(t.cycle).padStart(3, ' ')}`;
      const lineText = t.message
        ? `${time} ${cycle} | ${stripAnsi(t.message)}`
        : `${time} ${cycle} | ${t.symbol.toUpperCase()}: $${t.price.toFixed(2)} | RSI: ${t.rsi.toFixed(1)} | PnL: $${t.pnl.toFixed(2)}`;

      body += `<w:p><w:r><w:rPr><w:sz w:val="18"/><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/></w:rPr><w:t>${xmlEscape(lineText)}</w:t></w:r></w:p>`;
    });
  }

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${body}</w:body>
</w:document>`;
}
