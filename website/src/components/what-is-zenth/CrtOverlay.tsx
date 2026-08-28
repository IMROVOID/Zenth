'use client';

import React from 'react';

export interface CrtOverlayProps {
  className?: string;
}

export function CrtOverlay({ className = '' }: CrtOverlayProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none z-20 overflow-hidden select-none ${className}`.trim()}
      aria-hidden="true"
    >
      {/* 1. Delicate, Ultra-Fine Scanlines (Crisp, High-Clarity Legibility with Subtle Retro Texture) */}
      <div
        className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0px, rgba(0, 0, 0, 0.4) 1px, transparent 1px, transparent 2.5px)',
          backgroundSize: '100% 2.5px',
        }}
      />

      {/* 2. CRT Screen Edge Vignette & Corner Depth */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 96% 92% at 50% 50%, transparent 80%, rgba(0, 0, 0, 0.7) 100%)',
          boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8)',
        }}
      />

      {/* 3. Subtle Neutral Glass Sheen */}
      <div
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.01) 18%, transparent 40%)',
        }}
      />
    </div>
  );
}

export default CrtOverlay;
