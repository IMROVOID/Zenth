'use client';

import React from 'react';

export interface DocsTaxonomyGridProps {
  cards: {
    tag: string;
    description: string;
  }[];
  className?: string;
}

export function DocsTaxonomyGrid({
  cards,
  className = '',
}: DocsTaxonomyGridProps) {
  return (
    <div className={`docs-taxonomy-grid w-full ${className}`.trim()}>
      {cards.map((tax) => (
        <div
          key={tax.tag}
          className="p-5 rounded-2xl flex flex-col justify-between shadow-md transition-all duration-200 hover:border-[var(--docs-border-hover,rgb(56,56,56))]"
          style={{
            background: 'var(--docs-bg-card-gradient)',
            border: '1px solid var(--docs-border-card, rgb(38, 38, 38))',
            boxShadow: 'var(--docs-shadow-card)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              style={{
                color: 'var(--docs-text-secondary, rgb(196, 193, 187))',
                backgroundColor: 'var(--docs-bg-elevated, rgb(15, 15, 15))',
                borderColor: 'var(--docs-border, rgb(44, 44, 44))',
                borderRadius: 'var(--radius-xl, 0.5rem)',
              }}
              className="text-[0.6875rem] font-mono font-bold border px-2.5 py-1 shadow-sm"
            >
              [{tax.tag}]
            </span>
          </div>
          <p
            style={{ color: 'var(--docs-text-secondary, rgb(196, 193, 187))' }}
            className="text-xs sm:text-[0.8125rem] font-medium leading-relaxed"
          >
            {tax.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DocsTaxonomyGrid;

