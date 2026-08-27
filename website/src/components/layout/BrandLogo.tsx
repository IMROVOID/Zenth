import React from 'react';
import Link from 'next/link';

export interface BrandLogoProps {
  name?: string;
  logoSrc?: string;
  className?: string;
}

export function BrandLogo({
  name = 'Zenth',
  logoSrc = '/logo.svg',
  className = '',
}: BrandLogoProps) {
  return (
    <div className={`flex items-center ${className || 'z-10'}`.trim()}>
      <Link href="/" className="flex items-center gap-2.5 group">
        <img
          src={logoSrc}
          alt={`${name} Logo`}
          className="w-6 h-6 object-contain invert"
        />
        <span className="text-2xl font-bold tracking-widest text-white uppercase font-mono">
          {name}
        </span>
      </Link>
    </div>
  );
}

export default BrandLogo;
