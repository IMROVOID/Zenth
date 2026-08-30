import React from 'react';
import { BrandLogo } from '../BrandLogo';
import { GithubStarBadge } from '../GithubStarBadge';
import { FooterBrandProps } from './types';

export function FooterBrand({
  name = 'Zenth',
  logoSrc = '/images/logo.svg',
  tagline = 'Autonomous self-learning cryptocurrency paper trading terminal with multi-exchange feeds, adaptive memory, and institutional risk management.',
  badges = ['[v1.0.1]', '[PAPER_ONLY]', '[GPL-3.0]'],
  repoUrl = 'https://github.com/IMROVOID/Zenth',
  className = '',
}: FooterBrandProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`.trim()}>
      {/* Brand Logo & Compact GitHub Star Badge in one row */}
      <div className="flex items-center gap-3 flex-wrap">
        <BrandLogo name={name} logoSrc={logoSrc} />
        <GithubStarBadge
          repoUrl={repoUrl}
          size="default"
          className="!h-[28px] !px-2.5 !gap-1.5 !text-[11px] !border-white/20 hover:!border-white/40 !bg-transparent"
        />
      </div>

      {/* Terminal Platform Tagline */}
      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm font-sans">
        {tagline}
      </p>

      {/* Specification Badges with signature radial glassmorphism */}
      <div className="flex flex-wrap gap-2 pt-0.5">
        {badges.map((badge, idx) => (
          <span
            key={`brand-badge-${idx}`}
            className="px-2.5 py-1 rounded-xl text-[10px] font-mono text-zinc-300 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)] uppercase tracking-wider"
            style={{
              background:
                'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(20,20,24,0.85) 100%)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

export default FooterBrand;
