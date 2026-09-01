'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { DocCategory } from '@/config/docs';
import { DocsNavTreeItem } from './DocsNavTreeItem';

export interface DocsNavTreeProps {
  categories: DocCategory[];
  activeSlug: string;
  onItemClick?: () => void;
  className?: string;
}

export function DocsNavTree({
  categories = [],
  activeSlug,
  onItemClick,
  className = '',
}: DocsNavTreeProps) {
  const [filterQuery, setFilterQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Global '/' keyboard listener to focus the Filter Sidebar input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCategories = useMemo(() => {
    if (!filterQuery.trim()) return categories;
    const q = filterQuery.toLowerCase().trim();

    return (categories || [])
      .map((cat) => ({
        ...cat,
        pages: (cat.pages || []).filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            (p.summary && p.summary.toLowerCase().includes(q))
        ),
      }))
      .filter((cat) => cat.pages.length > 0);
  }, [categories, filterQuery]);

  return (
    <div className={`w-full flex flex-col ${className}`.trim()}>
      {/* Real-time Interactive Filter Sidebar Box with Generous Padding */}
      <div className="relative w-full">
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-xl, 0.5rem)',
            border: '1px solid var(--docs-border, rgb(44, 44, 44))',
            backgroundColor: 'var(--docs-bg-elevated, rgb(15, 15, 15))',
            boxShadow: 'none',
          }}
          className="flex items-center justify-between gap-2 focus-within:border-[var(--docs-border-hover,rgb(56,56,56))] transition-colors"
        >
          <input
            ref={inputRef}
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setFilterQuery('');
                inputRef.current?.blur();
              }
            }}
            placeholder="Filter sidebar"
            style={{
              color: 'var(--docs-input-text, rgb(232, 230, 226))',
            }}
            className="w-full bg-transparent text-xs font-mono font-medium placeholder-[var(--docs-input-placeholder,rgb(168,165,160))] focus:outline-none"
          />

          {filterQuery ? (
            <button
              type="button"
              onClick={() => {
                setFilterQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear filter"
              className="text-[var(--docs-text-muted,rgb(133,130,126))] hover:text-[var(--docs-text-primary,rgb(242,240,236))] p-0.5 transition-colors cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <kbd
              onClick={() => inputRef.current?.focus()}
              style={{
                backgroundColor: 'var(--docs-kbd-bg, rgb(37, 37, 37))',
                border: 'none',
                outline: 'none',
                color: 'var(--docs-kbd-text, rgb(196, 193, 187))',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '10px',
                boxShadow: 'none',
              }}
              className="font-mono font-bold select-none cursor-pointer"
            >
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Filtered Category Tree with Compact Category Spacing */}
      <div style={{ paddingTop: '1.125rem', rowGap: '1rem' }} className="flex flex-col">
        {filteredCategories.length === 0 ? (
          <div className="px-2 py-4 text-xs font-mono text-[var(--docs-text-muted,rgb(133,130,126))]">
            No matching docs found.
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div key={cat.id} className="flex flex-col gap-1">
              <h3
                className="docs-category-heading text-[11px] font-mono font-semibold tracking-wider uppercase px-3 py-1 rounded-lg select-none cursor-default"
              >
                {cat.title}
              </h3>
              <ul className="flex flex-col gap-0.5 list-none p-0 m-0">
                {cat.pages.map((page) => (
                  <DocsNavTreeItem
                    key={page.slug}
                    title={page.title}
                    slug={page.slug}
                    badge={page.badge}
                    isActive={activeSlug === page.slug}
                    onItemClick={onItemClick}
                  />
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DocsNavTree;

