'use client';

import React, { useRef, useEffect, useState } from 'react';
import { getChartCurveY } from '@/lib/math';
import { PIXEL_GRID_COLORS, PIXEL_GRID_DISABLED_COLOR } from './chartConstants';

export interface PixelGridProps {
  areaD: string;
}

export function PixelGrid({ areaD }: PixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pathClip: Path2D | null = null;
    try { pathClip = new Path2D(areaD); } catch {}

    let rafId: number | null = null;

    const render = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const clientW = rect.width || parent.clientWidth;
      const clientH = rect.height || parent.clientHeight;
      if (!clientW || !clientH) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(clientW * dpr);
      const h = Math.round(clientH * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.clearRect(0, 0, w, h);

      const step = Math.round(10 * dpr);
      const dotSize = Math.max(2, Math.round(2.6 * dpr));
      const halfDot = Math.floor(dotSize * 0.5);
      const rx = Math.max(0.6, Math.round(0.28 * dotSize));

      const scaleX = w / 1600;
      const scaleY = h / 540;

      const centerX = 800 * scaleX;
      const centerY = (200 + 120) * scaleY;
      const startX = centerX % step;
      const startY = centerY % step;

      const cols = Math.ceil(w / step);
      const rows = Math.ceil(h / step);

      const curveYByCol = new Float32Array(cols + 1);
      for (let c = 0; c <= cols; c++) {
        curveYByCol[c] = getChartCurveY((startX + c * step) / scaleX);
      }

      const activeBuffers: number[][] = [[], [], [], []];
      const disabledBuffer: number[] = [];

      for (let r = 0; r <= rows; r++) {
        const py = Math.round(startY + r * step);
        const svgY = -120 + py / scaleY;

        for (let c = 0; c <= cols; c++) {
          const px = Math.round(startX + c * step);
          const svgX = px / scaleX;

          const dx = (svgX - 800) / 720;
          const dy = (svgY - 200) / 300;
          const distSq = dx * dx + dy * dy;
          if (distSq >= 1.0) continue;

          const dist = Math.sqrt(distSq);
          let envelope = 1.0;
          if (dist > 0.35) {
            const u = (dist - 0.35) / 0.65;
            envelope = 1.0 - u * u * (3 - 2 * u);
          }
          if (envelope < 0.02) continue;

          const isUnder = svgY >= curveYByCol[c];
          const colId = Math.round(svgX / 10);
          const rowId = Math.round((svgY + 120) / 10);
          const seed = Math.sin(rowId * 37.123 + colId * 79.891) * 54321.98;
          const rnd = seed - Math.floor(seed);

          if (isUnder) {
            const opacity = Math.min(1, 0.28 * envelope);
            if (opacity >= 0.02) disabledBuffer.push(px, py, opacity);
          } else {
            let colorIdx = 2;
            let baseOpacity = 0.16;
            if (rnd > 0.94) { colorIdx = 0; baseOpacity = 0.85; }
            else if (rnd > 0.84) { colorIdx = 1; baseOpacity = 0.65; }
            else if (rnd > 0.68) { colorIdx = 2; baseOpacity = 0.45; }
            else if (rnd > 0.48) { colorIdx = 3; baseOpacity = 0.28; }

            const opacity = Math.min(1, baseOpacity * envelope);
            if (opacity >= 0.02) activeBuffers[colorIdx].push(px, py, opacity);
          }
        }
      }

      // Fast batched drawing grouped by opacity buckets
      const drawGroup = (buf: number[], color: string) => {
        if (buf.length === 0) return;
        ctx.fillStyle = color;
        const buckets: Record<number, number[]> = {};
        for (let i = 0; i < buf.length; i += 3) {
          const k = Math.round(buf[i + 2] * 16);
          if (!buckets[k]) buckets[k] = [];
          buckets[k].push(buf[i], buf[i + 1]);
        }
        for (const k in buckets) {
          ctx.globalAlpha = Number(k) / 16;
          ctx.beginPath();
          const pts = buckets[k];
          for (let j = 0; j < pts.length; j += 2) {
            if (ctx.roundRect) ctx.roundRect(pts[j] - halfDot, pts[j + 1] - halfDot, dotSize, dotSize, rx);
            else ctx.rect(pts[j] - halfDot, pts[j + 1] - halfDot, dotSize, dotSize);
          }
          ctx.fill();
        }
      };

      for (let k = 0; k < 4; k++) drawGroup(activeBuffers[k], PIXEL_GRID_COLORS[k]);

      if (pathClip && disabledBuffer.length > 0) {
        ctx.save();
        ctx.scale(scaleX, scaleY);
        ctx.translate(0, 120);
        ctx.clip(pathClip);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        drawGroup(disabledBuffer, PIXEL_GRID_DISABLED_COLOR);
        ctx.restore();
      }

      setIsLoaded(true);
    };

    rafId = requestAnimationFrame(render);
    const observer = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(render);
    });
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [areaD]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full select-none pointer-events-none z-0 block transition-opacity duration-300 ease-out ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
