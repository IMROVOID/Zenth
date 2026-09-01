'use client';

import React, { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useLiquidMetal } from '@/components/effects/liquid-metal/useLiquidMetal';

export interface LiquidMetalButtonProps {
  text: string;
  href?: string;
  className?: string;
  width?: number;
  height?: number;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

export function LiquidMetalButton({
  text,
  href,
  className = '',
  width = 116,
  height = 38,
  target,
  rel,
  onClick,
}: LiquidMetalButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  useLiquidMetal(canvasRef, containerRef, handleReady);

  const content = (
    <div
      ref={containerRef}
      onClick={onClick}
      tabIndex={0}
      role={href ? undefined : 'button'}
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden select-none cursor-pointer transition-transform active:scale-95 flex-shrink-0 bg-[#0b0c0e] outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${className}`.trim()}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full pointer-events-none rounded-full block transition-opacity duration-700 ease-out ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          willChange: 'opacity',
          transform: 'translateZ(0)',
        }}
      />
      {/* Fallback border before shader loads; fades out smoothly once ready */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-full border border-white/20 pointer-events-none transition-opacity duration-500 ${
          isReady ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className="relative z-10 text-white font-medium tracking-wide leading-none pointer-events-none"
        style={{ fontSize: `${Math.round(height * 0.32)}px` }}
      >
        {text}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={target === '_blank' ? (rel || 'noopener noreferrer') : rel}
        className="inline-flex items-center justify-center flex-shrink-0 leading-none outline-none"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export default LiquidMetalButton;
