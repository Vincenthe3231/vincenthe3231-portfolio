precision highp float;

uniform float uTime;
uniform float uIntensity;
uniform float uRibbonIndex;

varying vec2 vUv;
varying float vDisplacement;

// Aurora color palette: green → teal → cyan → violet → magenta
vec3 auroraColor(float t) {
  vec3 c0 = vec3(0.18, 0.65, 0.30);  // aurora green
  vec3 c1 = vec3(0.20, 0.72, 0.58);  // aurora teal
  vec3 c2 = vec3(0.00, 0.90, 1.00);  // aurora cyan
  vec3 c3 = vec3(0.50, 0.38, 0.85);  // aurora violet
  vec3 c4 = vec3(0.78, 0.30, 0.65);  // aurora magenta

  t = clamp(t, 0.0, 1.0);
  if (t < 0.25) return mix(c0, c1, t / 0.25);
  if (t < 0.5) return mix(c1, c2, (t - 0.25) / 0.25);
  if (t < 0.75) return mix(c2, c3, (t - 0.5) / 0.25);
  return mix(c3, c4, (t - 0.75) / 0.25);
}

void main() {
  // Vertical color gradient — green at base, cyan in middle, violet at top
  float colorT = vUv.y * 0.8 + sin(uTime * 0.05 + uRibbonIndex * 1.3) * 0.15;
  colorT += vDisplacement * 0.05; // color shift based on wave displacement
  vec3 color = auroraColor(colorT);

  // Brighten at center of ribbon width
  float centerBright = 1.0 - abs(vUv.x - 0.5) * 2.0;
  centerBright = pow(centerBright, 0.6);

  // Vertical falloff — strongest in middle height, fades at edges
  float vertFade = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.8, vUv.y);

  // Pulsing glow
  float pulse = 0.8 + 0.2 * sin(uTime * 0.3 + uRibbonIndex * 2.1);

  float alpha = centerBright * vertFade * pulse * uIntensity * 0.6;

  // Add extra glow at bright displacement peaks
  alpha += pow(max(abs(vDisplacement) * 0.15, 0.0), 2.0) * vertFade * uIntensity * 0.15;

  alpha = clamp(alpha, 0.0, 0.7);

  gl_FragColor = vec4(color, alpha);
}
