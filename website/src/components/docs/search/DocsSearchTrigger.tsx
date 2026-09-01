'use client';

import React, { useState, useEffect } from 'react';

export interface DocsSearchTriggerProps {
  onClick: () => void;
  className?: string;
}

export function DocsSearchTrigger({ onClick, className = '' }: DocsSearchTriggerProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform || '');
      setIsMac(isApple);
    }
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Search documentation (Press ${isMac ? '⌘K' : 'Ctrl+K'})`}
      style={{
        boxShadow: 'none',
      }}
      className={`docs-search-trigger w-9 h-9 min-w-9 min-h-9 md:w-[210px] md:min-w-[210px] p-0 md:px-3 rounded-lg md:rounded-[var(--radius-xl,0.5rem)] hover:bg-black/[0.05] dark:hover:bg-white/10 md:hover:bg-[var(--docs-bg-elevated,rgb(15,15,15))] flex items-center justify-center md:justify-between gap-2.5 flex-nowrap transition-all text-left cursor-pointer group select-none ${className}`.trim()}
    >
      {/* Left: Magnifying Glass Icon & 'Search' Text */}
      <div className="flex items-center justify-center md:justify-start gap-2 flex-1 min-w-0">
        <svg
          width="18"
          height="18"
          style={{ color: 'var(--docs-text-secondary, rgb(196, 193, 187))' }}
          className="group-hover:text-[var(--docs-text-primary,rgb(242,240,236))] transition-colors flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span
          style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))' }}
          className="hidden md:inline text-xs transition-colors font-medium truncate"
        >
          Search
        </span>
      </div>

      {/* Right: Keycaps (Desktop Only) */}
      <div className="hidden md:flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap">
        <kbd
          style={{
            backgroundColor: 'var(--docs-kbd-bg, rgb(37, 37, 37))',
            border: 'none',
            outline: 'none',
            color: 'var(--docs-kbd-text, rgb(196, 193, 187))',
            borderRadius: '4px',
            minWidth: isMac ? '18px' : 'auto',
            height: '18px',
            padding: isMac ? '0 4px' : '0 5px',
            boxShadow: 'none',
          }}
          className={`font-mono font-medium select-none flex items-center justify-center ${isMac ? 'text-[11px]' : 'text-[10px]'}`}
        >
          {isMac ? '⌘' : 'Ctrl'}
        </kbd>
        <kbd
          style={{
            backgroundColor: 'var(--docs-kbd-bg, rgb(37, 37, 37))',
            border: 'none',
            outline: 'none',
            color: 'var(--docs-kbd-text, rgb(196, 193, 187))',
            borderRadius: '4px',
            minWidth: '18px',
            height: '18px',
            padding: '0 4px',
            boxShadow: 'none',
          }}
          className="text-[10px] font-mono font-medium select-none flex items-center justify-center"
        >
          K
        </kbd>
      </div>
    </button>
  );
}

export default DocsSearchTrigger;



