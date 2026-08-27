import React from 'react';
import { PixelGrid } from './PixelGrid';
import { CHART_PATH_D, CHART_AREA_D, CHART_VIEWBOX } from './chartConstants';

export function HeroChart() {
  const pathD = CHART_PATH_D;
  const areaD = CHART_AREA_D;

  return (
    <div
      className="relative w-full h-[340px] sm:h-[400px] lg:h-[460px] select-none pointer-events-none"
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 3%, rgba(0,0,0,0.6) 8%, black 14%, black 86%, rgba(0,0,0,0.6) 92%, rgba(0,0,0,0.15) 97%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 3%, rgba(0,0,0,0.6) 8%, black 14%, black 86%, rgba(0,0,0,0.6) 92%, rgba(0,0,0,0.15) 97%, transparent 100%)',
      }}
    >
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 h-full"
        style={{ width: 'max(106%, 1200px)' }}
      >
        {/* 1. Vector-Clipped Pixel Grid mathematically locked to the exact SVG path */}
        <PixelGrid areaD={areaD} />

        {/* 2. SVG Line Chart with ViewBox */}
        <svg
          viewBox={CHART_VIEWBOX}
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
          className="absolute inset-0 w-full h-full z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="chart-side-fade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="6%" stopColor="white" stopOpacity="0.1" />
              <stop offset="14%" stopColor="white" stopOpacity="0.5" />
              <stop offset="24%" stopColor="white" stopOpacity="1" />
              <stop offset="76%" stopColor="white" stopOpacity="1" />
              <stop offset="86%" stopColor="white" stopOpacity="0.5" />
              <stop offset="94%" stopColor="white" stopOpacity="0.1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="side-fade-mask">
              <rect y="-120" width="1600" height="540" fill="url(#chart-side-fade)" />
            </mask>

            <linearGradient id="chart-area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2CE88A" stopOpacity="0.22" />
              <stop offset="45%" stopColor="#22E881" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#15803D" stopOpacity="0.0" />
            </linearGradient>

            {/* Stroke gradient with smooth edge fade and dark tone transition */}
            <linearGradient id="chart-stroke-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0" />
              <stop offset="5%" stopColor="#102519" stopOpacity="0.05" />
              <stop offset="10%" stopColor="#1b633a" stopOpacity="0.35" />
              <stop offset="16%" stopColor="#22c56a" stopOpacity="0.75" />
              <stop offset="24%" stopColor="#2CE88A" stopOpacity="1" />
              <stop offset="50%" stopColor="#4ADE80" stopOpacity="1" />
              <stop offset="76%" stopColor="#2CE88A" stopOpacity="1" />
              <stop offset="84%" stopColor="#22c56a" stopOpacity="0.75" />
              <stop offset="90%" stopColor="#1b633a" stopOpacity="0.35" />
              <stop offset="95%" stopColor="#102519" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 2a. Under-Curve Area Gradient (masked to sides) */}
          <path d={areaD} fill="url(#chart-area-fill)" mask="url(#side-fade-mask)" />

          {/* 2b. Outer Ambient Glow with GPU layer caching */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#chart-stroke-grad)"
            strokeWidth="7"
            strokeOpacity="0.22"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'blur(4px)', willChange: 'transform', transform: 'translateZ(0)' }}
          />

          {/* 2c. Mid Bloom Layer with GPU layer caching */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#chart-stroke-grad)"
            strokeWidth="4"
            strokeOpacity="0.45"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'blur(1.5px)', willChange: 'transform', transform: 'translateZ(0)' }}
          />

          {/* 2d. Primary Razor-Sharp Vector Core (Zero rasterization, 100% geometric precision) */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#chart-stroke-grad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            shapeRendering="geometricPrecision"
          />
        </svg>
      </div>
    </div>
  );
}
