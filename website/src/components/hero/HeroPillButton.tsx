'use client';

import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config';

export function HeroPillButton() {
  return (
    <Link
      href={siteConfig.hero.badgeHref}
      className="inline-flex items-center justify-center cursor-pointer group leading-none transition-transform active:scale-95"
    >
      <span className="flex items-center gap-2.5 px-6 rounded-full bg-white hover:bg-neutral-100 transition-colors text-black leading-none h-[42px] box-border shadow-sm">
        {/* Text */}
        <span className="text-sm font-semibold tracking-wide text-black">
          {siteConfig.hero.badgeText}
        </span>

        {/* Arrow */}
        <svg
          className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform duration-150"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.333 8h9.334M8.667 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}

export default HeroPillButton;
