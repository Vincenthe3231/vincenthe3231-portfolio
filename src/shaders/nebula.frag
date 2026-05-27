precision highp float;

uniform float uTime;
uniform float uOpacity;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uSeed;

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

  // Radial falloff so edges fade smoothly
  float radial = 1.0 - smoothstep(0.0, 0.5, length(uv));

  // FBM-modulated cloud
  vec2 p = uv * 2.5 + vec2(uSeed * 7.3, uSeed * 2.1);
  p += vec2(uTime * 0.012, uTime * 0.008);
  float n = fbm(p);
  float density = smoothstep(-0.1, 0.5, n);

  vec3 color = mix(uColorA, uColorB, density);

  float alpha = density * radial * uOpacity;
  // Bright bloom in densest spots
  alpha += pow(density, 3.0) * radial * uOpacity * 0.4;

  gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.55));
}
