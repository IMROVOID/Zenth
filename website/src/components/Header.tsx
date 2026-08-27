'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { siteConfig } from '../config';
import { LiquidMetalButton } from './LiquidMetalButton';

export function Header() {
  const [stars, setStars] = useState<string | null>(null);

  // Fetch real stargazers count from GitHub API dynamically
  useEffect(() => {
    fetch('https://api.github.com/repos/IMROVOID/Zenth')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.stargazers_count === 'number') {
          const count = data.stargazers_count;
          setStars(count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count.toString());
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="w-full pt-6 pb-2 px-6 sm:px-10 xl:px-14 flex-shrink-0 animate-startup-header">
      <div className="w-full max-w-[96%] xl:max-w-[95%] 2xl:max-w-[1760px] mx-auto flex items-center justify-between relative">
        {/* Left Side: Logo + Zenth brand wordmark */}
        <div className="flex items-center z-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.svg"
              alt="Zenth Logo"
              className="w-6 h-6 object-contain invert"
            />
            <span className="text-2xl font-bold tracking-widest text-white uppercase font-mono">
              Zenth
            </span>
          </Link>
        </div>

        {/* Center: Navigation centered across the entire header */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 xl:gap-7 text-sm font-medium absolute left-1/2 -translate-x-1/2">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-1.5 text-white hover:text-white/75 transition-colors duration-150"
            >
              <span>{item.label}</span>
              {item.hasDropdown && (
                <svg
                  className="w-3.5 h-3.5 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side: Language Icon + GitHub Repo Stars Box + Liquid Metal Get Started Button */}
        <div className="flex items-center gap-3.5 z-10">
          {/* Language Icon: Icon only, no background, no border, w-[23px] h-[23px] */}
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

          {/* GitHub Repo Stars Box: exact style as prior EN button, dynamic real stars data */}
          <a
            href={siteConfig.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-[38px] px-3.5 flex items-center gap-2 rounded-full border border-white/20 bg-transparent text-sm font-medium text-white hover:border-white/40 transition-colors"
          >
            <svg
              className="w-4 h-4 text-white fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span className="text-xs font-medium text-white/90">Star</span>
            <span className="text-[11px] text-[#2CE88A] bg-[#2CE88A]/10 px-1.5 py-0.5 rounded-full font-mono font-medium">
              {stars ?? '0'}
            </span>
          </a>

          {/* Liquid Metal Get Started Button: identical 38px height, 116px width */}
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
