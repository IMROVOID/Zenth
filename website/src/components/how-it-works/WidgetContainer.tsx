'use client';

import React from 'react';
import { siteConfig } from '@/config';
import { SideStatCard } from './SideStatCard';
import { InteractiveChartWidget } from './InteractiveChartWidget';

export interface WidgetContainerProps {
  className?: string;
}

export function WidgetContainer({ className = '' }: WidgetContainerProps) {
  const { howItWorks } = siteConfig;

  return (
    <div
      className={`relative w-full max-w-7xl mx-auto mt-10 sm:mt-16 px-2 sm:px-4 flex items-center justify-center ${className}`.trim()}
    >
      {/* 3-Box Main Widget Grid with Equal Stretch Heights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 w-full items-stretch">
        {/* Left Telemetry Box (Span 3) */}
        <div className="lg:col-span-3 order-2 lg:order-1 w-full h-full flex flex-col">
          <SideStatCard stats={howItWorks.leftStats} />
        </div>

        {/* Center Main Chart Widget (Span 6) */}
        <div className="lg:col-span-6 order-1 lg:order-2 w-full h-full flex flex-col">
          <InteractiveChartWidget />
        </div>

        {/* Right Telemetry Box (Span 3) */}
        <div className="lg:col-span-3 order-3 lg:order-3 w-full h-full flex flex-col">
          <SideStatCard stats={howItWorks.rightStats} />
        </div>
      </div>
    </div>
  );
}

export default WidgetContainer;
