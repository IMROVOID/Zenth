'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchDocs, type DocSearchResult } from '@/config/docs';

export interface DocsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocsSearchModal({ isOpen, onClose }: DocsSearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<DocSearchResult[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const router = useRouter();

  const handleSmoothClose = useCallback(() => {
    if (!isClosing) {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 180);
    }
  }, [isClosing, onClose]);

  // Lock body scroll and focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setResults([]);
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 40);
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  useEffect(() => {
    setResults(searchDocs(query));
    setSelectedIndex(0);
  }, [query]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (results.length > 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex, results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleSmoothClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      const target = results[selectedIndex];
      if (target) {
        handleSmoothClose();
        const url = target.sectionId ? `/documentation/${target.slug}/#${target.sectionId}` : `/documentation/${target.slug}/`;
        router.push(url);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: 'var(--docs-modal-overlay-bg, rgba(0, 0, 0, 0.85))' }}
      className={`fixed inset-0 z-50 flex items-start justify-center px-4 sm:px-6 ${isClosing ? 'animate-overlay-out pointer-events-none' : 'animate-overlay-in'}`}
      onClick={handleSmoothClose}
    >
      <div
        className={`w-full overflow-hidden flex flex-col mx-auto mt-10 sm:mt-[18vh] ${isClosing ? 'animate-modal-card-out' : 'animate-modal-card-in'}`}
        style={{
          backgroundColor: 'var(--docs-bg-surface, rgb(20, 20, 20))',
          border: '1px solid var(--docs-border, rgb(44, 44, 44))',
          boxShadow: 'var(--docs-shadow-modal, 0 25px 80px rgba(0, 0, 0, 0.95))',
          maxWidth: 620,
          borderRadius: 'var(--radius-xl, 0.5rem)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ borderBottom: '1px solid var(--docs-border-subtle, rgb(38, 38, 38))' }} className="flex items-center px-5 py-3.5 gap-3.5">
          <svg width="18" height="18" style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documentation..."
            style={{ color: 'var(--docs-input-text, rgb(232, 230, 226))' }}
            className="w-full bg-transparent text-[14px] placeholder-[var(--docs-input-placeholder,#a8a5a0)] focus:outline-none font-medium"
          />
        </div>

        <div className="overflow-y-auto p-2" style={{ maxHeight: 380 }}>
          {query.trim().length === 0 ? (
            <div className="h-[130px] flex flex-col items-center justify-center text-center p-4">
              <svg width="36" height="36" style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="mt-2.5 text-sm font-medium" style={{ color: 'var(--docs-input-placeholder, rgb(168, 165, 160))' }}>
                Start typing to search
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="h-[130px] flex flex-col items-center justify-center text-center p-4">
              <p className="text-sm font-medium" style={{ color: 'var(--docs-input-placeholder, rgb(168, 165, 160))' }}>
                No matching documentation pages found.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const linkHref = item.sectionId ? `/documentation/${item.slug}/#${item.sectionId}` : `/documentation/${item.slug}/`;

                return (
                  <Link
                    key={`${item.slug}-${item.sectionId || idx}`}
                    ref={(el) => { itemRefs.current[idx] = el; }}
                    href={linkHref}
                    onClick={handleSmoothClose}
                    className={`flex flex-col p-3 rounded transition-colors text-left ${isSelected ? 'bg-black/[0.06] dark:bg-white/[0.08]' : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span style={{ color: 'var(--docs-text-primary, rgb(242, 240, 236))' }} className="text-sm font-semibold">
                        {item.title}
                      </span>
                      <span style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))', backgroundColor: 'var(--docs-bg-elevated, rgb(15, 15, 15))', borderColor: 'var(--docs-border, rgb(44, 44, 44))' }} className="text-[10px] font-mono font-semibold border px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    {item.sectionTitle && (
                      <span style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))' }} className="text-xs font-medium mt-0.5">
                        ↳ {item.sectionTitle}
                      </span>
                    )}
                    <span style={{ color: 'var(--docs-text-secondary, rgb(196, 193, 187))' }} className="text-xs font-medium mt-1 line-clamp-1">
                      {item.matchSnippet}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ backgroundColor: 'var(--docs-bg-elevated, rgb(15, 15, 15))', borderTop: '1px solid var(--docs-border-subtle, rgb(38, 38, 38))' }} className="px-5 py-3 flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1">
            <kbd style={{ backgroundColor: 'var(--docs-kbd-bg, rgb(37, 37, 37))', color: 'var(--docs-kbd-text, rgb(196, 193, 187))', borderRadius: '4px', padding: '2px 6px' }} className="text-[10px] font-mono shadow-sm">↑</kbd>
            <kbd style={{ backgroundColor: 'var(--docs-kbd-bg, rgb(37, 37, 37))', color: 'var(--docs-kbd-text, rgb(196, 193, 187))', borderRadius: '4px', padding: '2px 6px' }} className="text-[10px] font-mono shadow-sm">↓</kbd>
            <span style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))' }} className="text-[11px] ml-1">Navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd style={{ backgroundColor: 'var(--docs-kbd-bg, rgb(37, 37, 37))', color: 'var(--docs-kbd-text, rgb(196, 193, 187))', borderRadius: '4px', padding: '2px 6px' }} className="text-[10px] font-mono shadow-sm">↵</kbd>
            <span style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))' }} className="text-[11px] ml-1">Select</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd style={{ backgroundColor: 'var(--docs-kbd-bg, rgb(37, 37, 37))', color: 'var(--docs-kbd-text, rgb(196, 193, 187))', borderRadius: '4px', padding: '2px 6px' }} className="text-[10px] font-mono shadow-sm">Esc</kbd>
            <span style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))' }} className="text-[11px] ml-1">Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocsSearchModal;

