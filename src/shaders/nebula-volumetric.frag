precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform int   uArchetype;     // 0 pillar, 1 ring, 2 supernova, 3 ionStorm, 4 molecular, 5 binary, 6 protoplanetary, 7 darkNebula
uniform vec3  uColorPrimary;
uniform vec3  uColorSecondary;
uniform float uTurbulence;
uniform float uHoverIntensity; // 0..1
uniform int   uOctaves;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float nse(vec2 p) {
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

float fbmN(vec2 p, int oct) {
  float v = 0.0;
  float a = 0.5;
  float f = 1.0;
  for (int i = 0; i < 5; i++) {
    if (i >= oct) break;
    v += a * nse(p * f);
    f *= 2.0;
    a *= 0.5;
  }
  return v;
}

// Domain-warped FBM
float warpFBM(vec2 p, int oct, float t) {
  vec2 q = vec2(fbmN(p + vec2(0.0, t * 0.05), oct),
                fbmN(p + vec2(5.2, 1.3 + t * 0.03), oct));
  vec2 r = vec2(fbmN(p + 4.0 * q + vec2(1.7, 9.2), oct),
                fbmN(p + 4.0 * q + vec2(8.3, 2.8), oct));
  return fbmN(p + 4.0 * r, oct);
}

float densityField(vec2 uv, vec2 c, float t, int oct, float turb) {
  vec2 p = (uv - c) * 2.5;
  float r = length(p);

  // pillar — vertical column with horizontal turbulence
  if (uArchetype == 0) {
    float column = exp(-pow(p.x * 1.6, 2.0)) * smoothstep(1.4, -0.2, p.y);
    float turbN = warpFBM(p * 1.5 + vec2(0.0, t * 0.15), oct, t) * (0.7 + turb);
    return clamp(column * (0.4 + turbN), 0.0, 1.0);
  }
  // ring — hollow circular shell
  if (uArchetype == 1) {
    float ring = smoothstep(0.32, 0.42, r) - smoothstep(0.5, 0.65, r);
    float swirl = warpFBM(p * 2.0 + vec2(sin(t * 0.2) * 0.3, cos(t * 0.2) * 0.3), oct, t);
    return clamp(ring * (0.5 + swirl * 0.6 + turb * 0.3), 0.0, 1.0);
  }
  // supernova — fragmented explosive arcs
  if (uArchetype == 2) {
    float ang = atan(p.y, p.x);
    float shock = pow(max(0.0, 1.0 - abs(r - 0.45) * 4.0), 2.5);
    float frag = pow(abs(nse(vec2(ang * 4.0, r * 6.0 + t * 0.1))), 1.5);
    float core = exp(-r * 4.0) * 1.2;
    float fil = warpFBM(p * 2.5 + vec2(t * 0.08, 0.0), oct, t);
    return clamp(core + shock * (0.5 + frag) + fil * 0.3 * turb, 0.0, 1.0);
  }
  // ionStorm — sharp blue streaks, chaotic
  if (uArchetype == 3) {
    vec2 q = p + vec2(sin(p.y * 6.0 + t) * 0.15, cos(p.x * 6.0 + t * 1.3) * 0.15);
    float streak = pow(abs(warpFBM(q * 4.0, oct, t)), 2.0);
    float core = exp(-length(p) * 2.5);
    return clamp(core * 0.7 + streak * (0.6 + turb * 0.5), 0.0, 1.0);
  }
  // molecular — dense fog, slow drift
  if (uArchetype == 4) {
    float fog = warpFBM(p * 1.2 + vec2(t * 0.05, t * 0.03), oct, t);
    float mask = exp(-r * 1.4);
    return clamp(mask * (0.4 + fog * 0.9), 0.0, 1.0);
  }
  // binary — twin cores with bridge
  if (uArchetype == 5) {
    vec2 a = p - vec2(-0.22, 0.0);
    vec2 b = p - vec2(0.22, 0.0);
    float c1 = exp(-dot(a, a) * 9.0);
    float c2 = exp(-dot(b, b) * 9.0);
    float bridge = exp(-pow(p.y * 6.0, 2.0)) * smoothstep(0.3, 0.0, abs(p.x));
    float swirl = warpFBM(p * 2.5 + vec2(t * 0.1, 0.0), oct, t) * 0.4 * turb;
    return clamp(c1 + c2 + bridge * 0.5 + swirl, 0.0, 1.0);
  }
  // protoplanetary — disk with central star
  if (uArchetype == 6) {
    float disk = exp(-pow(p.y * 3.5, 2.0)) * smoothstep(0.7, 0.0, abs(p.x)) * smoothstep(0.0, 0.15, abs(p.x));
    float star = exp(-r * 8.0) * 1.6;
    float dust = warpFBM(p * 3.0 + vec2(t * 0.08, 0.0), oct, t) * 0.3;
    return clamp(disk + star + dust * turb, 0.0, 1.0);
  }
  // darkNebula — heavy occlusion with rim glow
  // archetype 7
  float occluder = warpFBM(p * 1.4 + vec2(t * 0.04, 0.0), oct, t);
  float core = exp(-r * 1.8);
  float rim = smoothstep(0.55, 0.4, r) - smoothstep(0.4, 0.25, r);
  return clamp(core * (0.3 + occluder * 0.8) + rim * 0.3 * turb, 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  float t = uTime;

  float d = densityField(uv, vec2(0.5), t, uOctaves, uTurbulence);

  // Soft circular fade to mask the quad
  float radial = smoothstep(0.5, 0.05, length(uv - 0.5));
  d *= radial;

  // Color blend: primary at high density, secondary at low
  vec3 col = mix(uColorSecondary, uColorPrimary, pow(d, 0.6));

  // Hover brightening
  float hover = uHoverIntensity;
  col += uColorPrimary * 0.3 * hover * d;

  float alpha = d * (0.55 + hover * 0.35);

  // Subtle stellar sparkle within dense regions
  float sparkle = pow(max(0.0, nse(uv * 80.0 + t * 0.5)), 6.0) * d * 0.6;
  col += vec3(sparkle);

  gl_FragColor = vec4(col, alpha);
}
