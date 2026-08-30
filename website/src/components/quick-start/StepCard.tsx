'use client';

import React, { useState } from 'react';
import { StepCardProps } from './types';

export function StepCard({ step, index, className = '' }: StepCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!step.actionCode) return;
    try {
      await navigator.clipboard.writeText(step.actionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 sm:p-6 rounded-[22px] sm:rounded-[26px] overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)] ${className}`.trim()}
      style={{
        background:
          'radial-gradient(130% 120% at 50% 0%, #1e1e23 0%, #111114 45%, #08080a 100%)',
        boxShadow:
          '0 12px 35px -4px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
        border: '1px solid transparent',
        backgroundImage:
          'radial-gradient(130% 120% at 50% 0%, #1e1e23 0%, #111114 45%, #08080a 100%), linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 40%, transparent 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      {/* Specular Highlight Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] z-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0.45) 50%, rgba(255, 255, 255, 0.2) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Ambient Green Radial Glow */}
      <div
        className="absolute bottom-0 right-0 w-[75%] h-[75%] pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 95% 85% at 95% 95%, rgba(34, 197, 94, 0.18) 0%, rgba(16, 185, 129, 0.05) 40%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Card Content Top Header */}
      <div className="relative z-10 flex flex-col">
        {/* Step Indicator & Badge */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-bold text-sm text-white/90 border border-white/10 flex-shrink-0 shadow-[0_4px_16px_rgba(0,0,0,0.5)] group-hover:border-white/20 transition-colors"
            style={{
              background:
                'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(24,24,28,0.85) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {step.step}
          </div>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider text-zinc-400 bg-white/[0.04] border border-white/[0.08]">
            {step.badge}
          </span>
        </div>

        {/* Step Title */}
        <h3 className="text-base sm:text-[17px] font-semibold text-white tracking-tight leading-snug">
          {step.title}
        </h3>

        {/* Step Description */}
        <p className="mt-2 text-xs sm:text-[13px] text-[#a0a0a5] leading-relaxed font-normal">
          {step.description}
        </p>
      </div>

      {/* Bottom Interactive Clickable Copy Bar */}
      {step.actionCode && (
        <div className="relative z-10 mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <span className="text-[11px] font-mono text-zinc-400 flex-shrink-0">
            {step.actionLabel || 'Command'}:
          </span>
          <button
            type="button"
            onClick={handleCopy}
            title="Click to copy command"
            aria-label={`Copy command: ${step.actionCode}`}
            className="group/btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/10 hover:border-white/20 text-[11px] font-mono text-zinc-200 hover:text-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:scale-95 max-w-full sm:max-w-[240px]"
            style={{
              background:
                'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(24,24,28,0.85) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="truncate">{copied ? 'COPIED!' : step.actionCode}</span>
            {copied ? (
              <svg className="w-3 h-3 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-zinc-400 group-hover/btn:text-white flex-shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default StepCard;
