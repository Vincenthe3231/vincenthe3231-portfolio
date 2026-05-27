precision highp float;

varying vec3  vColor;
varying float vShimmer;

void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float r = length(c);
  if (r > 0.5) discard;

  // Soft point with bright core
  float core = pow(1.0 - r * 2.0, 2.0);
  float halo = exp(-r * 6.0) * 0.5;
  float a = (core + halo) * vShimmer;

  gl_FragColor = vec4(vColor * (0.6 + 0.6 * vShimmer), a);
}
