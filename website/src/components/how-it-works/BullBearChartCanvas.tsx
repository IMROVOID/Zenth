'use client';

import React from 'react';
import {
  HOW_IT_WORKS_VIEWBOX,
  CHART_ROW_LINES,
  CANDLESTICK_DATA,
  BOTTOM_MARKETCAP_PATH,
  BOTTOM_MARKETCAP_AREA,
  CHART_MARKERS,
} from './constants';
import { ChartSignalBadge } from './ChartSignalBadge';

export function BullBearChartCanvas() {
  const buyMarker = CHART_MARKERS.find((m) => m.type === 'BUY')!;
  const sellMarker = CHART_MARKERS.find((m) => m.type === 'SELL')!;
  const total = CANDLESTICK_DATA.length;

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[350px] md:min-h-[380px] select-none flex items-center justify-center">
      <svg
        viewBox={HOW_IT_WORKS_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="row-line-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="8%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="92%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="chart-left-alpha-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="6%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="16%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="26%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
          <mask id="chart-alpha-mask">
            <rect x="0" y="0" width="760" height="340" fill="url(#chart-left-alpha-grad)" />
          </mask>

          <linearGradient id="marketcap-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2CE88A" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#2CE88A" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="marketcap-stroke-grad" x1="0" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0d5a32" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#16a34a" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {CHART_ROW_LINES.map((y) => (
          <line key={`row-line-${y}`} x1="0" y1={y} x2="760" y2={y} stroke="url(#row-line-fade)" strokeWidth="1" />
        ))}

        <g mask="url(#chart-alpha-mask)">
          {/* Bottom Marketcap Area & Line Chart */}
          <path d={BOTTOM_MARKETCAP_AREA} fill="url(#marketcap-area-grad)" />
          <path d={BOTTOM_MARKETCAP_PATH} fill="none" stroke="url(#marketcap-stroke-grad)" strokeWidth="1.8" strokeLinecap="round" />

          {/* Candlestick Bars */}
          {CANDLESTICK_DATA.map((c, idx) => {
            const bodyY = Math.min(c.open, c.close);
            const bodyH = Math.max(Math.abs(c.close - c.open), 3.5);
            const isSignal = !!c.signalType;
            const isBuy = c.signalType === 'BUY';
            const isSell = c.signalType === 'SELL';
            const opacity = isSignal ? 1.0 : 0.52 + (idx / (total - 1)) * 0.48;
            const color = isBuy ? '#4ade80' : isSell ? '#ff4d6d' : c.isBull ? '#2CE88A' : '#f43f5e';
            const fill = isBuy ? '#22c55e' : isSell ? '#ef4444' : c.isBull ? '#16a34a' : '#dc2626';

            return (
              <g key={`candle-${c.id}`} opacity={opacity}>
                {isSignal && (
                  <rect
                    x={c.x - 7}
                    y={c.high - 4}
                    width="14"
                    height={c.low - c.high + 8}
                    rx="4"
                    fill={isBuy ? '#22c55e' : '#f43f5e'}
                    opacity="0.38"
                    style={{ filter: 'blur(5px)' }}
                  />
                )}
                <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke={color} strokeWidth={isSignal ? '1.8' : '1.2'} strokeLinecap="round" />
                <rect
                  x={c.x - (isSignal ? 3.8 : 3.4)}
                  y={bodyY}
                  width={isSignal ? 7.6 : 6.8}
                  height={bodyH}
                  rx="1"
                  fill={fill}
                  stroke={color}
                  strokeWidth={isSignal ? '1.2' : '0.8'}
                  shapeRendering="geometricPrecision"
                />
                {isSignal && (
                  <rect x={c.x - 1.2} y={bodyY + 2} width="2.4" height={Math.max(bodyH - 4, 1)} rx="0.5" fill="#ffffff" opacity="0.6" />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Buy Signal Box - Snug below Buy Candle */}
      <div
        className="absolute transform -translate-x-1/2 pointer-events-none"
        style={{ left: `${(buyMarker.x / 760) * 100}%`, top: `${(buyMarker.y / 340) * 100}%` }}
      >
        <ChartSignalBadge marker={buyMarker} />
      </div>

      {/* Sell Signal Box - Snug above Sell Candle */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none"
        style={{ left: `${(sellMarker.x / 760) * 100}%`, top: `${(sellMarker.y / 340) * 100}%` }}
      >
        <ChartSignalBadge marker={sellMarker} />
      </div>
    </div>
  );
}

export default BullBearChartCanvas;
