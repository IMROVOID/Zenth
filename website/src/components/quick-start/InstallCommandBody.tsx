'use client';

import React, { useEffect, useRef, useState } from 'react';
import { InstallTabItem } from '@/config/quickStart';

export interface InstallCommandBodyProps {
  activeTab: InstallTabItem;
}

export function InstallCommandBody({ activeTab }: InstallCommandBodyProps) {
  const [displayTab, setDisplayTab] = useState(activeTab);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const innerContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab.id !== displayTab.id) {
      setFadeState('out');
      const timer = setTimeout(() => {
        setDisplayTab(activeTab);
        setFadeState('in');
      }, 140);
      return () => clearTimeout(timer);
    }
  }, [activeTab, displayTab]);

  useEffect(() => {
    if (innerContentRef.current) {
      setContentHeight(innerContentRef.current.scrollHeight);
    }
  }, [displayTab, fadeState]);

  const handleCopy = async () => {
    if (!displayTab?.command) return;
    try {
      await navigator.clipboard.writeText(displayTab.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className="relative z-10 transition-[height] duration-300 ease-out overflow-hidden w-full min-w-0"
      style={{ height: contentHeight ? `${contentHeight}px` : undefined }}
    >
      <div
        ref={innerContentRef}
        className={`p-3.5 sm:p-6 lg:p-7 flex flex-col justify-between transition-all duration-200 ease-out w-full min-w-0 ${
          fadeState === 'in' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
        }`}
      >
        {/* Comment & Description Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400 font-mono mb-3 sm:mb-4 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-zinc-500 font-semibold flex-shrink-0">[OK]</span>
            <span className="text-zinc-400 truncate">{displayTab?.comment}</span>
          </div>
          <span className="text-[10.5px] sm:text-[11px] text-zinc-500 italic break-words">
            {displayTab?.description}
          </span>
        </div>

        {/* Main Monospace Command Box */}
        <div className="relative flex items-center justify-between gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-xl bg-black/60 border border-white/[0.08] shadow-inner min-w-0 w-full">
          <div className="flex items-start gap-2.5 sm:gap-3 font-mono text-xs sm:text-sm text-zinc-200 overflow-x-auto no-scrollbar selection:bg-white selection:text-black min-w-0 flex-1">
            <span className="text-zinc-400 select-none font-bold flex-shrink-0">$</span>
            <pre className="whitespace-pre-wrap font-mono leading-relaxed text-zinc-100 flex-1 break-all sm:break-normal">
              {displayTab?.command}
            </pre>
          </div>

          {/* Copy Button with Grey BG and White Border */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy installation command"
            className="flex-shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-mono font-medium text-white/90 hover:text-white border border-white/10 hover:border-white/20 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.5)] active:scale-95"
            style={{
              background:
                'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(24,24,28,0.85) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-white font-semibold">COPIED</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>COPY</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallCommandBody;
