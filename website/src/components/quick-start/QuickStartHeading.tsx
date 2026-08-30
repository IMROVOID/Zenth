'use client';

import React from 'react';
import { siteConfig } from '@/config';
import { QuickStartPill } from './QuickStartPill';
import { QuickStartHeadingProps } from './types';

export function QuickStartHeading({ className = '' }: QuickStartHeadingProps) {
  const { quickStart } = siteConfig;

  return (
    <div
      className={`flex flex-col items-center text-center max-w-5xl mx-auto px-4 ${className}`.trim()}
    >
      {/* Top Pill Badge */}
      <QuickStartPill text={quickStart.pillText} className="mb-4 sm:mb-6" />

      {/* Main Section Title */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] 2xl:text-7xl font-medium tracking-tight leading-[1.1]">
        <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#ffffff] via-[#f0f0f0] to-[#888888]">
          {quickStart.title}
        </span>
      </h2>

      {/* Section Subtitle Description */}
      <p className="mt-3 sm:mt-4 text-[#a0a0a5] text-xs sm:text-sm lg:text-[15px] font-normal leading-relaxed max-w-2xl">
        {quickStart.subtitle}
      </p>
    </div>
  );
}

export default QuickStartHeading;
