'use client';

import React from 'react';
import { siteConfig } from '@/config';
import { StepCard } from './StepCard';
import { QuickStartStepsGridProps } from './types';

export function QuickStartStepsGrid({
  steps = siteConfig.quickStart.steps,
  className = '',
}: QuickStartStepsGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 w-full max-w-7xl mx-auto mt-6 sm:mt-8 px-2 sm:px-4 ${className}`.trim()}
    >
      {steps.map((step, idx) => {
        const isLastOnTablet = idx === 2;
        return (
          <StepCard
            key={`step-${step.step}-${idx}`}
            step={step}
            index={idx}
            className={`w-full min-h-[200px] ${
              isLastOnTablet ? 'md:col-span-2 lg:col-span-1' : 'col-span-1'
            }`}
          />
        );
      })}
    </div>
  );
}

export default QuickStartStepsGrid;
