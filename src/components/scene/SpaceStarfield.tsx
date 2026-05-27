import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAurora } from "@/aurora/AuroraProvider";

/**
 * Deep-space starfield: dense, cool, far. Visible only past hero (sceneMode > 0).
 * Distinct from the warm near-hero Starfield — this layer is the cosmos backdrop.
 */
export function SpaceStarfield() {
  const pointsRef = useRef<THREE.Points>(null);
  const { uniforms, config } = useAurora();
  const count = config.spaceStarCount;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spherical shell r=60..120 (deeper than hero starfield)
      const r = 60 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = -Math.abs(r * Math.sin(phi) * Math.sin(theta)) - 15;

      // Cool blue/white tints
      const t = Math.random();
      if (t < 0.15) {
        col[i * 3] = 0.55; col[i * 3 + 1] = 0.7; col[i * 3 + 2] = 1.0; // blue
      } else if (t < 0.2) {
        col[i * 3] = 1.0; col[i * 3 + 1] = 0.85; col[i * 3 + 2] = 0.95; // pink-white
      } else {
        col[i * 3] = 0.9; col[i * 3 + 1] = 0.92; col[i * 3 + 2] = 1.0; // cool white
      }
    }
    return { positions: pos, colors: col };
  }, [count]);

  const lerpedMouse = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const u = uniforms.current;

    // Slow drift rotation
    pointsRef.current.rotation.y += delta * 0.008;

    // Very mild mouse parallax
    lerpedMouse.current.x += (u.mouseX * 0.04 - lerpedMouse.current.x) * 0.02;
    lerpedMouse.current.y += (u.mouseY * 0.04 - lerpedMouse.current.y) * 0.02;
    pointsRef.current.position.x = lerpedMouse.current.x;
    pointsRef.current.position.y = lerpedMouse.current.y - u.smoothScroll * 1.5;

    // Visible only past hero
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = u.sceneMode * 0.9;
  });

  return (
    <points ref={pointsRef} renderOrder={-95}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        vertexColors
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
