'use client';

import React from 'react';
import { faqConfig } from '@/config/faq';
import { FaqProps } from './types';
import { FaqHeader } from './FaqHeader';
import { FaqAccordionList } from './FaqAccordionList';

export function Faq({ config = faqConfig, className = '' }: FaqProps) {
  return (
    <section
      id="faq"
      className={`relative w-full py-16 sm:py-24 px-3 sm:px-10 xl:px-14 bg-[#0a0a0a] overflow-hidden ${className}`.trim()}
    >
      {/* Background Decorative Ambient Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1200px] h-[500px] sm:h-[800px] pointer-events-none z-0 opacity-30 filter blur-[100px]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.12) 0%, rgba(16, 185, 129, 0.04) 45%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Grid Pattern Background with Smooth Side & Top Edge Radial Fade */}
      <div
        className="absolute inset-0 w-full h-full bg-square-grid pointer-events-none opacity-25 z-0"
        style={{
          maskImage:
            'radial-gradient(ellipse 78% 70% at 50% 50%, black 35%, rgba(0,0,0,0.6) 65%, transparent 95%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 78% 70% at 50% 50%, black 35%, rgba(0,0,0,0.6) 65%, transparent 95%)',
        }}
        aria-hidden="true"
      />

      {/* Top Edge Transition Gradient smoothly blending into previous section */}
      <div
        className="absolute top-0 left-0 right-0 h-24 sm:h-36 pointer-events-none z-0"
        style={{
          background:
            'linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.8) 40%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Section Content Container (2-Column Responsive Layout) */}
      <div className="relative z-10 w-full max-w-[96%] xl:max-w-[95%] 2xl:max-w-[1760px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column: Title, Subtitle, Support Card (Top aligned with right column) */}
          <div className="lg:col-span-5 w-full">
            <FaqHeader
              pillText={config.pillText}
              title={config.title}
              subtitle={config.subtitle}
              supportCard={config.supportCard}
            />
          </div>

          {/* Right Column: Expandable FAQ Accordion Cards (Top aligned with left column) */}
          <div className="lg:col-span-7 w-full min-w-0">
            <FaqAccordionList items={config.items} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Faq;
