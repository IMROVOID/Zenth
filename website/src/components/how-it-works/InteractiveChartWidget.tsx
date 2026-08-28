'use client';

import React from 'react';
import { BullBearChartCanvas } from './BullBearChartCanvas';

export interface InteractiveChartWidgetProps {
  className?: string;
}

export function InteractiveChartWidget({
  className = '',
}: InteractiveChartWidgetProps) {
  return (
    <div
      className={`relative w-full h-full min-h-[340px] sm:min-h-[380px] lg:min-h-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#0c0d10]/70 backdrop-blur-md border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col justify-center ${className}`.trim()}
    >
      {/* 1. Underlying 8 Horizontal Background Row Guide Lines (Layer 0) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0 flex flex-col justify-between py-8 sm:py-10 px-4 sm:px-8"
        aria-hidden="true"
      >
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      </div>

      {/* 2. Top-edge Specular Highlight Line (Layer 10) */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.18) 30%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.18) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* 3. Primary Chart Graphic Canvas & Badges Layer (Layer 10) */}
      <div className="relative z-10 w-full h-full p-2 sm:p-4 flex items-center justify-center overflow-hidden">
        <BullBearChartCanvas />
      </div>

      {/* 4. HIGHEST LAYER: Tapered Volumetric Light Glow (Layer 30, pointer-events-none) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
        style={{
          background:
            'radial-gradient(ellipse 95% 80% at 88% 95%, rgba(34,197,94,0.18) 0%, rgba(21,128,61,0.09) 30%, rgba(16,80,45,0.02) 58%, transparent 76%), linear-gradient(135deg, transparent 0%, transparent 48%, rgba(21,128,61,0.04) 68%, rgba(34,197,94,0.10) 100%)',
        }}
        aria-hidden="true"
      />

      {/* 5. HIGHEST LAYER: Tapered Fractal Micro-Grain Noise Overlay (Layer 30, pointer-events-none) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-18 mix-blend-overlay pointer-events-none z-30"
        style={{
          maskImage:
            'radial-gradient(ellipse 95% 80% at 88% 95%, black 20%, rgba(0,0,0,0.5) 50%, transparent 76%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 95% 80% at 88% 95%, black 20%, rgba(0,0,0,0.5) 50%, transparent 76%)',
        }}
        aria-hidden="true"
      >
        <filter id="chart-light-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#chart-light-noise)" />
      </svg>
    </div>
  );
}

export default InteractiveChartWidget;
