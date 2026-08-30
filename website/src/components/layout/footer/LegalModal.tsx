'use client';

import React, { useEffect, useState } from 'react';
import { LegalModalProps } from './types';

export function LegalModal({
  isOpen,
  activeDoc,
  onClose,
  onSwitchDoc,
  config,
}: LegalModalProps) {
  const [isRendered, setIsRendered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
    } else if (isRendered) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
      }, 190);
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

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isRendered) return null;

  const currentDoc = activeDoc === 'privacy' ? config.privacy : config.terms;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-2xl ${
        isClosing ? 'animate-overlay-out' : 'animate-overlay-in'
      }`}
      onClick={onClose}
    >
      {/* Modal Dialog Card with Glassmorphism & Animated Scale */}
      <div
        className={`relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-[22px] sm:rounded-[26px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.95)] ${
          isClosing ? 'animate-modal-card-out' : 'animate-modal-card-in'
        }`}
        style={{
          background:
            'radial-gradient(130% 120% at 50% 0%, rgba(30, 30, 35, 0.88) 0%, rgba(17, 17, 20, 0.92) 45%, rgba(8, 8, 10, 0.96) 100%)',
          boxShadow:
            '0 25px 70px -10px rgba(0, 0, 0, 0.95), inset 0 1px 1px 0 rgba(255, 255, 255, 0.18)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Specular Line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] z-30 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.2) 70%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Ambient Subtle Emerald Glow */}
        <div
          className="absolute bottom-0 right-0 w-[50%] h-[50%] pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 80% at 95% 95%, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Header with Segmented Glassmorphic Tabs */}
        <div className="relative z-10 flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/[0.08] bg-black/40 backdrop-blur-md flex-shrink-0">
          <div
            className="flex items-center gap-1 p-1 rounded-xl border border-white/10"
            style={{
              background:
                'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.04) 0%, rgba(18,18,22,0.85) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <button
              type="button"
              onClick={() => onSwitchDoc('privacy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                activeDoc === 'privacy'
                  ? 'bg-white/[0.12] text-white border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.5)]'
                  : 'text-zinc-400 hover:text-white bg-transparent border border-transparent'
              }`}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onSwitchDoc('terms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                activeDoc === 'terms'
                  ? 'bg-white/[0.12] text-white border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.5)]'
                  : 'text-zinc-400 hover:text-white bg-transparent border border-transparent'
              }`}
            >
              Terms of Service
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white hover:border-white/25 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)] cursor-pointer focus:outline-none"
          >
            <span className="text-base leading-none">×</span>
          </button>
        </div>

        {/* Modal Scrollable Body with Smooth Tab Content Fade */}
        <div
          key={activeDoc}
          className="relative z-10 p-5 sm:p-7 overflow-y-auto space-y-5 text-zinc-300 font-sans animate-tab-content"
        >
          <div>
            <h3 id="legal-modal-title" className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              {currentDoc.title}
            </h3>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Last Updated: {currentDoc.lastUpdated}
            </p>
          </div>

          {currentDoc.sections.map((section, idx) => (
            <div
              key={`legal-sec-${idx}`}
              className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.4)] space-y-2"
              style={{
                background:
                  'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.03) 0%, rgba(18,18,22,0.6) 100%)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                {section.heading}
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 font-sans">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Bottom Bar */}
        <div className="relative z-10 px-5 sm:px-7 py-3.5 border-t border-white/[0.08] bg-black/40 backdrop-blur-md flex items-center justify-between text-xs font-mono text-zinc-400 flex-shrink-0">
          <span>Zenth Open Source Documentation</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white/90 hover:text-white border border-white/10 hover:border-white/25 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.5)] cursor-pointer"
            style={{
              background:
                'radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(24,24,28,0.85) 100%)',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LegalModal;
