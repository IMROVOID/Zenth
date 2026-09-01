'use client';

import React from 'react';

export interface DocsCalloutProps {
  type?: 'invariant' | 'math' | 'telemetry' | 'tip' | 'warning' | 'schema';
  title: string;
  body: string;
  className?: string;
}

export function DocsCallout({
  type = 'invariant',
  title,
  body,
  className = '',
}: DocsCalloutProps) {
  const isWarning = type === 'warning';

  return (
    <div
      className={`relative w-full p-6 rounded-2xl overflow-hidden transition-all duration-300 ${className}`.trim()}
      style={{
        background: isWarning
          ? 'radial-gradient(130% 120% at 50% 0%, rgba(245, 158, 11, 0.14) 0%, rgba(245, 158, 11, 0.04) 50%, var(--docs-bg-surface, rgb(20, 20, 20)) 100%)'
          : 'var(--docs-bg-card-gradient)',
        boxShadow: isWarning
          ? '0 10px 30px -4px rgba(245, 158, 11, 0.12), var(--docs-shadow-card)'
          : 'var(--docs-shadow-card)',
        border: isWarning ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid var(--docs-border-card, rgb(38, 38, 38))',
      }}
    >
      {/* Top Edge Specular Highlight Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background: isWarning
            ? 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.6), transparent)'
            : 'var(--docs-specular-highlight)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col">
        <h4
          style={{
            color: isWarning ? undefined : 'var(--docs-text-primary, rgb(242, 240, 236))',
          }}
          className={`text-xs sm:text-[13px] font-mono font-bold tracking-wider uppercase ${
            isWarning ? 'text-amber-600 dark:text-amber-300' : ''
          }`}
        >
          {title}
        </h4>
        <p
          style={{
            color: isWarning ? undefined : 'var(--docs-text-secondary, rgb(196, 193, 187))',
          }}
          className={`mt-2.5 text-xs sm:text-[13.5px] font-mono font-medium leading-relaxed whitespace-pre-line ${
            isWarning ? 'text-amber-900/85 dark:text-amber-100/80' : ''
          }`}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

export default DocsCallout;

