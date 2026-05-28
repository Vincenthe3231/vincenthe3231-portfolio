precision highp float;

uniform vec3  uPaperColor;
uniform vec3  uShadowColor;
uniform float uOpacity;
uniform float uAngularVelocity; // rad/s — sharpens crease when turning fast
uniform float uSubsurface;      // 0..1 — warm light bleed-through at midturn

varying vec2  vUv;
varying float vBend;
varying vec3  vNormalView;

// ── Hashing ────────────────────────────────────────────────────────────────
float hash21(vec2 p) {
  p  = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

// ── Two-layer angled fiber crosshatch ─────────────────────────────────────
// Layer 1: near-horizontal fibers at high frequency
// Layer 2: diagonal fibers at ~60° — gives classic laid-paper feel
float fiber(vec2 uv) {
  float f1 = hash21(vec2(uv.x * 640.0, floor(uv.y * 290.0)));
  vec2 rot = vec2(uv.x * 0.866 - uv.y * 0.5, uv.x * 0.5 + uv.y * 0.866);
  float f2 = hash21(vec2(rot.x * 590.0, floor(rot.y * 270.0)));
  return f1 * 0.58 + f2 * 0.42;
}

void main() {
  vec3 col = uPaperColor;

  // ── Paper fiber grain ──────────────────────────────────────────────────
  float g = fiber(vUv);
  col -= (g - 0.5) * 0.042;

  // ── Edge roughness — slightly noisy free edge ──────────────────────────
  float edgeNoise = hash21(vUv * vec2(1.0, 52.0)) * 0.038;
  float edgeShade = smoothstep(0.87 + edgeNoise, 1.0, vUv.x) * vBend * 0.42;
  col = mix(col, uShadowColor, edgeShade);

  // ── Crease shadow — sharpens with angular velocity ────────────────────
  float velFactor = clamp(abs(uAngularVelocity) / 8.0, 0.0, 1.0);
  float creaseSoft = mix(0.16, 0.28, velFactor);
  float midShade   = sin(vBend * 3.14159) * creaseSoft;
  col = mix(col, uShadowColor, midShade);

  // ── Subsurface warmth — amber bleed at midturn peak ───────────────────
  float sst = uSubsurface * sin(vBend * 3.14159) * 0.055;
  col += vec3(0.20, 0.13, 0.06) * sst;

  // ── Lambert with view-space normal ────────────────────────────────────
  float ndotl = clamp(vNormalView.z, 0.0, 1.0);
  col *= mix(0.68, 1.0, ndotl);

  gl_FragColor = vec4(col, uOpacity);
}
