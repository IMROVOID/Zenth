'use client';

import React from 'react';
import { IllustrationProps } from '../types';

export function MultiCurrencyCardsIllustration({ className = '' }: IllustrationProps) {
  return (
    <div
      className={`relative w-full h-full min-h-[120px] sm:min-h-[140px] flex items-center justify-center select-none pointer-events-none ${className}`.trim()}
    >
      {/* Overlapping Format Circles with Stacked-Layer Glassmorphism */}
      <div className="relative z-10 flex items-center">
        {/* Circle 1: PDF (Topmost Layer) */}
        <div
          className="relative z-20 w-13 h-13 sm:w-14 sm:h-14 md:w-13 md:h-13 lg:w-12 lg:h-12 xl:w-13 xl:h-13 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-md flex flex-col items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300"
        >
          <span className="text-xs sm:text-[13px] md:text-xs lg:text-[11px] xl:text-xs font-black font-mono text-white/90 tracking-tighter transition-all duration-300">
            PDF
          </span>
          <span className="text-[7px] sm:text-[8px] md:text-[7px] lg:text-[6.5px] xl:text-[7px] font-mono text-white/50 -mt-0.5">v1.4</span>
        </div>

        {/* Circle 2: DOCX (Under Circle 1) */}
        <div
          className="relative z-19 -ml-4 sm:-ml-4.5 md:-ml-4 lg:-ml-3.5 xl:-ml-4 w-13 h-13 sm:w-14 sm:h-14 md:w-13 md:h-13 lg:w-12 lg:h-12 xl:w-13 xl:h-13 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-md flex flex-col items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300"
        >
          <span className="text-xs sm:text-[13px] md:text-xs lg:text-[11px] xl:text-xs font-black font-mono text-white/90 tracking-tighter transition-all duration-300">
            DOCX
          </span>
          <span className="text-[7px] sm:text-[8px] md:text-[7px] lg:text-[6.5px] xl:text-[7px] font-mono text-white/50 -mt-0.5">XML</span>
        </div>

        {/* Circle 3: CSV (Under Circle 2) */}
        <div
          className="relative z-18 -ml-4 sm:-ml-4.5 md:-ml-4 lg:-ml-3.5 xl:-ml-4 w-13 h-13 sm:w-14 sm:h-14 md:w-13 md:h-13 lg:w-12 lg:h-12 xl:w-13 xl:h-13 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-md flex flex-col items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300"
        >
          <span className="text-xs sm:text-[13px] md:text-xs lg:text-[11px] xl:text-xs font-black font-mono text-white/90 tracking-tighter transition-all duration-300">
            CSV
          </span>
          <span className="text-[7px] sm:text-[8px] md:text-[7px] lg:text-[6.5px] xl:text-[7px] font-mono text-white/50 -mt-0.5">Data</span>
        </div>

        {/* Circle 4: MD (Under Circle 3) */}
        <div
          className="relative z-17 -ml-4 sm:-ml-4.5 md:-ml-4 lg:-ml-3.5 xl:-ml-4 w-13 h-13 sm:w-14 sm:h-14 md:w-13 md:h-13 lg:w-12 lg:h-12 xl:w-13 xl:h-13 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-md flex flex-col items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300"
        >
          <span className="text-xs sm:text-[13px] md:text-xs lg:text-[11px] xl:text-xs font-black font-mono text-white/90 tracking-tighter transition-all duration-300">
            MD
          </span>
          <span className="text-[7px] sm:text-[8px] md:text-[7px] lg:text-[6.5px] xl:text-[7px] font-mono text-white/50 -mt-0.5">Log</span>
        </div>

        {/* Circle 5: TXT / Clipboard (Under Circle 4) */}
        <div
          className="relative z-16 -ml-4 sm:-ml-4.5 md:-ml-4 lg:-ml-3.5 xl:-ml-4 w-13 h-13 sm:w-14 sm:h-14 md:w-13 md:h-13 lg:w-12 lg:h-12 xl:w-13 xl:h-13 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-xs sm:text-[13px] md:text-xs lg:text-[11px] xl:text-[11px] font-mono text-zinc-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all duration-300"
        >
          +1
        </div>

        {/* Floating Frosted Glassmorphism /export Callout Capsule */}
        <div className="absolute -bottom-3 right-0 z-25 flex items-center gap-1.5 px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/20 text-white font-mono font-semibold text-[9.5px] sm:text-[10.5px] md:text-[10px] lg:text-[9.5px] xl:text-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.6),inset_0_1px_1.5px_rgba(255,255,255,0.25)] transition-all duration-300">
          <span>/export</span>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default MultiCurrencyCardsIllustration;
