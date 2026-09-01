'use client';

import React from 'react';
import { SectionHeading } from './SectionHeading';
import { ThreeUICrtVideoPlayer } from './crt';

export interface WhatIsZenthProps {
  className?: string;
}

export function WhatIsZenth({ className = '' }: WhatIsZenthProps) {
  return (
    <section
      id="engine"
      className={`relative w-full py-16 sm:py-24 px-3 sm:px-10 xl:px-14 bg-[#0a0a0a] overflow-hidden ${className}`.trim()}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1100px] h-[500px] sm:h-[700px] pointer-events-none z-0 opacity-40 filter blur-[90px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(46, 224, 125, 0.12) 0%, rgba(24, 150, 92, 0.05) 45%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 w-full h-full bg-square-grid pointer-events-none opacity-35 z-0"
        style={{
          maskImage:
            'radial-gradient(ellipse 78% 70% at 50% 50%, black 35%, rgba(0,0,0,0.6) 65%, transparent 95%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 78% 70% at 50% 50%, black 35%, rgba(0,0,0,0.6) 65%, transparent 95%)',
        }}
        aria-hidden="true"
      />

      <div
        className="absolute top-0 left-0 right-0 h-24 sm:h-36 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.8) 40%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[96%] xl:max-w-[95%] 2xl:max-w-[1760px] mx-auto flex flex-col items-center">
        <SectionHeading />
        <ThreeUICrtVideoPlayer />
      </div>
    </section>
  );
}

export default WhatIsZenth;
