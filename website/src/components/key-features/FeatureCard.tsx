'use client';

import React from 'react';
import { FeatureCardProps, FeatureIconType } from './types';
import {
  RealTimeAnalyticsIllustration,
  AdvancedSecurityIllustration,
  AdaptiveMemoryIllustration,
  MultiCurrencyCardsIllustration,
} from './illustrations';

function FeatureHeaderIcon({ type }: { type: FeatureIconType }) {
  switch (type) {
    case 'security':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <circle cx="12" cy="11" r="1.5" fill="currentColor" />
          <path d="M12 12.5v3" />
        </svg>
      );
    case 'ecosystem':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
        </svg>
      );
    case 'analytics':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="12" cy="18" r="3" />
          <path d="M8.5 7.5l2.5 8.5" />
          <path d="M15.5 7.5l-2.5 8.5" />
          <path d="M9 6h6" />
        </svg>
      );
    case 'multicurrency':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
  }
}

function FeatureIllustration({ type }: { type: FeatureIconType }) {
  switch (type) {
    case 'analytics':
      return <RealTimeAnalyticsIllustration />;
    case 'security':
      return <AdvancedSecurityIllustration />;
    case 'ecosystem':
      return <AdaptiveMemoryIllustration />;
    case 'multicurrency':
      return <MultiCurrencyCardsIllustration />;
  }
}

export function FeatureCard({ feature, layout = 'vertical', className = '' }: FeatureCardProps) {
  const isHorizontal = layout === 'horizontal';

  return (
    <div
      className={`group relative flex ${
        isHorizontal ? 'flex-col md:flex-row items-start justify-between' : 'flex-col justify-between'
      } rounded-[22px] sm:rounded-[26px] overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)] ${className}`.trim()}
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
      {/* Top Edge Specular Highlight Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] z-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0.45) 50%, rgba(255, 255, 255, 0.2) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* In-box Green Ambient Radial Glow on Bottom-Right */}
      <div
        className="absolute bottom-0 right-0 w-[85%] h-[85%] pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 95% 85% at 95% 95%, rgba(34, 197, 94, 0.24) 0%, rgba(16, 185, 129, 0.08) 40%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Fractal Micro-Grain Noise Overlay on Green Glow */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 mix-blend-overlay pointer-events-none z-0"
        style={{
          maskImage:
            'radial-gradient(ellipse 95% 85% at 95% 95%, black 20%, rgba(0,0,0,0.5) 50%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 95% 85% at 95% 95%, black 20%, rgba(0,0,0,0.5) 50%, transparent 75%)',
        }}
        aria-hidden="true"
      >
        <filter id={`feature-noise-${feature.id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#feature-noise-${feature.id})`} />
      </svg>

      {/* Card Header Content Area */}
      <div className={`relative z-10 ${isHorizontal ? 'w-full md:w-[58%] lg:w-[58%] xl:w-[54%] min-w-0 p-4 sm:p-5 lg:p-6 flex flex-col justify-start' : 'p-5 sm:p-6 pb-2'}`}>
        {/* Icon & Title Row */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full min-w-0">
          {/* Rounded Square Icon Badge */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/90 border border-white/10 flex-shrink-0 shadow-[0_4px_16px_rgba(0,0,0,0.5)] group-hover:border-white/20 transition-colors"
            style={{
              background:
                'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(24,24,28,0.85) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <FeatureHeaderIcon type={feature.icon} />
          </div>

          {/* Feature Title */}
          <h3 className="text-[15px] sm:text-[17px] md:text-base lg:text-[15px] xl:text-base font-semibold tracking-tight text-white leading-snug flex-1 min-w-0">
            {feature.title}
          </h3>
        </div>

        {/* Feature Subtitle Description (Narrower max-width on laptop so illustration has extra space) */}
        <p className="mt-2 text-[#a0a0a5] text-xs sm:text-[13px] leading-relaxed font-normal lg:max-w-[85%] xl:max-w-none">
          {feature.description}
        </p>
      </div>

      {/* Feature Custom In-Box Illustration Viewport (Mouse Interactions Disabled) */}
      <div className={`relative z-10 pointer-events-none ${isHorizontal ? 'w-full md:w-[42%] lg:w-[42%] xl:w-[46%] flex items-center justify-center lg:justify-end xl:justify-center p-2 sm:p-3 lg:pr-3 lg:pb-3 xl:p-4 self-center lg:self-end xl:self-center lg:translate-x-3 lg:translate-y-2 xl:translate-x-0 xl:translate-y-0 overflow-visible' : 'w-full mt-auto'}`}>
        <FeatureIllustration type={feature.icon} />
      </div>
    </div>
  );
}

export default FeatureCard;
