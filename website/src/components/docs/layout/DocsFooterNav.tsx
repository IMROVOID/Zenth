'use client';

import React from 'react';
import Link from 'next/link';

export interface DocsFooterNavProps {
  prevPage?: { title: string; slug: string };
  nextPage?: { title: string; slug: string };
  className?: string;
}

export function DocsFooterNav({ prevPage, nextPage, className = '' }: DocsFooterNavProps) {
  if (!prevPage && !nextPage) return null;

  const hasBoth = Boolean(prevPage && nextPage);

  return (
    <nav
      aria-label="Documentation Page Navigation"
      className={`mt-6 grid ${
        hasBoth ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
      } gap-5 w-full ${className}`.trim()}
    >
      {prevPage && (
        <Link
          href={`/documentation/${prevPage.slug}/`}
          className="group relative p-5 sm:p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--docs-border-hover,rgb(56,56,56))] flex flex-col w-full"
          style={{
            background: 'var(--docs-bg-card-footer-gradient)',
            border: '1px solid var(--docs-border-card, rgb(38, 38, 38))',
            boxShadow: 'var(--docs-shadow-card)',
          }}
        >
          {/* Top Edge Specular Highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{ background: 'var(--docs-specular-highlight)' }}
            aria-hidden="true"
          />

          <span
            style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))' }}
            className="text-xs font-mono flex items-center gap-1.5 group-hover:text-[var(--docs-text-secondary,rgb(196,193,187))] transition-colors font-medium"
          >
            ← Previous Article
          </span>
          <span
            style={{ color: 'var(--docs-text-primary, rgb(242, 240, 236))' }}
            className="text-base font-semibold mt-2 transition-colors truncate"
          >
            {prevPage.title}
          </span>
        </Link>
      )}

      {nextPage && (
        <Link
          href={`/documentation/${nextPage.slug}/`}
          className={`group relative p-5 sm:p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--docs-border-hover,rgb(56,56,56))] flex flex-col w-full ${
            hasBoth ? 'text-right sm:items-end' : 'text-left sm:items-start'
          }`}
          style={{
            background: 'var(--docs-bg-card-footer-gradient)',
            border: '1px solid var(--docs-border-card, rgb(38, 38, 38))',
            boxShadow: 'var(--docs-shadow-card)',
          }}
        >
          {/* Top Edge Specular Highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{ background: 'var(--docs-specular-highlight)' }}
            aria-hidden="true"
          />

          <span
            style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))' }}
            className={`text-xs font-mono flex items-center gap-1.5 group-hover:text-[var(--docs-text-secondary,rgb(196,193,187))] transition-colors font-medium ${
              hasBoth ? 'justify-end' : 'justify-start'
            }`}
          >
            Next Article →
          </span>
          <span
            style={{ color: 'var(--docs-text-primary, rgb(242, 240, 236))' }}
            className="text-base font-semibold mt-2 transition-colors truncate"
          >
            {nextPage.title}
          </span>
        </Link>
      )}
    </nav>
  );
}

export default DocsFooterNav;

