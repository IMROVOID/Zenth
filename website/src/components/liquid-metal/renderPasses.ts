import { ProgramInfo, RenderTarget, DisturbanceParams, CompositeParams } from './types';
import { GLOW_TEX } from './constants';
import { drawTo } from './webglUtils';

export function runScenePass(
  gl: WebGL2RenderingContext,
  p: ProgramInfo,
  target: RenderTarget,
  w: number,
  h: number,
  cx: number,
  cy: number,
  bw: number,
  bh: number,
  clock: number,
  hover: number,
  press: number,
  ripArr: Float32Array,
  r: DisturbanceParams,
  ptrS: { x: number; y: number },
  ptrAmt: number,
  ptrSpeed: number,
  uArr: Float32Array
) {
  gl.useProgram(p.p);
  gl.uniform2f(p.u.uC, cx, cy); gl.uniform2f(p.u.uHalf, bw / 2, bh / 2);
  gl.uniform1f(p.u.uT, clock); gl.uniform1f(p.u.uHover, hover); gl.uniform1f(p.u.uPress, press);
  gl.uniform4fv(p.u.uRip, ripArr);
  gl.uniform4f(p.u.uRipK, r.speed, r.width, r.decay, r.amp);
  gl.uniform4f(p.u.uRipK2, r.facet, r.lobes, r.sharp, r.emit);
  gl.uniform4f(p.u.uPtr, ptrS.x, ptrS.y, ptrAmt, ptrSpeed);
  gl.uniform4f(p.u.uPtrK, r.ptrRad, r.ptrAmp, r.ptrFast, r.ptrRim);
  gl.uniform1fv(p.u.uP, uArr);
  drawTo(gl, target, w, h);
}

export function runRimPass(
  gl: WebGL2RenderingContext,
  p: ProgramInfo,
  target: RenderTarget,
  w: number,
  h: number,
  cx: number,
  cy: number,
  bw: number,
  bh: number,
  clock: number,
  press: number,
  ripArr: Float32Array,
  r: DisturbanceParams,
  ptrS: { x: number; y: number },
  ptrAmt: number,
  ptrSpeed: number,
  eArr: Float32Array
) {
  gl.useProgram(p.p);
  gl.uniform2f(p.u.uC, cx, cy); gl.uniform2f(p.u.uHalf, bw / 2, bh / 2);
  gl.uniform1f(p.u.uT, clock); gl.uniform1f(p.u.uPress, press);
  gl.uniform1f(p.u.uBw, Math.max(1.5, 3.2 * (bh / 516)));
  gl.uniform4fv(p.u.uRip, ripArr);
  gl.uniform4f(p.u.uRipK, r.speed, r.width, r.decay, r.amp);
  gl.uniform4f(p.u.uRipK2, r.facet, r.lobes, r.sharp, r.emit);
  gl.uniform4f(p.u.uPtr, ptrS.x, ptrS.y, ptrAmt, ptrSpeed);
  gl.uniform4f(p.u.uPtrK, r.ptrRad, r.ptrAmp, r.ptrFast, r.ptrRim);
  gl.uniform1fv(p.u.uE, eArr);
  drawTo(gl, target, w, h);
}

export function runSoftenPass(
  gl: WebGL2RenderingContext,
  down: ProgramInfo,
  blur: ProgramInfo,
  core: RenderTarget,
  s1: RenderTarget,
  s2: RenderTarget,
  w: number,
  h: number,
  bh: number,
  soften: number
) {
  gl.useProgram(down.p);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, core.tex);
  gl.uniform1i(down.u.uTex, 0); gl.uniform1f(down.u.uAdd, 0);
  gl.uniform2f(down.u.uDstTexel, 1 / s1.w, 1 / s1.h);
  gl.uniform2f(down.u.uSrcTexel, 1 / w, 1 / h);
  drawTo(gl, s1, w, h);

  gl.useProgram(blur.p);
  gl.uniform1i(blur.u.uTex, 0); gl.uniform2f(blur.u.uTexel, 1 / s1.w, 1 / s1.h);
  const sigTex = soften * (bh * 0.5) * 0.95;
  if (sigTex > 0.1) {
    const iters = Math.min(4, Math.max(1, Math.ceil(sigTex / 3.0)));
    gl.uniform1f(blur.u.uR, sigTex / Math.sqrt(iters) / 1.95);
    for (let i = 0; i < iters; i++) {
      gl.bindTexture(gl.TEXTURE_2D, s1.tex); gl.uniform2f(blur.u.uDir, 1, 0); drawTo(gl, s2, w, h);
      gl.bindTexture(gl.TEXTURE_2D, s2.tex); gl.uniform2f(blur.u.uDir, 0, 1); drawTo(gl, s1, w, h);
    }
  }
}

export function runBloomPass(
  gl: WebGL2RenderingContext,
  down: ProgramInfo,
  blur: ProgramInfo,
  s1: RenderTarget,
  rim: RenderTarget,
  a: RenderTarget,
  b: RenderTarget,
  w: number,
  h: number,
  bh: number,
  downScale: number,
  glowR: number
) {
  gl.useProgram(down.p);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, s1.tex);
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, rim.tex);
  gl.uniform1i(down.u.uTex, 0); gl.uniform1i(down.u.uTex2, 1); gl.uniform1f(down.u.uAdd, 1);
  gl.uniform2f(down.u.uDstTexel, 1 / a.w, 1 / a.h);
  gl.uniform2f(down.u.uSrcTexel, 1 / s1.w, 1 / s1.h);
  drawTo(gl, a, w, h);

  gl.useProgram(blur.p);
  gl.activeTexture(gl.TEXTURE0);
  gl.uniform1i(blur.u.uTex, 0); gl.uniform2f(blur.u.uTexel, 1 / a.w, 1 / a.h);
  const rs = (glowR * (bh / downScale)) / GLOW_TEX;
  for (const r of [1.0, 2.3, 5.2, 9.0].map((v) => v * rs)) {
    gl.uniform1f(blur.u.uR, r);
    gl.bindTexture(gl.TEXTURE_2D, a.tex); gl.uniform2f(blur.u.uDir, 1, 0); drawTo(gl, b, w, h);
    gl.bindTexture(gl.TEXTURE_2D, b.tex); gl.uniform2f(blur.u.uDir, 0, 1); drawTo(gl, a, w, h);
  }
}

export function runCompPass(
  gl: WebGL2RenderingContext,
  p: ProgramInfo,
  s1: RenderTarget,
  rim: RenderTarget,
  a: RenderTarget,
  w: number,
  h: number,
  cx: number,
  cy: number,
  bw: number,
  bh: number,
  clock: number,
  ripArr: Float32Array,
  r: DisturbanceParams,
  c: CompositeParams,
  dim: number
) {
  gl.useProgram(p.p);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, s1.tex); gl.uniform1i(p.u.uSoft, 0);
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, rim.tex); gl.uniform1i(p.u.uRim, 1);
  gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, a.tex); gl.uniform1i(p.u.uGlow, 2);
  gl.uniform2f(p.u.uRes, w, h); gl.uniform2f(p.u.uC, cx, cy); gl.uniform2f(p.u.uHalf, bw / 2, bh / 2);
  gl.uniform1f(p.u.uT, clock); gl.uniform4fv(p.u.uRip, ripArr);
  gl.uniform4f(p.u.uRipK, r.speed, r.width, r.decay, r.amp);
  gl.uniform4f(p.u.uRipK2, r.facet, r.lobes, r.sharp, r.emit);
  gl.uniform1f(p.u.uGlowGain, c.glow); gl.uniform1f(p.u.uGlowIn, c.glowIn);
  gl.uniform1f(p.u.uOccl, c.occl); gl.uniform1f(p.u.uDim, dim); gl.uniform1f(p.u.uPunch, c.punch);
  drawTo(gl, null, w, h);
}
