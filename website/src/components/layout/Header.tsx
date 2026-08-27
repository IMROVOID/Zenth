'use client';

import React from 'react';
import { BrandLogo } from './BrandLogo';
import { NavMenu } from './NavMenu';
import { GithubStarBadge } from './GithubStarBadge';
import { LiquidMetalButton } from '@/components/ui';

export interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  return (
    <header className={`w-full pt-6 pb-2 px-6 sm:px-10 xl:px-14 flex-shrink-0 animate-startup-header ${className}`.trim()}>
      <div className="w-full max-w-[96%] xl:max-w-[95%] 2xl:max-w-[1760px] mx-auto flex items-center justify-between relative">
        {/* Left Side: Brand Logo */}
        <BrandLogo />

        {/* Center: Navigation centered across the entire header */}
        <NavMenu />

        {/* Right Side: Language Icon + GitHub Repo Stars Box + Liquid Metal Get Started Button */}
        <div className="flex items-center gap-3.5 z-10">
          {/* Language Icon */}
          <button
            type="button"
            aria-label="Language selector"
            className="text-white/80 hover:text-white transition-colors p-1 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[23px] h-[23px]"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M0 0h24v24H0z" stroke="none" />
              <path d="M5 7h7m-2-2v2a5 8 0 0 1-5 8m1-4a7 4 0 0 0 6.7 4M11 19l4-9 4 9m-.9-2h-6.2" />
            </svg>
          </button>

          {/* GitHub Repo Stars Box */}
          <GithubStarBadge />

          {/* Liquid Metal Get Started Button */}
          <LiquidMetalButton
            text="Get Started"
            href="#start"
            height={38}
            width={116}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
