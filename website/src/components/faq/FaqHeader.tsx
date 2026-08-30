'use client';

import React from 'react';
import Link from 'next/link';
import { FaqHeaderProps } from './types';
import { FaqPill } from './FaqPill';

export function FaqHeader({
  pillText,
  title,
  subtitle,
  supportCard,
  className = '',
}: FaqHeaderProps) {
  return (
    <div className={`flex flex-col items-start text-left w-full ${className}`.trim()}>
      {/* Top Pill Badge */}
      <FaqPill text={pillText} className="mb-4 sm:mb-6 self-start" />

      {/* Main Section Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-5xl font-medium tracking-tight leading-[1.15]">
        <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#ffffff] via-[#f0f0f0] to-[#888888]">
          {title}
        </span>
      </h2>

      {/* Technical Subtitle Description */}
      <p className="mt-3 sm:mt-4 text-[#a0a0a5] text-xs sm:text-sm lg:text-[15px] font-normal leading-relaxed max-w-xl">
        {subtitle}
      </p>

      {/* Glassmorphic Help & Support Callout Card */}
      <div
        className="mt-6 sm:mt-8 w-full p-5 sm:p-6 rounded-[20px] relative overflow-hidden transition-all duration-300 hover:border-white/20 shadow-[0_12px_35px_-4px_rgba(0,0,0,0.85)]"
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
        {/* Specular Highlight Line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] z-20 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0.45) 50%, rgba(255, 255, 255, 0.2) 70%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col gap-3">
          <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            {supportCard.title}
          </h3>

          <p className="text-xs sm:text-[13px] text-[#a0a0a5] leading-relaxed">
            {supportCard.description}
          </p>

          <div className="mt-1 flex flex-wrap gap-2.5">
            {/* GitHub Discussions Button */}
            <Link
              href={supportCard.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white/90 hover:text-white border border-white/10 hover:border-white/20 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:scale-95"
              style={{
                background:
                  'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(24,24,28,0.85) 100%)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span>{supportCard.githubLabel}</span>
              <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </Link>

            {/* Visit Documentation Button */}
            <Link
              href={supportCard.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white/90 hover:text-white border border-white/10 hover:border-white/20 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:scale-95"
              style={{
                background:
                  'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(24,24,28,0.85) 100%)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span>{supportCard.docsLabel}</span>
              <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaqHeader;
