precision highp float;

uniform float uTime;
uniform float uOpacity;

varying vec2 vUv;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

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

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv - 0.5;

  float r = length(uv);
  float ang = atan(uv.y, uv.x);

  // Log spiral pattern
  float spiral = sin(ang * 2.0 + log(r + 0.02) * 4.5 + uTime * 0.05) * 0.5 + 0.5;

  // FBM detail
  vec2 p = vec2(r * 4.0, ang);
  float n = fbm(p * 2.0);

  // Radial falloff
  float radial = 1.0 - smoothstep(0.0, 0.5, r);

  float density = spiral * n * radial;

  // Magenta/violet tint
  vec3 c1 = vec3(0.45, 0.18, 0.55);
  vec3 c2 = vec3(0.70, 0.28, 0.65);
  vec3 color = mix(c1, c2, density);

  // Core glow
  float core = pow(1.0 - smoothstep(0.0, 0.15, r), 2.0);
  color += vec3(0.6, 0.4, 0.7) * core * 0.5;

  float alpha = density * uOpacity + core * uOpacity * 0.4;

  gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.12));
}
