'use client';

import React from 'react';
import { StatItem } from './types';

export interface SideStatCardProps {
  stats: StatItem[];
  className?: string;
}

export function SideStatCard({ stats, className = '' }: SideStatCardProps) {
  return (
    <div
      className={`flex flex-col gap-2 sm:gap-3 lg:gap-4 w-full h-full p-2 sm:p-2.5 lg:p-3 rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] bg-[#0c0c0f]/90 border border-white/[0.08] backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 ${className}`.trim()}
    >
      {stats.map((stat, idx) => (
        <div
          key={`stat-${stat.label}-${idx}`}
          className="relative flex-1 flex flex-col justify-center items-center text-center px-2 py-4 sm:px-3 sm:py-5 lg:px-4 lg:py-7 xl:py-8 rounded-[15px] sm:rounded-[18px] lg:rounded-[22px] overflow-hidden select-none transition-all duration-300 hover:scale-[1.01]"
          style={{
            background:
              'radial-gradient(130% 120% at 50% 0%, #1e1e23 0%, #111114 45%, #08080a 100%)',
            boxShadow:
              '0 10px 30px -4px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
            border: '1px solid transparent',
            backgroundImage:
              'radial-gradient(130% 120% at 50% 0%, #1e1e23 0%, #111114 45%, #08080a 100%), linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 40%, transparent 100%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          {/* Subtle top edge specular highlight line */}
          <div
            className="absolute top-0 left-[15%] right-[15%] h-[1px] pointer-events-none opacity-30"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
            }}
            aria-hidden="true"
          />

          {/* Metric Label */}
          <span className="text-[#9ca3af] text-[10.5px] sm:text-xs lg:text-[13px] font-medium tracking-tight line-clamp-1 px-1 transition-all duration-300">
            {stat.label}
          </span>

          {/* Primary Value with White-Grey Gradient */}
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-[40px] font-bold tracking-tight mt-1 sm:mt-1.5 lg:mt-2.5 leading-none font-sans bg-clip-text text-transparent bg-gradient-to-b from-[#ffffff] via-[#f0f0f0] to-[#888888] transition-all duration-300">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default SideStatCard;
