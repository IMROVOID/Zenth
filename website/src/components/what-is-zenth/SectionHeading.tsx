'use client';

import React from 'react';
import { siteConfig } from '@/config';

export interface SectionHeadingProps {
  className?: string;
}

export function SectionHeading({ className = '' }: SectionHeadingProps) {
  const { whatIsZenth } = siteConfig;

  return (
    <div className={`flex flex-col items-center text-center max-w-3xl mx-auto px-4 ${className}`.trim()}>
      {/* Main Section Title (Increased Font Size) */}
      <h2 className="text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.08]">
        <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#ffffff] via-[#f0f0f0] to-[#888888]">
          {whatIsZenth.title}
        </span>
      </h2>

      {/* Technical Subtitle Description (Refined Compact Font Size) */}
      <p className="mt-3 sm:mt-4 text-[#a0a0a5] text-xs sm:text-sm lg:text-[15px] font-normal leading-relaxed max-w-2xl">
        {whatIsZenth.subtitle}
      </p>
    </div>
  );
}

export default SectionHeading;
