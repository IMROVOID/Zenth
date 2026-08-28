export const CRT_VERTEX_SHADER = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const CRT_FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uTime;
uniform float uMotion;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 fuv = gl_FragCoord.xy / uRes;
  vec2 uv = fuv;
  
  vec2 inb = step(vec2(0.0), uv) * step(uv, vec2(1.0));
  float inside = inb.x * inb.y;
  vec2 ed = min(uv, 1.0 - uv);
  inside *= smoothstep(0.0, 0.015, min(ed.x, ed.y));
  
  // Chromatic RGB subpixel aberration
  vec2 dir = uv - 0.5;
  float d2 = dot(dir, dir);
  vec2 ao = dir * (0.0010 + 0.006 * d2);
  
  vec3 col;
  col.r = texture2D(uTex, uv + ao).r;
  col.g = texture2D(uTex, uv).g;
  col.b = texture2D(uTex, uv - ao).b;
  
  // 1. Exact ThreeUI 3-pixel Aperture Grille Phosphor Mask
  float gx = gl_FragCoord.x * (6.2831853 / 3.0);
  vec3 grille = 0.84 + 0.16 * cos(gx + vec3(0.0, 2.094, 4.188));
  col *= grille;
  
  // 2. Fragment-Aligned Micro Scanlines (Zero Moire aliasing / zero black bands)
  float gy = gl_FragCoord.y * 3.14159265;
  float sl = 0.90 + 0.10 * sin(gy);
  col *= sl;
  col *= 1.14;
  
  // ThreeUI Diagonal Glass Sheen Reflection
  float sheen = smoothstep(0.55, 0.0, distance(uv, vec2(0.50, 0.15)));
  col += sheen * 0.025 * vec3(0.45, 1.0, 0.75);
  
  // ThreeUI Vignette Falloff
  float vig = smoothstep(0.98, 0.30, length((uv - 0.5) * vec2(1.05, 1.0)));
  col *= mix(0.55, 1.0, vig);
  
  // Analog phosphor micro noise
  col += (hash(fuv + fract(uTime * 0.37)) - 0.5) * 0.012;
  
  // Outside frame room spill
  float spill = smoothstep(0.85, 0.18, length(fuv - 0.5)) * 0.04;
  vec3 room = vec3(0.005, 0.015, 0.01) + vec3(0.0, spill * 0.5, spill * 0.35);
  col = mix(room, col, inside);
  
  gl_FragColor = vec4(col, 1.0);
}
`;
