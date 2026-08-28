'use client';

import React from 'react';

export interface VolumetricLightBeamProps {
  position?: 'top' | 'bottom';
  className?: string;
}

export function VolumetricLightBeam({
  position = 'top',
  className = '',
}: VolumetricLightBeamProps) {
  const isTop = position === 'top';

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 w-full max-w-[115%] pointer-events-none select-none z-0 overflow-visible flex items-center justify-center ${
        isTop ? '-top-20 sm:-top-32 h-24 sm:h-36' : '-bottom-20 sm:-bottom-32 h-24 sm:h-36'
      } ${className}`.trim()}
      aria-hidden="true"
    >
      {/* 1. Ultra-Wide Atmospheric Deep Glow (Softest diffuse base) */}
      <div
        className={`absolute w-[95%] sm:w-[90%] h-32 sm:h-48 rounded-full filter blur-[60px] sm:blur-[90px] opacity-50 sm:opacity-60 transition-opacity duration-700 ${
          isTop ? 'top-4 origin-bottom' : 'bottom-4 origin-top'
        }`}
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(138, 92, 255, 0.45) 0%, rgba(44, 232, 138, 0.22) 40%, transparent 75%)',
        }}
      />

      {/* 2. Focused Volumetric Light Beam (Smooth vertical dispersion without sharp edges) */}
      <div
        className={`absolute w-[80%] sm:w-[75%] h-24 sm:h-36 filter blur-[32px] sm:blur-[48px] opacity-75 sm:opacity-85 ${
          isTop ? 'bottom-0 origin-bottom' : 'top-0 origin-top'
        }`}
        style={{
          background: isTop
            ? 'linear-gradient(180deg, transparent 0%, rgba(138, 92, 255, 0.3) 30%, rgba(167, 139, 250, 0.7) 70%, rgba(255, 255, 255, 0.95) 100%)'
            : 'linear-gradient(0deg, transparent 0%, rgba(138, 92, 255, 0.3) 30%, rgba(167, 139, 250, 0.7) 70%, rgba(255, 255, 255, 0.95) 100%)',
          maskImage: isTop
            ? 'radial-gradient(ellipse 80% 90% at 50% 100%, black 35%, transparent 80%)'
            : 'radial-gradient(ellipse 80% 90% at 50% 0%, black 35%, transparent 80%)',
          WebkitMaskImage: isTop
            ? 'radial-gradient(ellipse 80% 90% at 50% 100%, black 35%, transparent 80%)'
            : 'radial-gradient(ellipse 80% 90% at 50% 0%, black 35%, transparent 80%)',
        }}
      />

      {/* 3. Intense Light-Bar Core Filament (Creates the physical look of an illuminated LED/laser tube) */}
      <div
        className={`absolute w-[68%] sm:w-[62%] h-4 sm:h-5 rounded-full filter blur-[10px] sm:blur-[14px] opacity-90 ${
          isTop ? '-bottom-1.5' : '-top-1.5'
        }`}
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(138, 92, 255, 0.6) 15%, rgba(255, 255, 255, 1) 50%, rgba(44, 232, 138, 0.8) 85%, transparent 100%)',
        }}
      />

      {/* 4. Ultra-Bright Precision Hot-Spot Center */}
      <div
        className={`absolute w-[40%] sm:w-[35%] h-2 sm:h-2.5 rounded-full filter blur-[4px] sm:blur-[6px] opacity-100 ${
          isTop ? '-bottom-0.5' : '-top-0.5'
        }`}
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(220, 200, 255, 0.9) 25%, #ffffff 50%, rgba(180, 255, 220, 0.9) 75%, transparent 100%)',
        }}
      />
    </div>
  );
}

export default VolumetricLightBeam;
