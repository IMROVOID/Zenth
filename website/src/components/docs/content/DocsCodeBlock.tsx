'use client';

import React, { useState, useCallback } from 'react';
import { renderHighlightedCode } from './codeHighlight';

export interface DocsCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function DocsCodeBlock({
  code,
  language = 'bash',
  filename,
  className = '',
}: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, [code]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden shadow-lg ${className}`.trim()}
      style={{
        background: 'var(--docs-code-bg, rgb(20, 20, 20))',
        border: '1px solid var(--docs-code-border, rgb(38, 38, 38))',
        boxShadow: 'var(--docs-shadow-card)',
      }}
    >
      {/* Top Edge Specular Highlight Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{ background: 'var(--docs-specular-highlight)' }}
        aria-hidden="true"
      />

      {/* Code Header Bar */}
      <div
        style={{
          borderBottom: '1px solid var(--docs-code-border, rgb(38, 38, 38))',
          backgroundColor: 'var(--docs-code-header-bg, rgba(20, 20, 20, 0.9))',
        }}
        className="flex items-center justify-between px-4 py-3 backdrop-blur-md"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block" />
          {filename && (
            <span
              style={{ color: 'var(--docs-text-primary, rgb(242, 240, 236))' }}
              className="text-xs font-mono ml-2 font-medium"
            >
              {filename}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <span
            style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))' }}
            className="text-[11px] font-mono uppercase font-medium"
          >
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy code snippet to clipboard"
            style={{
              backgroundColor: 'var(--docs-bg-elevated, rgb(15, 15, 15))',
              border: '1px solid var(--docs-border, rgb(44, 44, 44))',
              borderRadius: 'var(--radius-xl, 0.5rem)',
              color: 'var(--docs-text-secondary, rgb(196, 193, 187))',
            }}
            className="flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1 hover:text-[var(--docs-text-primary,rgb(242,240,236))] hover:border-[var(--docs-border-hover,rgb(56,56,56))] transition-all shadow-sm cursor-pointer select-none active:scale-95"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" style={{ color: 'var(--docs-text-muted, rgb(133, 130, 126))' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Text Content with Shell Syntax Highlighting */}
      <pre
        style={{ color: 'var(--docs-code-text, rgb(229, 229, 229))' }}
        className="p-5 overflow-x-auto text-[13.5px] font-mono leading-relaxed selection:bg-emerald-500 selection:text-black"
      >
        <code>{renderHighlightedCode(code)}</code>
      </pre>
    </div>
  );
}

export default DocsCodeBlock;


