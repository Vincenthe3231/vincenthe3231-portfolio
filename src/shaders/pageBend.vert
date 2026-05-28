precision highp float;

// Core page state
uniform float uTurn;            // 0 = flat right, 1 = fully turned left
uniform float uSide;            // +1 right-page, -1 left-page
// Physics-driven
uniform float uAngularVelocity; // rad/s from cannon-es body (clamped -8..8)
uniform float uSag;             // 0..1 — paper weight droop at free edge when flat
uniform float uTime;            // global time for micro-waviness secondary motion
// Interaction
uniform float uHover;           // 0..1, lifts free corner when not turning

varying vec2  vUv;
varying float vBend;
varying vec3  vNormalView;

void main() {
  vec3 p = position;

  // ── Hinge setup ────────────────────────────────────────────────────────
  // PlaneGeometry is centered: local x spans -1.2 .. +1.2.
  // Mesh sits at world [1.2, 0, 0], so local x=-1.2 = world x=0 (spine).
  float hingeX       = -uSide * 1.2;
  float distFromHinge = abs(p.x - hingeX);       // 0 at spine, 2.4 at free edge
  float distNorm      = distFromHinge / 2.4;      // 0..1

  float bendT = clamp(uTurn, 0.0, 1.0);
  float ease  = 1.0 - pow(1.0 - bendT, 3.0);     // cubic ease-out

  // ── Paper sag (gravity-like droop when flat) ───────────────────────────
  // Heaviness concentrated at free edge, fades as page turns
  float sag = uSag * (1.0 - bendT) * distNorm * distNorm;
  p.y -= sag * 0.045;

  // ── Velocity-driven curvature ──────────────────────────────────────────
  // Faster turn → free edge leads (positive angVel = turning toward left)
  float velNorm = clamp(uAngularVelocity / 8.0, -1.0, 1.0);
  float leadLag  = velNorm * 0.11 * distNorm;
  p.z += leadLag;

  // ── Parabolic curl at midpoint of turn ────────────────────────────────
  float curl = sin(bendT * 3.14159) * 0.065 * distNorm;
  p.z += curl;

  // ── Hover lift on free corner ─────────────────────────────────────────
  float hoverLift = uHover * (1.0 - bendT) * distNorm;
  p.z += hoverLift * 0.05;

  // ── Micro-waviness secondary motion ───────────────────────────────────
  // Slow sinusoidal ripple along the free edge when mostly flat
  // Wave only active during turn arc (sin peaks at bendT=0.5, zero at flat/fully-turned)
  float wave = sin(p.y * 4.2 + uTime * 0.85) * 0.003 * distNorm * sin(bendT * 3.14159);
  p.z += wave;

  // ── Rotation around spine ─────────────────────────────────────────────
  float angle = ease * 3.14159 * uSide * -1.0;
  float c     = cos(angle);
  float s     = sin(angle);
  float relX  = p.x - hingeX;
  float relZ  = p.z;
  p.x = hingeX + relX * c - relZ * s;
  p.z =          relX * s + relZ * c;

  vBend      = bendT;
  vUv        = uv;
  vNormalView = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
