import { ProgramInfo, RenderTarget } from './types';

export function createProgram(
  gl: WebGL2RenderingContext,
  vs: string,
  fs: string
): ProgramInfo {
  const p = gl.createProgram()!;
  const vShader = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vShader, vs);
  gl.compileShader(vShader);

  const fShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fShader, fs);
  gl.compileShader(fShader);

  gl.attachShader(p, vShader);
  gl.attachShader(p, fShader);
  gl.bindAttribLocation(p, 0, 'position');
  gl.linkProgram(p);
  gl.deleteShader(vShader);
  gl.deleteShader(fShader);

  const u: Record<string, WebGLUniformLocation | null> = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i);
    if (info) u[info.name.replace('[0]', '')] = gl.getUniformLocation(p, info.name);
  }
  return { p, u };
}

export function makeTarget(gl: WebGL2RenderingContext): RenderTarget {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  return { tex, fbo, w: 0, h: 0 };
}

export function sizeTarget(
  gl: WebGL2RenderingContext,
  t: RenderTarget,
  w: number,
  h: number,
  hasFloat: boolean
) {
  if (t.w === w && t.h === h) return;
  t.w = w;
  t.h = h;
  gl.bindTexture(gl.TEXTURE_2D, t.tex);
  if (hasFloat) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
  } else {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }
}

export function drawTo(
  gl: WebGL2RenderingContext,
  t: RenderTarget | null,
  w: number,
  h: number
) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, t ? t.fbo : null);
  gl.viewport(0, 0, t ? t.w : w, t ? t.h : h);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

export function deleteTarget(gl: WebGL2RenderingContext, t: RenderTarget) {
  gl.deleteTexture(t.tex);
  gl.deleteFramebuffer(t.fbo);
}
