'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface HeroWordCapsuleProps {
  words: string[];
  intervalMs?: number;
  className?: string;
}

export function HeroWordCapsule({
  words,
  intervalMs = 3000,
  className = '',
}: HeroWordCapsuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finishRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (words.length <= 1) return;

    timerRef.current = setInterval(() => {
      const prev = currentIndexRef.current;
      const next = (prev + 1) % words.length;

      setIncomingIndex(next);
      setIsTransitioning(true);

      if (finishRef.current) clearTimeout(finishRef.current);
      finishRef.current = setTimeout(() => {
        currentIndexRef.current = next;
        setCurrentIndex(next);
        setIncomingIndex(null);
        setIsTransitioning(false);
      }, 450);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (finishRef.current) clearTimeout(finishRef.current);
    };
  }, [words, intervalMs]);

  return (
    <span
      className={`hero-capsule-box relative inline-grid grid-cols-1 grid-rows-1 place-items-center overflow-hidden rounded-full px-5 sm:px-5.5 h-[1.32em] sm:h-[1.26em] select-none text-[0.82em] sm:text-[0.84em] flex-shrink-0 align-middle ${className}`.trim()}
    >
      {/* Invisible anchor sizers: locks capsule width and height to max across all words */}
      {words.map((w) => (
        <span
          key={`sizer-${w}`}
          className="invisible pointer-events-none select-none col-start-1 row-start-1 opacity-0 font-medium tracking-tight text-transparent leading-none -translate-y-[0.04em]"
          aria-hidden="true"
        >
          {w}
        </span>
      ))}

      {/* Active / Outgoing Word (slides DOWN and fades out) */}
      <span
        className={`col-start-1 row-start-1 w-full text-center font-medium tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#909096] to-[#ffffff] ${
          isTransitioning
            ? 'animate-capsule-loop-out'
            : '-translate-y-[0.04em] opacity-100'
        }`}
      >
        {words[currentIndex]}
      </span>

      {/* Incoming Word during transition (starts from top and slides DOWN into place) */}
      {isTransitioning && incomingIndex !== null && (
        <span
          className="col-start-1 row-start-1 w-full text-center font-medium tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#909096] to-[#ffffff] animate-capsule-loop-in"
        >
          {words[incomingIndex]}
        </span>
      )}
    </span>
  );
}

export default HeroWordCapsule;
