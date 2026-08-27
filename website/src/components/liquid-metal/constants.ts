import { MetalParams, RimParams, CompositeParams, DisturbanceParams } from './types';

export const DEFAULT_P: MetalParams = {
  valFreq: 0.5,
  valAmp: 0.55,
  dens: 2.4,
  densVar: 2.2,
  densFreq: 0.32,
  wobAmp: 0.12,
  wobFreq: 1.6,
  lift: 0.05,
  refract: 0.18,
  edge: 0.04,
  width: 0.46,
  disp: 0.3,
  skew: 1.5,
  fineAmp: 0.0,
  fineFreq: 9.0,
  gamma: 1.0,
  gain: 1.9,
  octGain: 0.32,
  litLo: -0.26,
  litHi: 0.1,
  dim: 0.44,
};

export const P_KEYS = Object.keys(DEFAULT_P) as (keyof MetalParams)[];

export const DEFAULT_E: RimParams = {
  base: 0.40,
  hot: 0.82,
  chromA: 0.42,
  chromS: 0.03,
  speed: 0.07,
  top: 0.0,
  press: 0.85,
  ripple: 1.6,
};

export const E_KEYS = Object.keys(DEFAULT_E) as (keyof RimParams)[];

export const DEFAULT_C: CompositeParams = {
  glow: 1.95,
  glowR: 1.3,
  glowIn: 0.3,
  occl: 0.0,
  soften: 0.24,
  punch: 1.5,
};

export const DEFAULT_R: DisturbanceParams = {
  speed: 1.85,
  width: 0.2,
  decay: 1.35,
  amp: 1.35,
  facet: 0.18,
  lobes: 6.0,
  sharp: 1.15,
  emit: 0.45,
  ptrRad: 0.55,
  ptrAmp: 0.32,
  ptrFast: 0.4,
  ptrRim: 0.8,
  ptrLag: 0.0016,
  ptrVref: 4.5,
};

export const GLOW_TEX = 129;
