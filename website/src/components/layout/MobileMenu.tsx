'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { navItems, type NavItem } from '@/config';
import { BrandLogo } from './BrandLogo';
import { GithubStarBadge } from './GithubStarBadge';
import { LiquidMetalButton } from '@/components/ui';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items?: NavItem[];
}

export function MobileMenu({
  isOpen,
  onClose,
  items = navItems,
}: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
    } else if (isRendered) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    mediaQuery.addEventListener('change', handleBreakpoint);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      mediaQuery.removeEventListener('change', handleBreakpoint);
    };
  }, [isOpen, onClose]);

  if (!isRendered || !mounted) return null;

  const content = (
    <div
      id="mobile-nav-menu"
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-[#0a0a0a]/96 backdrop-blur-3xl md:hidden ${
        isClosing ? 'animate-menu-out' : 'animate-menu-in'
      }`}
      onAnimationEnd={(e) => {
        if (isClosing && e.target === e.currentTarget) {
          setIsRendered(false);
          setIsClosing(false);
        }
      }}
      aria-modal="true"
      role="dialog"
      aria-label="Mobile navigation"
    >
      {/* Top Header Row matching main header exact coordinates */}
      <div className="w-full pt-6 pb-2 px-3 sm:px-10 flex-shrink-0 flex items-center justify-between">
        <BrandLogo className="relative z-10" />

        <div className="flex items-center gap-1.5 relative z-10">
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

          {/* Morphing X button */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className="w-10 h-10 flex flex-col items-center justify-center gap-[5px] text-white/80 hover:text-white transition-colors focus:outline-none p-2"
          >
            <span
              className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 ease-in-out origin-center ${
                !isClosing ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-200 ease-in-out ${
                !isClosing ? 'opacity-0 scale-x-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 ease-in-out origin-center ${
                !isClosing ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col items-center justify-center gap-7 my-auto py-6">
        {items.map((item) => {
          const isExternal = item.href.startsWith('http');
          return (
            <Link
              key={item.label}
              href={item.href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              onClick={onClose}
              className="text-2xl font-medium tracking-wider text-white/85 hover:text-white transition-colors duration-150 py-1"
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions: GitHub Star Badge + Get Started as row */}
      <div className="flex items-center justify-center gap-3.5 pb-10 pt-4 border-t border-white/10 mx-4 min-[380px]:mx-6">
        <GithubStarBadge size="lg" />
        <LiquidMetalButton
          text="Get Started"
          href="#quickstart"
          height={44}
          width={150}
          onClick={onClose}
        />
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

export default MobileMenu;
