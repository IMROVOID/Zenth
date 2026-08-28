export const VS_SOURCE = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const FS_SOURCE = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_is_top;

float hash(float n) { return fract(sin(n) * 753.5453123); }

float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(hash(i), hash(i + 1.0), f);
}

vec2 sdLine(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return vec2(length(pa - ba * h), h);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = uv * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float isTop = u_is_top;

  // Broad border emitter bar coordinates across the card width
  float edgeY = isTop ? -1.0 : 1.0;
  vec2 barA = vec2(-0.85, edgeY);
  vec2 barB = vec2(0.85, edgeY);
  vec2 barCenter = vec2(0.0, edgeY);

  // 1. Horizontal emitter border filament distance
  vec2 lBar = sdLine(uv, barA, barB);
  float barCenterDist = abs(uv.x);
  float barEnv = smoothstep(0.92, 0.10, barCenterDist);

  // Physical high-intensity incandescent core right on the border boundary
  float borderCore = (0.055 / (lBar.x + 0.005) + exp(-lBar.x * 16.0) * 1.6) * barEnv;

  // 2. Wide-angle volumetric matrix-field light ray dispersion outward from border
  float yDir = isTop ? 1.0 : -1.0;
  vec2 dirCenter   = normalize(vec2(0.0, yDir * 1.0));
  vec2 dirMidLeft  = normalize(vec2(-0.45, yDir * 0.9));
  vec2 dirMidRight = normalize(vec2(0.45, yDir * 0.9));
  vec2 dirFarLeft  = normalize(vec2(-0.85, yDir * 0.65));
  vec2 dirFarRight = normalize(vec2(0.85, yDir * 0.65));

  vec2 lCenter = sdLine(uv, barCenter, barCenter + dirCenter * 3.0);
  vec2 lMidL   = sdLine(uv, barA * 0.45, barA * 0.45 + dirMidLeft * 3.0);
  vec2 lMidR   = sdLine(uv, barB * 0.45, barB * 0.45 + dirMidRight * 3.0);
  vec2 lFarL   = sdLine(uv, barA * 0.85, barA * 0.85 + dirFarLeft * 2.5);
  vec2 lFarR   = sdLine(uv, barB * 0.85, barB * 0.85 + dirFarRight * 2.5);

  float intensity = 0.014;
  float rays = (intensity * 1.4) / (lCenter.x + 0.004) +
               intensity / (lMidL.x + 0.005) +
               intensity / (lMidR.x + 0.005) +
               (intensity * 0.7) / (lFarL.x + 0.007) +
               (intensity * 0.7) / (lFarR.x + 0.007);

  // Traveling pulses across rays
  float pulse0 = smoothstep(0.18, 0.0, abs(lCenter.y - fract(u_time * 0.35))) * 0.04 / (lCenter.x + 0.004);
  float pulse1 = smoothstep(0.18, 0.0, abs(lMidL.y - fract(u_time * 0.42 + 0.2))) * 0.03 / (lMidL.x + 0.005);
  float pulse2 = smoothstep(0.18, 0.0, abs(lMidR.y - fract(u_time * 0.38 + 0.5))) * 0.03 / (lMidR.x + 0.005);
  rays += pulse0 + pulse1 + pulse2;

  // Combine intense border core + volumetric rays
  float totalGlow = borderCore * 1.5 + rays;

  // Luminous physical colors: deep teal -> neon emerald -> radiant mint -> pure incandescent core
  vec3 colDeep = vec3(0.04, 0.38, 0.22);
  vec3 colEmerald = vec3(0.18, 0.88, 0.49);
  vec3 colMint = vec3(0.47, 1.0, 0.72);
  vec3 colCoreWhite = vec3(0.95, 1.0, 0.98);

  vec3 finalColor = mix(colDeep, colEmerald, smoothstep(0.0, 0.8, totalGlow));
  finalColor = mix(finalColor, colMint, smoothstep(0.8, 2.4, totalGlow));
  finalColor = mix(finalColor, colCoreWhite, smoothstep(2.4, 5.0, totalGlow));
  finalColor *= totalGlow;

  // Breathing modulation
  float distToCenter = length(uv - barCenter);
  finalColor *= 0.92 + 0.08 * sin(u_time * 1.8 - distToCenter * 4.0);

  // Tighter, natural inverse falloff preventing distant spill
  float vignette = 1.0 - smoothstep(0.2, 1.5, distToCenter);
  finalColor *= vignette;

  // Authentic Dynamic Photonic Noise Overlay (Film Grain Shimmer)
  vec2 noiseCoord = gl_FragCoord.xy + vec2(sin(u_time * 18.0) * 120.0, cos(u_time * 14.0) * 120.0);
  float n = fract(sin(dot(noiseCoord, vec2(12.9898, 78.233))) * 43758.5453);
  finalColor += (n - 0.5) * 0.16 * smoothstep(0.02, 0.9, totalGlow);

  float alpha = clamp(length(finalColor) * 1.3, 0.0, 1.0);
  gl_FragColor = vec4(finalColor, alpha);
}
`;
