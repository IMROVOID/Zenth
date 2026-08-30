import React from 'react';
import { FooterLegalDisclaimerProps } from './types';

export function FooterLegalDisclaimer({
  description,
  notionalCapText,
  className = '',
}: FooterLegalDisclaimerProps) {
  return (
    <div
      className={`w-full rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 ${className}`.trim()}
      style={{
        background:
          'radial-gradient(130% 120% at 50% 0%, #1e1e23 0%, #111114 45%, #08080a 100%)',
        boxShadow:
          '0 10px 30px -4px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
        border: '1px solid transparent',
        backgroundImage:
          'radial-gradient(130% 120% at 50% 0%, #1e1e23 0%, #111114 45%, #08080a 100%), linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 40%, transparent 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      {/* Top Specular Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] z-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 30%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 255, 255, 0.15) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-start gap-3 sm:gap-4 text-[11px] sm:text-xs leading-relaxed">
        <span
          className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold text-amber-300 border border-amber-400/20 shadow-[0_2px_8px_rgba(0,0,0,0.5)] flex-shrink-0 mt-[1px]"
          style={{
            background:
              'radial-gradient(120% 100% at 50% 0%, rgba(245,158,11,0.15) 0%, rgba(20,20,24,0.85) 100%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          [DISCLAIMER]
        </span>
        <p className="text-zinc-300 font-sans">
          {description}{' '}
          <span className="text-zinc-400 font-mono text-[11px] font-medium">
            {notionalCapText}
          </span>
        </p>
      </div>
    </div>
  );
}

export default FooterLegalDisclaimer;
