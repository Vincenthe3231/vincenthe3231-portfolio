precision highp float;

uniform float uTime;
uniform float uScroll;
uniform vec2 uMouse;
uniform float uIntensity;
uniform int uOctaves;

varying vec2 vUv;

// Simplex-style hash
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

// Gradient noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Fractal Brownian motion
float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 4; i++) {
    if (i >= octaves) break;
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Domain warping for aurora curtain effect
float warpedFbm(vec2 p, int octaves) {
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0), octaves),
    fbm(p + vec2(5.2, 1.3), octaves)
  );
  vec2 r = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2), octaves),
    fbm(p + 4.0 * q + vec2(8.3, 2.8), octaves)
  );
  return fbm(p + 4.0 * r, octaves);
}

// Aurora color palette: green → teal → cyan → violet → magenta
vec3 auroraColor(float t) {
  // 5-stop gradient
  vec3 c0 = vec3(0.18, 0.65, 0.30);  // aurora green
  vec3 c1 = vec3(0.20, 0.72, 0.58);  // aurora teal
  vec3 c2 = vec3(0.00, 0.90, 1.00);  // aurora cyan (accent)
  vec3 c3 = vec3(0.50, 0.38, 0.85);  // aurora violet
  vec3 c4 = vec3(0.78, 0.30, 0.65);  // aurora magenta

  t = clamp(t, 0.0, 1.0);
  if (t < 0.25) return mix(c0, c1, t / 0.25);
  if (t < 0.5) return mix(c1, c2, (t - 0.25) / 0.25);
  if (t < 0.75) return mix(c2, c3, (t - 0.5) / 0.25);
  return mix(c3, c4, (t - 0.75) / 0.25);
}

void main() {
  vec2 uv = vUv;

  // Stretch horizontally for curtain look
  vec2 p = vec2(uv.x * 0.3, uv.y * 1.4);

  // Time-based drift
  p.y += uTime * 0.04;
  p.x += uTime * 0.01;

  // Mouse wind effect (subtle)
  p += uMouse * 0.03;

  // Scroll shifts aurora vertically
  p.y -= uScroll * 0.5;

  // Main aurora pattern via domain-warped fbm
  float pattern = warpedFbm(p, uOctaves);

  // Curtain fold modulation
  float curtain = sin(uv.x * 6.0 + pattern * 3.0 + uTime * 0.15) * 0.5 + 0.5;
  pattern = mix(pattern, curtain, 0.35);

  // Vertical falloff — aurora strongest in upper portion
  float verticalMask = smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.5, uv.y);

  // Color from pattern
  float colorT = pattern * 0.5 + 0.25 + sin(uTime * 0.08) * 0.15;
  vec3 color = auroraColor(colorT);

  // Final alpha: pattern strength × vertical mask × user intensity
  float alpha = smoothstep(-0.2, 0.6, pattern) * verticalMask * uIntensity;

  // Add subtle glow bloom at bright spots
  alpha += pow(max(pattern, 0.0), 3.0) * verticalMask * uIntensity * 0.3;

  // Clamp and apply
  alpha = clamp(alpha, 0.0, 0.45);

  gl_FragColor = vec4(color, alpha);
}
