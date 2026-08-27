import React from 'react';
import { siteConfig } from '@/config';
import { HeroPillButton } from './HeroPillButton';
import { HeroWordCapsule } from './HeroWordCapsule';
import { LiquidMetalButton } from '@/components/ui';
import { HeroChart } from '@/components/chart';
import { LightRay } from '@/components/effects';

export function Hero() {
  return (
    <section className="w-full flex-1 flex flex-col justify-between overflow-hidden px-6 sm:px-10 xl:px-14 pt-4 sm:pt-6 pb-2">
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

        {/* 3. Hero Content: Clean top placement, font-medium title */}
        <div className="relative z-10 pt-10 sm:pt-16 pb-3 px-6 flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[3.8rem] font-medium tracking-tight leading-[1.15] max-w-4xl text-center animate-startup-title">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#666666] via-[#ffffff] to-[#666666] pb-1">
              {siteConfig.hero.titleLine1}
            </span>
            <span className="inline-flex items-center justify-center flex-wrap gap-x-3.5 sm:gap-x-4.5 gap-y-2 pt-1 pb-1">
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#666666] via-[#ffffff] to-[#666666] pt-1 pb-2">
                {siteConfig.hero.titleLine2Prefix || 'Self-Learning'}
              </span>
              <HeroWordCapsule words={siteConfig.hero.titleWords || ['Crypto', 'Stocks']} />
            </span>
          </h1>

          <p className="mt-2.5 max-w-2xl text-[#888888] text-sm sm:text-base font-normal leading-relaxed animate-startup-desc">
            {siteConfig.hero.description}
          </p>

          {/* Action Buttons: Get Started + Documentation with Liquid Metal */}
          <div className="mt-5 flex items-center justify-center gap-4 animate-startup-cta">
            <HeroPillButton />
            <LiquidMetalButton
              text="Documentation"
              href="#docs"
              width={146}
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
