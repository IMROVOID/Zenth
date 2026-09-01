'use client';

import React from 'react';

export interface DocsStatGridProps {
  stats: {
    label: string;
    value: string;
    badge: string;
  }[];
  className?: string;
}

export function DocsStatGrid({ stats, className = '' }: DocsStatGridProps) {
  return (
    <div className={`docs-stat-grid w-full ${className}`.trim()}>
      {stats.map((item, idx) => (
        <div
          key={`${item.label}-${idx}`}
          className="group relative flex flex-col justify-between p-5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--docs-border-hover,rgb(56,56,56))] min-h-[140px]"
          style={{
            background: 'var(--docs-bg-card-gradient)',
            boxShadow: 'var(--docs-shadow-card)',
            border: '1px solid var(--docs-border-card, rgb(38, 38, 38))',
          }}
        >
          {/* Top Edge Specular Highlight Line */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{ background: 'var(--docs-specular-highlight)' }}
            aria-hidden="true"
          />

          {/* Label in Muted Grey */}
          <span
            style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))' }}
            className="relative z-10 text-[11px] font-mono font-semibold uppercase tracking-wider"
          >
            {item.label}
          </span>

          {/* Value in Primary Text */}
          <div className="relative z-10 my-3">
            <span
              style={{ color: 'var(--docs-text-primary, rgb(242, 240, 236))' }}
              className="text-xl sm:text-2xl font-bold tracking-tight font-mono"
            >
              {item.value}
            </span>
          </div>

          {/* Bottom Badge */}
          <div className="relative z-10 mt-auto flex">
            <span
              style={{
                color: 'var(--docs-text-secondary, rgb(196, 193, 187))',
                backgroundColor: 'var(--docs-bg-elevated, rgb(15, 15, 15))',
                borderColor: 'var(--docs-border, rgb(44, 44, 44))',
                borderRadius: 'var(--radius-xl, 0.5rem)',
              }}
              className="text-[10px] font-mono font-semibold border px-2.5 py-1 shadow-sm"
            >
              {item.badge}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DocsStatGrid;

