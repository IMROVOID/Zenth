'use client';

import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { NavMenu } from './NavMenu';
import { GithubStarBadge } from './GithubStarBadge';
import { MobileMenu } from './MobileMenu';
import { LiquidMetalButton } from '@/components/ui';

export interface HeaderProps {
  className?: string;
}

export function Header({ className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={`w-full pt-6 pb-2 px-3 sm:px-10 xl:px-14 flex-shrink-0 animate-startup-header relative z-50 ${className}`.trim()}>
      <div className="w-full max-w-[96%] xl:max-w-[95%] 2xl:max-w-[1760px] mx-auto flex items-center justify-between relative">
        {/* Left Side: Brand Logo - stays fixed in position across mobile menu */}
        <BrandLogo className="relative z-[60]" />

        {/* Center: Navigation centered across the entire header (desktop only) */}
        <NavMenu />

        {/* Right Side: Desktop (Lang + Stars + Get Started) */}
        <div className="hidden md:flex items-center gap-3.5 z-10">
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
            href="#quickstart"
            height={38}
            width={116}
          />
        </div>

        {/* Right Side: Mobile (Language Icon + Morphing Hamburger to X Button) */}
        <div className="flex md:hidden items-center gap-1.5 relative z-[60]">
          {/* Mobile Language Icon */}
          <button
            type="button"
            aria-label="Language selector"
            className="text-white/80 hover:text-white transition-colors p-1.5 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[21px] h-[21px]"
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

          {/* Smooth Morphing Hamburger to X Button */}
          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-[5px] text-white/80 hover:text-white transition-colors focus:outline-none p-2"
          >
            <span
              className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 ease-in-out origin-center ${
                isMobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-200 ease-in-out ${
                isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 ease-in-out origin-center ${
                isMobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Full Screen Glassmorphism Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}

export default Header;

