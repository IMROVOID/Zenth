'use client';

import React from 'react';
import { IllustrationProps } from '../types';

export function AdvancedSecurityIllustration({ className = '' }: IllustrationProps) {
  return (
    <div
      className={`relative w-full h-full min-h-[140px] sm:min-h-[160px] flex flex-col justify-center gap-1.5 sm:gap-2 xl:gap-2.5 p-2 sm:p-3 xl:p-4 select-none pointer-events-none ${className}`.trim()}
    >
      {/* Box 1: Buy Signal Box (Clean Uniform Glass Border with Full Left-Height Green Gradient) */}
      <div className="relative z-10 flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 xl:px-4 xl:py-2.5 rounded-[11px] sm:rounded-[13px] xl:rounded-[14px] overflow-hidden bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12)] transition-all duration-300">
        {/* Full-Height Left Green Gradient Fade */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.04) 45%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center gap-2 sm:gap-2.5 xl:gap-3">
          {/* Rounded Thick Green Upward Arrow */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 xl:w-[18px] xl:h-[18px] text-emerald-400/90 flex-shrink-0 drop-shadow-[0_2px_6px_rgba(52,211,153,0.35)] transition-all duration-300"
          >
            <path d="M12 4.5a1 1 0 0 0-.7.3L5.6 10.5a1 1 0 0 0 .7 1.7H9v7a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-7h2.7a1 1 0 0 0 .7-1.7l-5.7-5.7a1 1 0 0 0-.7-.3z" />
          </svg>
          <span className="text-[10.5px] sm:text-[11.5px] xl:text-xs font-mono font-semibold text-white/95 tracking-tight transition-all duration-300">
            [BUY] SMA 9 &gt; 21
          </span>
        </div>
      </div>

      {/* Box 2: Guard Box (Clean Uniform Glass Border with Full Left-Height Emerald Gradient) */}
      <div className="relative z-10 flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 xl:px-4 xl:py-2.5 rounded-[11px] sm:rounded-[13px] xl:rounded-[14px] overflow-hidden bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15)] transition-all duration-300">
        {/* Full-Height Left Emerald Gradient Fade */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.05) 45%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center gap-2 sm:gap-2.5 xl:gap-3">
          {/* Thick Green Shield Badge */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 xl:w-[18px] xl:h-[18px] text-emerald-400/90 flex-shrink-0 drop-shadow-[0_2px_6px_rgba(52,211,153,0.35)] transition-all duration-300"
          >
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 4c1.66 0 3 1.34 3 3v2h1v5H8v-5h1V9c0-1.66 1.34-3 3-3zm0 2c-.55 0-1 .45-1 1v2h2V9c0-.55-.45-1-1-1z" />
          </svg>
          <span className="text-[10.5px] sm:text-[11.5px] xl:text-xs font-mono font-bold text-white tracking-tight transition-all duration-300">
            [GUARD] $1,000 Cap
          </span>
        </div>
      </div>

      {/* Box 3: Sell Signal Box (Clean Uniform Glass Border with Full Left-Height Red Gradient) */}
      <div className="relative z-10 flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 xl:px-4 xl:py-2.5 rounded-[11px] sm:rounded-[13px] xl:rounded-[14px] overflow-hidden bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12)] transition-all duration-300">
        {/* Full-Height Left Red Gradient Fade */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.04) 45%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center gap-2 sm:gap-2.5 xl:gap-3">
          {/* Rounded Thick Red Downward Arrow */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 xl:w-[18px] xl:h-[18px] text-red-400/90 flex-shrink-0 drop-shadow-[0_2px_6px_rgba(239,68,68,0.35)] transition-all duration-300"
          >
            <path d="M12 19.5a1 1 0 0 0 .7-.3l5.7-5.7a1 1 0 0 0-.7-1.7H15V4.8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v7H6.3a1 1 0 0 0-.7 1.7l5.7 5.7a1 1 0 0 0 .7.3z" />
          </svg>
          <span className="text-[10.5px] sm:text-[11.5px] xl:text-xs font-mono font-semibold text-white/95 tracking-tight transition-all duration-300">
            [SELL] Reverse Exit
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdvancedSecurityIllustration;
