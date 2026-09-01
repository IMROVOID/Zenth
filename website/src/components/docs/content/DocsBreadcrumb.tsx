'use client';

import React from 'react';
import Link from 'next/link';

export interface DocsBreadcrumbProps {
  category: string;
  pageTitle: string;
  className?: string;
}

export function DocsBreadcrumb({ category, pageTitle, className = '' }: DocsBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}
      className={`w-full flex items-center gap-2 text-xs text-[var(--docs-text-secondary,rgb(196,193,187))] mb-5 font-mono font-medium select-none whitespace-nowrap ${className}`.trim()}
    >
      <Link href="/documentation/" className="hover:text-[var(--docs-text-primary,rgb(242,240,236))] transition-colors shrink-0">
        Docs
      </Link>
      <span className="text-[var(--docs-text-muted,rgb(133,130,126))] shrink-0">/</span>
      <span className="text-[var(--docs-text-secondary,rgb(196,193,187))] shrink-0">{category}</span>
      <span className="text-[var(--docs-text-muted,rgb(133,130,126))] shrink-0">/</span>
      <span className="text-[var(--docs-text-primary,rgb(242,240,236))] font-semibold shrink-0">{pageTitle}</span>
    </nav>
  );
}

export default DocsBreadcrumb;


