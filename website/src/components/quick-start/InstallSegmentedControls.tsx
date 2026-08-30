'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { siteConfig } from '@/config';
import { InstallTabItem } from '@/config/quickStart';

export interface InstallSegmentedControlsProps {
  tabs: InstallTabItem[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
}

export function InstallSegmentedControls({
  tabs,
  activeTabId,
  onSelectTab,
}: InstallSegmentedControlsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const updateIndicator = useCallback(() => {
    const activeEl = tabRefs.current[activeTabId];
    if (activeEl && containerRef.current) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
    }
  }, [activeTabId]);

  useEffect(() => {
    updateIndicator();
    const timer = setTimeout(updateIndicator, 50);

    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator, tabs]);

  return (
    <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 px-3.5 sm:px-6 py-3 sm:py-4 border-b border-white/[0.08] bg-black/40 backdrop-blur-md">
      {/* Left: Terminal Icon & Title */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-white/90 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)] flex-shrink-0"
          style={{
            background:
              'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(24,24,28,0.85) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        </div>
        <span className="text-[11px] sm:text-xs font-mono text-zinc-300 font-medium tracking-wide truncate">
          {siteConfig.quickStart.terminalTitle}
        </span>
      </div>

      {/* Right: Segmented Tab Controls with Smooth Sliding BG */}
      <div
        ref={containerRef}
        className="relative flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar max-w-full"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.04) 0%, rgba(18,18,22,0.85) 100%)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Smooth Sliding Background Indicator */}
        <div
          className="absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-out pointer-events-none border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity,
            background:
              'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.12) 0%, rgba(24,24,28,0.9) 100%)',
            backdropFilter: 'blur(12px)',
          }}
          aria-hidden="true"
        />

        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative z-10 inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-200 flex-shrink-0 leading-none ${
                isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="leading-none flex items-center">{tab.label}</span>
              {tab.badge && (
                <span
                  className={`hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-mono font-semibold tracking-wide rounded transition-colors duration-200 leading-none ${
                    isActive
                      ? 'bg-white/[0.12] text-zinc-200'
                      : 'bg-white/[0.05] text-zinc-500'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default InstallSegmentedControls;
