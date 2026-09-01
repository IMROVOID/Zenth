'use client';

import React from 'react';

export interface DocsMatrixTableProps {
  headers: string[];
  rows: string[][];
  className?: string;
}

export function DocsMatrixTable({
  headers,
  rows,
  className = '',
}: DocsMatrixTableProps) {
  return (
    <div
      className={`w-full overflow-x-auto rounded-2xl ${className}`.trim()}
      style={{
        background: 'var(--docs-bg-card-gradient)',
        border: '1px solid var(--docs-border-card, rgb(38, 38, 38))',
        boxShadow: 'var(--docs-shadow-card)',
      }}
    >
      <table className="w-full text-left text-xs sm:text-sm border-collapse font-mono">
        <thead>
          <tr style={{ backgroundColor: 'var(--docs-table-header-bg, rgb(22, 22, 22))' }}>
            {headers.map((h, i) => (
              <th
                key={i}
                className="py-3.5 px-4 font-bold uppercase tracking-wider text-[0.6875rem]"
                style={{
                  color: 'var(--docs-text-primary, rgb(242, 240, 236))',
                  borderBottom: '1px solid var(--docs-table-border, rgb(38, 38, 38))',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-[var(--docs-table-row-hover,rgba(255,255,255,0.03))] transition-colors">
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className="py-3.5 px-4 leading-normal font-medium"
                  style={{
                    color: 'var(--docs-text-secondary, rgb(196, 193, 187))',
                    borderTop: '1px solid var(--docs-table-border, rgb(38, 38, 38))',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocsMatrixTable;

