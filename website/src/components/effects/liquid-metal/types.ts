export interface RenderTarget {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
  w: number;
  h: number;
}

export interface RenderTargets {
  core: RenderTarget;
  rim: RenderTarget;
  s1: RenderTarget;
  s2: RenderTarget;
  a: RenderTarget;
  b: RenderTarget;
}

export interface ProgramInfo {
  p: WebGLProgram;
  u: Record<string, WebGLUniformLocation | null>;
}

export interface ShaderPrograms {
  scene: ProgramInfo | null;
  rim: ProgramInfo;
  down: ProgramInfo;
  blur: ProgramInfo;
  comp: ProgramInfo;
}

export interface MetalParams {
  valFreq: number;
  valAmp: number;
  dens: number;
  densVar: number;
  densFreq: number;
  wobAmp: number;
  wobFreq: number;
  lift: number;
  refract: number;
  edge: number;
  width: number;
  disp: number;
  skew: number;
  fineAmp: number;
  fineFreq: number;
  gamma: number;
  gain: number;
  octGain: number;
  litLo: number;
  litHi: number;
  dim: number;
}

export interface RimParams {
  base: number;
  hot: number;
  chromA: number;
  chromS: number;
  speed: number;
  top: number;
  press: number;
  ripple: number;
}

export interface CompositeParams {
  glow: number;
  glowR: number;
  glowIn: number;
  occl: number;
  soften: number;
  punch: number;
}

export interface DisturbanceParams {
  speed: number;
  width: number;
  decay: number;
  amp: number;
  facet: number;
  lobes: number;
  sharp: number;
  emit: number;
  ptrRad: number;
  ptrAmp: number;
  ptrFast: number;
  ptrRim: number;
  ptrLag: number;
  ptrVref: number;
}

export interface RippleSlot {
  x: number;
  y: number;
  t: number;
  on: number;
}
