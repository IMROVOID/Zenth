'use client';

import React from 'react';
import { KeyFeaturesPillProps } from './types';

export function KeyFeaturesPill({ text, className = '' }: KeyFeaturesPillProps) {
  return (
    <div
      className={`inline-flex items-center justify-center px-4 sm:px-5 py-1.5 rounded-full select-none shadow-[0_10px_25px_-4px_rgba(0,0,0,0.85)] ${className}`.trim()}
      style={{
        background:
          'radial-gradient(130% 120% at 50% 0%, #1e1e23 0%, #111114 45%, #08080a 100%)',
        boxShadow:
          '0 10px 30px -4px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
        border: '1px solid transparent',
        backgroundImage:
          'radial-gradient(130% 120% at 50% 0%, #1e1e23 0%, #111114 45%, #08080a 100%), linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 40%, transparent 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      {/* Pill Text with White-Grey Gradient */}
      <span className="text-xs sm:text-sm font-medium tracking-wide bg-clip-text text-transparent bg-gradient-to-b from-[#ffffff] via-[#f0f0f0] to-[#999999]">
        {text}
      </span>
    </div>
  );
}

export default KeyFeaturesPill;
