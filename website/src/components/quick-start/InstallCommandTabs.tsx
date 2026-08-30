'use client';

import React, { useState } from 'react';
import { siteConfig } from '@/config';
import { InstallCommandTabsProps } from './types';
import { InstallSegmentedControls } from './InstallSegmentedControls';
import { InstallCommandBody } from './InstallCommandBody';

export function InstallCommandTabs({
  tabs = siteConfig.quickStart.installTabs,
  className = '',
}: InstallCommandTabsProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || 'global-cli');
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div className={`w-full max-w-7xl mx-auto mt-8 sm:mt-12 px-2 sm:px-4 ${className}`.trim()}>
      <div
        className="group relative w-full rounded-[22px] sm:rounded-[26px] overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
        style={{
          background:
            'radial-gradient(130% 120% at 50% 0%, #1e1e23 0%, #111114 45%, #08080a 100%)',
          boxShadow:
            '0 12px 35px -4px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
          border: '1px solid transparent',
          backgroundImage:
            'radial-gradient(130% 120% at 50% 0%, #1e1e23 0%, #111114 45%, #08080a 100%), linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 40%, transparent 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        {/* Specular Highlight Line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] z-20 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0.45) 50%, rgba(255, 255, 255, 0.2) 70%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Ambient Green Radial Glow */}
        <div
          className="absolute bottom-0 right-0 w-[70%] h-[70%] pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse 95% 85% at 95% 95%, rgba(34, 197, 94, 0.20) 0%, rgba(16, 185, 129, 0.06) 40%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        {/* Top Segmented Controls with Sliding BG */}
        <InstallSegmentedControls
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={setActiveTabId}
        />

        {/* Animated Terminal Content Body with Smooth Height & Fade */}
        <InstallCommandBody activeTab={activeTab} />
      </div>
    </div>
  );
}

export default InstallCommandTabs;
