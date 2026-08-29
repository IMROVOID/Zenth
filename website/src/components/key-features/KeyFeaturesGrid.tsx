'use client';

import React from 'react';
import { siteConfig } from '@/config';
import { FeatureCard } from './FeatureCard';

export interface KeyFeaturesGridProps {
  className?: string;
}

export function KeyFeaturesGrid({ className = '' }: KeyFeaturesGridProps) {
  const { keyFeatures } = siteConfig;

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-24 gap-4 sm:gap-5 lg:gap-6 w-full max-w-7xl mx-auto mt-10 sm:mt-14 px-2 sm:px-4 ${className}`.trim()}
    >
      {keyFeatures.features.map((feature, idx) => {
        const isTopRow = idx < 2;
        const colSpan =
          idx === 0 || idx === 3
            ? 'lg:col-span-12 xl:col-span-14'
            : 'lg:col-span-12 xl:col-span-10';
        const minHeight = isTopRow
          ? 'min-h-[220px] sm:min-h-[240px]'
          : 'min-h-[170px] sm:min-h-[190px]';

        return (
          <FeatureCard
            key={feature.id}
            feature={feature}
            index={idx}
            layout="horizontal"
            className={`${colSpan} w-full ${minHeight}`}
          />
        );
      })}
    </div>
  );
}

export default KeyFeaturesGrid;
