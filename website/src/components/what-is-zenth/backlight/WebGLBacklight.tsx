'use client';

import React, { useRef } from 'react';
import { useBacklightRenderer } from './useBacklightRenderer';

export interface WebGLBacklightProps {
  position?: 'top' | 'bottom';
  className?: string;
}

export function WebGLBacklight({ position = 'top', className = '' }: WebGLBacklightProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isTop = position === 'top';

  useBacklightRenderer(canvasRef, isTop);

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 w-[110%] pointer-events-none select-none -z-10 overflow-visible ${
        isTop ? '-top-20 sm:-top-36 h-24 sm:h-44' : '-bottom-20 sm:-bottom-36 h-24 sm:h-44'
      } ${className}`.trim()}
      aria-hidden="true"
    >
      <div
        className={`absolute inset-0 w-full h-full filter blur-[35px] sm:blur-[50px] opacity-85 -z-10 ${
          isTop ? 'origin-bottom' : 'origin-top'
        }`}
        style={{
          background: `radial-gradient(ellipse 65% 65% at 50% ${
            isTop ? '100%' : '0%'
          }, rgba(120,255,185,0.8) 0%, rgba(46,224,125,0.45) 24%, rgba(24,150,92,0.12) 50%, transparent 75%)`,
        }}
      />

      <canvas ref={canvasRef} className="w-full h-full block relative -z-10" />

      <svg
        className={`absolute inset-0 w-full h-full opacity-30 mix-blend-overlay pointer-events-none -z-10 ${
          isTop ? 'origin-bottom' : 'origin-top'
        }`}
        style={{
          maskImage: `radial-gradient(ellipse 65% 65% at 50% ${isTop ? '100%' : '0%'}, black 20%, transparent 75%)`,
          WebkitMaskImage: `radial-gradient(ellipse 65% 65% at 50% ${isTop ? '100%' : '0%'}, black 20%, transparent 75%)`,
        }}
      >
        <filter id={`backlight-grain-${position}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#backlight-grain-${position})`} />
      </svg>
    </div>
  );
}

export default WebGLBacklight;
