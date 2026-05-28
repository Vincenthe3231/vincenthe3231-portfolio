precision highp float;

uniform float uTime;
uniform vec3  uColor;      // accent teal-cyan
uniform float uOpacity;    // global fade in/out

varying vec2  vUv;
varying vec3  vNormalWorld;
varying vec3  vViewDir;
varying float vDepth;

// Pseudo-random hash
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Cheap 2D noise (1 octave)
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),           hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  // ── Fresnel ──────────────────────────────────────────────────────────────
  float nDotV  = max(dot(vNormalWorld, vViewDir), 0.0);
  float fresnel = pow(1.0 - nDotV, 5.0);     // classic Schlick approx

  // ── Holographic gradient: darker center, brighter edge (fresnel) + vertical ─
  float gradY   = smoothstep(0.05, 0.95, vUv.y);
  vec3  baseCol = mix(uColor * 0.08, uColor * 0.42, gradY);

  // ── Scanline mask ─────────────────────────────────────────────────────────
  // Thin dark lines scrolling slowly — barely perceptible
  float scanY   = fract(vUv.y * 48.0 - uTime * 0.18);
  float scanMask = 1.0 - step(0.045, scanY) * 0.06;

  // ── Noise-driven alpha breakup (very subtle) ───────────────────────────
  float n       = noise(vUv * 5.0 + vec2(uTime * 0.04, -uTime * 0.02));
  float noiseMod = n * 0.03; // barely shifts opacity

  // ── Emissive pulse ────────────────────────────────────────────────────────
  float pulse   = sin(uTime * 0.65) * 0.07 + 0.93;

  // ── Edge glow (Fresnel-driven emissive) ───────────────────────────────────
  vec3 edgeGlow  = uColor * fresnel * 0.7;

  // ── Chromatic fringe on edges (fake — shift red/blue slightly) ────────────
  float edgeR   = pow(1.0 - nDotV, 3.5) * 0.018;
  float edgeB   = pow(1.0 - nDotV, 3.5) * 0.012;

  // ── Combine ───────────────────────────────────────────────────────────────
  vec3 color    = (baseCol + edgeGlow) * scanMask * pulse;
  color.r      += edgeR;
  color.b      += edgeB;

  // ── Alpha: translucent body, opaque edges ─────────────────────────────────
  float alpha   = 0.36 + fresnel * 0.36 + noiseMod;
  alpha         = clamp(alpha * uOpacity, 0.0, 0.92);

  // Discard near-transparent fragments (performance, avoids z-sort artifacts)
  if (alpha < 0.01) discard;

  gl_FragColor  = vec4(color, alpha);
}
