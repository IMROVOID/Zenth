import React from 'react';
import { FooterBottomBarProps } from './types';

export function FooterBottomBar({
  attribution,
  onOpenLegalModal,
  className = '',
}: FooterBottomBarProps) {
  return (
    <div
      className={`w-full pt-6 pb-2 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400 ${className}`.trim()}
    >
      {/* Left: Copyright Notice */}
      <div className="text-center md:text-left text-zinc-500 order-2 md:order-1 text-[11px] sm:text-xs">
        <span>{attribution.copyrightText}</span>
      </div>

      {/* Right: Legal Links & Signature Glassmorphic ROVOID Attribution */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 order-1 md:order-2">
        {/* Legal Document Triggers */}
        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => onOpenLegalModal('privacy')}
            className="hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-colors focus:outline-none cursor-pointer"
          >
            Privacy Policy
          </button>
          <span className="text-zinc-700">|</span>
          <button
            type="button"
            onClick={() => onOpenLegalModal('terms')}
            className="hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-colors focus:outline-none cursor-pointer"
          >
            Terms of Service
          </button>
        </div>

        {/* ROVOID Attribution Glassmorphic Capsule */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-all hover:border-white/20"
          style={{
            background:
              'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(20,20,24,0.85) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span className="text-zinc-400">{attribution.prefixText}</span>
          <a
            href={attribution.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white hover:text-emerald-400 underline underline-offset-2 decoration-emerald-400/40 hover:decoration-emerald-400 transition-all tracking-wider"
          >
            {attribution.authorName}
          </a>
        </div>
      </div>
    </div>
  );
}

export default FooterBottomBar;
