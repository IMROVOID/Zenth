'use client';

import React from 'react';
import { siteConfig } from '@/config';
import { KeyFeaturesPill } from './KeyFeaturesPill';
import { KeyFeaturesHeadingProps } from './types';

export function KeyFeaturesHeading({ className = '' }: KeyFeaturesHeadingProps) {
  const { keyFeatures } = siteConfig;

  return (
    <div
      className={`flex flex-col items-center text-center max-w-5xl mx-auto px-4 ${className}`.trim()}
    >
      {/* Top Pill Box */}
      <KeyFeaturesPill text={keyFeatures.pillText} className="mb-4 sm:mb-6" />

      {/* Main Section Title */}
      <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-[52px] xl:text-6xl font-medium tracking-tight leading-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#ffffff] via-[#f0f0f0] to-[#888888]">
          {keyFeatures.title}
        </span>
      </h2>

      {/* Technical Subtitle Description */}
      <p className="mt-3 sm:mt-4 text-[#a0a0a5] text-xs sm:text-sm lg:text-[15px] font-normal leading-relaxed max-w-2xl">
        {keyFeatures.subtitle}
      </p>
    </div>
  );
}

export default KeyFeaturesHeading;
