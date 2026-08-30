'use client';

import React from 'react';
import { siteConfig } from '@/config';
import { HowItWorksPill } from './HowItWorksPill';

export interface HowItWorksHeadingProps {
  className?: string;
}

export function HowItWorksHeading({ className = '' }: HowItWorksHeadingProps) {
  const { howItWorks } = siteConfig;

  return (
    <div
      className={`flex flex-col items-center text-center max-w-4xl mx-auto px-4 ${className}`.trim()}
    >
      {/* Top Pill Box */}
      <HowItWorksPill text={howItWorks.pillText} className="mb-4 sm:mb-6" />

      {/* Main Section Title (White-Grey Gradient matching other sections) */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] 2xl:text-7xl font-medium tracking-tight leading-[1.1]">
        <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#ffffff] via-[#f0f0f0] to-[#888888]">
          {howItWorks.title}
        </span>
      </h2>

      {/* Technical Subtitle Description */}
      <p className="mt-3 sm:mt-4 text-[#a0a0a5] text-xs sm:text-sm lg:text-[15px] font-normal leading-relaxed max-w-2xl">
        {howItWorks.subtitle}
      </p>
    </div>
  );
}

export default HowItWorksHeading;
