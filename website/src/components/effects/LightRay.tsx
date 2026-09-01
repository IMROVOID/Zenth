import React from 'react';
import { themeConfig } from '@/config';
import { imagePath } from '@/config/assets';

export interface LightRayProps {
  className?: string;
  color?: string;
}

export function LightRay({ className = '', color = themeConfig.accentColor }: LightRayProps) {
  return (
    <div
      className={`w-full h-full pointer-events-none blur-[16px] select-none ${className}`.trim()}
      style={{
        maskImage:
          'radial-gradient(circle at 0% 0%, black 40%, rgba(0,0,0,0.85) 65%, transparent 88%)',
        WebkitMaskImage:
          'radial-gradient(circle at 0% 0%, black 40%, rgba(0,0,0,0.85) 65%, transparent 88%)',
      }}
    >
      <img
        src={imagePath('light-ray.webp')}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        loading="eager"
        decoding="sync"
        className="w-full h-full object-cover block select-none"
      />
    </div>
  );
}

export default LightRay;
