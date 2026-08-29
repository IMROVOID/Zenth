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
      {/* 3-Box Main Widget Grid with Responsive Layout (Sideboxes side-by-side on mobile/tablet) */}
      <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 w-full items-stretch">
        {/* Center Main Chart Widget (Full width on mobile/tablet, Span 6 on desktop) */}
        <div className="col-span-2 lg:col-span-6 order-1 lg:order-2 w-full h-full flex flex-col">
          <InteractiveChartWidget />
        </div>

        {/* Left Telemetry Box (Span 1 of 2 on mobile/tablet, Span 3 on desktop) */}
        <div className="col-span-1 lg:col-span-3 order-2 lg:order-1 w-full h-full flex flex-col min-w-0">
          <SideStatCard stats={howItWorks.leftStats} />
        </div>

        {/* Right Telemetry Box (Span 1 of 2 on mobile/tablet, Span 3 on desktop) */}
        <div className="col-span-1 lg:col-span-3 order-3 lg:order-3 w-full h-full flex flex-col min-w-0">
          <SideStatCard stats={howItWorks.rightStats} />
        </div>
      </div>
    </div>
  );
}

export default WidgetContainer;
