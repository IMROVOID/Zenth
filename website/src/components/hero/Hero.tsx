'use client';

import React from 'react';
import { siteConfig } from '@/config';
import { HeroPillButton } from './HeroPillButton';
import { HeroWordCapsule } from './HeroWordCapsule';
import { LiquidMetalButton } from '@/components/ui';
import { HeroChart } from '@/components/chart';
import { LightRay } from '@/components/effects';

export function Hero() {
  return (
    <section className="w-full flex-1 flex flex-col justify-between overflow-hidden px-2.5 sm:px-10 xl:px-14 pt-4 sm:pt-8 pb-2">
      {/* Standalone Hero Card matching Page BG and fitting viewport height */}
      <div className="w-full max-w-[96%] xl:max-w-[95%] 2xl:max-w-[1760px] mx-auto flex-1 flex flex-col justify-between relative rounded-[32px] sm:rounded-[40px] bg-transparent overflow-hidden">
        {/* 1. Foggy Volumetric LightRay with increased intensity */}
        <div
          className="absolute -top-10 -left-10 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] pointer-events-none z-[1]"
          aria-hidden="true"
        >
          <LightRay color={siteConfig.theme?.accentColor || '#2CE88A'} />
        </div>

        {/* 2. Top-Left Greyscale Square Grid under the fog ray */}
        <div
          className="absolute top-0 left-0 w-full sm:w-[60%] h-[55%] bg-square-grid pointer-events-none z-[2]"
          style={{
            maskImage:
              'radial-gradient(ellipse 65% 55% at 14% 18%, black 25%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 65% 55% at 14% 18%, black 25%, transparent 75%)',
          }}
          aria-hidden="true"
        />

        {/* 3. Hero Content: Centered placement in dark midsection, font-medium title */}
        <div className="relative z-10 pt-18 min-[380px]:pt-20 min-[420px]:pt-24 sm:pt-22 pb-2 px-1 sm:px-6 flex flex-col items-center text-center">
          <h1 className="text-[clamp(1.22rem,5.4vw,1.72rem)] min-[390px]:text-[1.88rem] min-[420px]:text-[2.05rem] sm:text-5xl lg:text-6xl xl:text-[3.8rem] font-medium tracking-tight leading-[1.18] max-w-4xl text-center animate-startup-title">
            <span className="block whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-b from-[#ffffff] via-[#f0f0f0] to-[#888888] pb-1">
              {siteConfig.hero.titleLine1}
            </span>
            <span className="inline-flex items-center justify-center whitespace-nowrap gap-x-2.5 sm:gap-x-4.5 pt-1 pb-1">
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-[#ffffff] via-[#f0f0f0] to-[#888888] pt-1 pb-2">
                {siteConfig.hero.titleLine2Prefix || 'Self-Learning'}
              </span>
              <HeroWordCapsule words={siteConfig.hero.titleWords || ['Crypto', 'Stocks']} />
            </span>
          </h1>

          <p className="mt-2.5 sm:mt-3 max-w-xl text-[#b5b5b8] sm:text-[#888888] text-[13px] sm:text-base font-normal leading-snug sm:leading-relaxed px-1 sm:px-0 animate-startup-desc">
            {siteConfig.hero.description}
          </p>

          {/* Action Buttons: Vertically stacked on mobile, horizontal on desktop */}
          <div className="mt-8 min-[380px]:mt-9 sm:mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto animate-startup-cta">
            <HeroPillButton />
            <LiquidMetalButton
              text="Documentation"
              href="#docs"
              width={154}
              height={42}
            />
          </div>
        </div>

        {/* 4. Dense Multi-Wave Technical Chart with Embedded Synchronized PixelGrid */}
        <div className="relative z-0 w-full mt-auto -mb-2 animate-startup-chart">
          <HeroChart />
        </div>
      </div>
    </section>
  );
}

export default Hero;
