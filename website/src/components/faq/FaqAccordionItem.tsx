'use client';

import React from 'react';
import { FaqAccordionItemProps } from './types';

export function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
  className = '',
}: FaqAccordionItemProps) {
  const contentId = `faq-content-${item.id}`;
  const headerId = `faq-header-${item.id}`;

  return (
    <div
      className={`group relative rounded-[20px] sm:rounded-[22px] overflow-hidden transition-all duration-300 ${
        isOpen
          ? 'border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.9)]'
          : 'hover:border-white/15 hover:shadow-[0_12px_30px_rgba(0,0,0,0.7)]'
      } ${className}`.trim()}
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

      {/* Accordion Trigger Header */}
      <button
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className="relative z-10 w-full p-4 sm:p-5 lg:p-6 flex items-center justify-between gap-4 text-left cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-[20px]"
      >
        {/* Question Text */}
        <h3
          className={`text-sm sm:text-base lg:text-[17px] font-medium tracking-tight leading-snug transition-colors duration-200 flex-1 min-w-0 ${
            isOpen ? 'text-white' : 'text-zinc-200 group-hover:text-white'
          }`}
        >
          {item.question}
        </h3>

        {/* Expand / Collapse Chevron Indicator */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${
            isOpen
              ? 'bg-white/10 border-white/25 text-white rotate-180 shadow-[0_2px_8px_rgba(0,0,0,0.5)]'
              : 'bg-white/5 border-white/10 text-zinc-400 group-hover:text-white group-hover:border-white/20'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expandable Answer Content Container with Smooth Bezier Grid Transition */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        style={{
          transition: 'grid-template-rows 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease',
        }}
        className={`relative z-10 grid px-4 sm:px-5 lg:px-6 ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden flex flex-col gap-3 pb-5 sm:pb-6">
          <div className="h-[1px] w-full bg-white/10" />

          {/* Answer Body */}
          <p className="text-xs sm:text-sm text-[#a0a0a5] leading-relaxed font-normal">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FaqAccordionItem;
