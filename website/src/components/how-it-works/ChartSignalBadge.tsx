'use client';

import React from 'react';
import { ChartMarker } from './types';

export interface ChartSignalBadgeProps {
  marker: ChartMarker;
  className?: string;
}

export function ChartSignalBadge({
  marker,
  className = '',
}: ChartSignalBadgeProps) {
  const isBuy = marker.type === 'BUY';

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-[10px] sm:rounded-[12px] select-none shadow-[0_10px_25px_-4px_rgba(0,0,0,0.85)] ${className}`.trim()}
      style={{
        background:
          'radial-gradient(130% 120% at 50% 0%, #1e1e23 0%, #111114 45%, #08080a 100%)',
        boxShadow:
          '0 8px 24px -2px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
        border: '1px solid transparent',
        backgroundImage:
          'radial-gradient(130% 120% at 50% 0%, #1e1e23 0%, #111114 45%, #08080a 100%), linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 40%, transparent 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      {/* Signal Type Label (Buy / Sell) */}
      <span className="text-[#d1d5db] text-xs sm:text-[13px] font-medium tracking-tight">
        {marker.label}
      </span>

      {/* Colored Percentage */}
      <span
        className={`text-xs sm:text-[13px] font-semibold tracking-tight font-sans ${
          isBuy ? 'text-[#2CE88A]' : 'text-[#f43f5e]'
        }`}
      >
        {marker.metric}
      </span>
    </div>
  );
}

export default ChartSignalBadge;
