precision highp float;

uniform float uTime;
uniform float uScroll;
uniform float uRibbonIndex;

varying vec2 vUv;
varying float vDisplacement;

// Inline noise for vertex shader (can't share includes in raw GLSL)
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm2(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  float f = 1.0;
  for (int i = 0; i < 3; i++) {
    v += a * noise2(p * f);
    f *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vUv = uv;

  vec3 pos = position;

  // Curtain wave displacement based on noise
  float timeOffset = uRibbonIndex * 3.7;
  float displacement = fbm2(vec2(pos.y * 0.08 + uTime * 0.03 + timeOffset, uRibbonIndex * 2.0)) * 3.5;
  displacement += sin(pos.y * 0.15 + uTime * 0.08 + timeOffset) * 1.5;

  pos.x += displacement;

  // Gentle Z sway for depth
  pos.z += sin(pos.y * 0.1 + uTime * 0.06 + uRibbonIndex * 1.5) * 0.8;

  // Scroll shifts ribbon vertically
  pos.y -= uScroll * 3.0;

  vDisplacement = displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
