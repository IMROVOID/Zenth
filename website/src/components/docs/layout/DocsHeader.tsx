'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { siteConfig } from '@/config';
import { DocsSearchTrigger } from '../search/DocsSearchTrigger';
import { DocsThemeToggle } from './DocsThemeToggle';

export interface DocsHeaderProps {
  onSearchOpen: () => void;
  onMobileMenuToggle: () => void;
  className?: string;
}

export function DocsHeader({
  onSearchOpen,
  onMobileMenuToggle,
  className = '',
}: DocsHeaderProps) {
  const [starCount, setStarCount] = useState<string>('0');

  useEffect(() => {
    fetch('https://api.github.com/repos/IMROVOID/Zenth')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.stargazers_count === 'number') {
          setStarCount(data.stargazers_count >= 1000 ? `${(data.stargazers_count / 1000).toFixed(1)}k` : `${data.stargazers_count}`);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--docs-header-bg, rgba(16, 16, 16, 0.82))',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--docs-border, rgb(44, 44, 44))',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        boxShadow: 'none',
      }}
      className={`w-full h-[4rem] flex items-center justify-between flex-shrink-0 backdrop-blur-md ${className}`.trim()}
    >
      {/* Left: Brand Logo & Compact [DOCS] Badge */}
      <div className="flex items-center gap-2.5">
        <BrandLogo href="/documentation/" themeAdaptive={true} className="scale-95 sm:scale-100 origin-left" />
        <Link
          href="/documentation/"
          style={{
            borderRadius: '4px',
            border: '1px solid var(--docs-border, rgb(44, 44, 44))',
            backgroundColor: 'var(--docs-docs-badge-bg, rgb(22, 22, 22))',
            color: 'var(--docs-text-secondary, rgb(196, 193, 187))',
            padding: '1px 5px',
            fontSize: '9.5px',
          }}
          className="hidden sm:inline-flex font-mono font-semibold tracking-wider hover:text-[var(--docs-text-primary,rgb(242,240,236))] transition-colors select-none"
        >
          [DOCS]
        </Link>
      </div>

      {/* Right Side: Header Actions */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
        {/* 1. Search Bar (36px height) */}
        <DocsSearchTrigger onClick={onSearchOpen} />

        {/* 2. Github Stars Box (Exact 36px height matching Search Bar) */}
        <a
          href={siteConfig.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            height: '36px',
            minHeight: '36px',
            maxHeight: '36px',
            boxSizing: 'border-box',
            padding: '0 10px',
            borderRadius: 'var(--radius-xl, 0.5rem)',
            border: '1px solid var(--docs-border, rgb(44, 44, 44))',
            backgroundColor: 'var(--docs-bg-elevated, rgb(15, 15, 15))',
            color: 'var(--docs-text-secondary, rgb(196, 193, 187))',
            boxShadow: 'none',
          }}
          className="hidden md:flex items-center gap-2 text-xs font-mono font-medium hover:text-[var(--docs-text-primary,rgb(242,240,236))] hover:border-[var(--docs-border-hover,rgb(56,56,56))] transition-all select-none cursor-pointer"
        >
          <svg width="14" height="14" className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span>Star</span>
          <span
            style={{
              backgroundColor: 'var(--docs-star-badge-bg, rgb(37, 37, 37))',
              color: 'var(--docs-text-primary, rgb(242, 240, 236))',
              borderRadius: '4px',
              padding: '1px 5px',
              fontSize: '10px',
              lineHeight: 1.2,
            }}
            className="font-mono"
          >
            {starCount}
          </span>
        </a>

        {/* 3. Theme Dropdown Toggle (36px height) */}
        <div className="flex items-center">
          <DocsThemeToggle />
        </div>

        {/* 4. Exit to App Icon (Matching 36px geometry and padding) */}
        <Link
          href="/"
          aria-label="Exit to App"
          title="Exit to App"
          style={{
            height: '36px',
            width: '36px',
            minHeight: '36px',
            minWidth: '36px',
            boxSizing: 'border-box',
            borderRadius: 'var(--radius-xl, 0.5rem)',
          }}
          className="hidden md:flex items-center justify-center text-[var(--docs-text-secondary,rgb(196,193,187))] hover:text-[var(--docs-text-primary,rgb(242,240,236))] hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
        </Link>

        {/* Hamburger Menu Toggle (Visible ONLY on Tablet & Mobile < 1024px) */}
        <button
          type="button"
          onClick={onMobileMenuToggle}
          aria-label="Open documentation navigation menu"
          style={{
            height: '36px',
            width: '36px',
            minHeight: '36px',
            minWidth: '36px',
            padding: 0,
            boxSizing: 'border-box',
          }}
          className="docs-mobile-toggle p-0 flex items-center justify-center rounded-lg text-[var(--docs-text-secondary,rgb(196,193,187))] hover:text-[var(--docs-text-primary,rgb(242,240,236))] hover:bg-black/[0.05] dark:hover:bg-white/10 transition-colors"
        >
          <svg width="20" height="20" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default DocsHeader;

