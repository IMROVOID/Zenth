'use client';

import React, { useRef, useState, useCallback, type ReactNode } from 'react';

export interface BorderProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
}

// Exact continuous clockwise perimeter traversal starting and ending at (12, 15)
function getPerimeterPos(s: number) {
  if (s <= 0.35) {
    const u = s / 0.35;
    return { x: 12 + 76 * u, y: 15 };
  } else if (s <= 0.50) {
    const u = (s - 0.35) / 0.15;
    const th = -Math.PI / 2 + u * Math.PI;
    return { x: 88 + 8 * Math.cos(th), y: 50 + 35 * Math.sin(th) };
  } else if (s <= 0.85) {
    const u = (s - 0.50) / 0.35;
    return { x: 88 - 76 * u, y: 85 };
  } else {
    const u = (s - 0.85) / 0.15;
    const th = Math.PI / 2 + u * Math.PI;
    return { x: 12 + 8 * Math.cos(th), y: 50 + 35 * Math.sin(th) };
  }
}

export function InteractiveBorder({
  children,
  className = '',
}: BorderProps) {
  // Resting focal point: Strictly at the top-left corner curve (12% X, 15% Y)
  const defaultPos = { x: 12, y: 15 };
  const [pos, setPos] = useState(defaultPos);
  const isSpinningRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (isSpinningRef.current) return;
    isSpinningRef.current = true;

    const duration = 850; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-in-out cubic: 0 velocity at start and end
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Exactly matches defaultPos at ease=0 and ease=1
      setPos(getPerimeterPos(ease));

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setPos(defaultPos);
        isSpinningRef.current = false;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const maskStyle = {
    maskImage: `radial-gradient(ellipse 110px 55px at ${pos.x}% ${pos.y}%, black 0%, black 35%, transparent 80%)`,
    WebkitMaskImage: `radial-gradient(ellipse 110px 55px at ${pos.x}% ${pos.y}%, black 0%, black 35%, transparent 80%)`,
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* 
        100% Vertically Centered Concentric Border:
        - top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 guarantees identical top and bottom spacing (5px gap)
        - borderWidth: 1.6px eliminates pixelation for a smooth, solid hairline
        - Perfectly continuous start and end animation (0 jump, 0 snap)
      */}
      <div
        onMouseEnter={handleMouseEnter}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-solid border-[#2CE88A] pointer-events-auto"
        style={{
          width: 'calc(100% + 6px)',
          height: 'calc(100% + 6px)',
          borderWidth: '1.6px',
          ...maskStyle,
        }}
        aria-hidden="true"
      />

      {/* Button Interior Wrapper */}
      <div className="relative z-[1] flex items-center justify-center">{children}</div>
    </div>
  );
}

export default InteractiveBorder;
