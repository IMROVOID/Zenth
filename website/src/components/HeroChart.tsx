import React from 'react';
import { PixelGrid } from './PixelGrid';

export function HeroChart() {
  // Silky smooth stepped spline: continuous cubic beziers (C) with generous tangent handles
  const pathD =
    'M 0 280 ' +
    'L 120 280 ' +
    'C 155 280, 175 195, 210 195 ' + // Smooth rise to Shelf 1
    'L 255 195 ' + // Horizontal shelf 1 (left)
    'C 285 195, 305 270, 335 270 ' + // Smooth drop to Valley 1
    'L 355 270 ' +
    'C 385 270, 405 135, 435 135 ' + // Smooth rise to Shelf 2
    'L 485 135 ' + // Horizontal shelf 2 (left)
    'C 515 135, 530 85, 560 85 ' + // Smooth rise to High Shelf 3
    'L 615 85 ' + // High shelf 3 (left)
    'C 645 85, 665 210, 695 210 ' + // Smooth descent to Shelf 4
    'L 715 210 ' +
    'C 735 210, 748 290, 765 290 ' + // Pre-launch valley
    'L 780 290 ' +
    'C 795 290, 804 22, 816 22 ' + // Center Towering Needle Apex
    'C 824 22, 835 165, 846 165 ' + // Smooth drop to center shelf
    'L 865 165 ' +
    'C 880 165, 892 26, 908 26 ' + // Smooth rise to Main Plateau
    'L 970 26 ' + // Wide Flat-Top Plateau (centered at 860-970)
    'C 990 26, 1005 95, 1025 95 ' + // Smooth step down to Shelf 1
    'L 1065 95 ' +
    'C 1085 95, 1100 160, 1120 160 ' + // Smooth step down to Shelf 2
    'L 1155 160 ' +
    'C 1175 160, 1190 275, 1210 275 ' + // Valley
    'L 1235 275 ' +
    'C 1255 275, 1270 125, 1295 125 ' + // Smooth rise to Right Shelf 3
    'L 1345 125 ' +
    'C 1370 125, 1390 210, 1415 210 ' + // Smooth step down to Shelf 4
    'L 1445 210 ' +
    'C 1470 210, 1490 280, 1520 280 ' +
    'L 1600 280';

  const areaD = `${pathD} L 1600 420 L 0 420 Z`;

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

        {/* 2. SVG Line Chart with ViewBox 0 -120 1600 540 */}
        <svg
        viewBox="0 -120 1600 540"
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
