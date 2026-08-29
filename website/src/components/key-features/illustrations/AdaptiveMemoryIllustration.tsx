'use client';

import React from 'react';
import { IllustrationProps } from '../types';

export function AdaptiveMemoryIllustration({ className = '' }: IllustrationProps) {
  return (
    <div
      className={`relative w-full h-full min-h-[160px] sm:min-h-[180px] flex items-center justify-center select-none pointer-events-none ${className}`.trim()}
    >
      {/* SVG Layer: Circuit Lines with Smooth Edge-Fading Mask & Soft Layer-Adjacent Specular Glints */}
      <svg
        viewBox="-400 -200 800 400"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none z-10 overflow-visible"
      >
        <defs>
          {/* Smooth Edge-Fading Mask */}
          <radialGradient id="circuitEdgeFade" cx="0" cy="0" r="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="45%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="72%" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="92%" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="edgeFadeMask">
            <rect x="-800" y="-400" width="1600" height="800" fill="url(#circuitEdgeFade)" />
          </mask>

          {/* Softer Specular Glint Filter */}
          <filter id="softLaserGlint" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.9" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Directional Specular Glint Gradients with userSpaceOnUse to avoid 0-dimension bounding box collapse */}
          <linearGradient id="glintLeft" x1="-50" y1="15" x2="-140" y2="15" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="glintDiagLeft" x1="-40" y1="42" x2="-130" y2="91.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="glintDown" x1="0" y1="45" x2="0" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="glintDiagRight" x1="40" y1="42" x2="130" y2="91.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="glintUpperRight" x1="45" y1="-25" x2="135" y2="-25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="glintLowerRight" x1="45" y1="15" x2="135" y2="15" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g mask="url(#edgeFadeMask)">
          {/* 1. Mid-Left Stepped Line (Base + Collinear Specular Glint) */}
          <path d="M 0 15 L -90 15 L -800 360" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
          <line x1="-50" y1="15" x2="-140" y2="15" stroke="url(#glintLeft)" strokeWidth="1.5" filter="url(#softLaserGlint)" />

          {/* 2. Bottom-Left Perspective Ray (Base + Collinear Specular Glint) */}
          <line x1="0" y1="20" x2="-600" y2="350" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
          <line x1="-40" y1="42" x2="-130" y2="91.5" stroke="url(#glintDiagLeft)" strokeWidth="1.5" filter="url(#softLaserGlint)" />

          {/* 3. Center Vertical Down Line (Base + Collinear Specular Glint) */}
          <line x1="0" y1="20" x2="0" y2="400" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
          <line x1="0" y1="45" x2="0" y2="135" stroke="url(#glintDown)" strokeWidth="1.5" filter="url(#softLaserGlint)" />

          {/* 4. Bottom-Right Perspective Ray (Base + Collinear Specular Glint) */}
          <line x1="0" y1="20" x2="600" y2="350" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
          <line x1="40" y1="42" x2="130" y2="91.5" stroke="url(#glintDiagRight)" strokeWidth="1.5" filter="url(#softLaserGlint)" />

          {/* 5. Upper-Middle Right Line (Base + Collinear Specular Glint) */}
          <line x1="0" y1="-25" x2="800" y2="-25" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
          <line x1="45" y1="-25" x2="135" y2="-25" stroke="url(#glintUpperRight)" strokeWidth="1.5" filter="url(#softLaserGlint)" />

          {/* 6. Lower-Middle Right Line (Base + Collinear Specular Glint) */}
          <line x1="0" y1="15" x2="800" y2="15" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
          <line x1="45" y1="15" x2="135" y2="15" stroke="url(#glintLowerRight)" strokeWidth="1.5" filter="url(#softLaserGlint)" />
        </g>
      </svg>

      {/* Exactly 3 Stacked Borderless Layers */}
      <div className="relative z-20 flex items-center justify-center p-2">
        {/* Layer 1: Outermost Frosted Glassmorphism Square */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-[20px] sm:rounded-[22px] lg:rounded-[22px] xl:rounded-[24px] bg-white/[0.035] backdrop-blur-md flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300">
          {/* Layer 2: Middle Frosted Glassmorphism Square */}
          <div className="w-19 h-19 sm:w-22 sm:h-22 lg:w-22 lg:h-22 xl:w-25 xl:h-25 rounded-[14px] sm:rounded-[16px] lg:rounded-[16px] xl:rounded-[18px] bg-white/[0.065] backdrop-blur-lg flex items-center justify-center shadow-inner transition-all duration-300">
            {/* Layer 3: Top Floating White/Silver Neural Memory Badge */}
            <div
              className="w-11 h-11 sm:w-13 sm:h-13 lg:w-13 lg:h-13 xl:w-14 xl:h-14 rounded-[10px] sm:rounded-[12px] lg:rounded-[12px] xl:rounded-[13px] flex flex-col items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.85)] transition-all duration-300"
              style={{
                background:
                  'radial-gradient(120% 100% at 50% 0%, #ffffff 0%, #dedede 50%, #9a9aa0 100%)',
                boxShadow:
                  '0 6px 18px rgba(0,0,0,0.75), inset 0 1.5px 1.5px rgba(255,255,255,0.9), inset 0 -1.5px 3px rgba(0,0,0,0.4)',
              }}
            >
              {/* Brain / Neural Memory Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4.5 h-4.5 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-5 xl:h-5 text-[#151518] drop-shadow-sm transition-all duration-300"
              >
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdaptiveMemoryIllustration;
