'use client';

import { useEffect, useRef } from 'react';
import { LiquidMetalRenderer } from './renderer';
import { RippleSlot } from './types';
import {
  calcLocalPt,
  easeHover,
  easePress,
  updateRipples,
  updatePointerTrail,
} from './physics';

export function useLiquidMetal(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLElement | null>,
  onReady?: () => void
) {
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const firstFrameRef = useRef(false);

  const clockRef = useRef(0);
  const lastRef = useRef(performance.now());
  const hoverRef = useRef(0);
  const hoverTargetRef = useRef(0);
  const pressRef = useRef(0);
  const pressTargetRef = useRef(0);
  const ptrRef = useRef({ x: 0, y: 0 });
  const ptrSRef = useRef({ x: 0, y: 0 });
  const ptrAmtRef = useRef(0);
  const ptrSpeedRef = useRef(0);
  const ripSlotsRef = useRef<RippleSlot[]>([
    { x: 0, y: 0, t: -99, on: 0 },
    { x: 0, y: 0, t: -99, on: 0 },
    { x: 0, y: 0, t: -99, on: 0 },
  ]);
  const ripArrRef = useRef(new Float32Array(12));
  const ripNextRef = useRef(0);
  const onRef = useRef({ over: false, press: false, focus: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: LiquidMetalRenderer;
    try {
      renderer = new LiquidMetalRenderer(canvas);
    } catch {
      return;
    }

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animId = 0;
    let drawnSig: string | null = null;

    const resize = () => {
      const r = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(2, Math.round(r.width * dpr));
      const h = Math.max(2, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      renderer.resize(r.width, r.height, dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const sync = () => {
      const { over, press, focus } = onRef.current;
      hoverTargetRef.current = over || press || focus ? 1 : 0;
      pressTargetRef.current = press ? 1 : 0;
    };

    const addRipple = (x: number, y: number) => {
      const r = ripSlotsRef.current[ripNextRef.current];
      ripNextRef.current = (ripNextRef.current + 1) % ripSlotsRef.current.length;
      r.x = x;
      r.y = y;
      r.t = clockRef.current;
      r.on = 1;
    };

    const onPointerEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      renderer.ensureScene();
      const [x, y] = calcLocalPt(e.clientX, e.clientY, container);
      ptrRef.current = { x, y };
      ptrSRef.current = { x, y };
      ptrSpeedRef.current = 0;
      onRef.current.over = true;
      sync();
    };

    const onPointerDown = (e: PointerEvent) => {
      renderer.ensureScene();
      const [x, y] = calcLocalPt(e.clientX, e.clientY, container);
      ptrRef.current = { x, y };
      onRef.current.press = true;
      sync();
      addRipple(x, y);
    };

    const onKey = (e: KeyboardEvent, isDown: boolean) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (isDown) renderer.ensureScene();
      onRef.current.press = isDown;
      sync();
      if (isDown) addRipple(0, 0);
    };

    const cListeners: [string, EventListener][] = [
      ['pointerenter', onPointerEnter as EventListener],
      ['pointerleave', ((e: PointerEvent) => { if (e.pointerType === 'mouse') { onRef.current.over = false; sync(); } }) as EventListener],
      ['pointerdown', onPointerDown as EventListener],
      ['focus', () => { onRef.current.focus = true; sync(); }],
      ['blur', () => { onRef.current.focus = false; sync(); }],
      ['keydown', ((e: KeyboardEvent) => onKey(e, true)) as EventListener],
      ['keyup', ((e: KeyboardEvent) => onKey(e, false)) as EventListener],
    ];
    cListeners.forEach(([evt, fn]) => container.addEventListener(evt, fn));

    const onWindowMove = (e: PointerEvent) => {
      if (!onRef.current.over && !onRef.current.press) return;
      const [x, y] = calcLocalPt(e.clientX, e.clientY, container);
      ptrRef.current = { x, y };
    };
    const onWindowUp = () => { onRef.current.press = false; sync(); };

    window.addEventListener('pointermove', onWindowMove, { passive: true });
    window.addEventListener('pointerup', onWindowUp);
    window.addEventListener('pointercancel', onWindowUp);

    const frame = (now: number) => {
      const dt = Math.min((now - lastRef.current) / 1000, 1 / 20);
      lastRef.current = now;
      if (!calm) clockRef.current += dt;

      hoverRef.current = easeHover(hoverRef.current, hoverTargetRef.current, dt);
      pressRef.current = easePress(pressRef.current, pressTargetRef.current, dt);
      const ripLive = updateRipples(ripSlotsRef.current, ripArrRef.current, clockRef.current);
      ptrSpeedRef.current = updatePointerTrail(ptrRef.current, ptrSRef.current, ptrSpeedRef.current, dt);

      const wantWell = onRef.current.over || onRef.current.press ? 1 : 0;
      ptrAmtRef.current += (wantWell - ptrAmtRef.current) * (1 - Math.pow(0.004, dt));
      if (Math.abs(wantWell - ptrAmtRef.current) < 0.002) ptrAmtRef.current = wantWell;

      const sig = calm && !ripLive && ptrAmtRef.current < 0.002
        ? `${hoverRef.current}|${pressRef.current}|${renderer.W}|${renderer.H}`
        : null;

      if (sig === null || sig !== drawnSig) {
        drawnSig = sig;
        renderer.render({
          clock: clockRef.current,
          hover: hoverRef.current,
          press: pressRef.current,
          ripArr: ripArrRef.current,
          ptrS: ptrSRef.current,
          ptrAmt: ptrAmtRef.current,
          ptrSpeed: ptrSpeedRef.current,
        });

        if (!firstFrameRef.current) {
          firstFrameRef.current = true;
          onReadyRef.current?.();
        }
      }
      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      cListeners.forEach(([evt, fn]) => container.removeEventListener(evt, fn));
      window.removeEventListener('pointermove', onWindowMove);
      window.removeEventListener('pointerup', onWindowUp);
      window.removeEventListener('pointercancel', onWindowUp);
      renderer.destroy();
    };
  }, [canvasRef, containerRef]);
}
