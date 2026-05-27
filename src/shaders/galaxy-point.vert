attribute float aSize;
attribute float aPhase;
attribute vec3  aColor;

varying vec3  vColor;
varying float vShimmer;

uniform float uTime;
uniform float uPixelRatio;

void main() {
  vColor = aColor;
  vShimmer = 0.6 + 0.4 * sin(uTime * 1.6 + aPhase * 6.28318);

  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;

  float distAtten = 1.0 / max(0.4, -mv.z);
  gl_PointSize = aSize * uPixelRatio * 90.0 * distAtten;
}
