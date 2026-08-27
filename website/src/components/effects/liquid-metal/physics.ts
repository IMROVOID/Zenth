import { RippleSlot } from './types';
import { DEFAULT_R } from './constants';

export function calcLocalPt(
  clientX: number,
  clientY: number,
  container: HTMLElement
): [number, number] {
  const b = container.getBoundingClientRect();
  return [
    (clientX - (b.left + b.width / 2)) / b.height,
    (clientY - (b.top + b.height / 2)) / b.height,
  ];
}

export function easeHover(hover: number, target: number, dt: number): number {
  const k = target > hover ? 1 - Math.pow(0.0012, dt) : 1 - Math.pow(0.00012, dt);
  let next = hover + (target - hover) * k;
  if (Math.abs(target - next) < 0.0008) next = target;
  return next;
}

export function easePress(press: number, target: number, dt: number): number {
  const pk = target > press ? 1 - Math.pow(1e-9, dt) : 1 - Math.pow(0.004, dt);
  let next = press + (target - press) * pk;
  if (Math.abs(target - next) < 0.002) next = target;
  return next;
}

export function updateRipples(
  slots: RippleSlot[],
  arr: Float32Array,
  clock: number
): boolean {
  for (let i = 0; i < slots.length; i++) {
    const r = slots[i];
    if (r.on && clock - r.t > 4) r.on = 0;
    arr[i * 4] = r.x;
    arr[i * 4 + 1] = r.y;
    arr[i * 4 + 2] = r.t;
    arr[i * 4 + 3] = r.on;
  }
  return slots.some((r) => r.on);
}

export function updatePointerTrail(
  ptr: { x: number; y: number },
  ptrS: { x: number; y: number },
  ptrSpeed: number,
  dt: number
): number {
  const lag = 1 - Math.pow(DEFAULT_R.ptrLag, dt);
  const dx = (ptr.x - ptrS.x) * lag;
  const dy = (ptr.y - ptrS.y) * lag;
  ptrS.x += dx;
  ptrS.y += dy;
  const inst = Math.min(
    Math.hypot(dx, dy) / Math.max(dt, 1e-3) / DEFAULT_R.ptrVref,
    1
  );
  return ptrSpeed + (inst - ptrSpeed) * (1 - Math.pow(inst > ptrSpeed ? 0.001 : 0.02, dt));
}
