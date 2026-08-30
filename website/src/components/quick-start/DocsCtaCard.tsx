'use client';

import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config';
import { DocsCtaCardProps } from './types';

export function DocsCtaCard({
  config = siteConfig.quickStart.docsCallout,
  className = '',
}: DocsCtaCardProps) {
  return (
    <div className={`w-full max-w-7xl mx-auto mt-6 sm:mt-8 px-2 sm:px-4 ${className}`.trim()}>
      <div
        className="group relative w-full p-6 sm:p-8 lg:p-10 rounded-[22px] sm:rounded-[26px] overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
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
        {/* Top Specular Highlight Line */}
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
          className="absolute bottom-0 right-0 w-[65%] h-[65%] pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse 95% 85% at 95% 95%, rgba(34, 197, 94, 0.20) 0%, rgba(16, 185, 129, 0.06) 40%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        {/* Grid Pattern Inside Card */}
        <div
          className="absolute inset-0 w-full h-full bg-square-grid pointer-events-none opacity-20 z-0"
          style={{
            maskImage:
              'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 95%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 95%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
          {/* Left Column: Heading, Subtitle & Clean Feature Badges */}
          <div className="flex-1 max-w-3xl">
            <h3 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-4xl font-semibold text-white tracking-tight leading-tight">
              {config.title}
            </h3>

            <p className="mt-2.5 text-xs sm:text-sm text-[#a0a0a5] leading-relaxed">
              {config.description}
            </p>

            {/* Feature List Badges (Clean, no square icons) */}
            <div className="mt-4 flex flex-wrap gap-2">
              {config.features.map((feature, idx) => (
                <span
                  key={`doc-feat-${idx}`}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-mono text-zinc-300 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                  style={{
                    background:
                      'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(20,20,24,0.85) 100%)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Visit Documentation Button */}
          <div className="flex flex-col items-stretch gap-3 w-full sm:w-auto flex-shrink-0">
            <Link
              href={config.docsUrl}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold text-white/90 hover:text-white border border-white/10 hover:border-white/20 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.5)] active:scale-95"
              style={{
                background:
                  'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(24,24,28,0.85) 100%)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span>Visit Documentation</span>
              <svg className="w-4 h-4 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocsCtaCard;
