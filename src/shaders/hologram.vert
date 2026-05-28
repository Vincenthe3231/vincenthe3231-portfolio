precision highp float;

uniform float uTime;

varying vec2  vUv;
varying vec3  vNormalWorld;
varying vec3  vViewDir;
varying float vDepth;

void main() {
  vUv = uv;

  // World-space normal for Fresnel
  vNormalWorld = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

  // World position
  vec4 worldPos = modelMatrix * vec4(position, 1.0);

  // View direction
  vViewDir = normalize(cameraPosition - worldPos.xyz);

  // Depth from camera (for depth-based effects)
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mvPos.z;

  // Scanline micro-ripple displacement along normals
  float ripple = sin(uv.y * 32.0 + uTime * 1.6) * 0.0035
               + sin(uv.x * 18.0 + uTime * 0.9) * 0.0015;
  vec3 displaced = position + normal * ripple;

  // Breathing: extremely subtle scale pulse
  float breathe = 1.0 + sin(uTime * 0.4) * 0.003;
  displaced *= breathe;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
